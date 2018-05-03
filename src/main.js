import Vue from 'vue'
import App from './App'
import * as firebase from 'firebase'
import router from './router'
import { store } from './store'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import colors from 'vuetify/es5/util/colors'
import DateFilter from './filters/date'
import AlertCmp from './components/Shared/Alert.vue'

Vue.use(Vuetify, { theme: {
  primary: colors.blueGrey.base,
  secondary: '#424242',
  accent: '#82B1FF',
  error: '#FF5252',
  info: '#2196F3',
  success: '#4CAF50',
  warning: '#FFC107'
}})

Vue.filter('date', DateFilter)
Vue.component('app-alert', AlertCmp)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  created () {
    firebase.initializeApp({
      apiKey: 'AIzaSyB66y6Jikzn3iOY8dZ3xtmy2ktMaJfADlw',
      authDomain: 'devmeetup-vue-js.firebaseapp.com',
      databaseURL: 'https://devmeetup-vue-js.firebaseio.com',
      projectId: 'devmeetup-vue-js',
      storageBucket: 'devmeetup-vue-js.appspot.com'
    })
  }
})
