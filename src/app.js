import Vue from 'vue'
import App from './App.vue'
import { createStore } from './store'
import { createRouter } from './router'
import { sync } from 'vuex-router-sync'
import titleMixin from './util/title'
import * as filters from './util/filters'
import axios from 'axios'

// minxin 处理动态标题
Vue.mixin(titleMixin)
// 注册全局过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

axios.defaults.timeout = 5000

// http request 拦截器
axios.interceptors.request.use((config) => {
  // 发送请求前
  return config;
}, error => {
  // 请求发生错误
  return Promise.reject(error);
});

// http response 拦截器
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response) {
      // console.log(error.response.status)
    }
    return Promise.reject(error.response.data)
  });

Vue.prototype.axios = axios

export function createApp() {

  const store = createStore()
  const router = createRouter()
  // 同步 router 和 the vuex store.
  // 使用方式 `store.state.route`
  sync(store, router)

  //创建应用程序实例。
  //这里我们将路由器，存储和ssr上下文注入到所有子组件，
  //让它们随处可见，通过使用`this.$router` 和 `this.$store`。
  const app = new Vue({
    router,
    store,
    render: h => h(App)
  })


  //公开app，router和store。
  //注意，我们没有在这里挂载应用程序，因为引导将是
  //根据我们是在浏览器还是在服务器上而不同。
  return { app, router, store }
}
