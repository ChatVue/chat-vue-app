import axios from 'axios';
import config from '../config';

export default {
    namespaced: true,
    state: {
        messages: []
    },
    mutations: {
        setMessages(state, messages) {
            state.messages = messages;
        },
        add(state, message) {
            state.messages.push(message);
        }
    },
    actions: {
        async load({ commit }) {
            try {
                const res = await axios.get(config.apiUrl + '/messages');
                commit('setMessages', res.data.messages);
            } catch (err) {}
        },
        add({ commit, rootGetters, dispatch }, newMsg) {
            axios.post(config.apiUrl + '/messages', { message: newMsg }).then(() => {
                dispatch('load');
            });
            const user = rootGetters['user/user'];
            commit('add', {
                _id: 'new',
                message: newMsg,
                author: { id: user.id, nick: user.nick }
            });
        }
    }
};
