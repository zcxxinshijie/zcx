import Vue from 'vue'
import VueRouter from 'vue-router'
import Overview from '../views/Overview/overviewForAdmin.vue'
import User from '../views/User/userManagement.vue'
import Device from '../views/Device/deviceManagement.vue'
import Product from '../views/Product/productManagement.vue'
import Login from '../views/Login/login.vue'
import Layout from '../views/Layout/layout.vue'
import statisticHomepage from '../views/Statistic/statisticHomepage.vue'
import clientTestStatistic from '../views/Statistic/clientTestStatistic.vue'
import clientTrainingStatistic from '../views/Statistic/clientTrainingStatistic.vue'
import deviceUsingStatistic from '../views/Statistic/deviceUsingStatistic.vue'
import operationData from '../views/Statistic/operationData.vue'
import testingInstrumentUsingStatistic from '../views/Statistic/testingInstrumentUsingStatistic.vue'
import trainingUsingStatistic from '../views/Statistic/trainingUsingStatistic.vue'
import userFilter from '../views/Statistic/userFilter.vue'
import verificationCodeStatistic from '../views/Statistic/verificationCodeStatistic.vue'
import rankHomepage from '../views/Rank/rankHomepage.vue'
import rankSetting from '../views/Rank/rankSetting.vue'
import roleManagement from '../views/Rank/roleManagement.vue'
import enterpriseHomepage from '../views/Enterprise/enterpriseHomepage.vue'
import storeManagement from '../views/Enterprise/storeManagement.vue'
import channelManagement from '../views/Enterprise/channelManagement.vue'
import orderHomepage from '../views/Order/orderHomepage.vue'
import orderManagement from '../views/Order/orderManagement.vue'
import packageManagement from '../views/Order/packageManagement.vue'
import priceManagement from '../views/Order/priceManagement.vue'
import trainingDistribution from '../views/Order/trainingDistribution.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    redirect:'/overview',
    children:[
      {
        path: '/overview',
        name: 'OverView',
        component: Overview
      },
      {
        path: '/user',
        name: 'User',
        component: User
      },
      {
        path: '/device',
        name: 'Device',
        component: Device
      },
      {
        path: '/product',
        name: 'Product',
        component: Product
      },
      {
        path: '/statistic',
        name: 'Statistic',
        redirect: '/statistic/operation',
        component:statisticHomepage,
        // component: () => import(/* webpackChunkName: "statistic" */ '../views/Statistic/statisticHomepage.vue'),
        children:[
          {
            path: 'client_test',
            component:clientTestStatistic,
            // component: () => import(/* webpackChunkName: "statistic" */ '../views/Statistic/clientTestStatistic.vue')
          },
          {
            path: 'client_training',
            component:clientTrainingStatistic,
            // component: () => import(/* webpackChunkName: "statistic" */ '../views/Statistic/clientTrainingStatistic.vue')
          },
          {
            path: 'device_using',
            component:deviceUsingStatistic,
            // component: () => import(/* webpackChunkName: "statistic" */ '../views/Statistic/deviceUsingStatistic.vue')
          },
          {
            path: 'operation',
            component:operationData
            // component: () => import(/* webpackChunkName: "statistic" */ '../views/Statistic/operationData.vue')
          },
          {
            path: 'testing_instrument_using',
            component:testingInstrumentUsingStatistic,
            // component: () => import(/* webpackChunkName: "statistic" */ '../views/Statistic/testingInstrumentUsingStatistic.vue')
          },
          {
            path: 'training_using',
            component:trainingUsingStatistic,
            // component: () => import(/* webpackChunkName: "statistic" */ '../views/Statistic/trainingUsingStatistic.vue')
          },
          {
            path: 'user_filter',
            component:userFilter,
            // component: () => import(/* webpackChunkName: "statistic" */ '../views/Statistic/userFilter.vue')
          },
          {
            path: 'verification_code',
            component:verificationCodeStatistic,
            // component: () => import(/* webpackChunkName: "statistic" */ '../views/Statistic/verificationCodeStatistic.vue')
          },
        ]
      },
      {
        path: '/rank',
        name: 'Rank',
        redirect: '/rank/role_management',
        component:rankHomepage,
        // component: () => import(/* webpackChunkName: "rank" */ '../views/Rank/rankHomepage.vue'),
        children:[
          {
            path: 'rank_distribution',
            component:rankSetting,
            // component: () => import(/* webpackChunkName: "rank" */ '../views/Rank/rankSetting.vue')
          },
          {
            path: 'role_management',
            component:roleManagement,
            // component: () => import(/* webpackChunkName: "rank" */ '../views/Rank/roleManagement.vue')
          },
        ]
      },
      {
        path: '/enterprise',
        name: 'Enterprise',
        redirect: '/enterprise/channel_management',
        component:enterpriseHomepage,
        // component: () => import(/* webpackChunkName: "enterprise" */ '../views/Enterprise/enterpriseHomepage.vue'),
        children:[
          {
            path: 'store_management',
            component:storeManagement,
            // component: () => import(/* webpackChunkName: "enterprise" */ '../views/Enterprise/storeManagement.vue')
          },
          {
            path: 'channel_management',
            component:channelManagement,
            // component: () => import(/* webpackChunkName: "enterprise" */ '../views/Enterprise/channelManagement.vue')
          }
        ]
      },
      {
        path: '/order',
        name: 'Order',
        redirect: '/order/package_management',
        component:orderHomepage,
        // component: () => import(/* webpackChunkName: "order" */ '../views/Order/orderHomepage.vue'),
        children:[
          {
            path: 'order_management',
            component:orderManagement,
            // component: () => import(/* webpackChunkName: "order" */ '../views/Order/orderManagement.vue')
          },
          {
            path: 'package_management',
            component:packageManagement,
            // component: () => import(/* webpackChunkName: "order" */ '../views/Order/packageManagement.vue')
          },
          {
            path: 'price_management',
            component:priceManagement,
            // component: () => import(/* webpackChunkName: "order" */ '../views/Order/priceManagement.vue')
          },
          {
            path: 'training_distribution',
            component:trainingDistribution,
            // component: () => import(/* webpackChunkName: "order" */ '../views/Order/trainingDistribution.vue')
          }
        ]
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
