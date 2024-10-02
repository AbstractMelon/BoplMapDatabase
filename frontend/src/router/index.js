import { createRouter, createWebHistory } from "vue-router";
import Home from "../components/Homepage.vue";
import Login from "../components/Login.vue";
import Signup from "../components/Signup.vue";
import NotFound from "../components/NotFound.vue";
import Showcase from "../components/Showcase.vue";

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
        path: "/:catchAll(.*)",
        name: "NotFound",
        component: NotFound,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
