<template>
  <div class="addressEdit">
    <van-nav-bar
      title="编辑收货地址"
      @click-left="onClickLeft"
    >
     <van-icon name="arrow-left" color="#fff" size="20px" slot="left" />
    </van-nav-bar>
    <van-address-edit
        :address-info="addressInfo"
        :area-list="areaList"
        show-search-result
        :area-columns-placeholder="['请选择', '请选择', '请选择']"
        @save="onSave"
      >
    </van-address-edit>
  </div>
</template>
<script>
import areaList from '../../../assets/js/area'
import { Toast } from 'vant';
export default {
  components: {areaList},
  data () {
    return {
      radio: '1',
      addressInfo:{},
      areaList: {},
      searchResult: [],
      toupdateAddressUrl:this.$store.state.url+'address/update'//修改收货地址
    }
  },
   mounted () {
    var item=JSON.parse(this.$route.query.id)
    const addressInfo = {
        id:item.id,
        name:item.name,
        tel:item.tel,
        address:item.address,
        addressDetail:item.addressDetail,
        areaCode:item.areaCode,
    }
    this.addressInfo=addressInfo;
    this.get()
  },
  methods: {
    // 初始化地址选择器
    get:function(){
      this.areaList=areaList
    },
    //返回
    onClickLeft() {
      this.$router.replace({
        path:'/addressList'
      })
    },
    //点击保存地址
    onSave(e) {
      const data={//提交服务器端数据
                    contacts:e.name,
                    phone:e.tel,
                    address:e.province+"/"+e.city+"/"+e.county,
                    areaCode:e.areaCode,
                    houseNumber:e.addressDetail,
                    id:e.id
                  }
                  const addressInfo = {
                    id:e.id,
                    name:e.name,
                    tel:e.tel,
                    address:e.province+"/"+e.city+"/"+e.county+","+e.addressDetail,
                    addressDetail:e.county,
                    areaCode:e.areaCode+"",
                  }
      this.$axios.put(this.toupdateAddressUrl,data).then(res => {
          if (0 == res.data.responseCode) {
            const address=JSON.parse(sessionStorage.getItem("address"))
            if(address!=null){
              if(address.id==data.id){
                sessionStorage.setItem("address", JSON.stringify(addressInfo))
              }
            }
            this.$router.replace({
              path:'/addressList'
            })
          } else {
            Toast.fail(res.responseMsg);
            }
        }).catch(function (error) { // 请求失败处理
          const {data} = error.response
          Toast.fail(data.responseMsg);
        });
      Toast('保存成功');
    },
  }
}
</script>
<style scoped>

</style>
<style>

.addressEdit .van-nav-bar__title{
  color: #fff;
}
</style>
