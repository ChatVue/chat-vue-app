import axios from 'axios';
import config from '../config';
import jwt from 'jsonwebtoken';

export default {
    namespaced: true,
    state: {
        token: '',
        id: '',
        nick: '',
        email: ''
    },
    mutations: {
        setUser(state, user) {
            state.token = user.token;
            state.id = user.id;
            state.nick = user.nick;
            state.email = user.email;
        }
    },
    actions: {
        logout({ commit }) {
            commit('setUser', { token: '', id: '', nick: '', email: '' });
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
                    token,
                    id: userData.id,
                    nick: userData.nick,
                    email: userData.email
                });
            } catch (err) {
                throw err;
            }
        }
    },
    getters: {
        user: (state) => {
            return { token: state.token, id: state.id, nick: state.nick, state: state.email };
        }
    }
};
