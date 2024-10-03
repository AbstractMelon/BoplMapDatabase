import { createRouter, createWebHistory } from "vue-router";
import Home from "../components/Homepage.vue";
import Login from "../components/Login.vue";
import Signup from "../components/Signup.vue";
import NotFound from "../components/NotFound.vue";
import Showcase from "../components/Showcase.vue";
import AdminPanel from "../components/AdminPanel.vue";
import store from "../store";

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
    },
    {
        path: "/login",
        name: "Login",
        component: Login,
    },
    {
        path: "/signup",
        name: "Signup",
        component: Signup,
    },
    {
        path: "/map-creator",
        name: "Map Creator",
        component: Showcase,
    },
    {
        path: "/admin",
        name: "Admin",
        component: AdminPanel,
        meta: { requiresAuth: true, isAdmin: true },
    },
    {
        path: "/:catchAll(.*)",
        name: "NotFound",
        component: NotFound,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Navigation Guard
router.beforeEach((to, from, next) => {
    const isAuthenticated = !!store.state.user; // Check if the user is authenticated
    const isAdmin = isAuthenticated && store.state.user.isAdmin; // Check if the user is admin

    if (to.meta.requiresAuth && !isAuthenticated) {
        next({ name: "Login" }); // Redirect to login if not authenticated
    } else if (to.meta.isAdmin && !isAdmin) {
        next({ name: "NotFound" }); // Redirect to NotFound if not admin
    } else {
        next();
    }
});

export default router;
