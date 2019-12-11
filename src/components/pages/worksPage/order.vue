<template>
  <div class="order">
    <div class="top">
      <van-nav-bar
          title="我的订单"
          fixed
        >
      </van-nav-bar>
    </div>
    <div class="img" v-if="order.length==0&&accomplish">
      <img src="/static/HM-shophome/img/nothing.png" alt="">
      <div>
        暂无订单
      </div>
    </div> 
    <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
          :immediate-check="false"
        >
      <div class="content" v-for="(order, index) in order" :key="index" @click="toOrderInfo(order)">
        <div class='slot_icon'>
          <img v-if="order.merchant.file!=null" :src="order.merchant.file.fileUrl" alt="" width="40px" height="40px">
        </div>
        <div class="content_text">
          <div @click.stop="toGood(order.merchant)">
            <div class="slot_title">
              {{order.merchant.shopName}}
            </div>
            <div class="slot_label">
              {{order.startTime}}
            </div>
            <div  class="arrow"><van-icon name="arrow" color="#fb7299" size="18px"/></div>
          </div>
          <div class="titleRight">
            <div v-if="order.isSend==1" >已送达</div>
            <div v-if="order.isSend==0">
              派送中
            </div>
            <div v-else-if="order.isComment==0" @click.stop="toComment(order)" style="margin-top:5px;color:#fb7299; font-size:16px;">评价</div>
            <div v-else style="margin-top:5px; font-size:16px;">已评价</div>
            <div v-if="order.isSend==0" class="confirm">
              <van-tag plain color="#fb7299" round @click.stop="confirm(order.id)">确认收货</van-tag>
            </div>
          </div>
          <van-divider />
          <div class="good_name"><van-tag color="#fb7299" >{{order.goodsList[0].goodsName}}</van-tag><span class="goodsNum" v-if="order.goodsList.length>1">等{{order.goodsList.length}}件</span></div>
          <div class="total_price">￥{{order.totalPrice}}</div>
        </div>       
      </div>
    </van-list>
  </div>
</template>
<script>
import { Toast } from 'vant';
export default {
  data () {
    return {
      total:0,
      pageNum: 1,
      pageSize: 10,
      loading: false,
      finished: false,
      order:[],
      accomplish:false,//true则加载完成
      toseletOrderUrl:this.$store.state.url+'order/listByUser',//查询订单
      toupdateOrderUrl:this.$store.state.url+'order/update',//修改订单
    }
  },
  created(){
    this.setActive()
    this.getDate()
  },
  methods:{
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
    //获取数据
    getDate(){
      const userId={
          userId: parseInt(sessionStorage.getItem("userId")),
          limit:this.pageSize,
          page:this.pageNum
        }
      this.$axios.get(this.toseletOrderUrl,{params:userId}).then(res => {
          if (0 == res.data.responseCode) {
           this.order=this.order.concat(res.data.data.list)
           this.total=res.data.data.total
           this.accomplish=true
          } else {
            Toast.fail(res.responseMsg);
            }
        }).catch(function (error) { // 请求失败处理
          const {data} = error.response
          Toast.fail(data.responseMsg);
        });
    },
    //评价
    toComment(value){
      this.$router.push({
        name:'comment',
        query: { id: JSON.stringify(value)} 
      })
    },
    // 确认收货
    confirm(orderId){
      this.$dialog.confirm({
        message: '是否确认收货？',
        width:"280px"
      }).then(() => {
        // on confirm
      // 调用接口设置订单已经送达
        const data={
          id: orderId,
          isSend:1
        }
        this.accomplish=false
        this.$axios.post(this.toupdateOrderUrl,data).then(res => {
            if (0 == res.data.responseCode) {
              this.order=[]
              this.pageNum=1
              this.getDate()
            } else {
              Toast.fail(res.responseMsg);
              }
          }).catch(function (error) { // 请求失败处理
            const {data} = error.response
            Toast.fail(data.responseMsg);
          });
        }).catch(() => {
          // on cancel
        });
    },
    toOrderInfo(value){
      this.$router.push({
        name:'orderInfo',
        query: { id: JSON.stringify(value)} 
      })
    },
    toGood(value){
      this.$router.push({
        name:'good',
        query: { id: JSON.stringify(value)} 
      })
    },
    setActive(){
      sessionStorage.setItem("active",2)
    }
  }
}
</script>
<style scoped>
.img{
  width: 100%;
  text-align: center;
  margin-top: 150px;
  font-size: 14px;
  color: #BFBDBA;
}
.img img{
  width:50px;
  height: 50px;
}
.goodsNum{
  margin-left: 10px;
}
.arrow{
  position: absolute;
  left: 120px;
  top: 1px;
}
.confirm{
  position: relative;
  top:7px;
  right: 11px;
}
.titleRight{
  position: absolute;
  right: 0px;
  top: 0px;
}
.top{
  overflow: hidden;
  margin-bottom: 56px;
}
.good_name{
  font-size: 12px;
}
.total_price{
  position: absolute;
  right: 15px;
  bottom:0px;
  font-size: 12px;
}
.content_text{
  overflow: hidden;
  margin-left: 50px;
  position: relative;
}
.slot_icon{
  float: left;
  overflow: hidden;
}
.content{
  background: #fff;
  border-radius: 10px; 
  margin: 5px 5px 5px 5px;
  padding:10px 10px 35px 10px;
  height: 65px;
  overflow: hidden;
  box-shadow: 2px 2px 10px #909090;
}
.order{
  background: #f8f8f8;
  overflow: auto;
  width: 100%;
  height:100%;
}
.slot_label{
  overflow: hidden;
  width:150px;
  /* 只显示一行超出文字自动变成... */
  white-space: nowrap;
  -o-text-overflow:ellipsis;
  text-overflow: ellipsis;
  /* text-overflow: ellipsis; 溢出用省略号 */
  font-size: 8px;
  padding: 0px;
  color: rgb(124, 115, 115);
}
.slot_title{
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 10px;
}
</style>
<style>
.order .van-nav-bar{
  background:#fb7299;
}
.order .van-nav-bar__title{
  color: #fff;
}
.order .van-divider{
  margin: 10px 0;
}
</style>
