#!/usr/bin/env python3
"""
train.py — Train LightGBM ordinal classifiers from cache.json
=============================================================
Features used:
  1. Metadata     — year, decade, rating, votes, popularity, is_season, genres
  2. IMDB guide   — per-category vote counts + weighted severity scores + review texts (TF-IDF)
  3. MPA rating   — G/PG/PG-13/R/NC-17 encoded as ordinal + one-hot
  4. CSM age      — recommendedAge when available
  5. Text TF-IDF  — review texts, EN/ES synopsis, titles, parentsNeedToKnow, oneLiner

Targets (CSM content grid):  sex, violence, language, drugs

Usage:
  pip install lightgbm scikit-learn numpy pandas
  python train.py --cache ./cache.json
  python train.py --cache ./cache.json --targets sex violence
  python train.py --cache ./cache.json --movies ./movies_meta.json
"""

import argparse, json, os, sys
import numpy as np
import pandas as pd
import lightgbm as lgb
from sklearn.model_selection import train_test_split, RandomizedSearchCV, KFold
from sklearn.metrics import mean_absolute_error, mean_squared_error, cohen_kappa_score
from sklearn.feature_extraction.text import TfidfVectorizer

# ── Config ─────────────────────────────────────────────────────────────────────

CSM_TARGETS = ["sex", "violence", "language", "drugs"]

# Correct category names from rawParentsGuide
IMDB_CATEGORIES = [
    "SEXUAL_CONTENT",
    "VIOLENCE",
    "PROFANITY",
    "ALCOHOL_DRUGS",
    "FRIGHTENING_INTENSE_SCENES",
]
SEVERITY_ORDER = ["none", "mild", "moderate", "severe"]

# MPA ratings as ordinal (NC-17 = 4, unrated = None)
MPA_ORDINAL = {"G": 0, "PG": 1, "PG-13": 2, "R": 3, "NC-17": 4, "TV-Y": 0, "TV-Y7": 0, "TV-G": 0, "TV-PG": 1, "TV-14": 2, "TV-MA": 3}

GENRE_BITS = {
    "Action": 0, "Adventure": 1, "Animation": 2, "Biography": 3, "Comedy": 4,
    "Crime": 5, "Documentary": 6, "Drama": 7, "Family": 8, "Fantasy": 9,
    "Film-Noir": 10, "History": 11, "Horror": 12, "Music": 13, "Musical": 14,
    "Mystery": 15, "Romance": 16, "Sci-Fi": 17, "Sport": 18, "Thriller": 19,
    "War": 20, "Western": 21,
}

MODEL_DIR = "./models"
TFIDF_MAX_FEATURES = 800

# ── Feature extraction ─────────────────────────────────────────────────────────

