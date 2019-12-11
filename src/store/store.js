import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
/**
 * Vuex全局状态管理
 * @param options {Array} 用于渲染tabs的数组
 */
const store = new Vuex.Store({
  state: {
      // userInfo: {},//当前登陆人信息
    //  url:'http://10.61.27.40:9611/',//服务请求路径
     url:'http://49.234.6.119:9611/',
  },
  mutations: {
    // toLogin(){//公共方法 每个组件可直接调用
    //    window.location.href='http://localhost:8080/#/login'
    // },
  }
});

export default store;
