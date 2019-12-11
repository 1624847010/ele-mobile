<template>
  <div class="search">
    <div class="top">
      <van-search
        background="#fb7299"
        v-model="value"
        placeholder="请输入搜索商家名"
        
        shape="round"
        @search="onSearch"
        @input="onSearch"
      >
      </van-search>
    </div>
    <div class="content">
      <van-cell-group v-for="(x,index) in business" :key="index" @click="toGood(x)">
        <van-cell :title="x.shopName">
          <div slot="icon" style="width:30px;height:30px;">
            <img v-if="x.file!=null" :src="x.file.fileUrl" width="30px" height="30px">
          </div>
          <div slot="label">
            评分{{x.sumGrade}}
          </div>
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      value:'',
      business:[//商家
      ],
      toseletMerchantUrl:this.$store.state.url+'merchant/selectMerchantList',//商家列表
    }
  },
  created(){
    this.onSearch()
    this.setActive()
  },
  methods:{
    toGood(value){
      this.$router.push({
        name: "good",
        query: { id: JSON.stringify(value)} 
      });
    },
    setActive(){
      sessionStorage.setItem("active",1)
    },
     onSearch() {
      //  if(this.value!=""){
        const merchant={
        pageNum:1,
        pageSize:50,
        shopName:this.value,
        type:0
      }
      this.$axios.get(this.toseletMerchantUrl,{params:merchant}).then(res => {
          if (0 == res.data.responseCode) {
            this.business=res.data.data.list
          } else {
            Toast.fail(res.responseMsg);
            }
        }).catch(function (error) { // 请求失败处理
          const {data} = error.response
          Toast.fail(data.responseMsg);
        });
      //  }else{
      //    this.business=[]
      //  }
      },
  }
}
</script>
<style scoped>
.search{
  width: 100%;
  height: 100%;
  overflow: auto;
}
.content{
  overflow: auto;
  margin-top: 54px;
  height: calc(100% - 54px);
}
.top{
  height: 54px;
  width: 100%;
  position: fixed;
  top: 0px;
}
</style>
<style>
.search .van-cell__title{
  margin-left: 10px;
}
.search .van-cell{
  padding: 5px 16px;
}
</style>
