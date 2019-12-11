<template>
  <div class="personal">
    <van-nav-bar
      title="个人资料"
      @click-left="onClickLeft"
    >
      <van-icon name="arrow-left" color="#fff" size="20px" slot="left" />
    </van-nav-bar>
    <van-cell title="头像" is-link @click="sentImg">
      <div slot="default">
        <van-image
            v-if="userInfo.file==null"
              round
              fit="cover"
              width="30px"
              height="30px"
              src="../../static/HM-shophome/img/p7.png"
            />
            <van-image
            v-else
              round
              fit="cover"
              width="30px"
              height="30px"
              :src="userInfo.file.fileUrl"
            />
      </div>
    </van-cell>
    <van-cell title="用户名" is-link  :value="userInfo.userName" @click="updateNameDialog"/>
    <van-cell title="收货地址" is-link @click="toAddressList"/>
    <van-cell title="手机号码" :value="userInfo.phone"/>
    <van-dialog
      v-model="show"
      title="修改头像"
      show-cancel-button
      :beforeClose="beforeClose"
    >
      <van-uploader
          v-model="fileList"
          :max-count="1"
          preview-size="150"
        />
    </van-dialog>
    <van-dialog
      v-model="updateShow"
      title="修改用户名"
      show-cancel-button
      :beforeClose="beforeNameClose"
    >
      <van-cell-group>
        <van-field v-model.trim="userName" type="textarea" clearable placeholder="请输入1~9用户名" />
      </van-cell-group>
    </van-dialog>
  </div>
</template>
<script>
import { Toast } from 'vant';
export default {
  data () {
    return {
      userName:"",
      userInfo:{},
      show: false,
      updateShow:false,
      fileList:[],
      toUserUrl:this.$store.state.url+'user/selectById',//获取用户信息
      toImgUrl:this.$store.state.url+'file/uploadFile',//上传图片
      toUpdateUserUrl:this.$store.state.url+'user/updateUser',//修改用户信息
      updateUser:{
        file:{},
        id:0
      }
    }
  },
  created(){
    this.getDate()
  },
  methods:{
    //上传图片
    afterRead() {
      let fd = new FormData()
      fd.append('file', this.fileList[0].file)
       // 此时可以自行将文件上传至服务器
        this.$axios.post(this.toImgUrl,fd).then(res => {
          if (0 == res.data.responseCode) {
            this.updateUser.file=res.data.data
            this.updateImg()
            Toast.success(res.data.responseMsg);
          } else {
            Toast.fail(res.responseMsg);
            }
        }).catch(function (error) { // 请求失败处理
          const {data} = error.response
          Toast.fail(data.responseMsg);
        });
    },
 //获取用户信息
  getDate(){
      const userId={
          id: sessionStorage.getItem("userId")
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
  updateNameDialog(){
    this.updateShow=true;
  },
  //修改用户名
  updateName(){
    const data={
      id:parseInt(sessionStorage.getItem('userId')),
      userName:this.userName
    }
    this.$axios.put(this.toUpdateUserUrl,data).then(res => {
          if (0 == res.data.responseCode) {
            this.userName=""
            this.getDate()
            Toast.success(res.data.responseMsg);
          } else {
            Toast.fail(res.responseMsg);
            }
        }).catch(function (error) { // 请求失败处理
          const {data} = error.response
          Toast.fail(data.responseMsg);
        });
  },
  //是否确定修改名称
  beforeNameClose(action, done) {
    //确定
      if(action === 'confirm') {
        if(this.userName.length>0&&this.userName.length<10){
         this.updateName()
          done() //关闭
        }else{
          Toast('请输入1~9的长度');
          done(false) //不关闭弹框
        }//取消
      } else if(action === 'cancel') {
         done() //关闭
      }
    },
    //修改头像
    updateImg(){
        this.updateUser.id=parseInt(sessionStorage.getItem('userId'))
        this.$axios.put(this.toUpdateUserUrl,this.updateUser).then(res => {
          if (0 == res.data.responseCode) {
            this.fileList=[]
            this.getDate()
            Toast.success(res.data.responseMsg);
          } else {
            Toast.fail(res.responseMsg);
            }
        }).catch(function (error) { // 请求失败处理
          const {data} = error.response
          Toast.fail(data.responseMsg);
        });
    },
    //是否确认修改头像
    beforeClose(action, done) {
      if(action === 'confirm') {
        if(this.fileList.length!=0){         
          this.afterRead()
          done() //关闭
        }else{
          Toast('请选择图片');
          done(false) //不关闭弹框
        }
      } else if(action === 'cancel') {
         done() //关闭
      }
    },
    sentImg(){
      this.show=true
    },
    //收货地址
    toAddressList(){
      this.$router.push({
        path:'/addressList',
      })
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

</style>
<style>

.personal .van-nav-bar__title{
  color: #fff;
}
.personal .van-dialog{
  text-align: center;
}
.personal .van-cell--clickable{
  height:60px;
  padding-top: 15px;
  width:100%
}
</style>
