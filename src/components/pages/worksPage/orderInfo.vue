<template>
  <div class="orderInfo">
    <div class="top">
      <van-nav-bar
          title="订单信息"
          @click-left="onClickLeft"
          fixed
        >
        <van-icon name="arrow-left" color="#fff" size="20px" slot="left" />
      </van-nav-bar>
    </div>
    <div class="content">
      <div class="title">{{order.merchant.shopName}}</div>
      <div class="goodList" v-for="(goods,index) in order.goodsList" :key="index">
        <van-cell>
          <div slot="icon">
            <img :src="goods.goodsImg.fileUrl" width="40px" height="40px">
          </div>
          <div class="goodName" slot="title">
            {{goods.goodsName}}
          </div>
          <div slot="default" class="goodNum">
            <van-tag color="#fb7299" v-if="goods.goodsStatus==0">在售</van-tag>
            <van-tag color="#969799" v-if="goods.goodsStatus==1">已下架</van-tag>
            x{{goods.orderCount}}
          </div>
          <div slot="right-icon" class="goodPrice">
            ￥{{goods.price*goods.orderCount}}
          </div>
        </van-cell>
      </div>
      <van-cell>
          <div slot="icon">
            <van-tag color="#fb7299" plain>包装费</van-tag>
          </div>
          <div class="goodName" slot="title">
            餐盒
          </div>
          <div slot="default">
            x{{this.sumCount}}
          </div>
          <div slot="right-icon" class="goodPrice">
            ￥{{order.merchant.lunchBox*this.sumCount}}
          </div>
      </van-cell>
      <van-cell>
          <div slot="icon">
            <van-tag color="#fb7299" plain>配送费</van-tag>
          </div>
          <div class="goodName" slot="title">
            蜂鸟快送
          </div>
          <div slot="right-icon" class="goodPrice">
            ￥{{order.merchant.sendPrice}}
          </div>
      </van-cell>
      <div class="price">
        <div>实付￥{{order.totalPrice}}</div>
      </div>
      <div>
        <div class="title">配送信息</div>
        <van-cell title="送达时间"  value="尽快送达"/>
        <van-cell title="收货地址" v-if="order.address!=null"  :value="order.address.address+order.address.houseNumber"/>
        <van-cell title="收货地址" v-else value="地址已被删除"/>
        <van-cell title="配送方式"  value="蜂鸟快送"/>
      </div>
      <div>
        <div class="title">订单信息</div>
        <van-cell title="订单号"  :value="order.id"/>
        <van-cell title="支付方式"  value="在线支付"/>
        <div class="time">
          <van-cell title="下单时间" >
            <div slot="default" class="startTime">
              {{order.startTime}}
            </div>
          </van-cell>
          <van-cell title="订单备注" >
            <div slot="default" class="startTime">
              {{order.remark}}
            </div>
          </van-cell>
        </div>
        
      </div>
      <div class="comment" v-if="order.isComment==1">
        <div class="title">我的评论</div>
        <van-cell-group>
          <van-cell>
           <div slot="title" class="userName">
                  <div>{{order.comment.user.userName}}</div>
                  <div>
                    <van-rate
                      v-model="order.comment.grade"
                      allow-half
                      void-icon="star"
                      void-color="#eee"
                      size="12px"
                      readonly
                    />
                  </div>
                </div>
                <div slot="icon" class="userImg" v-if="order.comment.user.file==null">	
                  <img src="/static/HM-shophome/img/p7.png" width="35px" height="35px">
                </div>
                <div slot="icon" class="userImg" v-else>	
                  <img :src="order.comment.user.file.fileUrl" width="35px" height="35px">
                </div>
                <div slot="label">
                  <div class="evaluate" v-if="order.comment.comment!=null">
                    {{order.comment.comment}}
                  </div>
                  <div class="evaluate" v-else>
                    该用户没有写评价
                  </div>
                  <div v-if="order.comment.img!=null">
                    <img :src="order.comment.img.fileUrl" width="100px" height="100px">
                  </div>
                </div>
              </van-cell>              
        </van-cell-group>
      </div>
    </div>
  </div>
</template>
<script>
import { Toast } from 'vant';
export default {
  data () {
    return {
      sumCount:0,
      message:'',
      isAddress:false,//是否有默认地址false没有
      order:{},
    }
  },
  created(){
    this.order=JSON.parse(this.$route.query.id)
    this.setSumCount()
  },
  methods: {
    setSumCount(){
      for(let i=0;i<this.order.goodsList.length;i++){
        this.sumCount+=this.order.goodsList[i].orderCount
      }
    },
    onClickLeft(){
      this.$router.back(-1)//返回上一个路由
    }
  }
}
</script>
<style scoped>
.userImg{
  margin-top: 6px;
}
/* 评价 */
.evaluate{
  color:#000;
}
/* 评价用户名 */
.userName{
  font-size: 12px;
}
.comment{
  overflow: hidden;
  font-size: 12px;
}
.startTime{
  overflow: hidden;
  white-space: nowrap;
  -o-text-overflow:ellipsis;
  text-overflow: ellipsis;
}
.price div{
  margin-right: 16px;
}
.price{
  width: 100%;
  line-height: 44px;
  background: #fff;
  font-size: 16px;
  overflow: hidden;
  text-align: right;
}
.title{
  width: 100%;
  line-height: 44px;
  background: #fff;
  margin-top: 10px;
  padding-left: 16px;
  font-size: 15px;
  font-weight: bold;
  border-bottom: 1px solid #f7f7f7;
}
.orderInfo{
  overflow: auto;
  height: 100%;
  width: 100%;
  background:#f7f7f7;
}
.content{
  overflow: hidden;
  width: calc(100% - 20px);
  margin: 0px 10px 10px 10px;
}
.goodPrice{
  width: 30px;
  margin-left: 20px;
}
.goodName{
  margin-left: 10px;
}
.top{
  overflow: hidden;
  margin-bottom: 46px;
}
</style>
<style>
.goodNum .van-tag{
  margin-right: 10px;
}
.time .van-cell__value {
  text-align: left;
}
.goodList .van-cell{
  line-height: 40px;
  height: 50px;
}
.orderInfo .van-nav-bar__title{
  color: #fff;
}
</style>