import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/components/Layout.vue';
import { Message } from 'element-ui';

Vue.use(VueRouter)
const routes = [{
    path: '/login',
    alias: '/',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
}, {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'),
}, {
    path: '/goods/',
    name: 'Goods',
    component: Layout,
    meta: { requiresAuth: true },
    children: [{
        path: 'list',
        name: 'GoodsList',
        component: () => import('@/views/goods/List.vue'),
    }, {
        path: 'category',
        name: 'GoodsCategory',
        component: () => import('@/views/goods/Category.vue'),
    }, {
        path: 'release',
        name: 'GoodsRelease',
        component: () => import('@/views/goods/Release.vue'),
    }, {
        path: 'edit/:id',
        name: 'GoodsEdit',
        component: () => import('@/views/goods/Edit.vue'),
        props: true,
    },]
}, {
    path: '/order/',
    name: 'Order',
    component: Layout,
    meta: { requiresAuth: true },
    children: [{
        path: 'list',
        name: 'OrderList',
        component: () => import('@/views/order/List.vue'),
    }]
}, {
    path: '/user/',
    name: 'User',
    component: Layout,
    meta: { requiresAuth: true },
    children: [{
        path: 'list',
        name: 'UserList',
        component: () => import('@/views/user/List.vue'),
    }, {
        path: 'info',
        name: 'UserInfo',
        component: () => import('@/views/user/Info.vue')
    }],

}, {
    path: '/auth/',
    name: 'Auth',
    component: Layout,
    meta: { requiresAuth: true },
    children: [{
        path: 'role',
        name: 'AuthRole',
        component: () => import('@/views/auth/Role.vue'),
    }, {
        path: 'menu',
        name: 'AuthMenu',
        component: () => import('@/views/auth/Menu.vue'),
    }],
}]
const router = new VueRouter({
    routes
})
router.beforeEach((to, from, next) => {
    // 根据meta元信息校验路由是否需要授权
    let isRequireAuth = to.matched.some((path) => path.meta.requiresAuth);
    if (!isRequireAuth) {
        next();
        return;
    }
    let token = sessionStorage.token;
    if (token) {
        // 有token,放行
        next();
        return;
    }
    // 无token强制跳转登录
    if (!token) {
        Message.error('无效的token,请重新登录');
        setTimeout(() => {
            // 通过query向其他页面传参
            next(`/login?redirect=${to.path}`);
        }, 1000);
    }
})

export default router
