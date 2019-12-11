<template>
  <div class="goods">
    <div class="top">
      <img class="left_img" src="../../../../assets/left2.png" width="20px" height="20px" @click="retHome"/>
      <van-search
          placeholder="想吃什么搜一搜"
          shape="round"
          @focus="onSearch"
        />
    </div>
    <van-tabs swipeable sticky color="#fb7299">
      <van-tab  title="点餐">
        <div class="img" v-if="classify.length==0&&accomplish">
          <img src="/static/HM-shophome/img/nothing.png" alt="">
          <div>
            暂无商品
          </div>
        </div> 
        <div class="content">
          <yd-scrolltab>
              <yd-scrolltab-panel v-for="(type,index) in classify" :key="index" :label="type.typeName">
                <div v-for="(value,index) in type.goodsList" :key="index">
                  <van-card
                      :thumb="value.goodsImg.fileUrl"
                      @click=is_show(value)
                    >
                      <div slot="title" class="slot_title">
                        {{value.goodsName}}
                      </div>
                      <div slot="desc" class="slot_desc">
                        <div v-if="value.remark!=null">{{value.remark}}</div>
                        <div v-else>暂无介绍</div>
                        <div>销售量{{value.saleCount}}</div>
                      </div>
                      <div slot="price" class="slot_price">
                        ￥{{value.price}}
                      </div>
                      <div slot="footer" class="countber">
                        <div>
                          <img class="left_img" src="../../../../assets/increase.png" @click.stop="increase(value)"/>
                        </div>   
                        <div v-if="value.count!=0">{{value.count}}</div>
                        <div>
                          <img v-if="value.count!=0" class="left_img" src="../../../../assets/reduce.png" @click.stop="reduce(value)"/>
                        </div>
                      </div>
                    </van-card>
                  </div>
              </yd-scrolltab-panel>     
          </yd-scrolltab>
        </div> 
        <!-- 商品信息 -->
        <van-popup
          v-model="show"
          closeable
          close-icon="close"
          position="bottom"
          :style="{ height: '80%' }"
        >
        <div>
            <div><img width="100%" :src="goods.goodsImg.fileUrl" alt=""></div>
            <div class="popupGoods">
              <div class="slot_title">{{goods.goodsName}}</div>
              <div class="sunCount">销售量{{goods.saleCount}}</div>
              <div style="overflow: hidden;">
                <div class="count">
                  <div>
                    <img class="left_img" src="../../../../assets/increase.png" width="20px" height="20px" @click.stop="increase(goods)"/>
                  </div>   
                  <div v-if="goods.count!=0" class="num">{{goods.count}}</div>
                  <div>
                      <img v-if="goods.count!=0" class="left_img" src="../../../../assets/reduce.png" width="20px" height="20px" @click.stop="reduce(goods)"/>
                  </div>
                  <div class="price">￥{{goods.price}}</div>
                </div>
              </div>
              <div class="remark" v-if="goods.remark!=null">{{goods.remark}}</div>
              <div class="remark" v-else>暂无介绍</div>
            </div>
          </div>
        </van-popup>
        <!-- 购物车弹窗 -->
    <van-popup v-model="showCart" position="bottom" >
      <div class="cartTop">
        <span>已选商品</span><span class="clear" @click="clearCart()">清空</span>
      </div>
      <div class="popup_good">
        <van-cell v-for="(good,index) in cartList.goods" :key="index">
        <div slot="title" class="cartTitle">
          {{good.goodsName}}
        </div>
        <div slot="default">
          <div class="count">
            <div>
              <img class="left_img" src="../../../../assets/increase.png" width="20px" height="20px" @click.stop="increase(good)"/>
            </div>   
            <div class="num">{{good.count}}</div>
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
          button-text="去结算"
          @submit="onSubmit"
          :disabled="isDisabled"
        >
          <div class="cart_left"><van-goods-action-icon icon="cart-o" text="购物车" :info="cartList.sumCount" @click="isShowCart()" /></div>
          <div class="message" v-if="isDisabled">未选购商品</div>
          <div class="sendPrice">配送费{{cartList.distribution_price}}元</div>
          <div class="sumPrice" v-if="!isDisabled" >￥{{cartList.sumPrice}}</div>
        </van-submit-bar>
      </van-tab>
      <van-tab  title="评价">
        <div class="score">
          <div class="tag">
            <van-tag :plain=whole color="#fb7299" @click="selWhole">全部评论{{wholeTotal}}</van-tag>
            <van-tag :plain=praise color="#fb7299" @click="selPraise">好评<span v-if="praiseTotal!=0">{{praiseTotal}}</span></van-tag>
            <van-tag :plain=bad color="#fb7299" @click="selBad">差评<span v-if="badTotal!=0">{{badTotal}}</span></van-tag>
            <van-tag :plain=figure color="#fb7299" @click="selFigure">有图</van-tag>
          </div>
          <div class="img" v-if="comment.length==0&&accomplish">
          <img src="/static/HM-shophome/img/nothing.png" alt="">
          <div>
            暂无评论
          </div>
        </div> 
          <div class="comment">
            <van-list
              v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
              @load="onLoad"
              :immediate-check="false"
            >
            <van-cell-group v-for="(comment,index) in comment" :key="index">
              <van-cell>
                <div slot="title" class="userName">
                  <div v-if="comment.isAnonymity==1">匿名</div>
                  <div v-else>{{comment.user.userName}}</div>
                  <div>
                    <van-rate
                      v-model="comment.grade"
                      allow-half
                      void-icon="star"
                      void-color="#eee"
                      size="12px"
                      readonly
                    />
                  </div>
                </div>
                <div slot="icon" v-if="comment.isAnonymity==1||comment.user.file==null">	
                  <!-- <img src="../../../../../static/HM-shophome/img/p7.png" width="35px" height="35px"> -->
                  <van-image
                    @click="commentImg('../../../../../static/HM-shophome/img/p7.png')"
                    round
                    fit="cover"
                    width="35px"
                    height="35px"
                    src="../../../../../static/HM-shophome/img/p7.png"
                  />
                </div>
                <div slot="icon" v-else>
                  <van-image
                    @click="commentImg(comment.user.file.fileUrl)"
                    round
                    fit="cover"
                    width="35px"
                    height="35px"
                    :src="comment.user.file.fileUrl"
                  />	
                  <!-- <img :src="comment.user.file.fileUrl" width="35px" height="35px" @click="commentImg(comment.user.file.fileUrl)" > -->
                </div>
                <div slot="label">
                  <div class="evaluate" v-if="comment.comment!=null">
                    {{comment.comment}}
                  </div>
                  <div class="evaluate" v-else>
                    该用户没有写评价
                  </div>
                  <div v-if="comment.img!=null">
                    <img @click="commentImg(comment.img.fileUrl)" :src="comment.img.fileUrl" width="100px" height="100px">
                  </div>
                </div>
              </van-cell>               
            </van-cell-group>
            </van-list>
          </div>
        </div>
      </van-tab>
      <van-tab  title="商家" class="business">
        <div class="introduction">
            <div>商家信息</div>
            <div class="image" v-if="business.files!=null">
              <img  v-for="(img,index) in business.files" :key="index"  :src="img.fileUrl"  height="100px" alt="无法显示" @click="imagePreview(index)">
            </div>
            <div v-if="business.remark!=null">{{business.remark}}</div>
            <div v-else>暂无简介</div>
        </div>
        <van-cell-group>
          <van-cell title="商家名称" :value="business.shopName"/>
          <van-cell title="商家地址" :value="business.address" />
          <van-cell title="商家电话" :value="business.phone" />
        </van-cell-group>
        <div class="buService">
          <div>
            商家服务
          </div>
          <div>
            该商户食品已由国泰产险承担，食品安全有保障
          </div>
        </div>
      </van-tab>
    </van-tabs>
    <!-- 预览图片 -->
        <van-image-preview
          v-if="images!=null"
            v-model="showImg"
            :showIndex="false"
            showIndicators
            :images="images"
            :startPosition=index
          />
  </div>
