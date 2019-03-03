import axios from 'axios';
import config from '../config';
import shortid from 'shortid';

export default {
    namespaced: true,
    state: {
        messages: [],
        loading: false,
        SOCKET_ADD_processing: false
    },
    mutations: {
        setMessages(state, messages) {
            state.messages = messages;
        },
        addMessages(state, messages) {
            state.messages.unshift(...messages);
        },
        add(state, message) {
            if (!message._id) message._id = shortid.generate();
            state.messages.push(message);
        },
        update(state, data) {
            let index = state.messages.findIndex((msg) => msg._id === data.tmpId);
            state.messages[index] = data.message;
        },
        setLoading(state, isLoading) {
            state.loading = isLoading;
        }
    },
    actions: {
        async load({ commit, getters }, loadHistory = false) {
            try {
                commit('setLoading', true);
                const params = { count: config.loadCount };
                if (loadHistory && getters['all'].length > 0) {
                    params.dateBefore = getters['all'][0]['createdAt'];
                }
                const res = await axios.get(config.apiUrl + '/messages', { params });
                if (loadHistory) {
                    commit('addMessages', res.data.messages);
                } else {
                    commit('setMessages', res.data.messages);
                }
                commit('setLoading', false);
            } catch (err) {}
        },
        add({ state, commit, rootGetters }, newMsg) {
            const bearer = 'Bearer ' + rootGetters['user/user'].token;
            const tmpId = shortid.generate();
            this._vm.$socket.emit('NEW', bearer, newMsg, tmpId);
            const user = rootGetters['user/user'];
            let newDate = new Date(Date.now());
            if (state.messages.length > 0) {
                const lastDate = Date.parse(state.messages.slice(-1)[0].createdAt);
                newDate = new Date(lastDate + 1);
            }
            commit('add', {
                _id: tmpId,
                message: newMsg,
                createdAt: newDate.toISOString(),
                author: { _id: user.id, nick: user.nick }
            });
        },
        SOCKET_ADD({ state, commit, dispatch }, newMsg) {
            state.SOCKET_ADD_processing = true;
            commit('add', newMsg);
            dispatch('sort');
        },
        SOCKET_ADD_processing_finish({ state }) {
            state.SOCKET_ADD_processing = false;
        },
        SOCKET_UPDATE({ commit, dispatch }, data) {
            commit('update', data);
            dispatch('sort');
        },
        sort({ state }) {
            state.messages.sort((a, b) => {
                return Date.parse(a.createdAt) - Date.parse(b.createdAt);
            });
        }
    },
    getters: {
        all: (state) => {
            return state.messages;
        }
    }
};