def extract_imdb_features(raw_guide):
    feats = {}
    if not isinstance(raw_guide, list):
        for cat in IMDB_CATEGORIES:
            cat_l = cat.lower()
            for level in SEVERITY_ORDER:
                feats[f"imdb_{cat_l}_{level}"] = 0
            feats[f"imdb_{cat_l}_weighted"] = 0.0
            feats[f"imdb_{cat_l}_total"] = 0
            feats[f"imdb_{cat_l}_severe_ratio"] = 0.0
            feats[f"imdb_{cat_l}_moderate_ratio"] = 0.0
            feats[f"imdb_{cat_l}_mild_ratio"] = 0.0
            feats[f"imdb_{cat_l}_none_ratio"] = 0.0
            feats[f"imdb_{cat_l}_mature_ratio"] = 0.0
            feats[f"imdb_{cat_l}_entropy"] = 0.0
            feats[f"imdb_{cat_l}_variance"] = 0.0
            feats[f"imdb_{cat_l}_std_dev"] = 0.0
            feats[f"imdb_{cat_l}_severe_acceleration"] = 0.0
            feats[f"imdb_{cat_l}_moderate_acceleration"] = 0.0
            feats[f"imdb_{cat_l}_sample_gravity"] = 0.0
        feats["imdb_contrast_violence_vs_profanity"] = 0.0
        feats["imdb_contrast_sex_vs_violence"] = 0.0
        return feats

    guide_map = {e["category"]: e for e in raw_guide if isinstance(e, dict) and "category" in e}

    import math

    for cat in IMDB_CATEGORIES:
        cat_l = cat.lower()
        entry = guide_map.get(cat, {})
        
        breakdowns = {}
        if isinstance(entry, dict):
            for b in entry.get("severityBreakdowns", []):
                if isinstance(b, dict) and "severityLevel" in b:
                    breakdowns[str(b["severityLevel"]).lower()] = b.get("voteCount") or 0

        total, weighted = 0, 0.0
        for i, level in enumerate(SEVERITY_ORDER):
            votes = breakdowns.get(level, 0)
            try: votes = int(votes)
            except: votes = 0
            feats[f"imdb_{cat_l}_{level}"] = votes
            total += votes
            weighted += votes * i
            
        feats[f"imdb_{cat_l}_total"]    = total
        mu = (weighted / total) if total > 0 else 0.0
        feats[f"imdb_{cat_l}_weighted"] = mu
        
        p_severe   = (breakdowns.get("severe", 0) / total) if total > 0 else 0.0
        p_moderate = (breakdowns.get("moderate", 0) / total) if total > 0 else 0.0
        p_mild     = (breakdowns.get("mild", 0) / total) if total > 0 else 0.0
        p_none     = (breakdowns.get("none",   0) / total) if total > 0 else 0.0
        
        feats[f"imdb_{cat_l}_severe_ratio"]   = p_severe
        feats[f"imdb_{cat_l}_moderate_ratio"] = p_moderate
        feats[f"imdb_{cat_l}_mild_ratio"]     = p_mild
        feats[f"imdb_{cat_l}_none_ratio"]     = p_none
        
        # Advanced Features
        feats[f"imdb_{cat_l}_mature_ratio"] = p_severe + p_moderate
        
        entropy = 0.0
        variance = 0.0
        for i, p in enumerate([p_none, p_mild, p_moderate, p_severe]):
            if p > 0:
                entropy -= p * math.log2(p)
                variance += p * ((i - mu) ** 2)
        feats[f"imdb_{cat_l}_entropy"] = entropy
        feats[f"imdb_{cat_l}_variance"] = variance
        feats[f"imdb_{cat_l}_std_dev"]  = variance ** 0.5
        
        v_severe   = breakdowns.get("severe", 0)
        v_moderate = breakdowns.get("moderate", 0)
        v_mild     = breakdowns.get("mild", 0)
        feats[f"imdb_{cat_l}_severe_acceleration"] = (v_severe / (v_moderate + 1))
        feats[f"imdb_{cat_l}_moderate_acceleration"] = (v_moderate / (v_mild + 1))
        feats[f"imdb_{cat_l}_sample_gravity"] = mu * math.log1p(total)

    # Cross-Category Contrasts
    v_total = feats.get("imdb_violence_total", 0)
    p_total = feats.get("imdb_profanity_total", 0)
    s_total = feats.get("imdb_sexual_content_total", 0)
    feats["imdb_contrast_violence_vs_profanity"] = (v_total / p_total) if p_total > 0 else 0.0
    feats["imdb_contrast_sex_vs_violence"] = (s_total / v_total) if v_total > 0 else 0.0

    return feats


def decode_genres(mask):
    try: mask = int(mask)
    except: mask = 0
    return {f"genre_{n.lower().replace('-','_')}": int(bool(mask & (1 << b))) for n, b in GENRE_BITS.items()}


