<template>
  <Modal v-model="visibleDlg"
         title="添加对比KOL"
         width="970"
         class="modal-dlg">
    <div class="search-card">
      <Select v-model="selectedSearchIndex"
              clearable
              filterable
              remote
              :loading="loading"
              class="select-dlg"
              :remote-method="remoteMethod"
              @on-clear="searchList = []"
              placeholder="请输入KOL名称模糊查询">
        <Option v-for="(item, index) in searchListRemove"
                :value="index"
                :key="item.id"
                :label="item.nickName">
          <dl class="seacrh-select-list">
            <dt>
              <img :src="item.avatar" />
            </dt>
            <dd>
              <h6>{{item.nickName}}</h6>
              <p>{{item.dsc}}</p>
            </dd>
          </dl>
        </Option>
      </Select>
      <Button class="add-button"
              type="primary"
              @click="searchAddItemHandle">添加</Button>
    </div>
    <div class="select-card">
      <div class="selected-box">
        <div class="num-box">
          已选择 {{selectedCount}}/{{maxCount}}
        </div>
        <ul>
          <li v-for="(item, index) in selectedCart"
              :key="index">
            <dl class="person">
              <dt>
                <img :src="item.avatar" />
              </dt>
              <dd>
                <h6>{{item.nickName}}</h6>
                <i @click="removeItemHandle(index)"
                   class="add-remove ivu-icon ivu-icon-md-remove-circle"></i>
              </dd>
            </dl>
          </li>
        </ul>
      </div>
      <div class="choose-box">
        <RadioGroup @on-change="tabChange"
                    v-model="tabIndex"
                    size="large"
                    type="button">
          <Radio :label="0">相似KOL</Radio>
          <Radio :label="1">我的收藏</Radio>
        </RadioGroup>
        <ul v-if=" tabIndex === 0 & cartDataType0.length > 0 ">
          <li v-for="(item, index) in cartDataType0"
              :key="index">
            <dl class="person">
              <dt>
                <img :src="item.avatar" />
              </dt>
              <dd>
                <h6>{{item.nickName}}</h6>
                <i @click="cartAddItemHandle(index, 'cartDataType0')"
                   class="add-remove ivu-icon ivu-icon-md-add-circle"></i>
              </dd>
            </dl>
          </li>
        </ul>
        <ul v-if=" tabIndex === 1 & cartDataType1.length > 0 ">
          <li v-for="(item, index) in cartDataType1"
              :key="index">
            <dl class="person">
              <dt>
                <img :src="item.avatar" />
              </dt>
              <dd>
                <h6>{{item.nickName}}</h6>
                <i @click="cartAddItemHandle(index, 'cartDataType1')"
                   class="add-remove ivu-icon ivu-icon-md-add-circle"></i>
              </dd>
            </dl>
          </li>
        </ul>
      </div>
    </div>
    <div slot="footer">
      <Button class="btn-cancel"
              @click="handleCancel">取消</Button>
      <Button type="primary"
              @click="updateHandle('form')">确定</Button>
    </div>
  </Modal>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { warning } from '@/ui/modal'
import { differenceBy } from 'lodash'
export interface DataItem {
  nickName: string
  id: number
  avatar: string
  dsc?: string
  typeKey?: number
}
@Component({
  components: {}
})
export default class SelectModal extends ViewBase {
  @Prop({ type: Object, default: () => {} }) kol!: any
  @Prop({ type: Array, default: () => {} }) compareList!: any[]

  loading = false
  visibleDlg = false

  maxCount = 4

  searchList = [
    {
      id: 9111,
      nickName: '去重项9111',
      dsc: '去重项',
      avatar: 'http://sina.lt/gdYZ',
      typeKey: null
    },
    {
      id: 9222,
      nickName: '去重项9222',
      dsc: '去重项',
      avatar: 'http://sina.lt/gdYZ',
      typeKey: null
    },
    {
      id: 9333,
      nickName: '去重项9333',
      dsc: '去重项',
      avatar: 'http://sina.lt/gdYZ',
      typeKey: null
    },
    {
      id: 3002,
      nickName: '搜索结果1111',
      dsc: '摘要信息摘要信息摘要信息摘要信息摘要信息摘要信息',
      avatar: 'http://sina.lt/gdYZ',
      typeKey: null
    }
  ]

  selectedSearchIndex: string = ''
  // searchItem: any = {
  //   id: null,
  //   nickName: '',
  //   avatar: '',
  //   typeKey: null,
  // }

