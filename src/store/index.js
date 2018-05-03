import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'
Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        loadedMeetups: [{
                imageUrl: 'https://lonelyplanetimages.imgix.net/mastheads/GettyImages-538096543_medium.jpg?sharp=10&vib=20&w=1200',
                id: 'dsfdsf',
                title: 'New York',
                date: new Date(),
                location: "New York",
                description: "Describe NY!"
            },
            {
                imageUrl: 'http://baycityguide.com/media/00P0B00000uwaF6UAI/Skyline-Downtown-Close-up-1500.jpg',
                id: 'hghgnb',
                title: 'San Fransisco',
                date: new Date(),
                location: "San F",
                description: "Blah Blah San Fa"
            }
        ],
        user: null,
        loading: false,
        error: null
    },
    mutations: {
        createMeetup (state, payload){
            state.loadedMeetups.push(payload)
        },
        setUser(state, payload){
            state.user = payload
        },
        setLoading (state, payload) {
            state.loading = payload
        },
        setError (state, payload) {
            state.error = payload
        },
        clearError (state) {
            state.error = null
        },
        setLoadedMeetups (state, payload) {
            state.loadedMeetups = payload
        }
    },
    actions: {
        loadMeetups ({commit}) {
            commit('setLoading', true)
            firebase.database().ref('meetups').once('value')
            .then(
                (data) => {
                    const meetups = []
                    const obj = data.val()
                    for (let key in obj) {
                        meetups.push({
                            id: key,
                            title: obj[key].title,
                            description: obj[key].description,
                            imageUrl: obj[key].imageUrl,
                            date: obj[key].date,
                        })
                    }
                    commit('setLoadedMeetups', meetups)
                    commit('setLoading', false)
                }
            )
            .catch(
                (error) => {
                    commit('setLoading', true)
                }
            )
        },
        createMeetup ({commit}, payload){
            const meetup = {
                title: payload.title,
                location: payload.location,
                imageUrl: payload.imageUrl,
                description: payload.description,
                date: payload.date.toISOString()
            }
            firebase.database().ref('meetups').push(meetup)
            .then(
                (data) => {
                    const key = data.key
                    commit('createMeetup', {
                        ...meetup,
                        id: key
                    })

                })
                .catch(
                    (error) => {
                        console.log(error)
                    })
            //store to firebase
        },
        SignUserUp ({commit}, payload) {
            commit('setLoading', true)
            commit('clearError')
            firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
            .then(
                user => {
                    commit('setLoading', false)
                    const newUser = {
                        id: user.uid,
                        registeredMeetups: []
                    }
                    commit('setUser', newUser)
                }
            )
            .catch(
                error => {
                    commit('setLoading', false)
                    commit('setError', error)
                    console.log(error)
                }
            )
        },
        SignUserIn({commit}, payload){
            commit('setLoading', true)
            commit('clearError')
            firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
            .then(
                user => {
                    commit('setLoading', false)
                    const newUser = {
                        id: user.uid,
                        registeredMeetups: []
                    }
                    commit('setUser', newUser)
                }
            )
                .catch(
                    error => {
                        commit('setLoading', false)
                        commit('setError', error)
                        console.log(error)
                    }
            )
        },
        clearError ({commit}){
            commit('clearError')
        }
    },
    getters: {
        loadedMeetups(state) {
            return state.loadedMeetups.sort((meetupA, meetupB) => {
                return meetupA.date > meetupB.date
            })
        },
        featuredMeetups(state, getters) {
            return getters.loadedMeetups.slice(0, 5)
        },
        loadedMeetup(state) {
            return (meetupId) => {
                return state.loadedMeetups.find((meetup) => {
                    return meetup.id === meetupId
                })
            }
        },
        user (state) {
            return state.user
        },
        error (state) {
            return state.error
        },
        loading (state) {
            return state.loading
        }
    }
})