def build_records(cache, movies_meta=None, min_guide_votes=0):
    records, synopses = [], []
    if not isinstance(cache, dict): return records, synopses

    for imdb_id, c in cache.items():
        if not isinstance(c, dict): continue
        csm = c.get("csm")
        if not isinstance(csm, dict): continue
        grid = csm.get("contentGrid") or {}
        if not isinstance(grid, dict): continue

        # MIN_GUIDE_VOTES FILTERING
        raw_guide = c.get("rawParentsGuide")
        if min_guide_votes > 0:
            if not isinstance(raw_guide, list) or len(raw_guide) == 0:
                continue
            total_guide_votes = 0
            for item in raw_guide:
                if isinstance(item, dict):
                    for b in item.get("severityBreakdowns", []):
                        if isinstance(b, dict):
                            total_guide_votes += (b.get("voteCount") or 0)
            if total_guide_votes < min_guide_votes:
                continue

        # Target Check
        has_any_target = False
        row = {"id": imdb_id}
        for t in CSM_TARGETS:
            val = grid.get(t)
            row[f"csm_{t}"] = val
            if val is not None: has_any_target = True
            
        if not has_any_target: continue

        row["csm_recommendedAge"] = csm.get("recommendedAge")

        meta = (movies_meta or {}).get(imdb_id, {}) if isinstance(movies_meta, dict) else {}
        if not isinstance(meta, dict): meta = {}
            
        row["year"]       = meta.get("year")       or c.get("year")
        row["rating"]     = meta.get("rating")     or c.get("imdbRating")
        row["votes"]      = meta.get("votes")      or c.get("votes")
        row["is_season"]  = int(bool(meta.get("isSeason", False)))
        row["popularity"] = c.get("popularity")    or 0
        genres = meta.get("genres") or c.get("genres") or 0
        row.update(decode_genres(genres))
        
        raw_year = row["year"]
        year_val = raw_year if pd.notna(raw_year) else 2000
        year = np.clip(year_val - 2000, 0, 30)  # score drift over the years

        mpa = c.get("mpaCertification")
        row["mpa_ordinal"] = MPA_ORDINAL.get(mpa) if mpa else None
        for label in ["G", "PG", "PG-13", "R", "NC-17"]:
            row[f"mpa_{label.replace('-','_')}"] = int(mpa == label) if mpa else 0
        row["has_mpa"] = int(mpa is not None)

        row.update(extract_imdb_features(raw_guide))
        row["has_imdb_guide"] = int(bool(raw_guide))

        records.append(row)

        # TEXT STRATAGEM
        txt_pieces = []
        # for key in ["title"]:
        #     if c.get(key):
        #         txt_pieces.append(str(c[key]))
        # if isinstance(raw_guide, list):
        #     for entry in raw_guide:                        # entry = {category, reviews, ...}
        #         if isinstance(entry.get("reviews"), list):
        #             for rev in entry["reviews"]:           # rev = {"text": "..."}
        #                 if isinstance(rev, dict) and rev.get("text"):
        #                     txt_pieces.append(str(rev["text"]))

        if meta.get("tags"):
            # Flattens all lists inside the tags dictionary into txt_pieces
            txt_pieces.extend([word for keywords in meta["tags"].values() for word in keywords])
        # if isinstance(csm, dict):
        #     for key in ["parentsNeedToKnow", "oneLiner"]:
        #         if csm.get(key):
        #             txt_pieces.append(str(csm[key]))

        synopses.append(" ".join(txt_pieces).strip())
        #print(f"{synopses[-1]} - {meta}")

    return records, synopses


