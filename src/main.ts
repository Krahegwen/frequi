import Vue from 'vue';
import './plugins/bootstrap-vue';
import App from './App.vue';
import store from './store';
import router from './router';
import { init } from './shared/apiService';
import vuetify from './plugins/vuetify';

init(store);

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
