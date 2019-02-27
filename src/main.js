import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/';
import axios from 'axios';
import VueSocketIO from 'vue-socket.io';
import config from './config';

import 'bootstrap';
import 'bootstrap/scss/bootstrap.scss';

Vue.config.productionTip = false;

if (localStorage.token) {
    store.dispatch('user/applyToken', localStorage.token);
}

router.beforeEach((to, from, next) => {
    if (!localStorage.token && ![ '/login', '/signup' ].includes(to.path)) {
        next({ path: '/login' });
    }
    next();
});

axios.interceptors.request.use(function(config) {
    const token = store.getters['user/user'].token;
    if (token) {
        config.headers['Authorization'] = 'Bearer ' + token;
    } else {
        config.headers['Authorization'] = null;
    }
    return config;
});

Vue.use(
    new VueSocketIO({
        debug: false,
        connection: config.apiUrl,
        vuex: {
            store,
            actionPrefix: 'SOCKET_',
            mutationPrefix: 'SOCKET_'
        }
    })
);

new Vue({
    store,
    router,
    render: (h) => h(App)
}).$mount('#app');