def build_dataset(cache, movies_meta=None, min_guide_votes=0):
    print(f"  Extracting features from cache entries (min_guide_votes={min_guide_votes})...")
    records, synopses = build_records(cache, movies_meta, min_guide_votes)
    if not records:
        raise ValueError("No valid records extracted from cache. Please check your configurations.")
        
    df = pd.DataFrame(records)
    print(f"  {len(df)} initial records built.")

    has_text = sum(1 for s in synopses if str(s).strip())
    print(f"  Synopsis/review text available for {has_text}/{len(synopses)} rows.")
    if has_text > 50:
        print(f"  Fitting TF-IDF (max_features={TFIDF_MAX_FEATURES})...")
        
        # Custom Negation-Safe Stop Words List
        from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS
        negations_and_modifiers = {
            'no', 'not', 'never', 'none', 'neither', 'nor', 'all', 'any', 
            'nothing', 'without', 'against', 'off', 'least', 'less', 'too'
        }
        custom_stop_words = list(ENGLISH_STOP_WORDS - negations_and_modifiers)

        tfidf = TfidfVectorizer(
            max_features=TFIDF_MAX_FEATURES,
            ngram_range=(1, 3),         # Captures up to 3-word combinations
            min_df=5,
            stop_words=custom_stop_words,
            sublinear_tf=True,
            strip_accents="unicode",
        )
        tfidf_matrix = tfidf.fit_transform(synopses).toarray()
        tfidf_cols = [f"tfidf_{t}" for t in tfidf.get_feature_names_out()]
        tfidf_df = pd.DataFrame(tfidf_matrix, columns=tfidf_cols, index=df.index)
        df = pd.concat([df, tfidf_df], axis=1)
        print(f"  Added {len(tfidf_cols)} text features.")
    else:
        tfidf = None

    return df, tfidf


# ── Training ───────────────────────────────────────────────────────────────────

def _pred_entropy(preds_int, n_classes):
    """Normalised Shannon entropy of a prediction array: 0 = all same class, 1 = uniform."""
    counts = np.bincount(preds_int, minlength=n_classes).astype(float)
    probs  = counts / counts.sum()
    probs  = probs[probs > 0]
    raw    = -float(np.sum(probs * np.log2(probs)))
    return round(raw / np.log2(n_classes), 4)   # normalise to [0, 1]


def _eval_preds(y_test, preds_int, preds_soft, max_val, label=""):
    """Compute MAE / MSE / QWK / Exact / error_dist for a set of predictions and print a row."""
    mae = mean_absolute_error(y_test, preds_soft)
    mse = mean_squared_error(y_test, preds_soft)
    qwk = cohen_kappa_score(y_test, preds_int, weights="quadratic")
    acc = (preds_int == y_test.values).mean()
    # error_dist: absolute deviation counts as % of test set, keyed 0..max_val
    abs_errs = np.abs(preds_int - y_test.values)
    n = len(abs_errs)
    error_dist = {str(e): round(float((abs_errs == e).sum() / n), 4)
                  for e in range(max_val + 1) if (abs_errs == e).any()}
    pred_entropy = _pred_entropy(preds_int, max_val + 1)
    print(f"    {label:30s} | MAE={mae:.3f} | QWK={qwk:.3f} | Exact={acc:.1%} | H={pred_entropy:.3f}")
    return mae, mse, qwk, acc, error_dist, pred_entropy


def tune_params(X_train, y_train, n_classes, base_params, n_iter=25, cv=3, random_state=42):
    """
    Random search over a focused grid, optimising neg-MAE via CV.
    Returns a dict of the best found params to merge into base_params.
    Runs quickly: n_iter * cv fits, each with early_stopping capped at 400 trees.
    """
    from scipy.stats import randint, uniform

    param_dist = {
        "max_depth":        randint(5, 10),
        "num_leaves":       randint(31, 80),
        "min_child_samples":randint(10, 40),
        "subsample":        uniform(0.6, 0.35),        # 0.60 – 0.95
        "colsample_bytree": uniform(0.4, 0.45),        # 0.40 – 0.85
        "reg_alpha":        uniform(0.0, 0.4),
        "reg_lambda":       uniform(0.1, 0.5),
        "learning_rate":    uniform(0.005, 0.025),     # 0.005 – 0.030
    }

    # Use a fast fixed-tree estimator for the search (no early stopping in CV)
    search_estimator = lgb.LGBMClassifier(
        objective="multiclass",
        num_class=n_classes,
        n_estimators=400,          # capped for speed; best params still transfer
        class_weight="balanced",
        random_state=random_state,
        n_jobs=-1,
        verbose=-1,
        **{k: base_params[k] for k in ("subsample_freq",) if k in base_params},
    )

    cv_splitter = KFold(n_splits=cv, shuffle=True, random_state=random_state)
    search = RandomizedSearchCV(
        search_estimator,
        param_distributions=param_dist,
        n_iter=n_iter,
        scoring="neg_mean_absolute_error",
        cv=cv_splitter,
        refit=False,
        random_state=random_state,
        n_jobs=1,       # outer parallelism; inner already uses n_jobs=-1
        verbose=0,
    )
    search.fit(X_train, y_train)

    best = search.best_params_
    print(f"    tune: best CV MAE={-search.best_score_:.4f}  params={best}")
    return best



