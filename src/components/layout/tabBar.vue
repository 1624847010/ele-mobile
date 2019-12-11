<template>
  <div class="tabBar">
    
    <van-tabbar v-model="active" active-color="#fb7299">
      <van-tabbar-item to="/customer" >
        <span>外卖</span>
        <van-icon slot="icon" name="wap-home" />
      </van-tabbar-item>
      <van-tabbar-item @click="toSearch()">
        <span>搜索</span>
        <van-icon slot="icon" name="shop" />
      </van-tabbar-item>
      <van-tabbar-item to="/order">
        <span>订单</span>
        <van-icon slot="icon" name="cart" />
      </van-tabbar-item>
      <van-tabbar-item to="/my">
        <span>我的</span>
        <van-icon slot="icon" name="friends"/>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
import eventVue from '../../eventVue.js'
export default {
  data () {
    return {
      active: 0,
    }
  },
  created(){
    this.getActive()
  },
  methods:{
    toSearch(){
      this.active=1
      this.$router.replace({
        path:'/search'
      })
    },
    getActive(){
      var t=sessionStorage.getItem("active")
      if(t!=null){
        this.active=parseInt(t)
      }
    }
  },
}
</script>
<style scoped>
 span{
   font-size: 2px;
 }
</style>
<style>
.tabBar .van-tabbar{
  background: #f7f7f7;
  /* height:40px; */
}
</style>
