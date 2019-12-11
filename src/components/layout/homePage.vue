<template>
  <div>
    <div class="content">
        <router-view @save="save"></router-view>
    </div>
    <div class="tabBar">
      <TabBar ref="tabBar"></TabBar>
    </div>
  </div>
</template>
<script>
import TabBar from './tabBar.vue'
export default {
  components:{TabBar},
  data () {
    return {
  
    }
  },
  methods:{
    //调用子组件方法
    save(){
      this.$refs.tabBar.toSearch();
    }
  }
}
</script>
<style scoped>
  .content{
    height: calc(100% - 40px);
    width: 100%;
    position: fixed;  
    top:0px;
  }
  .tabBar{
    height:40px;
    position: fixed;  
    bottom: 0px;
  }
</style>