class _OrdinalMLP(object):  # kept as stub so old model files can still be referenced
    """
    Two-hidden-layer MLP with an ordinal (CORAL-style) output head.

    Architecture:
        input → BN → Linear(512) → GELU → Dropout(0.3)
               → Linear(256) → GELU → Dropout(0.2)
               → Linear(n_classes-1)  ← n_classes-1 binary thresholds

    Training loss: sum of binary cross-entropies over cumulative thresholds,
    weighted by class frequency so tail classes are not ignored.

    Prediction:
        P(Y > k) = sigmoid(logit_k)   for k in 0..n_classes-2
        P(Y = k) = P(Y > k-1) - P(Y > k)   (with boundary clamps)
        hard pred = argmax of class probs
        soft pred = expected value E[Y]
    """

    pass  # removed



VALID_MODELS = {"regressor", "clf_argmax"}

def train_one(df, target_col, model_dir, tune=False, tune_iter=25, models=None):
    valid = df[df[target_col].notna()].copy()
    if len(valid) < 100:
        print(f"  ⚠  {target_col}: only {len(valid)} labelled rows, skipping.")
        return None

    label_cols   = [c for c in df.columns if c.startswith("csm_")]
    feature_cols = [c for c in df.columns if c not in label_cols and c != "id"]

    X = valid[feature_cols].copy()
    try: y = valid[target_col].astype(int)
    except: y = pd.to_numeric(valid[target_col], errors="coerce").fillna(0).astype(int)

    for col in X.select_dtypes(include="object").columns:
        X[col] = pd.to_numeric(X[col], errors="coerce")

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.15, stratify=y, random_state=42
    )

    # Which model variants to run (default: all)
    run = set(models) if models else VALID_MODELS

    max_val   = int(y.max())
    n_classes = max_val + 1   # ratings 0..max_val
    classes   = np.arange(n_classes)

    shared_params = dict(
        n_estimators=2000,        # more trees; early stopping keeps it from overfitting
        learning_rate=0.01,       # slower lr → better generalisation with more trees
        max_depth=7,              # slightly deeper to capture ordinal boundaries
        num_leaves=55,            # ~2^max_depth * 0.75; enough capacity without overfit
        subsample=0.75,           # slightly more aggressive row sampling
        subsample_freq=1,         # apply subsample every tree
        colsample_bytree=0.55,    # tighter feature sampling → less correlation between trees
        min_child_samples=20,     # allow model to fit smaller tail-class nodes
        reg_alpha=0.1,            # loosen L1 slightly; tail classes need more flexibility
        reg_lambda=0.3,           # tighten L2 to compensate for deeper trees
        class_weight="balanced",  # upweight rare classes → better spread, less mode collapse
        random_state=42,
        n_jobs=-1,
        verbose=-1,
    )

    print(f"\n  {target_col}  (classes 0–{max_val}, n_train={len(X_train)}, n_test={len(X_test)})")

    if tune:
        print(f"    tuning ({tune_iter} iterations, optimising MAE)...")
        best_search_params = tune_params(
            X_train, y_train, n_classes, shared_params,
            n_iter=tune_iter, cv=3,
        )
        shared_params.update(best_search_params)
        print(f"    shared_params updated with tuned values.")

    # Only using LightGBM formats for deployment ease with the predict macro script
    # ── Baseline: Regressor + spread multiplier ────────────
    if "regressor" in run:
        reg = lgb.LGBMRegressor(**shared_params)
        reg.fit(X_train, y_train, eval_set=[(X_test, y_test)], callbacks=[lgb.early_stopping(80, verbose=False)])

        raw_preds = np.clip(reg.predict(X_test), 0, max_val)
        # Use the actual training-set mean so the spread is centred correctly.
        # A hardcoded value shifts predictions for targets whose distribution
        # differs from the assumed mean (e.g. csm_drugs is very left-skewed
        # while csm_violence is more uniform).
        dataset_mean      = float(y_train.mean())
        spread_multiplier = 1.2
        spread_preds      = np.clip(dataset_mean + (raw_preds - dataset_mean) * spread_multiplier, 0, max_val)
        reg_int           = np.round(spread_preds).astype(int)
        reg_mae, reg_mse, reg_qwk, reg_acc, reg_err_dist, reg_entropy = _eval_preds(
            y_test, reg_int, spread_preds, max_val, "Regressor + spread (baseline)")
    else:
        reg = reg_mae = reg_mse = reg_qwk = reg_acc = reg_err_dist = reg_entropy = None
        spread_preds = reg_int = None

    # ── Option A: Multiclass — argmax ──────────────────────────────────────────
    need_clf = ("clf_argmax" in run) or ("clf_expected_val" in run)
    if need_clf:
        clf = lgb.LGBMClassifier(objective="multiclass", num_class=n_classes, **shared_params)
        clf.fit(X_train, y_train,
                eval_set=[(X_test, y_test)],
                callbacks=[lgb.early_stopping(80, verbose=False)])
        probs = clf.predict_proba(X_test)          # shape (n, n_classes)
    else:
        clf = probs = None

    if "clf_argmax" in run:
        clf_argmax = probs.argmax(axis=1).astype(int)
        clf_mae_am, clf_mse_am, clf_qwk_am, clf_acc_am, clf_err_dist_am, clf_entropy_am = _eval_preds(
            y_test, clf_argmax, clf_argmax.astype(float), max_val, "Classifier — argmax")
    else:
        clf_argmax = clf_mae_am = clf_mse_am = clf_qwk_am = clf_acc_am = clf_err_dist_am = clf_entropy_am = None

    # ── Option B: Multiclass — expected value ──────────────────────────────────
    if "clf_expected_val" in run:
        clf_ev     = (probs * classes).sum(axis=1)
        clf_ev_int = np.clip(np.round(clf_ev), 0, max_val).astype(int)
        clf_mae_ev, clf_mse_ev, clf_qwk_ev, clf_acc_ev, clf_err_dist_ev, clf_entropy_ev = _eval_preds(
            y_test, clf_ev_int, clf_ev, max_val, "Classifier — expected value")
    else:
        clf_ev = clf_ev_int = clf_mae_ev = clf_mse_ev = clf_qwk_ev = clf_acc_ev = clf_err_dist_ev = clf_entropy_ev = None

    # ── Pick winner and save it ────────────────────────────────────────────────
    candidates = []
    if "regressor" in run:
        candidates.append(("regressor",        reg_qwk,    reg_mae,    reg_mse,    reg_acc,    reg_int,    spread_preds,             reg,    None,     reg_int))
    if "clf_argmax" in run:
        candidates.append(("clf_argmax",       clf_qwk_am, clf_mae_am, clf_mse_am, clf_acc_am, clf_argmax, clf_argmax.astype(float), clf,    "argmax", clf_argmax))
    if "clf_expected_val" in run:
        candidates.append(("clf_expected_val", clf_qwk_ev, clf_mae_ev, clf_mse_ev, clf_acc_ev, clf_ev_int, clf_ev,                   clf,    "ev",     clf_ev_int))
    # Primary sort: MAE (lower = better); tiebreak: QWK (higher = better)
    winner_name, best_qwk, best_mae, best_mse, best_acc, best_int, best_soft, best_model, pred_mode, _ = \
        max(candidates, key=lambda c: (-c[2], c[1]))

    print(f"    → winner: {winner_name}  (QWK={best_qwk:.3f}  MAE={best_mae:.3f})")

    os.makedirs(model_dir, exist_ok=True)
    model_path = os.path.join(model_dir, f"model_{target_col}.lgb")
    best_model.booster_.save_model(model_path)

    importance = sorted(
        zip(feature_cols, best_model.feature_importances_), key=lambda x: -x[1])[:25]

    return {
        "target":       target_col,
        "model_type":   winner_name,
        "pred_mode":    pred_mode,           # None | "argmax" | "ev"
        "n_train":      len(X_train),
        "n_test":       len(X_test),
        "mae":          round(best_mae, 4),
        "mse":          round(best_mse, 4),
        "qwk":          round(best_qwk, 4),
        "exact_acc":    round(float(best_acc), 4),
        # Per-variant metrics for comparison
        "variants": {
            **( {"regressor":        {"qwk": round(reg_qwk, 4),    "mae": round(reg_mae, 4),    "mse": round(reg_mse, 4),    "exact": round(float(reg_acc), 4),    "pred_entropy": reg_entropy,    "error_dist": reg_err_dist}}        if "regressor"        in run else {} ),
            **( {"clf_argmax":       {"qwk": round(clf_qwk_am, 4), "mae": round(clf_mae_am, 4), "mse": round(clf_mse_am, 4), "exact": round(float(clf_acc_am), 4), "pred_entropy": clf_entropy_am, "error_dist": clf_err_dist_am}}       if "clf_argmax"       in run else {} ),
            **( {"clf_expected_val": {"qwk": round(clf_qwk_ev, 4), "mae": round(clf_mae_ev, 4), "mse": round(clf_mse_ev, 4), "exact": round(float(clf_acc_ev), 4), "pred_entropy": clf_entropy_ev, "error_dist": clf_err_dist_ev}}       if "clf_expected_val" in run else {} ),
        },
        "label_dist":   y.value_counts().sort_index().to_dict(),
        "true_test_distribution":        {str(k): int(v) for k, v in pd.Series(y_test.values).value_counts().sort_index().items()},
        "predicted_output_distribution": {str(k): int(v) for k, v in pd.Series(best_int).value_counts().sort_index().items()},
        "top_features": [{"feature": f, "importance": int(i)} for f, i in importance],
        "feature_cols": feature_cols,
        "model_path":   model_path,
    }


