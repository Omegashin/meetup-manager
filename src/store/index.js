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
        user: null
    },
    mutations: {
        createMeetup (state, payload){
            state.loadedMeetups.push(payload)
        },
        setUser(state, payload){
            state.user = payload
        }
    },
    actions: {
        createMeetup ({commit}, payload){
            const meetup = {
                title: payload.title,
                location: payload.location,
                imageUrl: payload.imageUrl,
                description: payload.description,
                date: payload.date,
                id: 'idforthis'
            }
            //store to firebase
            commit('createMeetup', meetup)
        },
        SignUserUp ({commit}, payload) {
            firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
            .then(
                user => {
                    const newUser = {
                        id: user.uid,
                        registeredMeetups: []
                    }
                    commit('setUser', newUser)
                }
            )
            .catch(
                error => {
                    console.log(error)
                }
            )
        },
        SignUserIn({commit}, payload){
            firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
            .then(
                user => {
                    const newUser = {
                        id: user.uid,
                        registeredMeetups: []
                    }
                    commit('setUser', newUser)
                }
            )
                .catch(
                    error => {
                        console.log(error)
                    }
            )
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
        }
    }
})