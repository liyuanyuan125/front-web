<template>
  <div class="page">
    <h3 class="userTitle">
      <span>用户管理</span>
      <router-link class="addUser" tag="span" to>
        <Icon type="ios-add" size="27"/>
        <router-link to="/account/user/add">新增子用户</router-link>
      </router-link>
    </h3>
    <Form :model="form">
      <Row type="flex" justify="space-between">
        <Col :span="6">
          <FormItem label="权限角色" :label-width="100">
            <Select v-model="form.role">
              <Option :value="item.key" v-for="item in rolelist">{{item.value}}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col :span="5">
          <FormItem label="账号状态" :label-width="100">
            <Select v-model="form.status">
              <Option :value="item.key" v-for="item in statusList">{{item.value}}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col :span="10">
          <FormItem>
            <Input search enter-button placeholder="请输入联系人姓名／邮箱账号／手机号码进行搜索"/>
          </FormItem>
        </Col>
      </Row>
    </Form>
    <div class="tableTotal">
      <span>当前共有用户 xxx 人</span>
      <span>当前结果共xxxx项</span>
    </div>
    <Table
      ref="selection"
      stripe
      class="tables"
      :columns="columns4"
      :data="data1"
      @on-select-all="selectAll"
    ></Table>
    <h4 class="checkAll">
      <span @click="handleSelectAll">
        <Checkbox v-model="checkboxAll"></Checkbox>全选
      </span>
      <span @click="deleteList">批量删除</span>
    </h4>
    <Page :total="100" class="btnCenter" show-total show-elevator/>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class Main extends ViewBase {
  checkboxAll = false
  form = {
    role: '',
    status: ''
  }
  rolelist = [
    { key: '1', value: '所有角色' },
    { key: '2', value: '广告运营' },
    { key: '3', value: '所有角色' },
    { key: '4', value: '所有角色' }
  ]
  statusList = [
    { key: '1', value: '所有状态' },
    { key: '2', value: '待激活' },
    { key: '3', value: '已启用' },
    { key: '4', value: '已禁用' }
  ]
  columns4 = [
    {
      type: 'selection',
      width: 60,
      align: 'center'
    },
    { title: '联系人', key: 'person' },
    {
      title: '登录邮箱',
      key: 'loginEmail'
    },
    {
      title: '手机号码',
      key: 'mobile'
    },
    {
      title: '权限角色',
      key: 'power'
    },
    {
      title: '状态',
      key: 'status',
      render: (h: any, params: any) => {
        const status = params.row.status
        if (status === 0) {
          return h('span', { style: { color: '#444' } }, '已启用')
        }
        if (status === 1) {
          return h('span', { style: { color: '#05B824' } }, '待激活')
        }
        if (status === 2) {
          return h('span', { style: { color: '#FF002D' } }, '已禁用')
        }
      }
    },
    {
      title: '上次登录时间',
      key: 'lastTime'
    },
    {
      title: '操作',
      key: '',
      render: (h: any, params: any) => {
        const status = params.row.status
        const that = this
        const cocat = [
          h(
            'span',
            {
              style: { color: '#2481D7', cursor: 'pointer' },
              on: {
                click: () => {
                  this.toDetail()
                }
              }
            },
            '查看'
          ),
          h(
            'span',
            {
              style: {
                color: '#2481D7',
                cursor: 'pointer',
                margin: '0 15px'
              },
              on: { click: () => {} }
            },
            '编辑'
          )
        ]

        if (status === 0) {
          return h(
            'div',
            cocat.concat([
              h(
                'span',
                {
                  style: { color: '#2481D7', cursor: 'pointer' },
                  on: {
                    click: () => {
                      this.$Modal.warning({
                        title: '提示',
                        content:
                          '您确认要禁用该广告用户吗？广告用户禁用后，将不能登录广告平台',
                        onOk: () => {},
                        onCancel: () => {}
                      })
                    }
                  }
                },
                '禁用'
              )
            ])
          )
        } else if (status === 1) {
          return h(
            'div',
            cocat.concat([
              h(
                'span',
                {
                  style: { color: '#2481D7', cursor: 'pointer' },
                  on: {
                    click: () => {
                      this.$Message.success(
                        '重新激活”按钮，提示文案“激活链接已重新发送，请提醒子用户查收激活邮件'
                      )
                    }
                  }
                },
                '重新激活'
              )
            ])
          )
        } else if (status === 2) {
          return h(
            'div',
            cocat.concat([
              h(
                'span',
                {
                  style: { color: '#2481D7', cursor: 'pointer' },
                  on: {
                    click: () => {
                      this.$Modal.success({
                        title: '提示',
                        content: '您确认要启用该广告吗',
                        onOk: () => {},
                        onCancel: () => {}
                      })
                    }
                  }
                },
                '启用'
              )
            ])
          )
        }
      }
    }
  ]
  data1 = [
    {
      person: 'John Brown',
      loginEmail: 'xxxxxxx',
      mobile: 'xxxxxx',
      power: 'xxxxxx',
      status: 0,
      lastTime: 'xxxx',
      _disabled: false
    },
    {
      person: 'John Brown',
      loginEmail: 'xxxxxxx',
      mobile: 'xxxxxx',
      power: 'xxxxxx',
      status: 1,
      lastTime: 'xxxx'
    },
    {
      person: 'John Brown',
      loginEmail: 'xxxxxxx',
      mobile: 'xxxxxx',
      power: 'xxxxxx',
      status: 2,
      lastTime: 'xxxx'
    }
  ]

  async mounted() {}
  toDetail() {
    this.$router.push({ name: 'account-user-detail' })
  }
  selectAll(select: any) {}
  handleSelectAll() {
    const selection = this.$refs.selection as any
    selection.selectAll(!this.checkboxAll)
  }
  deleteList() {}
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

.colBg {
  font-size: 14px;
  height: 50px;
  line-height: 50px;
  padding: 0 30px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  background: @c-head-bg;
}
.page {
  background: #fff;
  height: 100%;
  font-size: 14px;
  .checkAll {
    cursor: pointer;
    margin: 10px 20px 0;
    .colBg;
    span:last-child {
      color: @c-link;
    }
  }
  .userTitle {
    .colBg;
    .addUser {
      width: 140px;
      height: 40px;
      line-height: 40px;
      display: block;
      text-align: center;
      color: #fff;
      cursor: pointer;
      background: @c-button;
    }
  }
  .ivu-form-item {
    /deep/ .ivu-form-item-label {
      padding: 14px 12px 14px 0;
      font-size: 14px;
    }
    /deep/ .ivu-form-item-content {
      /deep/ .ivu-select-selection {
        height: 40px;
        .ivu-select-selected-value {
          height: 40px;
          line-height: 40px;
          font-size: 14px;
        }
        .ivu-select-placeholder {
          height: 40px;
          line-height: 40px;
          font-size: 14px;
        }
      }
      /deep/ .ivu-input {
        height: 40px;
        font-size: 14px;
      }
    }
  }
  .tableTotal {
    padding: 0 30px 20px;
    display: flex;
    justify-content: space-between;
    color: #989898;
  }
  .tables {
    margin: 0 20px;
    border: none;
    /deep/.ivu-table {
      &::before {
        height: 0;
      }
      td {
        border-bottom: none;
      }
    }
  }
}
</style>