# ── Auto-generated predictor ───────────────────────────────────────────────────

def write_predictor(meta_list, model_dir):
    """
    Stamps updated data-derived constants (TARGETS, FEATURES, MODEL_DIR) into
    the canonical predict.py that lives next to train.py, then writes the result
    to <model_dir>/predict.py.

    Only the header assignment lines are replaced — all logic stays untouched.
    """
    valid = [m for m in meta_list if m]

    # Locate the canonical predict.py next to train.py
    src_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "predict.py")
    out_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "predict.py")
    if not os.path.exists(src_path):
        print(f"  ⚠  write_predictor: cannot find {src_path} — skipping predict.py generation.")
        return

    with open(src_path, "r") as f:
        lines = f.readlines()

    # Build replacement values
    new_targets  = json.dumps([m["target"] for m in valid])
    new_features = json.dumps({m["target"]: m["feature_cols"] for m in valid})
    # MODEL_DIR in predict.py should point to model_dir, relative to predict.py's own location
    rel_model_dir = os.path.relpath(model_dir, os.path.dirname(src_path))
    new_model_dir = f'os.path.join(os.path.dirname(__file__), {json.dumps(rel_model_dir)})'

    import re
    patched = []
    for line in lines:
        if re.match(r'^TARGETS\s*=', line):
            line = f"TARGETS        = {new_targets}\n"
        elif re.match(r'^FEATURES\s*=', line):
            line = f"FEATURES       = {new_features}\n"
        elif re.match(r'^MODEL_DIR\s*=', line):
            line = f"MODEL_DIR      = {new_model_dir}\n"
        patched.append(line)

    os.makedirs(model_dir, exist_ok=True)
    with open(out_path, "w") as f:
        f.writelines(patched)
    print(f"\n  ✓  predict.py written → {out_path}")


