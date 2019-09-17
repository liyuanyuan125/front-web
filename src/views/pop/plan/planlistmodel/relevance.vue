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
        <p style="margin-top: 30px" class="title-box">仅支持选择审核已通过的广告片</p>
      </div>
      <Form ref="forms" :model="form" :rules="rules" :label-width="100">
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
          <div class="flex-box search-borde">
            <Input v-model="form.name" placeholder="请输入广告片名称" />
              <img class='seach-img' src='../assets/seach.png'/>
            </Input>
            <Checkbox style="width: 180px; margin: 3px 0 0 20px " v-model="single">隐藏不可用广告片</Checkbox>
          </div>
        </FormItem>
      </Form>
      <div class="adver-box">
        <ul class="ul-list demo-spin-article">
          <li @click="adverSelcet(item.id, item.status)"
            :class="[ (value.item.videoId == item.id ) ? 'img-active' : '']"
            :key="item.id" v-for="item in releList">
            <div class="flex-box inner">
              <div class="left-item">
                <div :class="{advert: item.videoType == 1}"></div>
                <img :src="item.logo ? item.logo : defaultImg" :onerror="defaultImg" class="img" />
              </div>
              
              <div class="right-item">
                <p class="name">{{item.name}}</p>
                <p class="brand-name">{{item.brandName || item.productName}}</p>
                <div class="item-icon">
                  <span>{{transformSpecif(item.specification)}}</span>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <!-- <div @click="adverSelcet(item.id)" v-for="item in releList"
          :class="['img-box', (value.item.videoId == item.id ) ? 'img-active' : '']"
          :key="item.id" >
          <img :src="item.logo ? item.logo : defaultImg" :onerror="defaultImg" width="118px" height="120px" alt="" />
          <p class="title-p">名称：{{item.name}}</p>
        </div> -->
      </div>
      <pagination :pageList="pageList" :total="total" @uplist="uplist"></pagination>
      <div slot="footer" class="foot btn-center-footer footer-btn">
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
import { clean } from '@/fn/object'
import { confirm, toast } from '@/ui/modal'

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
    videoId: null,
  }

  pageList = {
    pageIndex: 1,
    pageSize: 10
  }

  single = false

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

  uplist(size: any) {
    this.pageList.pageIndex = size
    this.init()
  }

  async init() {
    try {
      (document.getElementsByTagName('html')[0] as any).style = 'overflow-y: hidden'
      const { data } = await advertising( clean({
        ...this.pageList,
        status: this.single ? 4 : '',
        name: this.form.name,
        videoType: this.value.advertTypeCode == 'TRAILER' ? 1 : 2
      }) )
      this.releList = data.items || []
      this.total = data.totalCount
    } catch (ex) {
      this.handleError(ex)
    }
  }

  transformSpecif(val: any) {
    const num = val % 60 == 0 ? '00' : val % 60
    return val < 60 ? `00:${val}` : `${Math.floor(val / 60)} : ${num}`
  }

  mounted() {
    // 编辑
    if (this.value.item) {
      this.value.item.videoId = this.value.item.videoId
    }
    this.init()
  }

  async adverSelcet(id: any, status: any) {
    if (status != 4) {
      await confirm(`该广告片审核未通过`, {
        title: ''
      })
    } else {
      this.value.item.videoId = id
    }
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

  // uplist(size: any) {
  //   this.pageList.pageIndex = size
  //   this.queryReleList()
  // }

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

  @Watch('form.name')
  watchFormName(val: any) {
    this.init()
  }

  @Watch('single')
  watchSingle(val: any) {
    this.init()
  }
}
</script>
<style lang="less" scoped>
@import '~@/site/lib.less';
@import '~@/views/account/less/common.less';
.item-top {
  padding-top: 20px;
}
.advert {
  position: absolute;
  height: 40px;
  width: 40px;
  background: url('~@/assets/icon/prevue.png') no-repeat left top;
  background-size: 40px auto;
}
/deep/ .ivu-modal-body {
  padding: 0;
}
/deep/ .ivu-input-wrapper,
/deep/ .ivu-input {
  position: relative;
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
.seach-img {
  position: absolute;
  top: 8px;
  left: 330px;
  height: 20px;
  user-select: none;
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
    padding-left: 20px;
    background: rgba(0, 32, 45, 1);
    border-radius: 5px;
    color: #fff;
    text-align: left;
    line-height: 45px;
  }
}

@cancel-color: rgba(59, 152, 255, 1);
.search-borde {
  width: 500px;
  margin-left: 20px;
  input {
    border: 1px solid #95cad6;
  }
}
.foot-button-box {
  width: 196px;
  height: 50px;
  margin-right: 20px;
}
.foot {
  text-align: center;
  height: 60px;
  margin-top: -20px;
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
  min-height: 100px;
  margin-bottom: 10px;
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
}
.ul-list {
  margin-left: 22px;
  margin-right: 22px;
  display: flex;
  flex-wrap: wrap;
  li {
    margin-top: 10px;
    position: relative;
    width: 49%;
    .inner {
      background: #00202d;
      border-radius: 5px;
      padding: 20px 20px 15px;
      cursor: pointer;
      position: relative;
      .left-item {
        .img {
          width: 120px;
          height: 120px;
        }
      }
      .right-item {
        padding-left: 15px;
        font-size: 14px;
        width: 100%;
        .name {
          font-size: 18px;
          color: #a3d5e6;
          height: 76px;
        }
        .img-wid {
          width: 17px;
          margin-left: 10px;
        }
        .brand-name {
          // word-break: break-all;
          padding-bottom: 7px;
          max-width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #fff;
        }
        .item-icon {
          width: 100%;
          span {
            color: #fff;
          }
          .icon-img {
            position: absolute;
            right: 10px;
            bottom: 12px;
            width: 100px;
            text-align: right;
          }
        }
      }
    }
  }
  li:nth-child(2n - 1) {
    margin-right: 2%;
  }
  .img-active {
    &::after {
      content: '';
      color: #00202d;
      position: absolute;
      right: 8px;
      top: 8px;
      background: url(../assets/sure.png);
      background-size: 20px;
      width: 20px;
      height: 20px;
    }
  }
}
/deep/ .ivu-checkbox-checked .ivu-checkbox-inner {
  background: #00202d;
}
/deep/ .page-list {
  .ivu-page-prev a, .ivu-page-total, .ivu-page-next a {
    color: #00202d;
  }
  .ivu-page-item {
    a {
      color: #00202d;
    }
  }
  .ivu-page-item.ivu-page-item-active {
    background: #00202d;
    a {
      color: #fff;
    }
  }
}
</style>


