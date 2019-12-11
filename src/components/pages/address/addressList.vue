<template>
  <div class="addressList">
    <div class="top">
      <van-nav-bar
          title="收货地址"
          @click-left="onClickLeft"
          fixed
        >
        <van-icon name="arrow-left" color="#fff" size="20px" slot="left" />
      </van-nav-bar>
    </div>
    <div class="img" v-if="list.length==0">
      <img src="/static/HM-shophome/img/nothing.png" alt="">
      <div>
        没有添加收货地址
      </div>
    </div> 
    <div class="content">
       <van-swipe-cell v-for="(value,index) in list" :key="index"  >
          <div class="addressInfo" @click="retAddress(value)">
            <div>{{value.name}}，{{value.tel}}</div>
            <div>{{value.address}}</div>
          </div>
          <template slot="right">
            <van-button square  text="删除" @click="delAddress(value)"/>
            <van-button square  text="修改" @click="onEdit(value)"/>
          </template>
        </van-swipe-cell>
    </div>
    <div class="bottom">
      <van-button  @click="onAdd">新增地址</van-button>
    </div>
  </div>
</template>
<script>
import { Toast } from 'vant';
export default {
  data () {
    return {
      path:'',
      chosenAddressId: '0',//选中的地址与id相对应
      list: [],
      toAddressUrl:this.$store.state.url+'address/list',//获取收货地址列表
      todelAddressUrl:this.$store.state.url+'address/delete'//删除收货地址
    }
  },
  created(){
    this.getAddress()  
  },
  methods: {
    //删除收货地址
    delAddress(value){
      const id={
        id:value.id
      }
      this.$dialog.confirm({
        message: '是否删除该收货地址',
        width:"280px"
      }).then(() => {
        this.$axios.delete(this.todelAddressUrl,{params:id}).then(res => {
          if (0 == res.data.responseCode) {
            const address=JSON.parse(sessionStorage.getItem("address"))
            if(address!=null){
              if(address.id==id.id){
                sessionStorage.removeItem("address")
              }
            }
            this.getAddress()
          } else {
            Toast.fail(res.responseMsg);
            }
        }).catch(function (error) { // 请求失败处理
          const {data} = error.response
          Toast.fail(data.responseMsg);
        });
      }).catch(() => {
        // on cancel
      });
    },
    //获得收货地址列表
    getAddress(){
      let userId={
        id:parseInt(sessionStorage.getItem("userId"))
      }
      this.accomplish=false
      this.$axios.get(this.toAddressUrl,{params:userId}).then(res => {
          if (0 == res.data.responseCode) {
            const dataList=res.data.data.list
            const address=[]
            for(let i=0;i<dataList.length;i++){
              const addressInfo = {
                id:dataList[i].id,
                name:dataList[i].contacts,
                tel:dataList[i].phone,
                address:dataList[i].address+","+dataList[i].houseNumber,
                addressDetail:dataList[i].houseNumber,
                areaCode:dataList[i].areaCode+"",
              }
              address.push(addressInfo)
            }
            this.list=address
          } else {
            Toast.fail(res.responseMsg);
            }
        }).catch(function (error) { // 请求失败处理
          const {data} = error.response
          Toast.fail(data.responseMsg);
        });
    }, 
    retAddress(item){
      sessionStorage.setItem("address", JSON.stringify(item))
      this.onClickLeft()
    },
    onClickLeft(){
      this.$router.back(-1)//返回上一个路由
    },
    onAdd() {
      this.$router.replace({
        path:'/addressAdd'
      })
    },
    onEdit(item) {
      this.$router.replace({
        name: "addressEdit",
        query: { id: JSON.stringify(item)} 
      });
    }
  }
}
</script>
<style scoped>
.img{
  width: 100%;
  text-align: center;
  margin-top: 150px;
  font-size: 14px;
  color: #BFBDBA;
}
.img img{
  width:50px;
  height: 50px;
}
.content{
  overflow: auto;
  margin-bottom: 44px;
}
.top{
  overflow: hidden;
  margin-bottom: 46px;
}
.addressInfo div:last-child{
  color: #7d7e80;
  font-size: 12px;
}
.addressInfo{
  font-size: 14px;
  padding: 10px 16px;
  line-height: 24px;
}
.addressList{
  overflow: auto;
  height: 100%;
  background: #f7f7f7;
}
</style>
<style>
.addressList .van-swipe-cell{
  background: #fff;
  margin-bottom: 2px;
}
.addressList .content .van-button{
  margin: 10px 0px 0px 0px;
  height: 48px;
}
.addressList .bottom .van-button{
  width: 100%;
  position: fixed;
  bottom: 0;
  margin-top:44px;
}

.addressList .van-nav-bar__title{
  color: #fff;
}
</style>
