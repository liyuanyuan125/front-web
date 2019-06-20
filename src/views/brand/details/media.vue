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

    <!-- 添加媒体平台 -->
      <Modal v-model="visible.visMedia" :title="visible.title" width="700" class="modal-dlg">
        <Form ref="form" :model="form" :rules="rule" :label-width="90" class="edit-input">
            <FormItem label="媒体平台" prop="channelCode">
                <Select v-model="form.channelCode" style="width: 400px" clearable>
                  <Option v-for="item in channelCodeList" :key="item.key" :value="item.key">{{item.text}}</Option>
                </Select>
            </FormItem>
            <FormItem label="账号名称" prop="name" >
                <Input v-model="form.name" placeholder="请输入账号名称" />
            </FormItem>
            <FormItem label="账号id" prop="channelDataId">
              <Input v-model="form.channelDataId" placeholder="请输入账号id" />
            </FormItem>
            <FormItem label="访问链接" prop="url" >
                <Input v-model="form.url"  placeholder="请输入访问链接" />
            </FormItem>
        </Form>
        <div slot="footer">
          <Button class="btn-cancel" @click="handleCancel">取消</Button>
          <Button type="primary" @click="addMedia">确定</Button>
        </div>
     </Modal>
  </div>
</template>

<script lang='ts'>
import {Component, Prop} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import pagination from '@/components/page.vue'
import {confirm} from '@/ui/modal'
import { querySelectList, mediaList, createMedia, editMedia, delMadia } from '@/api/brandList'

@Component({
  components: {
    pagination
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
  // 媒体平台类型list
  channelCodeList = []

  form: any = {}
  get rule() {
    return {
      name: [{ required: true, type: 'string', message: '账号名称不能为空', trigger: 'blur' }],
      channelCode: [{ required: true, type: 'string', message: '媒体平台不能为空', trigger: 'change' }],
      channelDataId: [{ required: true, type: 'string', message: '账号id不能为空', trigger: 'blur' }],
      // url: [{ required: true, type: 'string', message: '访问链接不能为空', trigger: 'blur' }]
    }
  }

  mounted() {
    this.querySelectList()
    this.tableList()
  }

  async querySelectList() {
    try {
      const {data: {channelCodeList}} = await querySelectList()
      this.channelCodeList = channelCodeList
    } catch (ex) {
      this.handleError(ex)
    }
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
  async addMedia() {
    const volid = await (this.$refs.form as any).validate()
    if (!volid) { return }

    const brandId = this.brandId
    try {
      if (this.visible.flag == 1) { // create
        const { data } = await createMedia({
          ...this.form,
          brandId,
        })
      } else { // 编辑
        const { data } = await editMedia({
          ...this.form,
          brandId
        })
      }
      this.visible.visMedia = false
      this.form = {}
      this.tableList()
    } catch (ex) {
      this.visible.visMedia = false
      this.handleError(ex)
    }
  }
  // 添加媒体平台
  handleAddMedia() {
    this.visible = {
      visMedia: true,
      title: '添加媒体平台',
      flag: 1
    }
  }
  // 编辑媒体平台
  editMediaList(item: any) {
    this.visible = {
      visMedia: true,
      title: '编辑媒体平台',
      flag: 2
    }
    this.form = {
      name: item.name,
      id: item.id,
      channelCode: item.channelCode,
      url: item.url,
      channelDataId: item.channelDataId
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

  handleCancel() {
    this.visible.visMedia = false
    this.form = {}
  }
}

</script>
<style lang='less' scoped>
@import '~@/views/brand/less/common.less';

</style>