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
        createMeetup(state, payload) {
            state.loadedMeetups.push(payload)
        },
        updateMeetup(state, payload) {
            const meetup = state.loadedMeetups.find(meetup => {
                return meetup.id === payload.id
            })
            if (payload.title) {
                meetup.title = payload.title
            }
            if (payload.description) {
                meetup.description = payload.description
            }
            if (payload.date) {
                meetup.date = payload.date
            }
        },
        setUser(state, payload) {
            state.user = payload
        },
        setLoading(state, payload) {
            state.loading = payload
        },
        setError(state, payload) {
            state.error = payload
        },
        clearError(state) {
            state.error = null
        },
        setLoadedMeetups(state, payload) {
            state.loadedMeetups = payload
        }
    },
    actions: {
        loadMeetups({
            commit
        }) {
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
                                location: obj[key].location,
                                creatorId: obj[key].creatorId
                            })
                        }
                        commit('setLoadedMeetups', meetups)
                        commit('setLoading', false)
                    }
                )
                .catch(
                    (error) => {
                        commit('setLoading', false)
                    }
                )
        },
        createMeetup({
            commit,
            getters
        }, payload) {
            const meetup = {
                title: payload.title,
                location: payload.location,
                description: payload.description,
                date: payload.date.toISOString(),
                creatorId: getters.user.id
            }
            let imageUrl
            let key
            firebase.database().ref('meetups').push(meetup)
                .then(
                    (data) => {
                        key = data.key
                        return key
                    })
                .then(key => {
                    const filename = payload.image.name
                    const ext = filename.slice(filename.lastIndexOf('.'))
                    return firebase.storage().ref('meetups/' + key + '.' + ext).put(payload.image)
                })
                .then(fileData => {
                    imageUrl = fileData.metadata.downloadURLs[0]
                    return firebase.database().ref('meetups').child(key).update({
                        imageUrl: imageUrl
                    })
                })
                .then(() => {
                    commit('createMeetup', {
                        ...meetup,
                        imageUrl: imageUrl,
                        id: key
                    })
                })
                .catch(
                    (error) => {
                        console.log(error)
                    })
            //store to firebase
        },
        updateMeetupData({
            commit
        }, payload) {
            commit('setLoading', true)
            const updateObj = {}
            if (payload.title) {
                updateObj.title = payload.title

            }
            if (payload.description) {
                updateObj.description = payload.description
            }
            if (payload.date) {
                updateObj.date = payload.date
            }
            firebase.database().ref('meetups').child(payload.id).update(updateObj)
                .then(() => {
                    commit('setLoading', false)
                    commit('updateMeetup', payload)
                })
                .catch(error => {
                    commit('setLoading', false)
                })
        },
        SignUserUp({
            commit
        }, payload) {
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
        SignUserIn({
            commit
        }, payload) {
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
        autoSignIn({
            commit
        }, payload) {
            commit('setUser', {
                id: payload.uid,
                registeredMeetups: []
            })
        },
        logout({
            commit
        }) {
            firebase.auth().signOut()
            commit('setUser', null)
        },
        clearError({
            commit
        }) {
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
        user(state) {
            return state.user
        },
        error(state) {
            return state.error
        },
        loading(state) {
            return state.loading
        }
    }
})