  selectedCart: any[] = [
    {
      id: 9111,
      nickName: '去重项9111',
      dsc: '去重项',
      avatar: 'http://sina.lt/gdYZ',
      typeKey: null
    },
    {
      id: 1,
      nickName: '账号1',
      dsc: '摘要信息摘要信息摘要信息',
      avatar: 'http://sina.lt/gdYZ',
      typeKey: null
    }
  ]

  cartDataType0: any[] = [
    {
      id: 9222,
      nickName: '去重项9222',
      dsc: '去重项',
      avatar: 'http://sina.lt/gdYZ',
      typeKey: 'cartDataType0'
    },
    {
      id: 5,
      nickName: '账号5',
      dsc: '摘要信息摘要信息摘要信息',
      avatar: 'http://sina.lt/gdYZ',
      typeKey: 'cartDataType0'
    },
    {
      id: 6,
      nickName: '账号6',
      dsc: '摘要信息摘要信息摘要信息',
      avatar: 'http://sina.lt/gdYZ',
      typeKey: 'cartDataType0'
    },
    {
      id: 7,
      nickName: '账号7',
      dsc: '摘要信息摘要信息摘要信息',
      avatar: 'http://sina.lt/gdYZ',
      typeKey: 'cartDataType0'
    },
    {
      id: 8,
      nickName: '账号8',
      dsc: '摘要信息摘要信息摘要信息',
      avatar: 'http://sina.lt/gdYZ',
      typeKey: 'cartDataType0'
    },
    {
      id: 9,
      nickName: '账号9',
      dsc: '摘要信息摘要信息摘要信息',
      avatar: 'http://sina.lt/gdYZ',
      typeKey: 'cartDataType0'
    }
  ]

  cartDataType1: any[] = [
    {
      id: 9333,
      nickName: '去重项9333',
      dsc: '去重项',
      avatar: 'http://sina.lt/gdYZ',
      typeKey: 'cartDataType1'
    },
    {
      id: 10,
      nickName: 'KOL账号名称99',
      dsc: '摘要信息摘要信息摘要信息',
      avatar: 'http://sina.lt/gdYZ',
      typeKey: 'cartDataType1'
    },
    {
      id: 11,
      nickName: 'KOL账号名称98',
      dsc: '摘要信息摘要信息摘要信息',
      avatar: 'http://sina.lt/gdYZ',
      typeKey: 'cartDataType1'
    },
    {
      id: 12,
      nickName: 'KOL账号名称97',
      dsc: '摘要信息摘要信息摘要信息',
      avatar: 'http://sina.lt/gdYZ',
      typeKey: 'cartDataType1'
    },
    {
      id: 13,
      nickName: 'KOL账号名称96',
      dsc: '摘要信息摘要信息摘要信息',
      avatar: 'http://sina.lt/gdYZ',
      typeKey: 'cartDataType1'
    },
    {
      id: 14,
      nickName: 'KOL账号名称95',
      dsc: '摘要信息摘要信息摘要信息',
      avatar: 'http://sina.lt/gdYZ',
      typeKey: 'cartDataType1'
    }
  ]

