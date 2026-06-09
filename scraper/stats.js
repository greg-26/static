import fs from 'fs';

//const data = JSON.parse(fs.readFileSync('../website/public/movies.json', 'utf8'));
const data = JSON.parse(fs.readFileSync('./cache.json', 'utf8'));

const stats = new Map();

function getType(value) {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    return typeof value;
}

function register(path, value) {
    if (!stats.has(path)) {
        stats.set(path, {
            occurrences: 0,
            nulls: 0,
            empties: 0,
            types: {}
        });
    }

    const s = stats.get(path);

    s.occurrences++;

    const type = getType(value);

    s.types[type] = (s.types[type] || 0) + 1;

    if (value === null) {
        s.nulls++;
        return;
    }

    if (
        value === '' ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === 'object' &&
            !Array.isArray(value) &&
            Object.keys(value).length === 0)
    ) {
        s.empties++;
    }
}

function walk(value, path = '') {
    register(path, value);

    if (Array.isArray(value)) {
        for (const item of value) {
            walk(item, `${path}[]`);
        }
        return;
    }

    if (value && typeof value === 'object') {
        for (const [key, child] of Object.entries(value)) {
            const childPath = path ? `${path}.${key}` : key;
            walk(child, childPath);
        }
    }
}

// Ignore first level (tt0110413, tt1234567, ...)
for (const movie of Object.values(data)) {
    walk(movie);
}

const results = [...stats.entries()]
    .map(([path, s]) => ({
        path: path || '<movie>',
        occurrences: s.occurrences,
        nulls: s.nulls,
        nullPct: ((100 * s.nulls) / s.occurrences).toFixed(1) + '%',
        empties: s.empties,
        emptyPct: ((100 * s.empties) / s.occurrences).toFixed(1) + '%',
        types: JSON.stringify(s.types)
    }))
    .sort((a, b) => b.occurrences - a.occurrences);

console.table(results);