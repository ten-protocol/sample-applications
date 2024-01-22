import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Auth from "../views/Auth.vue";
import Admin from "../views/Admin.vue";

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: "/",
			name: "home",
			component: Home,
		},
		{
			path: "/auth",
			name: "auth",
			component: Auth,
		},
		{
			path: "/admin",
			name: "admin",
			component: Admin,
		},
	],
});

export default router;
