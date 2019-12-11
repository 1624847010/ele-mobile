<template>
  <div class="login">
    <div class="title">
      <van-nav-bar
        title="用户登录"
        left-arrow
        @click-left="ret"
      />
    </div>
      <div class="loginBg">
        <div class="loginBox">
          <div class="loginForm">
            <van-cell-group>
              <van-field
                v-model="loginList.phone"
                required
                clearable
                label="手号机："
                type="number"
                :maxlength="11"
                label-width="60px"
                placeholder="请输入手机号"
                @click-right-icon="$toast('question')"
              />   
              <van-field 
                v-model.trim="loginList.pwd"
                required
                clearable
                type="password"
                label-width="60px"
                label="密码："
                placeholder="请输入密码"
              />
              <van-field :maxlength="4" v-model="code" clearable type="number" placeholder="请输入验证码" @touchstart.native.stop="show = true">
                <div slot="right-icon">
                  <!--验证码组件-->
                  <span @click="refreshCode()"><s-identify :identifyCode="identifyCode" ></s-identify></span>
                </div>
              </van-field>
            </van-cell-group>
          </div>
          <div class="buttomArea">
            <van-button  @click="toLogin">登陆</van-button>
          </div>
          <div class="footer">
            <span @click="toPassword">忘记密码？</span>
            <span class="register" @click="toRegister">用户注册</span>
          </div>
        </div>
      </div>
      <!--  手机号键盘 -->
          <van-number-keyboard
            v-model="loginList.phone"
            :show="telShow"
            :maxlength="11"
            @blur="telShow = false"
          />
          <!--  验证码键盘 -->
          <van-number-keyboard
            v-model="code"
            :show="show"
            :maxlength="4"
            @blur="show = false"
          />
  </div>
</template>
<script>
import SIdentify from './sidentify.vue'
import { Toast } from 'vant';
import {setUserId} from '@/utils/auth';
export default {
  components: { SIdentify },
  data () {
    return {
      show: false,
      telShow:false,
      identifyCodes: "1234567890",
      identifyCode: "",
      code:"",
      loginList:{
        phone:"",
        pwd:"",
      },
      toLoginUrl:this.$store.state.url+'user/login'
    }
  },
  mounted(){
     this.identifyCode=""
     this.makeCode(this.identifyCodes,4)
 },
  methods:{
    ret(){
      this.$router.back(-1)//返回上一个路由
    },
    toPassword(){
      this.$router.replace({
              path:'/updatePassword'
            })
    },
    toRegister(){
      this.$router.replace({
              path:'/register'
            })
    },
//验证输入的内容
  verification(){
    if(this.verificationTel()!=1){
      return
    }
    if(this.verificationPwd()!=1){
      return
    }
    if(this.verificationCode()!=1){
      return
    }
    return 1
  },
  //验证验证码
  verificationCode(){
    if(this.code==""){
      Toast('请输入验证码');
      return
    }else{
      if(this.code!==this.identifyCode){
        this.code=""
        this.refreshCode()
        Toast('请输入正确的验证码');
        return
      }
    }
    return 1
  },
  //验证手机号
  verificationTel(){
    var reg = new RegExp("^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\\d{8}$");
     var phoneVar = reg.test(this.loginList.phone);
     if (!phoneVar){
       Toast('请输入正确的手机号码');
       return
     }
    return 1
  },
  //验证密码
  verificationPwd(){
    if(this.loginList.pwd==""){
      Toast('密码不能为空');
      return
    }
    return 1
  },
  //随机验证码
  randomNum(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
  },
  //刷新验证码    
  refreshCode() {
      this.identifyCode = "";
      this.makeCode(this.identifyCodes, 4);
  },
  //生成验证码
  makeCode(o, l) {
      for (let i = 0; i < l; i++) {
          this.identifyCode += this.identifyCodes[
            this.randomNum(0, this.identifyCodes.length)
          ];
      }
  },
  //登录
    toLogin(){
      if(this.verification()==1){
       var login={
          phone: parseInt(this.loginList.phone),
          pwd: this.loginList.pwd
        }
        this.$axios.post(this.toLoginUrl,login).then(res => {

          if (0 == res.data.responseCode) {
            setUserId(res.data.data.id)
                   
            this.$router.back(-1)//返回上一个路由
          } else {
            Toast.fail(res.responseMsg);
            }
        }).catch(function (error) { // 请求失败处理
          const {data} = error.response
          Toast.fail(data.responseMsg);
          // console.info(data.responseMsg);
        });
      }
    },
  }
}
</script>
<style scoped>
.register{
  float: right;
}
.footer{
  line-height: 20px;
  overflow: hidden;
  width: calc(100% - 20px);
  margin: 10px 10px 0px 10px;
}
.login{
  height: 100%;
  background:  #f5f4f4;
}
.footer span{
  line-height: 20px;
  font-size: 12px;
  color:  #fb7299;
}
</style>
<style>
.title .van-nav-bar .van-icon,.van-nav-bar__title{
  color: #fff;
}

.login .buttomArea .van-button{
  width: calc(100% - 20px);
  margin: 20px 10px 0px 10px;
} 
</style>