  tabIndex: number = 0
  // 去重
  get searchListRemove() {
    return differenceBy(
      this.searchList,
      this.selectedCart,
      this.cartDataType1,
      this.cartDataType0,
      'id'
    )
  }
  get isFull() {
    return this.maxCount === this.selectedCount
  }
  get selectedCount() {
    return this.selectedCart.length
  }
  init() {
    this.visibleDlg = true
  }
  handleCancel() {
    this.visibleDlg = false
  }
  cartAddItemHandle(index: string, cartName: string) {
    const that: any = this
    if (this.isFull) {
      this.toastMsg()
      return
    }
    if (index !== '' && cartName) {
      const i = parseInt(index, 0)
      that.selectedCart.push(that[`${cartName}`][i])
      that[`${cartName}`].splice(index, 1)
    }
  }
  searchAddItemHandle() {
    if (this.isFull) {
      this.toastMsg()
      return
    }
    if (this.searchList.length === 0) {
      this.toastMsg(1)
      return
    }
    const i = parseInt(this.selectedSearchIndex, 0)
    this.selectedCart.push(this.searchList[i])
  }
  removeItemHandle(index: number = 0) {
    const typeKey = this.selectedCart[index].typeKey
    switch (typeKey) {
      case 'cartDataType0':
        this.cartDataType0.push(this.selectedCart[index])
        break
      case 'cartDataType1':
        this.cartDataType1.push(this.selectedCart[index])
        break
      case null:
        this.cartDataType0.push({
          ...this.selectedCart[index],
          typeKey: 'cartDataType0'
        })
    }
    this.selectedCart.splice(index, 1)
  }
  tabChange() {}
  toastMsg(type: number = 0) {
    switch (type) {
      case 1:
        warning('请先搜索')
        break
      default:
        warning('最多4个!')
    }
  }
  async remoteMethod(query: any) {}
  async updateHandle(dataform: any) {
    this.$emit('selectd', this.selectedCart)
    this.visibleDlg = false
  }
}
</script>
<style lang="less" scoped>
@import '~@/site/lib.less';
// 弹框
.modal-dlg {
  /deep/ .ivu-modal-content {
    padding: 20px 40px 35px;
    .ivu-modal-header {
      border-bottom: none;
      text-align: center;
    }
    .ivu-modal-footer {
      text-align: center;
      font-size: 18px;
      color: #00202d;
      .ivu-btn-primary {
        width: 200px;
        height: 50px;
        text-align: center;
        color: #fff;
        background: #00202d;
        border-radius: 25px;
        border: none;
      }
      .ivu-btn {
        font-size: 15px;
      }
    }
  }
  /deep/ .ivu-select-dropdown {
    max-height: 330px;
  }
  /deep/ .ivu-select-selection {
    height: 40px;
    border: none;
    .ivu-icon {
      right: 150px;
    }
  }
  /deep/ .ivu-select-input {
    height: 40px;
    background: rgba(242, 242, 242, 1);
    border-radius: 20px;
    border: 1px solid rgba(223, 223, 223, 1);
    text-indent: 15px;
  }
  /deep/ .ivu-radio-group {
    .ivu-radio-wrapper {
      background: none;
      border: none;
      box-shadow: none !important;
      color: rgb(9, 39, 51);
      border-radius: 0;
      padding: 0;
      margin-right: 60px;
      &::before,
      &::after {
        display: none;
      }
    }
    .ivu-radio-wrapper-checked {
      color: #00202d;
      border-bottom: 2px solid #00202d;
      .ivu-radio-inner {
        display: none;
      }
      &::before,
      &::after {
        display: none;
      }
    }
  }
  .add-button {
    width: 150px;
    height: 42px;
    background: rgba(0, 32, 45, 1);
    border-radius: 21px;
  }
  // 取消按钮
  .btn-cancel {
    background: none;
    border: none;
    color: #00202d;
    font-size: 14px;
    margin-right: 10px;
  }
  .add-remove {
    color: #ccd2d5;
    font-size: 29px;
  }
  .search-card {
    position: relative;
    .add-button {
      position: absolute;
      right: -1%;
      top: 0;
    }
  }
}
.seacrh-select-list {
  display: flex;
  flex-flow: row;
  justify-content: flex-start;
  align-items: center;
  dt {
    img {
      border-radius: 50%;
      max-width: 60px;
      max-height: 60px;
    }
  }
  dd {
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    align-items: flex-start;
    padding-left: 15px;
    h6 {
      color: #00202d;
      font-size: 16px;
      line-height: 30px;
    }
    p {
      font-size: 14px;
      color: rgb(38, 67, 78);
    }
  }
}
.select-card {
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  align-items: flex-start;
  padding-top: 41px;
  .selected-box {
    width: 38%;
    .num-box {
      height: 50px;
      font-size: 18px;
      font-weight: 400;
      color: rgba(0, 32, 45);
      line-height: 50px;
    }
  }
  .choose-box {
    width: 72%;
    position: relative;
    &::before {
      content: '';
      border-left: 1px solid #dde1e3;
      position: absolute;
      left: -22px;
      top: 24px;
      height: 92%;
      width: 1px;
    }
    .ivu-radio-group {
      height: 50px;
      font-size: 18px;
      line-height: 50px;
    }
    ul {
      overflow-y: scroll;
      li {
        margin: 0 15px 20px 0;
      }
    }
  }
  ul {
    height: 400px;
    padding-top: 20px;
    display: flex;
    flex-flow: wrap;
    justify-content: flex-start;
    align-items: flex-start;
    li {
      text-align: center;
      margin: 0 20px 20px 0;
    }
  }
}
dl.person {
  cursor: pointer;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  &:hover {
    img {
      border: 2px solid #00202d;
    }
    .add-remove {
      color: #00202d;
    }
  }
  dt {
    text-align: center;
    img {
      border-radius: 50%;
      max-width: 80px;
      max-height: 80px;
      border: 2px solid #fff;
    }
  }
  dd {
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    h6 {
      color: #00202d;
      font-size: 16px;
      line-height: 30px;
      width: 120px;
      .cut-text;
    }
    a {
      font-size: 14px;
      color: rgb(38, 67, 78);
    }
  }
}
</style>
