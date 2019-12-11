// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios';
Vue.prototype.$axios = axios;
import store from './store/store';

import Vant from 'vant';
import 'vant/lib/index.css';
import {ScrollTab, ScrollTabPanel} from 'vue-ydui/dist/lib.rem/scrolltab';
/* 使用px：import {ScrollTab, ScrollTabPanel} from 'vue-ydui/dist/lib.px/scrolltab'; */
Vue.component(ScrollTab.name, ScrollTab);
Vue.component(ScrollTabPanel.name, ScrollTabPanel);
Vue.config.productionTip = false
Vue.use(Vant);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
