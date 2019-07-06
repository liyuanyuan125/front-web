<template>
  <div>
    <Modal v-model="value.visible"
      :transfer='false'
      :width='660'
      :closable='false'
      :mask-closable='false'>
      <div class="title">
        <i @click="cancel"></i>
        <p>{{!!value.item.videoId ? '修改广告片' : '关联广告片'}}</p>
        <p class="title-box">仅支持选择审核已通过的广告片</p>
        <Form ref="forms" :model="form" style="margin-top: 30px" :rules="rules" :label-width="100">
          <!-- <FormItem label="已关联广告片" class="item-top">
            <div class="relvanMess">
              <p>
                <span>广告片ID</span>
                <em>{{value.item.videoId}}</em>
              </p>
              <p class="flex-box">
                <span>广告片名称</span>
                <em>{{value.item.videoName}}</em>
              </p>
            </div>
          </FormItem> -->
          <FormItem :labelWidth="0">
            <Input v-model="form.name" placeholder="请输入广告片名称" clearable style="width:500px" ></Input>
          </FormItem>
        </Form>
      </div>
      <div class="adver-box">
        <div @click="adverSelcet(item.id)" v-for="item in releList"
          :class="['img-box', (value.item.videoId == item.id ) ? 'img-active' : '']"
          :key="item.id" >
          <img :src="item.logo ? item.logo : defaultImg" :onerror="defaultImg" width="118px" height="120px" alt="" />
          <p class="title-p">名称：{{item.name}}</p>
        </div>
      </div>
      <Page :total="total" v-if="total>0" class="btnCenter"
        :current="pageList.pageIndex"
        :page-size="pageList.pageSize"
        :page-size-opts="[10, 20, 50, 100]"
        show-total
        show-sizer
        show-elevator
        @on-change="sizeChangeHandle"
        @on-page-size-change="currentChangeHandle"/>
      <div slot="footer" class="foot btnCenter footer-btn">
        <Button class="button-cancel foot-cancel-button" @click="cancel">取消</Button>
        <Button type="primary" class="button-ok foot-button" @click="handleSumbit">确认</Button>
      </div>
    </Modal>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { queryRelevanceList, relevanceVideo, setVideo } from '@/api/plan'
import { advertising } from '@/api/popPlan.ts'
import pagination from '@/components/page.vue'

@Component({
  components: {
    pagination
  }
})
export default class Relevan extends ViewBase {
  @Prop({ type: Object }) value: any
  releList = []
  form = {
    name: '',
    videoId: null
  }

  pageList = {
    pageIndex: 1,
    pageSize: 10
  }

  total = 0

  get defaultImg() {
    return 'this.src="' + require('./assets/error.png') + '"'
  }

  rules = {
    videoId: [
      {
        require: true,
        trigger: 'blur',
        validator(rule: any, value: string, callback: any) {
          !value ? callback(new Error('请选择关联广告片')) : callback()
        }
      }
    ]
  }

  async init() {
    try {
      (document.getElementsByTagName('html')[0] as any).style = 'overflow-y: hidden'
      const { data } = await advertising( {
        ...this.pageList,
        status: 4
      } )
      this.releList = data.items || []
      this.total = data.totalCount
    } catch (ex) {
      this.handleError(ex)
    }
  }

  mounted() {
    // 编辑
    if (this.value.item) {
      this.value.item.videoId = this.value.item.videoId
    }
    this.init()
  }

  adverSelcet(id: any) {
    this.value.item.videoId = id
  }

  // 每页数
  sizeChangeHandle(val: any) {
    this.pageList.pageIndex = val
    this.init()
  }

  // 当前页
  currentChangeHandle(val: any) {
    this.pageList.pageSize = val
    this.init()
  }

  async handleSumbit() {
    if (!this.value.item.videoId) {
      this.value.visible = false
    }
    try {
      await setVideo(
        this.value.id,
        {
          videoId: this.value.item.videoId
        }
      )
      this.value.visible = false
      this.$emit('submitRelevance')
      ; (document.getElementsByTagName('html')[0] as any).style = 'overflow-y: auto'
    } catch (ex) {
      this.handleError(ex)
    }
  }

  cancel() {
    (document.getElementsByTagName('html')[0] as any).style = 'overflow-y: auto'
    this.value.visible = false
  }

  uplist(size: any) {
    this.pageList.pageIndex = size
    this.queryReleList()
  }

  async queryReleList() {
    try {
      const {
        data: { items, totalCount }
      } = await queryRelevanceList({
        status: 4,
        ...this.pageList
      })
      this.releList = items
    } catch (ex) {
      this.handleError(ex)
    }
  }

}
</script>
<style lang="less" scoped>
@import '~@/site/lib.less';
/deep/ .ivu-modal-body {
  padding: 0;
}
/deep/ .ivu-input-wrapper,
/deep/ .ivu-input {
  background: rgba(255, 255, 255, 0.4);
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  border-radius: 5px;
  &::placeholder {
    font-size: 14px;
    color: #00202d;
  }
}
.title {
  border-radius: 5px 5px 0 0;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  padding: 20px;
  color: #00202d;
  i {
    position: absolute;
    right: -12px;
    top: -12px;
    display: block;
    width: 27px;
    height: 27px;
    background: #fff;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid rgba(209, 216, 219, 1);
    &::before {
      display: block;
      content: "×";
      font-size: 26px;
      line-height: 24px;
      text-align: center;
    }
  }
  .title-box {
    height: 45px;
    background: rgba(0, 32, 45, 1);
    border-radius: 5px;
  }
}

@cancel-color: rgba(59, 152, 255, 1);

.foot-button-box {
  width: 196px;
  height: 50px;
  margin-right: 20px;
}
.foot {
  text-align: center;
  height: 60px;
  margin-top: 20px;
  .foot-button {
    width: 103px;
    height: 38px;
    border-radius: 19px;
    line-height: 34px;
    font-size: 14px;
    padding: 0;
    .button-style(#fff, #00202d);
  }
  .foot-cancel-button {
    width: 103px;
    height: 38px;
    border-radius: 5px;
    line-height: 34px;
    font-size: 14px;
    padding: 0;
    margin-right: 20px;
    .button-style(#00202d, rgba(255, 255, 255, 0.6));
  }
}
.adver-box {
  padding: 0 50px;
  min-height: 100px;
  margin-bottom: 10px;
  display: flex;
  flex-wrap: wrap;
  .img-box {
    position: relative;
    width: 120px;
    cursor: pointer;
    margin-right: 20px;
    margin-bottom: 20px;
    border: 1px solid #d1d8db;
    border-radius: 5px;
    height: 150px;
    .title-p {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 30px;
      background: rgba(255, 255, 255, 0.6);
      line-height: 30px;
      padding-left: 10px;
      overflow: hidden;
      white-space: nowrap;
      color: #00202d;
      text-overflow: ellipsis;
    }
  }
  .img-active {
    &::after {
      content: '\2713';
      color: #fff;
      position: absolute;
      right: -8px;
      top: -8px;
      border: 1px solid #00202d;
      background: #00202d;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      text-align: center;
      line-height: 16px;
    }
  }
}
</style>


