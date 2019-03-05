import axios from 'axios';
import config from '../config';
import jwt from 'jsonwebtoken';

export default {
    namespaced: true,
    state: {
        id: '',
        nick: ''
    },
    mutations: {
        setUser(state, user) {
            state.id = user.id;
            state.nick = user.nick;
        }
    },
    actions: {
        logout({ commit, dispatch }) {
            commit('setUser', { id: '', nick: '' });
            dispatch('message/clear', null, { root: true });
            localStorage.removeItem('token');
        },
        SOCKET_LOGOUT({ dispatch }) {
            dispatch('logout');
        },
        async signup({}, user) {
            try {
                await axios.post(config.apiUrl + '/signup', user);
                return true;
            } catch (err) {
                throw new Error(err.response.data.error);
            }
        },
        async login({ dispatch }, user) {
            try {
                const response = await axios.post(config.apiUrl + '/login', user);
                const token = response.data.token;
                dispatch('applyToken', token);
                localStorage.token = token;
                return true;
            } catch (err) {
                throw err;
            }
        },
        applyToken({ commit }, token) {
            try {
                const userData = jwt.decode(token);
                commit('setUser', {
                    id: userData.id,
                    nick: userData.nick
                });
            } catch (err) {
                throw err;
            }
        }
    },
    getters: {
        user: (state) => {
            return { id: state.id, nick: state.nick };
        }
    }
};
