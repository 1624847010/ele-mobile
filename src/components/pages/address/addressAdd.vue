<template>
  <div class='addressAdd'>
    <van-nav-bar
      title="添加收货地址"
      @click-left="onClickLeft"
    >
      <van-icon name="arrow-left" color="#fff" size="20px" slot="left" />
    </van-nav-bar>
    <van-address-edit
        :area-list="areaList"
        show-search-result
        :area-columns-placeholder="['请选择', '请选择', '请选择']"
        @save="onSave"
      />
  </div>
</template>
<script>
import areaList from '../../../assets/js/area'
import { Toast } from 'vant';
export default {
  components: {areaList},
  data () {
    return {
      areaList: {},
      searchResult: [],
      toAddressAddUrl:this.$store.state.url+'address/add'
    }
  },
  mounted () {
    this.get()
  },
  methods: {
    // 初始化地址选择器
    get:function(){
      this.areaList=areaList
    },
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
                    address:e.province+" "+e.city+" "+e.county,
                    areaCode:e.areaCode,
                    userId:parseInt(sessionStorage.getItem("userId")),
                    houseNumber:e.addressDetail
                  }
      this.$axios.post(this.toAddressAddUrl,data).then(res => {
          if (0 == res.data.responseCode) {
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

.addressAdd .van-nav-bar__title{
  color: #fff;
}
</style>
