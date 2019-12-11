<template>
  <div class="balance">
    <div class="top">
      <van-nav-bar
        title="余额"
        @click-left="onClickLeft"
        :border=false
      >
        <van-icon name="arrow-left" color="#fff" size="20px" slot="left" />
      </van-nav-bar>
      <div class="price">
        <div>
          余额(元)
        </div>
        <div>
          {{userInfo.money}}
        </div>
      </div>
    </div>
    <van-cell title="充值" is-link @click="updateMoneyDialog">
      <van-icon name="../../static/HM-shophome/img/recharge.png" slot="icon" size="25px"/>
    </van-cell>
    <van-cell title="提现" is-link >
      <van-icon name="../../static/HM-shophome/img/cash.png" slot="icon" size="25px"/>
    </van-cell>
     <van-dialog
      v-model="updateShow"
      title="充值金额"
      show-cancel-button
      :beforeClose="beforeNameClose"
    >
      <van-cell-group>
        <van-field type="number" :maxlength="5" v-model="money" clearable placeholder="请输入充值金额" />
      </van-cell-group>
    </van-dialog>
  </div>
</template>
<script>
import { Toast } from 'vant';
export default {
  data () {
    return {
      money:"",
      updateShow:false,
      userInfo:{},
      toUserUrl:this.$store.state.url+'user/selectById',//获取用户信息
      toUpdateUserUrl:this.$store.state.url+'user/updateUser',//修改用户信息
    }
  },
  created(){
    this.getDate()
  },
  methods:{
    //打开充值对话框
  updateMoneyDialog(){
    this.updateShow=true;
  },
  //充值余额
  updateMoney(){
    const data={
      id:parseInt(sessionStorage.getItem('userId')),
      money:parseFloat(this.userInfo.money)+parseFloat(this.money)
    }
    this.$axios.put(this.toUpdateUserUrl,data).then(res => {
          if (0 == res.data.responseCode) {
            this.getDate()
            Toast.success("充值成功");
          } else {
            Toast.fail(res.responseMsg);
            }
        }).catch(function (error) { // 请求失败处理
          const {data} = error.response
          Toast.fail(data.responseMsg);
        });
  },
  //是否确定
  beforeNameClose(action, done) {
    //确定
      if(action === 'confirm') {
        if(this.money.length>0&&this.money.length<=5){
         this.updateMoney()
          done() //关闭
        }else{
          Toast('请输入1~5位的数字');
          done(false) //不关闭弹框
        }//取消
      } else if(action === 'cancel') {
         done() //关闭
      }
    },
    //获取用户信息
    getDate(){
      const userId={
          id: parseInt(sessionStorage.getItem("userId"))
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
    //返回
    onClickLeft() {
      this.$router.replace({
        path:'/my'
      })
    },
  }
}
</script>
<style scoped>
.price div:last-child{
  margin-top: 10px;
  font-size: 40px;
  color: #fff;
}
.price{
  padding-left: 20px;
}
.top{
  color: rgb(240, 235, 235);
  font-size: 10px;
  overflow: hidden;
  height: 150px;
  background:#fb7299;
}
</style>
<style>
.balance .van-icon {
  margin-right: 10px;
}
.balance .van-nav-bar__title{
  color: #fff;
}
</style>
