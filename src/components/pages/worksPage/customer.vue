<template>
  <div class="customer">
    <div class="top">
      <van-search background="#fb7299" placeholder="请输入商家名"  shape="round" @focus="onSearch" />
    </div>
    <div class="content">
      <div class="imgs">
        <van-swipe :height="250" :autoplay="3000" indicator-color="#fb7299">
          <van-swipe-item v-for="(image, index) in images" :key="index">
          <!-- <img :src="image.img.fileUrl" style="width:100%;height:250px;" /> -->
            <van-image
            @click="imagePreview(index)"
              fit="cover"
              width="100%"
              height="250px"
              :src="image.img.fileUrl"
            />
          </van-swipe-item>
        </van-swipe>
      </div>
       <!-- 商品分类 -->
      <div class="grid" v-if="type.length>4">
        <van-grid :column-num="4" :border="false">
          <van-grid-item  v-for="(value,index) in type" :key="index" @click="toType(value)">
            <van-image :src="value.file.fileUrl"
                round
                fit="cover"
                width="2.5rem"
                height="2.5rem" />
            <span style="font-size:10px">{{value.typeName}}</span>
          </van-grid-item>
        </van-grid>
      </div>
      <!-- 商品分类 -->
      <div class="grid2" v-else>
        <van-grid :column-num="4" :border="false">
          <van-grid-item  v-for="(value,index) in type" :key="index" @click="toType(value)">
            <van-image :src="value.file.fileUrl"
                round
                width="2.5rem"
                height="2.5rem" />
            <span style="font-size:10px">{{value.typeName}}</span>
          </van-grid-item>
        </van-grid>
      </div>
      <div>
        <div class="business_title"    >推荐商家</div>
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
          :immediate-check="false"
        >
          <div class="businessList" v-for="(x,index) in business" :key="index" @click="toBusiness(x)">
            <van-card             
            >
              <div slot="thumb">
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
                <van-rate
                      v-model="x.sumGrade"
                      allow-half
                      void-icon="star"
                      void-color="#eee"
                      size="12px"
                      readonly
                    />
                <span style="float:right;">售量{{x.saleCount}}</span>
              </div>
              <div slot="tags" class="slot_tags">
                起送￥{{x.sendPrice}}
              </div>
            </van-card>
            <!-- <van-divider :style="{ borderColor: 'rgb(143, 140, 137)', padding: '0 5px' }" /> -->
          </div>
        </van-list>
      </div>
    </div>
    <!-- 预览图片 -->
        <van-image-preview
          v-if="images!=null"
            v-model="showImg"
            :showIndex="true"
            :images="imgPreview"
            :startPosition=index	
          />
  </div>
</template>

<script>
import { Toast } from 'vant';
export default {
  data() {
    return {
      index:0,
      showImg:false,//是否预览商家信息图片
      imgPreview:[],//商家信息图片地址
      total:0,
      pageNum: 1,
      pageSize: 10,
      loading: false,
      finished: false,
      business:[//商家
      ],
      images: [//轮播图
      ],
      type:[//分类
      ],
      toseletMerchantUrl:this.$store.state.url+'merchant/selectMerchantList',//商家列表
      toseletImgUrl:this.$store.state.url+'slide/list',//轮播图列表
      toseletTypeUrl:this.$store.state.url+'type/selectType',//分类列表
    };
  },
  created(){
    this.setActive()
    this.getDate()
    this.getImgList()
    this.getTypeList()
  },
  methods:{
    //预览轮播图图片
    imagePreview(index){
      this.index=index//设置起始位置
      this.imgPreview=[];
      for(let i=0;i<this.images.length;i++){
        this.imgPreview[i]=this.images[i].img.fileUrl
      }
      this.showImg=true
    },
    //查询分类列表
    getTypeList(){
      const type={
        shopId:0,
      }
      this.$axios.get(this.toseletTypeUrl,{params:type}).then(res => {
          if (0 == res.data.responseCode) {
           this.type=res.data.data
          } else {
            Toast.fail(res.responseMsg);
            }
        }).catch(function (error) { // 请求失败处理
          const {data} = error.response
          Toast.fail(data.responseMsg);
        });
    },
    //获取轮播图
    getImgList(){
      const imgs={
        limit:4,
        page:1,
        status:0
      }
      this.$axios.get(this.toseletImgUrl,{params:imgs}).then(res => {
          if (0 == res.data.responseCode) {
           this.images=res.data.data.list
          } else {
            Toast.fail(res.responseMsg);
            }
        }).catch(function (error) { // 请求失败处理
          const {data} = error.response
          Toast.fail(data.responseMsg);
        });
    },
    //获取商家列表
    getDate(){
      const merchant={
        pageNum:this.pageNum,
        pageSize:this.pageSize,
        shopName:'',
        shopType:0
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
    //跳转到分类界面
    toType(value){
      this.$router.replace({
        name:'type',
        query:{id:JSON.stringify(value)}
      });
    },
    setActive(){
      sessionStorage.setItem("active",0)
    },
    //点击搜索框调用父组件方法跳转到搜索页面
    onSearch(){
      this.$emit('save');
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
.businessList{
  border-radius: 10px;
  overflow: hidden; 
  /* border-bottom: 1px solid rgb(143, 140, 137);
  border-left: 1px solid rgb(143, 140, 137);
  border-right: 1px solid rgb(143, 140, 137);
  border-top: 1px solid rgb(143, 140, 137); */
  margin: 5px 10px;
  box-shadow: 2px 2px 10px #909090;
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
.grid2{
  overflow: auto;
  border-radius: 5px;
  box-shadow: 2px 2px 5px #c2c1c1;
  margin:5px 10px 5px 10px;
  height: 66px;
}
.grid{
  overflow: auto;
  border-radius: 5px;
  box-shadow: 2px 2px 5px #c2c1c1;
  margin:15px 10px 15px 10px;
  height: 132px;
}
.imgs{
  overflow: hidden;
  height:"150";
  border-radius: 5px; 
  box-shadow: 2px 2px 5px #c2c1c1;
  margin: 10px 10px 0px 10px;
}
.business_title{
  font-size: 18px;
  font-weight: bold;
  margin:10px 0px 10px 15px;
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
.customer{
  overflow: auto;
  width: 100%;
  height:100%;
}
</style>
<style>

.customer .van-grid-item__content{
  padding: 5px 8px;
}
.customer .van-card{
  background:#fff;
}

</style>