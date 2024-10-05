import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Homepage.vue";
import Login from "../views/auth/Login.vue";
import Signup from "../views/auth/Signup.vue";
import NotFound from "../components/common/NotFound.vue";
import Showcase from "../views/Showcase.vue";
import Download from "../views/Download.vue";
import AdminPanel from "../views/admin/AdminPanel.vue";
import authUtils from "../utils/auth";

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
        path: "/download",
        name: "Download",
        component: Download,
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
router.beforeEach(async (to, from, next) => {
    const isAuthenticated = await authUtils.isLoggedIn(); // Check if the user is logged in
    const isAdmin = isAuthenticated ? await authUtils.isAdmin() : false; // Check if the user is admin if authenticated

    if (to.meta.requiresAuth && !isAuthenticated) {
        next({ name: "Login" }); // Redirect to login if not authenticated
    } else if (to.meta.isAdmin && !isAdmin) {
        next({ name: "NotFound" }); // Redirect to NotFound if not admin
    } else {
        next();
    }
});

export default router;
