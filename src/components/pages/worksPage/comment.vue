<template>
  <div class="comment">
    <van-nav-bar
      title="发表评价"
      @click-left="onClickLeft"
    >
    <van-icon name="arrow-left" color="#fff" size="20px" slot="left" />
    <div slot="right" class="navRight" @click="afterRead">发布</div>
    </van-nav-bar>
      <div class="content"  @click="toGood">
        <div class='slot_icon'>
          <img v-if="order.merchant.file!=null" :src="order.merchant.file.fileUrl" alt="" width="40px" height="40px">
        </div>
        <div class="content_text">
          <div class="slot_title">
              {{order.merchant.shopName}}
          </div>
          <div class="slot_label" v-if="order.merchant.remark!=null">
              {{order.merchant.remark}}
          </div>
          <div class="slot_label" v-else>
              暂无介绍
          </div>
        </div>       
      </div>
      <div class="score">
        <span>整体评价</span>
        <van-rate
          v-model="value"
          allow-half
          void-icon="star"
          void-color="#eee"
          size="16px"
        />
      </div>
      <div class="textarea">
        <van-cell-group>
          <van-field
              v-model="message"
              rows="3"
              autosize
              type="textarea"
              placeholder="请输入评论"
              maxlength="50"
            />
        </van-cell-group>
        <van-uploader
          v-model="fileList"
          multiple
          :max-count="1"
        />
      </div>
      <van-divider :style="{margin: '0'}" />
      <van-cell
        title="匿名"
        @click="toggle()"
        >
        <div slot="default" class="anonymous">
          <span v-if="checked" >以匿名的形式展现</span>
          <span v-if="checked==false">会展现用户名</span>
        </div>
        <van-checkbox v-model="checked" slot="icon"/>
      </van-cell>
      <van-divider :style="{margin: '0' }" />
  </div>
</template>
<script>
import { Toast } from 'vant'
export default {
  data () {
    return {
      isAnonymity:0,//是否匿名
      message:"",//评价的内容
      value:0,//评分
      checked: false,//是否选择按钮
      fileList: [],//存放选择图片的数据
      file:{
        
      },//存放图片上传至服务器返回的数据
      order:{},//订单信息
      toCommentUrl:this.$store.state.url+'comment/add',//发布评论
      toImgUrl:this.$store.state.url+'file/uploadFile',//上传图片
      toupdateOrderUrl:this.$store.state.url+'order/update',//修改订单
    }
  },
  created(){
    this.order=JSON.parse(this.$route.query.id)
    this.setActive()
  },
  methods:{
    //上传图片
    afterRead() {
      if(this.fileList.length>0){
         let fd = new FormData()
      fd.append('file', this.fileList[0].file)
       //此时可以自行将文件上传至服务器
        this.$axios.post(this.toImgUrl,fd).then(res => {
          if (0 == res.data.responseCode) {
            this.file=res.data.data
            this.sendComment()
          } else {
            Toast.fail(res.responseMsg);
            }
        }).catch(function (error) { // 请求失败处理
          const {data} = error.response
          Toast.fail(data.responseMsg);
        });
      }else{
        this.file=null
        this.sendComment()
      }
    },
    //发布评论
    sendComment(){
      const data={
        userId:parseInt(sessionStorage.getItem("userId")),
        grade:this.value,
        img:this.file,//图片
        comment:this.message,
        isAnonymity:this.isAnonymity,
        shopId:3,
        isComment:1,
        orderId:this.order.id
      }
      this.$axios.post(this.toCommentUrl,data).then(res => {
          if (0 == res.data.responseCode) {
            this.orderComment()
          } else {
            Toast.fail(res.data.responseMsg);
            }
        }).catch(function (error) { // 请求失败处理
          const {data} = error.response
          Toast.fail(data.responseMsg);
        });
    },
    //改变订单评论状态为1已评论
    orderComment(){
      const data={
          id: this.order.id,
          isComment:1
        }
        this.$axios.post(this.toupdateOrderUrl,data).then(res => {
            if (0 == res.data.responseCode) {
              Toast.success("已成功发布该评论")
              this.$router.replace({
                path:'/order'
              })
            } else {
              Toast.fail(res.responseMsg);
              }
          }).catch(function (error) { // 请求失败处理
            const {data} = error.response
            Toast.fail(data.responseMsg);
          });
    },
    //改变复选框选中状态
    toggle() {
      if(this.checked){
        this.checked=false
        this.isAnonymity=0
      }else{
        this.isAnonymity=1
        this.checked=true
      }
    },
    onClickLeft(){
      this.$router.replace({
        path:'/order'
      })
    },
    toGood(){
      this.$router.push({
        name:'good',
        query: { id: JSON.stringify(this.order.merchant)} 
      })
    },
    setActive(){
      sessionStorage.setItem("active",2)
    }
  }
}
</script>
<style scoped>
.navRight{
  color: #fff;
  font-size: 14px;
}
.score span{
  margin-right: 10px;
}
.score{
  height: 30px;
  line-height: 30px;
  font-size: 16px;
  font-weight: bold;
  padding-left: 10px;
}
.comment{
  overflow: hidden;
  width: 100%;
  height:100%;
}
.anonymous{
  font-size:10px;
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
  padding:10px 10px 10px 10px;
  overflow: hidden;

}
.slot_label{
  font-size: 8px;
  padding: 0px;
  color: rgb(124, 115, 115);
}
.slot_title{
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 10px;
}
</style>
<style>
.comment .van-divider{
  margin: 0px 0;
}
.comment .van-uploader{
  margin-left: 10px;
}
.comment .van-divider{
  margin: 10px 0;
}
.comment .van-cell__title{
  margin-left: 10px;
}

.comment .van-nav-bar__title{
  color: #fff;
}
</style>
