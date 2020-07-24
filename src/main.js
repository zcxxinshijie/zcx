import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import './style.css'
import axios from 'axios'
import echarts from 'echarts'
import "./assets/iconfont/iconfont.css"

Vue.use(antd);
Vue.config.productionTip = false;
Vue.prototype.axios = axios;
Vue.prototype.echarts = echarts;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
