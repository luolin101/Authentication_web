import {createRouter, createWebHistory} from 'vue-router'
import Layout from "@/layout/Layout";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import("@/views/MainPage"),
        redirect: "/home",
        children: [
             {
                 path: 'home',
                 name: 'Home',
                 component: () => import("@/views/Home"),
             },
             {path: '/PersonManage2', name: 'PersonManage2', component:() => import("@/views/PersonManage2")},
            
        ]
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import("@/views/Login")
    },
    {
        path: '/login2',
        name: 'Login2',
        component: () => import("@/views/LoginUkey")
    },
    {
        path: '/login3',
        name: 'Login3',
        component: () => import("@/views/QR")
    },
    {
        path: '/admin',
        name: 'Admin',
        component: () => import("@/views/Admin")
    },

]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
