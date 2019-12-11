<template>
  <div class="cart">
    <div class="top">
      <van-nav-bar
          title="确定订单"
          @click-left="onClickLeft"
          fixed
        >
        <van-icon name="arrow-left" color="#fff" size="20px" slot="left" />
      </van-nav-bar>
    </div>
      <div>
        <van-cell v-if="!isAddress" title="请选择收货地址" icon="location-o" is-link @click="toAddressList"/>
        <van-cell v-if="isAddress"  :title="address.address" is-link  @click="toAddressList">
          <div slot="label">
            <span>{{address.name}}</span>
            <span class="tel">{{address.tel}}</span>
          </div>
        </van-cell>
        <van-cell title="立即送出"/>
        <van-cell title="支付方式"  value="立即支付"/>
      </div>
      <van-cell :title="order.businessName"/>
      <div class="goodList" v-for="(goods,index) in order.goods" :key="index">
        <van-cell>
          <div slot="icon">
            <img :src="goods.goodsImg.fileUrl" width="40px" height="40px">
          </div>
          <div class="goodName" slot="title">
            {{goods.goodsName}}
          </div>
          <div slot="default" class="goodNum">
            x{{goods.count}}
          </div>
          <div slot="right-icon" class="goodPrice">
            ￥{{goods.price*goods.count}}
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
          <div slot="right-icon">
            ￥{{order.lunch_box_price}}
          </div>
      </van-cell>
      <van-cell>
          <div slot="icon">
            <van-tag color="#fb7299" plain>配送费</van-tag>
          </div>
          <div class="goodName" slot="title">
            蜂鸟快送
          </div>
          <div slot="right-icon">
            ￥{{order.distribution_price}}
          </div>
      </van-cell>
      <van-cell title="订单"  value="待支付"/>
      <van-field
              v-model.trim="message"
              rows="3"
              autosize
              type="textarea"
              placeholder="请输入口味、偏好等"
              maxlength="50"
            />
      <van-submit-bar
          :price="order.sumPrice*100"
          button-text="提交订单"
          @submit="onSubmit"
        >
        </van-submit-bar>
  </div>
</template>
<script>
import { Toast } from 'vant';
export default {
  data () {
    return {
      message:'',
      isAddress:false,//是否有默认地址false没有
      order:{},
      address:{},
      toUserUrl:this.$store.state.url+'user/selectById',//查询用户信息
      toOrderUrl:this.$store.state.url+'order/add',//添加订单
      toUpdateUserUrl:this.$store.state.url+'user/updateUser',//修改用户信息
      toUpdateUserUrl:this.$store.state.url+'user/updateUser',//修改商品信息
      toUpdateGoodsUrl:this.$store.state.url+'goods/updateGoods',//修改商品信息
      toSelectGoodsUrl:this.$store.state.url+'goods/selectGoodsById',//根据id查询商品信息
      money:0,
    }
  },
  created(){
  this.getAddress()  
  this.getuserInfo()
  this.order=JSON.parse(this.$route.query.id)
  },

  methods: {
    //获取用户信息
    getuserInfo(){
      const userId={
          id: parseInt(sessionStorage.getItem("userId"))
        }
        this.$axios.post(this.toUserUrl,userId).then(res => {
          if (0 == res.data.responseCode) {
            this.money=res.data.data.money
          } else {
            Toast.fail(res.responseMsg);
            }
        }).catch(function (error) { // 请求失败处理
          const {data} = error.response
          Toast.fail(data.responseMsg);
        });
    },
    toAddressList(){
      this.$router.push({
        path:'/addressList',
      })
    },
    //修改余额
    updateMoney(){
      const data={
        id:parseInt(sessionStorage.getItem('userId')),
        money:this.money-this.order.sumPrice
      }
      this.$axios.put(this.toUpdateUserUrl,data).then(res => {
            if (0 == res.data.responseCode) {
              this.$router.push({
                name: "order",
              });
            } else {
              Toast.fail(res.responseMsg);
              }
          }).catch(function (error) { // 请求失败处理
            const {data} = error.response
            Toast.fail(data.responseMsg);
          });
    },
    //修改商品数量
    updateSaleCount(){
      for(let i=0;i<this.order.goods.length;i++){
        const id={
        id:this.order.goods[i].id
      }
      const goodsData={
          id:id.id,
          saleCount:0
        }
        //根据id查询商品信息
        this.$axios.get(this.toSelectGoodsUrl,{params:id}).then(res => {
            if (0 == res.data.responseCode) {
              goodsData.saleCount=res.data.data.list[0].saleCount+this.order.goods[i].count
              //修改商品数量
              this.$axios.put(this.toUpdateGoodsUrl,goodsData).then(res => {
                if (0 == res.data.responseCode) {
                  this.$router.push({
                    name: "order",
                  });
                  } else {
                    Toast.fail(res.responseMsg);
                    }
                }).catch(function (error) { // 请求失败处理
                  const {data} = error.response
                  Toast.fail(data.responseMsg);
                });
            } else {
              Toast.fail(res.responseMsg);
              }
          }).catch(function (error) { // 请求失败处理
            const {data} = error.response
            Toast.fail(data.responseMsg);
          });
      }
    },
    //提交订单
    setOrder(){
      var goods=[]
      for(let i=0;i<this.order.goods.length;i++){
          let data={
            count:this.order.goods[i].count,
            id:this.order.goods[i].id
          }
          goods.push(data)
      }
      const data={
        userId:parseInt(sessionStorage.getItem("userId")),
        userAddress:this.address.id,
        totalPrice:this.order.sumPrice,
        shopId:this.order.businessId,
        remark:this.message,
        isSend:0,
        isComment:0,
        isClose:0,
        goodsJson:{goods},
      }
      this.$axios.post(this.toOrderUrl,data).then(res => {
          if (0 == res.data.responseCode) {
            sessionStorage.removeItem(this.order.businessId)
            this.updateMoney()//修改余额
            this.updateSaleCount()//修改商品数量
          } else {
            Toast.fail(res.responseMsg);
            }
        }).catch(function (error) { // 请求失败处理
          const {data} = error.response
          Toast.fail(data.responseMsg);
        });
    },
    //提交订单
    onSubmit(){
      this.$dialog.confirm({
        message: '是否支付？',
        width:"280px"
      }).then(() => {
        // on confirm
        if(!this.isAddress){
          Toast('请选择收货地址');
        }else{
          sessionStorage.setItem(this.order.businessId, JSON.stringify(this.order))
          //判断用户余额是否充足
          if(this.money>=this.order.sumPrice){
            //添加到订单
            this.setOrder()
          }else{
            Toast('余额不足');
          }
        }
      }).catch(() => {
        // on cancel
      });
    },
    getAddress(){
      this.order=JSON.parse(sessionStorage.getItem(this.order.businessId))
      var t=JSON.parse(sessionStorage.getItem("address"))
      if(t!=null){
        this.address=JSON.parse(sessionStorage.getItem("address"))
        this.isAddress=true
      }
    }, 
    onClickLeft(){
      this.$router.back(-1)//返回上一个路由
    }
  }
}
</script>
<style scoped>
.tel{
  margin-left: 20px;
}
.goodPrice{
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
.goodList .van-cell{
  line-height: 40px;
  height: 50px;
}

.cart .van-nav-bar__title{
  color: #fff;
}
</style>