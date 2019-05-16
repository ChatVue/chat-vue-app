import axios from 'axios';
import router from './../router';
import store from './../store';
import config from './../config';

function init() {
    if (localStorage.token) {
        store.dispatch('user/applyToken', localStorage.token);
    } else {
        router.push({ path: '/login' });
    }
}

function prepareRouter() {
    router.beforeEach((to, from, next) => {
        if (!localStorage.token && ![ '/login', '/signup' ].includes(to.path)) {
            next({ path: '/login' });
        }
        next();
    });
}

function prepareAxios() {
    axios.interceptors.request.use(function(reqConfig) {
        const path = reqConfig.url.substr(config.apiUrl.length);
        const isApiAuthRoute = [ '/login', '/signup', '/refresh' ].includes(path);
        if (localStorage.token && !isApiAuthRoute) {
            reqConfig.headers['Authorization'] = 'Bearer ' + localStorage.token;
        } else {
            delete reqConfig.headers['Authorization'];
            if (!isApiAuthRoute) router.push({ path: '/login' });
        }
        return reqConfig;
    });

    axios.interceptors.response.use(undefined, async (error) => {
        const path = error.config.url.substr(config.apiUrl.length);
        const isApiAuthRoute = [ '/login', '/signup', '/refresh' ].includes(path);
        if (isApiAuthRoute) {
            return router.push({ path: '/login' });
        } else {
            return await store.dispatch('user/checkAuthError', error).catch((error) => {
                return Promise.reject(error);
            });
        }
    });
}

export default {
    prepare: () => {
        init();
        prepareRouter();
        prepareAxios();
    }
};
