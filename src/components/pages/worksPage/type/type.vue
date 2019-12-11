<template>
  <div class="type">
      <div class="top">
        <van-nav-bar :title="type.typeName" fixed >
          <van-icon name="arrow-left" color="#fff" size="20px" slot="left" @click="retCustomer" />
        </van-nav-bar>
      </div>
      <van-dropdown-menu>
          <van-dropdown-item disabled  v-model="value1" :options="option1" />
          <van-dropdown-item disabled  v-model="value2" :options="option2" />
        </van-dropdown-menu>
        <div class="img" v-if="business.length==0">
          <img src="/static/HM-shophome/img/nothing.png" alt="">
          <div>
            暂无商家
          </div>
        </div>  
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
      >
        <div class="businessList" v-for="(x,index) in business" :key="index" @click="toBusiness(x)">
          <van-card>
          <div slot="thumb" >
                <van-image
                width="90px"
                height="90px"
                  v-if="x.file!=null"
                    :src="x.file.fileUrl"
                  />
              </div>
            <div slot="title" class="slot_title">
              {{x.shopName}}
            </div>
            <div slot="desc" class="slot_desc">
              <van-rate v-model="x.score" readonly size="12px"/>
              <span style="float:right;">月售{{x.saleCount}}</span>
            </div>
            <div slot="tags" class="slot_tags">
              起送￥{{x.sendPrice}}
            </div>
          </van-card>
        </div>
      </van-list>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value1: 0,
      value2: 'a',
      option1: [
        { text: '全部商家', value: 0 },
        { text: '新进商家', value: 1 },
        { text: '活动商家', value: 2 }
      ],
      option2: [
        { text: '默认排序', value: 'a' },
        { text: '好评排序', value: 'b' },
        { text: '销量排序', value: 'c' },
      ],
      pageNum: 1,
      pageSize: 10,
      total:0,
      loading: false,
      finished: false,
      business:[//商家
      ],
      type:{typeName:''},//分类
      toseletMerchantUrl:this.$store.state.url+'merchant/selectMerchantList',//商家列表
    };
  },
  created(){
    this.type=JSON.parse(this.$route.query.id)
    this.getDate()
    this.setActive()
  },
  methods:{
    getDate(){
       const merchant={
        pageNum:this.pageNum,
        pageSize:this.pageSize,
        shopName:'',
        shopType:this.type.id,
        type:0
      }
      this.$axios.get(this.toseletMerchantUrl,{params:merchant}).then(res => {
          if (0 == res.data.responseCode) {
              this.business=this.business.concat(res.data.data.list )  
              this.total=res.data.data.total   
          } else {
            Toast.fail(res.responseMsg);
            }
        }).catch(function (error) { // 请求失败处理
          const {data} = error.response
          Toast.fail(data.responseMsg);
        });
    },
    retCustomer(){
      this.$router.replace({
        path:'/customer'
      });
    },
    setActive(){
      sessionStorage.setItem("active",0)
    },
    onLoad() {
      // 异步更新数据
      setTimeout(() => {
        this.pageNum+=1
        // 加载状态结束
          this.loading = false;
        // 数据全部加载完成
        if(this.total%this.pageSize==0){
          this.total/=this.pageSize
        }else{
          this.total=this.total/this.pageSize+1
        }
        if(this.pageNum>this.total){
          this.finished = true;
        }else{
          this.getDate()
        }
      }, 500);
    },
     toBusiness(value){
       this.$router.push({
        name: "good",
        query: { id: JSON.stringify(value)} 
      });
     }
  }
};
</script>
<style scoped>
.img{
  width: 100%;
  text-align: center;
  margin-top: 100px;
  font-size: 14px;
  color: #BFBDBA;
}
.img img{
  width:50px;
  height: 50px;
}
.top{
  overflow: hidden;
  margin-bottom: 46px;
}
.grid{
  overflow: hidden;
  border-radius: 5px;
  box-shadow: 2px 2px 5px #c2c1c1;
  margin:5px 10px 5px 10px;
}
.imgs{
  overflow: hidden;
  height:"150";
  border-radius: 5px; 
  box-shadow: 2px 2px 5px #c2c1c1;
  margin: 0px 10px 0px 10px;
}
.slot_tags{
  color: #BFBDBA;
}
.slot_desc{
  color: #BFBDBA;
  margin-bottom: 5px;
}
.slot_title{
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}
.type{
  overflow: auto;
  width: 100%;
  height:100%;
}
</style>
<style>

.type .van-nav-bar__title{
  color: #fff;
}
</style>
