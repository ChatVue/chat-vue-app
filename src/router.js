import Vue from 'vue';
import Router from 'vue-router';

import Chat from './views/Chat.vue';
import Login from './views/Login.vue';
import Signup from './views/Signup.vue';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'chat',
            component: Chat
        },
        {
            path: '/signup',
            name: 'signup',
            component: Signup
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        }
    ],
    mode: 'history'
});