# ── Main ───────────────────────────────────────────────────────────────────────

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--cache",           required=True)
    ap.add_argument("--extra",           default="../website/public/extra.json")
    ap.add_argument("--model-dir",       default=MODEL_DIR)
    ap.add_argument("--targets",         nargs="+", default=CSM_TARGETS)
    ap.add_argument("--min-guide-votes", type=int, default=10) # Retain lower-vote films
    ap.add_argument("--tune",            action="store_true",  help="Run random-search HP tuning before training (slower)")
    ap.add_argument("--tune-iter",       type=int, default=25, help="Number of random-search iterations (default 25)")
    args = ap.parse_args()

    with open(args.cache) as f: cache = json.load(f)

    movies_meta = None
    if args.extra:
        with open(args.extra) as f: raw = json.load(f)
        movies_meta = {m["id"]: m for m in raw} if isinstance(raw, list) else raw

    df, tfidf = build_dataset(cache, movies_meta, min_guide_votes=args.min_guide_votes)

    csm_cols = [c for c in df.columns if c.startswith("csm_")]
    n_feat   = len([c for c in df.columns if c not in csm_cols and c != "id"])
    print(f"\n  Feature columns: {n_feat}  |  Labelled rows: {len(df)}")
    print(f"  MPA coverage:  {df['has_mpa'].sum()}/{len(df)}")
    print(f"  IMDB guide:    {df['has_imdb_guide'].sum()}/{len(df)}")

    print("\n── Training ──────────────────────────────────────────────────────────")
    results = []
    for target in args.targets:
        col = f"csm_{target}"
        if col not in df.columns:
            print(f"  ⚠  {col} not in dataset."); continue
        print(f"\n→ {target}")
        results.append(train_one(df, col, args.model_dir, tune=args.tune, tune_iter=args.tune_iter))

    os.makedirs(args.model_dir, exist_ok=True)
    with open(os.path.join(args.model_dir, "meta.json"), "w") as f:
        json.dump([r for r in results if r], f, indent=2)

    write_predictor(results, args.model_dir)

    print("\n── Summary ───────────────────────────────────────────────────────────")
    print(f"  {'target':12s}  {'winner':20s}  MAE    QWK    Exact")
    print(f"  {'-'*12}  {'-'*20}  {'-----':6s} {'-----':6s} {'-----':6s}")
    for r in results:
        if r:
            print(f"  {r['target']:12s}  {r['model_type']:20s}  {r['mae']:.3f}  {r['qwk']:.3f}  {r['exact_acc']:.1%}")

    print("\n── Per-variant breakdown ──────────────────────────────────────────────────────────────────────────────────────────────────────────")
    all_err_steps = sorted({k for r in results if r for m in r.get("variants", {}).values() for k in m.get("error_dist", {})}, key=int)
    err_header    = "  ".join(f"±{e}" for e in all_err_steps)
    print(f"  {'target':12s}  {'variant':24s}  MAE    MSE    QWK    Exact   H(pred)  | err_dist(%)  {err_header}")
    print(f"  {'-'*12}  {'-'*24}  {'-----':6s} {'-----':6s} {'-----':6s} {'-----':6s}  {'-------':7s}  | {'-'*max(1, len(err_header)+12)}")
    for r in results:
        if r:
            for variant, m in r.get("variants", {}).items():
                marker  = " ◀" if variant == r["model_type"] else "  "
                err_str = "  ".join(f"{m['error_dist'].get(str(e), 0.0):>5.1%}" for e in all_err_steps)
                print(f"  {r['target']:12s}  {variant:24s}  {m['mae']:.3f}  {m['mse']:.3f}  {m['qwk']:.3f}  {m['exact']:.1%}   {m['pred_entropy']:.3f}    | {err_str}{marker}")

if __name__ == "__main__":
    main()