import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

var vm = new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')


console.log(vm, '321331232');

console.log(vm.hasOwnProperty('$set'));

console.log(Vue.prototype.hasOwnProperty('$set'));