import axios from 'axios';
import config from '../config';
import jwt from 'jsonwebtoken';

export default {
    namespaced: true,
    state: {
        loggedIn: false,
        id: '',
        nick: '',
        refreshRequest: null,
        prevRefreshToken: null
    },
    mutations: {
        setUser(state, user) {
            state.loggedIn = true;
            state.id = user.id;
            state.nick = user.nick;
        },
        unsetUser(state) {
            state.loggedIn = false;
            state.id = '';
            state.nick = '';
        }
    },
    actions: {
        logout({ commit, dispatch }) {
            if (localStorage.refreshToken) {
                this.refreshRequest = axios
                    .post(config.apiUrl + '/logout', {
                        refreshToken: localStorage.refreshToken
                    })
                    .finally(() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('refreshToken');
                    });
            }
            commit('unsetUser');
            dispatch('message/clear', null, { root: true });
        },
        SOCKET_LOGOUT({ dispatch }) {
            dispatch('logout');
        },
        async SOCKET_REFRESH({ dispatch }, data) {
            await dispatch('refresh');
            if (data[1].startsWith('Bearer ')) {
                data[1] = 'Bearer ' + localStorage.token;
            }
            this._vm.$socket.emit(...data, true);
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
                const { token, refreshToken } = response.data;
                dispatch('applyToken', token);
                localStorage.token = token;
                localStorage.refreshToken = refreshToken;
                return true;
            } catch (err) {
                throw err;
            }
        },
        async refresh({ dispatch }) {
            try {
                if (!this.refreshRequest || this.prevRefreshToken !== localStorage.refreshToken) {
                    this.prevRefreshToken = localStorage.refreshToken;
                    this.refreshRequest = axios
                        .post(config.apiUrl + '/refresh', {
                            refreshToken: localStorage.refreshToken
                        })
                        .then((res) => {
                            const { token, refreshToken } = res.data;
                            dispatch('applyToken', token);
                            localStorage.token = token;
                            localStorage.refreshToken = refreshToken;
                        });
                }
                await this.refreshRequest;
            } catch (err) {
                throw err;
            }
        },
        async checkAuthError({ dispatch }, error) {
            if (!localStorage.refreshToken || error.response.status !== 401 || error.config.retry) {
                return Promise.reject(error);
            }
            await dispatch('refresh');
            const newRequest = {
                ...error.config,
                retry: true
            };
            if (error.config.url.substr(config.apiUrl.length) === '/logout') {
                const requestData = JSON.parse(newRequest.data);
                requestData.refreshToken = localStorage.refreshToken;
                newRequest.data = JSON.stringify(requestData);
            }

            return axios(newRequest);
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
            return { id: state.id, nick: state.nick, loggedIn: state.loggedIn };
        }
    }
};
