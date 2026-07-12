import { createRouter, createWebHistory } from "vue-router";
import DiscoverView from "@/views/DiscoverView.vue";
import SearchView from "@/components/SearchView.vue";
import SettingsView from "@/components/SettingsView.vue";
import RoadmapPage from "@/components/RoadmapPage.vue";

export const TAB_ROUTES = ["discover", "search", "settings"];

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/discover" },
    { path: "/discover", name: "discover", component: DiscoverView, meta: { tab: "discover" } },
    { path: "/search", name: "search", component: SearchView, meta: { tab: "search" } },
    { path: "/settings", name: "settings", component: SettingsView, meta: { tab: "settings" } },
    { path: "/roadmap", name: "roadmap", component: RoadmapPage },
    { path: "/:pathMatch(.*)*", redirect: "/discover" },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.name !== from.name) return { top: 0 };
    return false;
  },
});

export default router;
