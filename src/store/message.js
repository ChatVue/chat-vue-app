import Vue from 'vue';
import axios from 'axios';
import config from '../config';
import shortid from 'shortid';

function initialState() {
    return {
        messages: [],
        loading: false,
        newMessage: {},
        typingUsers: {}
    };
}

export default {
    namespaced: true,
    state: initialState(),
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
        },
        addTypingUser(state, nick) {
            Vue.set(state.typingUsers, nick, Date.now());
        },
        unsetTypingUser(state, nick) {
            Vue.delete(state.typingUsers, nick);
        },
        clear(state) {
            const initState = initialState();
            Object.keys(initState).forEach((key) => {
                state[key] = initState[key];
            });
        }
    },
    actions: {
        clear({ commit }) {
            commit('clear');
        },
        async load({ commit, dispatch, getters }, loadHistory = false) {
            try {
                if (!loadHistory) {
                    dispatch('clear');
                }
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
        add({ state, commit, rootGetters }, newMsgText) {
            const bearer = 'Bearer ' + localStorage.token;
            const tmpId = shortid.generate();
            this._vm.$socket.emit('NEW', bearer, newMsgText, tmpId);

            const user = rootGetters['user/user'];
            let newDate = new Date(Date.now());
            if (state.messages.length > 0) {
                const lastDate = Date.parse(state.messages.slice(-1)[0].createdAt);
                newDate = new Date(lastDate + 1);
            }
            const message = {
                _id: tmpId,
                message: newMsgText,
                createdAt: newDate.toISOString(),
                author: { _id: user.id, nick: user.nick }
            };

            state.newMessage = message;
            commit('add', message);
        },
        SOCKET_ADD({ state, commit, dispatch }, newMsg) {
            commit('unsetTypingUser', newMsg.author.nick);
            state.newMessage = newMsg;
            commit('add', newMsg);
            dispatch('sort');
        },
        SOCKET_UPDATE({ commit, dispatch }, data) {
            commit('update', data);
            dispatch('sort');
        },
        SOCKET_TYPING({ commit, dispatch, rootGetters }, nick) {
            if (nick === rootGetters['user/user'].nick) return;
            commit('addTypingUser', nick);
            setTimeout(() => {
                dispatch('typingUsersCheckAndClear');
            }, Math.ceil(config.typingMessageTimeoutSec * 1050));
        },
        typingUsersCheckAndClear({ commit, state }) {
            let now = Date.now();
            for (let nick in state.typingUsers) {
                if (state.typingUsers[nick] + config.typingMessageTimeoutSec * 1000 <= now) {
                    commit('unsetTypingUser', nick);
                }
            }
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
        },
        typingNicks: (state) => {
            return Object.keys(state.typingUsers);
        }
    }
};
