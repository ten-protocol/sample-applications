import { createRouter, createWebHistory } from "vue-router";

// Components
import Home from "@/view/Home.vue";
import Debug from "@/view/Debug.vue";

// Define routes
const routes = [
  {
    path: "/battleships/",
    name: "Home",
    component: Home,
  },
  {
    path: "/battleships/debug",
    name: "Debug",
    component: Debug,
  },
];

// Create the router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
