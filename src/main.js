import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/';
import auth from './utils/auth';
import VueSocketIO from 'vue-socket.io';
import config from './config';

import 'bootstrap';
import 'bootstrap/scss/bootstrap.scss';
import nl2br from 'vue-nl2br';

Vue.config.productionTip = false;

auth.prepare();

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

Vue.component('nl2br', nl2br);

new Vue({
    store,
    router,
    render: (h) => h(App)
}).$mount('#app');
