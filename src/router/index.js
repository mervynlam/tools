import { createWebHistory, createRouter } from "vue-router";
import Splice from "../components/Splice.vue";
import Watermark from "../components/Watermark/index.vue";
import Kindle2Md from "../components/Kindle2Md/index.vue";
import DrawGrids from "../components/DrawGrids/index.vue";
import Home from "../components/Home.vue";

const routes = [
  {
    path: "/",
    name: "index",
    component: Home,
  },
  {
    path: "/watermark",
    name: "watermark",
    component: Watermark,
  },
  {
    path: "/splice",
    name: "splice",
    component: Splice,
  },
  {
    path: "/home",
    name: "Home",
    redirect: "/",
  },
  {
    path: "/kindle2md",
    name: "kindle2Md",
    component: Kindle2Md,
  },
  {
    path: "/drawgrids",
    name: "drawgrids",
    component: DrawGrids,
  },
];

// const baseUrl = import.meta.env.BASE_URL

const router = createRouter({
  history: createWebHistory(),
  // history: createWebHistory(baseUrl),
  routes,
});

export default router;
