<template>
  <div class="my">
    <div class=top>
      <div class=title @click="personal">
        <div class="headImg">
            <van-image
            v-if="userInfo.file==null"
              fit="cover"
              width="4rem"
              height="4rem"
              src="../../static/HM-shophome/img/p7.png"
            />
            <van-image
              v-else
              round
              fit="cover"
              width="4rem"
              height="4rem"
              :src="userInfo.file.fileUrl"
            />
        </div>
        <div class="text">
            <div class="userName">{{userInfo.userName}}</div>
            <div class="remind">{{userInfo.phone}}</div>
            <div class="remind">在忙，也要记得吃饭哦~</div>
        </div>
      </div>
    </div>
    <div class="price">
      <van-cell title="余额（元）" icon="../../static/HM-shophome/img/blance.png" is-link  @click="toBalance">
        <div slot="default" class="money">{{userInfo.money}}</div>
      </van-cell>
    </div>    
    <div >
      <van-cell title="我的收藏" icon="../../static/HM-shophome/img/collection.png" is-link  @click="noTime"/>
      <van-cell title="我的客服" icon="../../static/HM-shophome/img/customer.png" is-link  @click="noTime"/>
      <van-cell title="推荐有奖" icon="../../static/HM-shophome/img/take.png" is-link  @click="noTime"/>
      <van-cell title="注销账户" icon="../../static/HM-shophome/img/del.png" is-link  @click="noTime"/>
    </div>
    <div class="exit">
     <van-cell title="退出登录" icon="../../static/HM-shophome/img/exit.png" is-link  @click="signOut"/>
    </div>
  </div>
</template>
<script>
import { Toast } from 'vant';
import eventVue from '../../../eventVue.js'
import {getUserId,removeUserId} from '@/utils/auth';
export default {
  data () {
    return {
      userInfo:{},
      toUserUrl:this.$store.state.url+'user/selectById'
    }
  },
  created(){
    this.setActive()
    this.getDate()
  },
  methods:{
    getDate(){
      const userId={
          id:getUserId()
        }
        this.$axios.post(this.toUserUrl,userId).then(res => {
          if (0 == res.data.responseCode) {
            this.userInfo=res.data.data
          } else {
            Toast.fail(res.responseMsg);
            }
        }).catch(function (error) { // 请求失败处理
          const {data} = error.response
          Toast.fail(data.responseMsg);
        });
    },
    //跳转到余额界面
    toBalance(){
      this.$router.replace({
        path:'/balance'
      })
    },
    setActive(){
      sessionStorage.setItem("active",3)
    },
    noTime(){
      Toast('暂不支持该功能');
    },
    //退出登录
    signOut(){
      this.$dialog.confirm({
        message: '退出登录？',
        width:"280px"
      }).then(() => {
        //删除cookie
        removeUserId()
        sessionStorage.clear()
        // on confirm
        this.$router.replace({
        path:'/login'
      })
      }).catch(() => {
        // on cancel
      });
    },
    personal(){
      this.$router.replace({
        path:'/personal'
      })
    }
  }
}
</script>
<style scoped>
.money{
  overflow: hidden;
  text-overflow: ellipsis; /* 溢出用省略号*/
}
.exit{
  margin-top: 10px;
}
.price{
margin-bottom: 10px;
}
.my{
  background: #EFEFEF;
  overflow: auto;
  width: 100%;
  height:100%;
}
.headImg{
  float: left;
  margin-left: 20px;
}
.remind{
  font-size: 10px;
}
.userName{
  font-size: 20px;
  font-weight: bold;
}
.text{
  margin-left: 100px;
}
.title{
  overflow: hidden;
  margin-top: 17px;
}
.top{
  overflow: hidden;
  height: 100px;
  width: 100%;
   background: #fb7299;
  color: #fff;
}
</style>
