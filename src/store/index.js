import Vue from 'vue';
import Vuex from 'vuex';
import user from './user';
import message from './message';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        user,
        message
    }
});
