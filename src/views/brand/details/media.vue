<template>
  <div>
    <h2 class="model-table-title list-title">
      <span class="count">全部媒体平台（{{list.length}}）家</span>
      <Button type="primary"  class="btn-edit" @click="handleAddMedia">添加媒体平台</Button>
    </h2>
    <ul class="ul-list">
      <li v-for="item in list" :key="item.id">
        <div class="inner">
          <div class="flex-box">
            <p v-if="item.channelCode == 'weibo'">
              <img :src="item.headImgUrl" v-if="item.headImgUrl" width="80" height="80"  />
              <img src="../assets/microblog.png" v-else width="80" height="80"  />
            </p>
            <p v-if="item.channelCode == 'kuaishou'">
              <img :src="item.headImgUrl" v-if="item.headImgUrl" width="80" height="80"  />
              <img src="../assets/quick.png" v-else width="80" height="80"  />
            </p>
            <p v-if="item.channelCode == 'douyin'">
              <img :src="item.headImgUrl" v-if="item.headImgUrl" width="80" height="80"  />
              <img src="../assets/vibrato.png" v-else width="80" height="80"  />
            </p>
            <p v-if="item.channelCode == 'wechat'">
              <img src="../assets/wechat.png" v-if="item.headImgUrl" width="80" height="80"  />
              <img src="../assets/wechat.png" v-else width="80" height="80"  />
            </p> 
            <div class="item">
              <p class="item-name">{{item.name}}</p>
              <p><a :href="item.url" target="_brank">{{item.url}}</a></p>
            </div>
          </div>
          <p class="operate">
            <img src="../assets/add-icon.png" @click="editMediaList(item)" class="img" width="20" />
            <img src="~@/views/pop/assets/del-icon.png" alt="alias" @click="delMediaList(item.id)" class="img" width="20" />
          </p>
        </div>
      </li>
    </ul>
    <ul class="no-data-list" v-if="list.length == 0">暂无数据</ul>
    <addMeida v-model="visible" v-if="visible.visMedia" @updata="updata"/>
  </div>
</template>

<script lang='ts'>
import {Component, Prop} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import pagination from '@/components/page.vue'
import {confirm} from '@/ui/modal'
import { querySelectList, mediaList, createMedia, editMedia, delMadia } from '@/api/brandList'
import addMeida from '../modalDlg/addMedia.vue'

@Component({
  components: {
    pagination,
    addMeida
  }
})
export default class Main extends ViewBase {
  @Prop({type: Number, default: 0}) brandId!: number

  list = []

  visible: any = {
    visMedia: false,
    title: '',
    flag: 1 // 1-create 2-edit
  }


  mounted() {
    this.tableList()
  }

  async tableList() {
    const brandId = this.brandId
    try {
      const {data: {channelCodeList, items}} = await mediaList({brandId})
      this.list = items || []
    } catch (ex) {
      this.handleError(ex)
    }
  }

  // 添加媒体平台
  handleAddMedia() {
    this.visible = {
      visMedia: true,
      title: '添加媒体平台',
      brandId: this.brandId,
      flag: 1
    }
  }
  // 编辑媒体平台
  editMediaList(item: any) {
    this.visible = {
      visMedia: true,
      title: '编辑媒体平台',
      brandId: this.brandId,
      flag: 2,
      items: {
        name: item.name,
        id: item.id,
        channelCode: item.channelCode,
        url: item.url,
        channelDataId: item.channelDataId
      }
    }
  }

  async delMediaList(id: number) {
    try {
      await confirm('你确定要删除当前媒体平台吗', {title: '删除媒体平台'})
      await delMadia(id)
      this.tableList()
    } catch (ex) {
      this.handleError(ex)
    }
  }

  updata() {
    this.tableList()
  }
}
</script>
<style lang='less' scoped>
@import '~@/views/brand/less/common.less';

</style>