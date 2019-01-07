<template>
  <div class="page home-bg">
    <h3 class="userTitle">
      <span class="nav-top-title">影院管理</span>
    </h3>
    <div class="flex-box">
      <Input placeholder="请输入影院专资编码／影院名称进行搜索"/>
      <span>
        <Icon type="ios-search" size="22"/>
      </span>
    </div>
    <div class="tableTotal">
      <span>当前共有用户 xxx 人</span>
      <span>当前结果共xxxx项</span>
    </div>
    <Table ref="selection" stripe class="tables" :columns="columns4" :data="data1"></Table>
    <Page :total="100" class="btnCenter" show-total show-elevator/>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class Main extends ViewBase {
  columns4 = [
    { title: 'ID', key: 'person' },
    {
      title: '权限角色名称',
      key: 'loginEmail'
    },
    {
      title: '上次编辑时间',
      key: 'mobile'
    },
    {
      title: '操作',
      render: (h: any, params: any) => {
        return h('div', [
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
          )
        ])
      }
    }
  ]
  data1 = [
    {
      person: 'John Brown',
      loginEmail: 'xxxxxxx',
      mobile: 'xxxxxx'
    },
    {
      person: 'John Brown',
      loginEmail: 'xxxxxxx',
      mobile: 'xxxxxx'
    }
  ]

  async mounted() {}

  toDetail() {
    this.$router.push({ name: 'account-cinema-detail' })
  }
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
  align-items: center;
  margin-bottom: 20px;
  background: @c-head-bg;
}
.page {
  background: #fff;
  height: 100%;
  font-size: 14px;
  .ivu-input-wrapper {
    width: auto;
    /deep/ .ivu-input {
      height: 40px;
      width: 400px;
      margin-bottom: 30px;
      margin-left: 25px;
    }
  }
  .flex-box {
    span {
      display: block;
      height: 40px;
      width: 80px;
      color: #fff;
      text-align: center;
      padding-top: 8px;
      background: @c-button;
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
  .tableTotal {
    padding: 0 30px 20px;
    display: flex;
    justify-content: space-between;
    color: #989898;
  }
  .tables {
    margin: 0 20px 40px;
  }
}
</style>
