import axios from 'axios';
import config from '../config';
import jwt from 'jsonwebtoken';

export default {
    namespaced: true,
    state: {
        token: '',
        nick: '',
        email: ''
    },
    mutations: {
        setUser(state, user) {
            (state.token = user.token), (state.nick = user.nick), (state.email = user.email);
        }
    },
    actions: {
        logout({ commit }) {
            commit('setUser', { token: '', nick: '', email: '' });
            localStorage.removeItem('token');
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
                    nick: userData.nick,
                    email: userData.email,
                    token
                });
            } catch (err) {
                throw err;
            }
        }
    },
    getters: {
        user: (state) => {
            return {
                nick: state.nick,
                email: state.email,
                token: state.token
            };
        }
    }
};
