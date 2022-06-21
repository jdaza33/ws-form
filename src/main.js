import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import VueCookie from 'vue-cookie'
import VueBus from 'vue-bus'
import VueTheMask from 'vue-the-mask'
// import VueMobileDetection from 'vue-mobile-detection'
// Vue.use(VueMobileDetection)
// import device from 'vue-device-detector'
// Vue.use(device)

Vue.use(VueBus)
Vue.use(Buefy, {
  defaultDayNames: ['D', 'L', 'M', 'Mi', 'J', 'V', 'S'],
  defaultMonthNames: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ],
  defaultFirstDayOfWeek: 1,
  defaultDateFormatter: (date) => date.toLocaleDateString('es-ES'),
})
Vue.use(VueCookie)
Vue.use(VueTheMask)

Vue.config.productionTip = false

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')
