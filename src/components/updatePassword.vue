<template>
  <div class="register">
    <div class="title">
      <van-nav-bar
        title="修改密码"
        left-arrow
        @click-left="toLogin"
      />
    </div>
      <div>
        <div>
          <van-cell-group>
              <van-field @blur="verificationTel" :maxlength="11" type="number" v-model="registerList.phone" clearable placeholder="请输入手机号" @touchstart.native.stop="telShow = true"/> 
              <van-field @blur="verificationPwd" v-model.trim="registerList.pwd" clearable type="password" placeholder="请输入新密码" />
              <van-field @blur="verificationCheckPass" v-model.trim="registerList.checkPass" clearable type="password" placeholder="请再次输入密码" />
              <van-field :maxlength="4" v-model="code" clearable type="number" placeholder="请输入验证码" @touchstart.native.stop="show = true">
                <div slot="right-icon">
                  <!--验证码组件-->
                  <span @click="refreshCode()"><s-identify :identifyCode="identifyCode" ></s-identify></span>
                </div>
              </van-field>
          </van-cell-group>
          <div class="buttomArea">
              <van-button color="#fb7299" @click="toRegister">修改密码</van-button>
          </div>
          <!--  手机号键盘 -->
          <van-number-keyboard
            v-model="registerList.phone"
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
      </div>
  </div>
</template>
<script>
import SIdentify from './sidentify.vue'
import { Toast } from 'vant';
export default {
  components: { SIdentify },
  data () {
    return {
      show: false,
      telShow:false,
      identifyCodes: "1234567890",
      identifyCode: "",
      code:"",//text框输入的验证码
      registerList:{
          act:'',
          type:'0',
          pwd:'',
          phone:'',
          checkPass:'',
      },
      
      toUpdateUserUrl:this.$store.state.url+'user/updateUser',//修改用户信息
    }
  },
   mounted(){
     this.identifyCode=""
     this.makeCode(this.identifyCodes,4)
 },
  methods:{
  //验证输入的内容
  verification(){
    if(this.verificationTel()!=1){
      return
    }
    if(this.verificationPwd()!=1){
      return
    }
    if(this.verificationCheckPass()!=1){
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
     var phoneVar = reg.test(this.registerList.phone);
     if (!phoneVar){
       Toast('请输入正确的手机号码');
       return
     }
    if(this.registerList.phone==""){
      Toast('手机号不能为空');
      return
    }
    return 1
  },
  //验证密码
  verificationPwd(){
    if(this.registerList.pwd.length<3){
      Toast('密码长度不能小于3');
      return
    }
    return 1
  },
  //验证再次输入密码
  verificationCheckPass(){
    if(this.registerList.checkPass==""){
      Toast('再次输入密码不能为空');
      return
    }else{
      if(this.registerList.checkPass!=this.registerList.pwd){
        Toast('再次输入密码与密码不一致');
      }
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
  //返回登录界面
  toLogin(){
    this.$router.replace({
      path:'/login'
    })
  },
// 修改密码
    toRegister(){
      if(this.verification()==1){
         const data={
        phone:this.registerList.phone,
        pwd:this.registerList.pwd
    }
    this.$axios.put(this.toUpdateUserUrl,data).then(res => {
          if (0 == res.data.responseCode) {
            Toast.success(res.data.responseMsg);
            this.toLogin();
          } else {
            Toast.fail(res.responseMsg);
            }
        }).catch(function (error) { // 请求失败处理
          const {data} = error.response
          Toast.fail(data.responseMsg);
        });
      }
    },
  }
}
</script>
<style scoped>
.footer{
  overflow: hidden;
  width: calc(100% - 20px);
  margin: 10px 10px 0px 10px;
}
.title{
  margin-bottom: 15px;
  line-height: 50px;
  color: #fff;
  text-align: center;
  background: #fb7299;
}
.register{
  height: 100%;
  background:  #f5f4f4;
}
</style>
<style>
.register .van-button{
  width: calc(100% - 20px);
  margin: 20px 10px 0px 10px;
} 

.title .van-nav-bar .van-icon,.van-nav-bar__title{
  color: #fff;
}
</style>
