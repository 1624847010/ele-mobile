import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'//登录
import register from '@/components/register'//注册
import updatePassword from '@/components/updatePassword'//修改密码
import HomePage from '@/components/layout/homePage'
import addressList from '@/components/pages/address/addressList'//收货地址
import addressEdit from '@/components/pages/address/addressEdit'//收货地址
import addressAdd from '@/components/pages/address/addressAdd'
import personal from '@/components/pages/my/personal'//个人资料
import balance from '@/components/pages/my/balance'//余额
import Cart from '@/components/pages/worksPage/business/cart'//购物车
import type from '@/components/pages/worksPage/type/type'//分类
import My from '@/components/pages/worksPage/my'//我的
import search from '@/components/pages/worksPage/search'//商家搜索
import goodsSearch from '@/components/pages/worksPage/business/goodsSearch'//商品搜索
import good from '@/components/pages/worksPage/business/good'//商家商品
import orderInfo from '@/components/pages/worksPage/orderInfo'//订单信息
import order from '@/components/pages/worksPage/order'//订单
import Customer from '@/components/pages/worksPage/customer'//外卖business
import comment from '@/components/pages/worksPage/comment'//评论
Vue.use(Router)

const router = new Router({
  routes: [ 
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/comment',
      name: 'comment',
      component: comment
    },
    {
      path: '/orderInfo',
      name: 'orderInfo',
      component: orderInfo
    },
    {
      path: '/balance',
      name: 'balance',
      component: balance
    },
    {
      path: '/goodsSearch',
      name: 'goodsSearch',
      component: goodsSearch
    },
    {
      path: '/good',
      name: 'good',
      component: good
  },
  {
    path: '/type',
    name: 'type',
    component: type
  },
    {
      path: '/cart',
      name: 'cart',
      component: Cart
    },
    {
      path: '/personal',
      name: 'personal',
      component: personal
    },
    {
      path: '/updatePassword',
      name: 'updatePassword',
      component: updatePassword
    },
    {
      path: '/register',
      name: 'register',
      component: register
    },
    {
      path: '/addressList',
      name: 'addressList',
      component: addressList
    },
    {
      path: '/addressAdd',
      name: 'addressAdd',
      component: addressAdd
    },
    {
      path: '/addressEdit',
      name: 'addressEdit',
      component: addressEdit
    }
    ,{
      path: '/',
      name: 'homePage',
      component: HomePage,
      children:[
        {
          path: '/my',
          name: 'my',
          component: My
        },
        
        {
          path: '/customer',
          name: 'customer',
          component: Customer
        },
        {
          path: '/order',
          name: 'order',
          component: order
        },
        {
          path: '/search',
          name: 'search',
          component: search
        },
      ]
    }
  ]
})
import { Toast } from 'vant';
import {getUserId} from '@/utils/auth'
// 导航守卫
// 使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆
router.beforeEach((to, from, next) => {
  let userId = getUserId()
  if (userId==''||userId==null) {
    if (to.path === '/'||to.path === '/register'||to.path ==='/updatePassword'||to.path === '/customer'||to.path === '/login'
    ||to.path === '/search'||to.path === '/type'||to.path === '/goodsSearch'||to.path === '/good'){
      if(to.path === '/'){
        next('/customer')
      }
      next();
    }else{
      Toast("请先登录")
      next('/login');
    } 
  } else {
    if (to.path === '/'){
      next('/customer');
    }
    sessionStorage.setItem('userId',userId);
    next();
  }
});
export default router;
