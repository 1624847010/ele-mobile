<template>
  <div class="goodsSearch">
    <div class="top">
      <img class="left_img" src="../../../../assets/left2.png" width="20px" height="20px" @click="retGood"/>
      <van-search
          v-model="value"
          placeholder="请输入商品名"
          shape="round"
          @input="onSearch"
        >
      </van-search>
    </div>
    <div class="content">
      <van-card v-for="(good,index) in goodList" :key="index">
      <div slot="thumb" >
        <van-image
          width="70"
          height="70"
          :src="good.goodsImg.fileUrl"
        />
      </div>
      <div slot="title" class="slot_title">{{good.goodsName}}</div>
      <div slot="desc" class="slot_desc">{{good.remark}}</div>
      <div slot="price" class="slot_price">￥{{good.price}}</div>
      <div slot="footer" class="countber">
        <div>
          <img class="left_img" src="../../../../assets/increase.png" @click.stop="increase(good)" />
        </div>
        <div v-if="good.count!=0">{{good.count}}</div>
        <div>
          <img v-if="good.count!=0" class="left_img" src="../../../../assets/reduce.png" @click.stop="reduce(good)" />
        </div>
      </div>
    </van-card>
    <!-- 购物车弹窗 -->
    <van-popup v-model="showCart" position="bottom" >
      <div class="cartTop">
        <span>已选商品</span><span class="clear" @click="clearCart()">清空</span>
      </div>
      <div class="popup_good">
        <van-cell v-for="(good,index) in cartList.goods" :key="index" :title="good.goodsName">
        <div slot="default">
          <div class="count">
            <div>
              <img class="left_img" src="../../../../assets/increase.png" width="20px" height="20px" @click.stop="increase(good)"/>
            </div>   
            <div  class="num">{{good.count}}</div>
            <div>
                <img class="left_img" src="../../../../assets/reduce.png" width="20px" height="20px" @click.stop="reduce(good)"/>
            </div>
            <div class="price">￥{{good.price*good.count}}</div>
          </div>
        </div>
      </van-cell>
      <div style="margin-top:10px">
        <van-cell title="餐盒">
          <div slot="default" class="lunch_box_price">
            ￥{{cartList.lunch_box_price}}
          </div>
        </van-cell>
        <van-cell title="配送费">
        <div slot="default" class="lunch_box_price">
          ￥{{cartList.distribution_price}}
        </div>
        </van-cell>
      </div>
    </div>
    </van-popup>
    <!-- 购物车 -->
        <van-submit-bar
          :price="cartList.sumPrice*100"
          button-text="去结算"
          @submit="onSubmit"
          :disabled="isDisabled"
        >
          <van-goods-action-icon icon="cart-o" text="购物车" :info="cartList.sumCount" @click="isShowCart()" />
        </van-submit-bar>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      business:{},
      isDisabled:true,//是否禁用去结算按钮
      showCart:false,//购物车是否弹出
      value: "",
      goodList: [
      ],
      cartList://购物车
        {
          sumPrice:0,//总价
          sumCount:0,//商品数量
          userId:'',
          businessId:'',
          businessName:'',
          lunch_box_price:0,//餐盒费lunchBox
          distribution_price:0,//配送费sendPrice
          goods:[
            
          ]
        },
      toSelectGoodsUrl:this.$store.state.url+'goods/selectGoods',//查询评价列表
    };
  },
  created(){
    this.getCart()
  },
  methods: {
    //弹出购物车
    isShowCart(){
      this.showCart=true;
    },
    //提交订单
    onSubmit(){
      this.$router.push({
        name: "cart",
        query: {
          id: JSON.stringify(this.cartList)
        }
      });
    },
    //用来接收路由传来的购物车
    getCart(){
      this.business=JSON.parse(this.$route.query.id)
      this.cartList=JSON.parse(sessionStorage.getItem(this.business.id))
      if(this.cartList.sumCount>0){
          this.isDisabled=false
        }
    },
    setCart(){
      sessionStorage.setItem(this.business.id, JSON.stringify(this.cartList))
    },
    // 点击-号
    reduce(newGood){
      if(newGood.count>0){
        //判断是否购物车中已经有商品，如果有就增加数量，反之加入这个商品
        let foodIndex = this.cartList.goods.findIndex(good => good.goodsName == newGood.goodsName);
        newGood.count=--this.cartList.goods[foodIndex].count
        if(this.cartList.goods[foodIndex].count==0){
          this.cartList.goods.splice(foodIndex,1)
        }
        this.cartList.sumCount--
        this.cartList.sumPrice-=newGood.price
        this.cartList.lunch_box_price-=this.business.lunchBox
        this.cartList.sumPrice-=this.business.lunchBox
        if(this.cartList.sumCount==0){
          this.isDisabled=true
        }
        this.setCart()
      }
    },
    //清空购物车
    clearCart(){
      this.$dialog.confirm({
        message: '清空购物车？',
        width:"280px"
      }).then(() => {
        // on confirm
        sessionStorage.removeItem(this.business.id)
        this.onSearch()
        this.cartList.goods=[];
        this.cartList.sumCount=0; 
        this.cartList.sumPrice=this.cartList.distribution_price
        this.cartList.lunch_box_price=0
        this.isDisabled=true
      }).catch(() => {
        // on cancel
      });
    },
    //点击+号
    increase(newGood){
      //判断是否购物车中已经有商品，如果有就增加数量，反之加入这个商品
      let foodIndex = this.cartList.goods.findIndex(good => good.goodsName == newGood.goodsName);
      //foodIndex为-1表示不存在 ,要加入商品
      if (foodIndex === -1) {
          newGood.count++
          this.cartList.goods.push(newGood)
      }else{
        this.cartList.goods[foodIndex].count++
        newGood.count=this.cartList.goods[foodIndex].count
      }
      this.cartList.sumCount++
      this.cartList.sumPrice+=newGood.price
      this.cartList.lunch_box_price+=this.business.lunchBox
      this.cartList.sumPrice+=this.business.lunchBox
      this.isDisabled=false
      this.setCart()
     },
     //搜索
    onSearch() {
      if (this.value != "") {
        //调用接口查询商品
        const merchant={
        pageNum:1,
        pageSize:50,
        goodsName:this.value,
        shopId:this.business.id
      }
      this.$axios.get(this.toSelectGoodsUrl,{params:merchant}).then(res => {
          if (0 == res.data.responseCode) {
            this.goodList=res.data.data.list
          for(let i=0;i<this.goodList.length;i++){
            var foodIndex = this.cartList.goods.findIndex(value => value.goodsName == this.goodList[i].goodsName);
            //foodIndex为-1表示不存在 
            if (foodIndex != -1) {
              this.goodList[i]=this.cartList.goods[foodIndex]
            }
          }
          } else {
            Toast.fail(res.responseMsg);
            }
        }).catch(function (error) { // 请求失败处理
          const {data} = error.response
          Toast.fail(data.responseMsg);
        });
      }else{
        this.goodList=[]
      }
    },
    //返回商家
    retGood(){
      this.setCart()
      this.$router.back(-1)//返回上一个路由
    }
  }
};
</script>
<style scoped>
.goodsSearch{
  width: 100%;
  height: 100%;
  overflow: auto;
}
.content{
  background: #f5f5f5;
  overflow: auto;
  margin-top: 54px;
  height: calc(100% - 54px);
}
.top{
  background: #fff;
  height: 54px;
  width: 100%;
  position: fixed;
  top: 0px;
}
.lunch_box_price{
  color: red;
  margin-right: 80px;
}
.popup_good{
  max-height:350px;
  overflow: auto;
}
.cartTop{
  background:#f5f5f5;
  padding: 10px;
  color: #969799;
  font-size: 12px;
}
.count{
  height: 34px;
  line-height: 34px;
}
.count .num{
  width:20px;
  text-align: center;
  color: #000;
}
.count .price{
  margin-right: 20px;
  color: red;
}
.count div{
  float: right;
}
.count div img{
  width: 20px;
  height: 20px;
  margin:0px;
  margin-top: 7px;
}
.left_img {
    float: left;
    margin-top: 17px;
    margin-left: 10px;
}
.slot_desc div{
  color:#969799;
  font-size: 8px;
}
.slot_title{
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
}
.slot_price{
  margin-top: 12px;
  font-size: 14px;
}
.countber div{
  float: right;
  margin-left: 5px;
}
.countber div img{
  width: 20px;
  height: 20px;
  margin:0px;
}
/* 清空 */
.clear{
  float: right;
}
</style>
<style>
.goodsSearch .van-cell__title{
  height: 34px;
  line-height: 34px;
}
.goodsSearch .van-cell__value{
  width: 200px;
  font-size: 12px;
}
.goodsSearch .van-card__thumb {
     width: 70px; 
    height: 70px; 
    margin-right: 8px;
}
.goodsSearch .van-card__header{
  height: 70px;
  margin:0;
  padding :0;
  overflow: hidden;
}
.goodsSearch .van-card{
  padding: 0px 10px;
  margin:0;
  height: 80px;
}
.goodsSearch .van-card__footer{
  position: relative;
  bottom: 20px;
  overflow: hidden;
}
.goodsSearch .van-cell {
  padding: 5px 16px;
}
</style>
