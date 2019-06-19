<template>
  <div class="model-home list">
    <div class="list-left">
      <!-- <img src="./assets/brand-logo.png" width="160" /> -->
      <Upload v-model="imageList" :max-count="1" accept="images/*" :isEdit="flagImg" confirm-on-del></Upload>
      <!-- <img src="./assets/add-icon.png" v-if="!flagImg" class="base-upload-img"/> -->
      <p class="title">Mercedes－Benz 待添加</p>
      <p class="types">汽车类</p>
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
import {Component} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import eventBus from './eventBus'
import Upload from '@/components/uploadOnly'


@Component({
  components: {
    Upload
  }
})
export default class Main extends ViewBase {
  tabActive: any = ''
  flagImg = false

  imageList: any = []
  tabs = [
    { name: '基础信息', key: 1, route: 'brand-moredetail-base'},
    { name: '门店', key: 2, route: 'brand-moredetail-shop'},
    { name: '媒体平台', key: 3, route: 'brand-moredetail-media'},
    { name: '产品信息', key: 4, route: 'brand-moredetail-product'},
  ]

  mounted() {
    this.tabActive = this.$route.name
    eventBus.$on('uploadImg', (flag: any) => {
      this.flagImg = flag
    })
    const fileds: any = localStorage.getItem('brandImg')
    this.imageList = JSON.parse(fileds)
  }

  handleTabs(item: any) {
    this.$router.push({name: item.route})
    this.tabActive = item.route
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