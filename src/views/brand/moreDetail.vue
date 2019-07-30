<template>
  <div class="model-home list">
    <div class="list-left">
      <Upload v-model="imageList" :max-count="1" accept="images/*" :isEdit="flagImg" confirm-on-del></Upload>
      <p class="title">{{detailMes.enName}}</p>
      <p class="types">{{detailMes.tradeCodeName}}</p>
      <ul class="tabs-title">
        <li v-for="item in tabs" :key="item.key" :class="{'active': item.route == tabActive}" 
        @click="handleTabs(item)" >{{item.name}}</li>
      </ul>
    </div>
    <div class="list-right model-bg">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang='ts'>
import {Component, Prop, Watch} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import eventBus from './eventBus'
import Upload from '@/components/uploadOnly'
import { baseList, editBase } from '@/api/brandList'


@Component({
  components: {
    Upload
  }
})
export default class Main extends ViewBase {
  @Prop({type: Number, default: 0}) id!: number
  @Prop({type: Number, default: 0}) brandId!: number


  tabActive: any = ''
  flagImg = false
  detailMes = {}
  imageList: any = []
  tabs = [
    { name: '基础信息', key: 1, route: 'brand-moredetail-base'},
    { name: '门店', key: 2, route: 'brand-moredetail-shop'},
    { name: '媒体平台', key: 3, route: 'brand-moredetail-media'},
    { name: '产品信息', key: 4, route: 'brand-moredetail-product'},
  ]

  mounted() {
    this.tabActive = this.$route.name
    this.queryList()
    // 监听是否编辑
    eventBus.$on('uploadImg', (val: any) => {
      this.flagImg = val
    })
  }
  async queryList() {
    const { data: {item, tradeCodeList, countryCodeList} } = await baseList(this.brandId)
    // 编辑头像
    const imgList: any = [
      {
        url: item.logoUrl,
        fileId: item.logo
      }
    ]
    this.imageList = imgList

    const tradeName: any = tradeCodeList.find((trade: any) => trade.key == item.tradeCode) || {}
    const detail = {
      enName: item.name,
      tradeCodeName: tradeName.text
    }
    this.detailMes = detail
  }
  handleTabs(item: any) {
    this.$router.push({name: item.route})
    this.tabActive = item.route
  }
  @Watch('imageList')
  watchImageList(val: any) {
    localStorage.setItem('fileId', val[0].fileId)
  }
}

</script>
<style lang='less' scoped>
@import '~@/views/brand/less/common.less';
.list {
  display: flex;
  .list-left {
    width: 160px;
    margin-right: 20px;
    position: relative;
    .title {
      font-size: 16px;
      padding: 15px 0 17px;
      text-align: center;
      color: #fff;
    }
    .types {
      text-align: center;
      color: #fff;
    }
    .tabs-title {
      width: 160px;
      background: rgba(0, 32, 45, .8);
      padding: 10px 0;
      margin: 40px 0 30px;
      li {
        font-size: 14px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        color: #fff;
        cursor: pointer;
        &.active {
          background: #00202d;
        }
      }
    }
  }
  .list-right {
    width: 100%;
  }
}
.model-home {
  padding: 30px 20px 100px;
}
.base-upload-img {
  width: 20px;
  position: absolute;
  right: 10px;
  top: 130px;
  cursor: pointer;
}
</style>