</template>
<script>
import { Toast } from 'vant';
export default {
  data () {
    return {
      index:0,
      showImg:false,//是否预览商家信息图片
      images:[],//商家信息图片地址
      pageNum: 1,
      pageSize: 10,
      total:0,//总条数
      wholeTotal:0,//全部数量
      praiseTotal:0,//好评数量
      badTotal:0,//差评数量
      loading: false,
      finished: false,
      whole:false,//全部 false不为空心样式
      praise:true,//好评 true为空心样式
      bad:true,//差评
      figure:true,//有图
      isDisabled:true,//是否禁用去结算按钮
      showCart:false,//购物车是否弹出
      business:{//商家信息
        },
      cartList://购物车
        {
          sumPrice:2,//总价
          sumCount:0,//商品数量
          userId:'',
          businessId:'',
          businessName:'商家名',
          lunch_box_price:0,//餐盒费lunchBox
          distribution_price:0,//配送费sendPrice
          goods:[
          ]
        }
      ,
      classify:[//食品分类
      ],
      accomplish:false,
      comment:[],//评价
      imgComment:[],//有图的评价
      show: false,//是否显示商品信息
      goods:{goodsImg:{fileUrl:""}},
      toGoodUrl:this.$store.state.url+'type/selectType',//查询商品列表
      toCommentUrl:this.$store.state.url+'comment/list',//查询评价列表
      type:3,//1好评 0差评 其他全部
    }
  },
 created(){
   this.getDate()
  },
  methods: {
    //预览商家图片
    imagePreview(index){
      this.index=index
      this.images=[];
      for(let i=0;i<this.business.files.length;i++){
        this.images[i]=this.business.files[i].fileUrl
      }
      this.showImg=true
    },
    //预览评论中的图片
    commentImg(src){
      this.images=[];
      this.images[0]=src
      this.showImg=true
    },
    getDate(){
      this.business=JSON.parse(this.$route.query.id)
      this.cartList.sumPrice=this.business.sendPrice
      this.cartList.businessName=this.business.shopName
      this.cartList.distribution_price=this.business.sendPrice
      this.cartList.businessId=this.business.id
      this.cartList.userId=parseInt(sessionStorage.getItem(this.business.id))
      this.getGoods()
      this.getComment()
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
    //查询评价列表
    getComment(){
      const commentList={
        shopId:this.business.id,
        id:this.type,
        pageNum:this.pageNum,
        pageSize:this.pageSize
      }
      this.accomplish=false
      this.$axios.get(this.toCommentUrl,{params:commentList}).then(res => {
          if (0 == res.data.responseCode) {
            this.total=res.data.data.total
            //如果this.figure==false查询把无图的评价过滤
            if(this.figure==false){
              const data=[]
              for(let i=0;i<res.data.data.list.length;i++){
                if(res.data.data.list[i].img!=null){
                  data.push(res.data.data.list[i])
                }
              }
              this.comment=this.comment.concat(data);
              //如果图片数量少于查询条数者查下一页
              if(data.length<this.pageSize){
                  this.onLoad()
                }
            }else{
              this.comment=this.comment.concat(res.data.data.list)
            }
            if(this.type!=0&&this.type!=1){
              this.wholeTotal=this.total;
            }
            if(this.type==1){
              this.praiseTotal=this.total;
            }
            if(this.type==0){
              this.badTotal=this.total;
            }
            this.accomplish=true
          } else {
            Toast.fail(res.responseMsg);
            }
        }).catch(function (error) { // 请求失败处理
          const {data} = error.response
          Toast.fail(data.responseMsg);
        });
    },
    //查询商品列表
    getGoods(){
      const goodsList={
        shopId:this.business.id,
      }
      this.$axios.get(this.toGoodUrl,{params:goodsList}).then(res => {
          if (0 == res.data.responseCode) {
              this.classify=res.data.data
              this.accomplish=true
              this.getCart()  
          } else {
            Toast.fail(res.responseMsg);
            }
        }).catch(function (error) { // 请求失败处理
          const {data} = error.response
          Toast.fail(data.responseMsg);
        });
    },
    // 设置样式为空心
    setPlain(){
      this.bad=true;
      this.whole=true;
      this.praise=true;
      this.figure=true;
    },
    //重置查询评论有关信息
    resetComment(){
      this.pageNum=1
      this.comment=[]
      this.finished=false
      this.getComment()
    },
    //查看有图的评论
    selFigure(){
      this.setPlain()
      this.figure=false;
      this.type=3
      this.resetComment()
    },
    //查看差评
    selBad(){
      this.setPlain()
      this.bad=false;
      this.type=0
      this.resetComment()
    },
    //查看好评
    selPraise(){
      this.setPlain()
      this.praise=false;
      this.type=1
      this.resetComment()
    },
    //查看全部评论
    selWhole(){
      this.setPlain()
      this.whole=false;
      this.type=3
      this.resetComment()
    },
    //用来接收sessionStorage传来的购物车
    getCart(){
      var t=JSON.parse(sessionStorage.getItem(this.business.id))
      if(t!=null){
        this.cartList=JSON.parse(sessionStorage.getItem(this.business.id))
        for(let i=0;i<this.classify.length;i++){
          for(let j=0;j<this.classify[i].goodsList.length;j++){
            var foodIndex = this.cartList.goods.findIndex(value => value.goodsName == this.classify[i].goodsList[j].goodsName);
            //foodIndex为-1表示不存在 
            if (foodIndex != -1) {
              this.classify[i].goodsList[j]=this.cartList.goods[foodIndex]
            }
          }
        }
        // sessionStorage.removeItem("cartList")
        if(this.cartList.sumCount==0){
          this.isDisabled=true
        }else{
          this.isDisabled=false
        }
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
        this.getDate()
        this.cartList.goods=[];
        this.cartList.sumCount=0; 
      }).catch(() => {
        // on cancel
      });
    },
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
    //设置购物车信息
    setCart(){
      sessionStorage.setItem(this.business.id, JSON.stringify(this.cartList))
    },
    editCart(newGood) {
    //判断是否购物车中已经有商品，如果有就增加数量，反之加入这个商品
    let foodIndex = this.cartList.goods.findIndex(good => good.goodsName == newGood.goodsName);
    //foodIndex为-1表示不存在 ,要加入商品
    if (foodIndex === -1) {
        this.cartList.goods.push(newGood)
     //foodIndex存在 ,更新数据
    } else {
      //如果商品数量为0则删除该商品
      if(this.cartList.goods[foodIndex].count==0){
        this.cartList.goods.splice(foodIndex,1)
      }
    }
  },
    //返回上一个路由
    retHome(){
      this.setCart()
      this.$router.back(-1)
    },
    //点击搜索框
    onSearch(){
      this.setCart()
      this.$router.push({
        name: "goodsSearch",
        query: {
          id: JSON.stringify(this.business)
        }
      });
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
        this.setCart()
        this.show=false
        if(this.cartList.sumCount==0){
          this.isDisabled=true
        }
      }
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
        newGood.count=++this.cartList.goods[foodIndex].count
      }
      this.cartList.sumCount++
      this.cartList.sumPrice+=newGood.price
      this.cartList.lunch_box_price+=this.business.lunchBox
      this.cartList.sumPrice+=this.business.lunchBox
      this.isDisabled=false
      this.show=false
      this.setCart()
     },
     //显示商品信息
     is_show(value){
        this.goods=value;
        this.show=true;
     }
  }
}
</script>
<style scoped>
.popupGoods .count .price{
  color: red;
  float: left;
  font-size: 16px;
  font-weight: bold;
}
.popupGoods{
  overflow: hidden;
  padding: 0px 10px 0px 10px;
}
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
.cartTitle{
  margin-top: 10px;
}
.popupGoods .remark{
  font-size: 10px;
  color: #aeabab;
  margin-bottom: 20px;
}
.sumPrice{
  color: red;
  font-size: 20px;
  position: absolute;
  left: 50px;
  top:5px;
}
.message{
  color:  rgb(139, 138, 138);
  font-size: 8px;
  position: absolute;
  left: 50px;
  top:10px;
}
.sendPrice{
  color: rgb(139, 138, 138);
  font-size: 8px;
  position: absolute;
  left: 50px;
  top:29.5px;
}
.cart_left{
  position: absolute;
  left: 0;
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
  margin-top: 15px;
  font-size: 14px;
}
.content{
  height: 700px;  
  margin-bottom: 55px;
  position: relative;
  /* padding-bottom: 160px; */
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
.lunch_box_price{
  color: red;
  margin-right: 80px;
}
.count{
  height: 24px;
  line-height: 24px;
  margin:10px 0px 10px 0px;
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
  margin-top: 3px;
}
/* 清空 */
.clear{
  float: right;
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
.button{
  position: relative;
}
.business_top{
  text-align:center;
  background: #fff;
}
/* 标记 */
.tag{
  height: 50px;
  background:#fff;
  margin: 10px 0px 10px 0px;
  padding:10px;
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
.buService :first-child{
  font-size: 14px;
  font-weight: bold;
}
.buService :last-child{
  font-size: 5px;
  color:#969799;
  margin-top: 10px;
}
.buService{
  overflow: hidden;
  background:#fff;
  padding: 10px;
  margin: 10px 0 10px 0;
}
.introduction img{
  float:left;
  margin-left: 5px;
}
.introduction .image{ 
  overflow: hidden;
  margin-bottom: 10px;
}
.introduction :first-child{
  color: #000;
  font-weight: bold;
  margin-bottom: 10px;
}
.introduction{
  background: #fff;
  margin-bottom: 10px;
  font-size: 12px;
  color:#969799;
  padding:10px;
}
.top{
  background: #fff;
}
.goods{
   background: #f5f5f5;
   overflow: auto;
   height: 100%;
}
.left_img{
  float:left;
  margin-top:17px;
  margin-left: 10px;
}
</style>
<style>
.comment .van-cell__title{
  margin-left: 10px;
}
.goods .van-card{
  padding: 8px 10px;
  height: 100px;
}
.goods .van-card__footer{
  position: relative;
  bottom: 22px;
  overflow: hidden;
}

/* Tag 标记 */
.score .van-tag{
  padding: 8px;
}
/* 设置评价中的单元格 */
.score .van-cell{
  line-height: 20px;
}
.goods .van-card{
  background: #fff;
}
.goods .yd-scrolltab-item{
  height:50px;
  font-size: 14px;
  width:60px;
}
.goods .yd-scrolltab-title{
  max-width:50px;
}
.goods .yd-scrolltab-content-title{
  color: #000;
  font-weight: bold;
}
/* 单元格右侧内容 */
.goods .van-cell__value{
  width: 200px;
  font-size: 12px;
}
/* 商家单元格左侧标题 */
.business .van-cell__title{
  font-size: 14px;
}
</style>
