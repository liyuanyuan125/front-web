<template>
  <div class="page bgHei">
    <com-statu :statuCode="statuCode"></com-statu>
    <div class="content">
      <h3>登录信息</h3>
      <ul>
        <li class="flex-box" v-for="item in loginMes">
          <div>{{item.label}}</div>
          <p>{{item.name}}</p>
        </li>
      </ul>
      <h3>公司信息</h3>
      <dl>
        <dd v-for="item in company">
          <div>{{item.label}}</div>
          <p>{{item.name}}</p>
        </dd>
      </dl>
      <h3>开户信息</h3>
      <ul>
        <li class="flex-box" v-for="item in opens.list">
          <div>{{item.label}}</div>
          <p>{{item.name}}</p>
        </li>
        <li class="flex-box">
          <div>{{opens.imgs.label}}</div>
          <p>
            <img class="imgs" v-for="item in opens.imgs.list" :src="item" alt="alias" width="150px">
          </p>
        </li>
      </ul>
    </div>
    <div class="accountList">
      <h3>账号变更记录</h3>
      <Table :columns="column" :data="dataList" stripe disabled-hover></Table>
      <div class="tableSubmit">
        <button class="submitBtn">
          <router-link tag="span" :to="{ name: 'account-info-edit' }">修改信息</router-link>
        </button>
        <button class="submitBtn" @click="handleInforma">变更账号</button>
      </div>
    </div>
    <div class="btnCenter" v-if="false">
      <button class="submitBtn">
        <router-link tag="span" :to="{ name: 'account-info-edit' }">修改信息</router-link>
      </button>
    </div>

    <dlgChange v-model="model" v-if="model.visibleMess"></dlgChange>
    <dlgInforma v-model="informa" v-if="informa.visibleInforma"></dlgInforma>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { infoIndex } from '@/api/info'
import comStatu from './status.vue'
import dlgChange from './dlgChange.vue'
import dlgInforma from './dlgInformation.vue'

@Component({
  components: {
    comStatu,
    dlgChange,
    dlgInforma
  }
})
export default class Main extends ViewBase {
  statuCode = 0
  model = {
    visibleMess: false,
    changelist: {
      name: '北京智能',
      type: '公司账号',
      type2: 'xxxxx',
      code: '88888888888888888',
      img: []
    }
  }
  column = [
    { title: '变更编号', key: 'id' },
    { title: '账号变更提交时间', key: 'times' },
    {
      title: '变更前信息',
      key: 'front',
      render: (h: any, params: any) => {
        return h('div', [
          h(
            'a',
            {
              style: {
                color: '#2481D7'
              },
              on: {
                click: () => {
                  this.model.visibleMess = true
                }
              }
            },
            params.row.front
          )
        ])
      }
    },
    {
      title: '变更后信息',
      key: 'after',
      render: (h: any, params: any) => {
        return h('div', [
          h(
            'a',
            {
              style: {
                color: '#2481D7'
              },
              on: {
                click: () => {
                  this.model.visibleMess = true
                }
              }
            },
            params.row.front
          )
        ])
      }
    },
    { title: '审核状态', key: 'status' },
    { title: '备注', key: 'remarks' }
  ]
  dataList = [
    {
      id: 'John Brown1',
      times: '2016-10-03 9:00:00',
      front: '点击查看',
      after: '点击查看',
      status: '1',
      remarks: '/'
    },
    {
      id: 'John Brown2',
      times: '2016-10-03 9:00:00',
      front: '点击查看',
      after: '点击查看',
      status: '1',
      remarks: '/'
    },
    {
      id: 'John Brown3',
      times: '2016-10-03 9:00:00',
      front: '点击查看',
      after: '点击查看',
      status: '1',
      remarks: '/'
    }
  ]

  loginMes = [
    { label: '账号类型', name: '公司信息/资源方' },
    { label: '账号ID', name: '22' },
    { label: '登录账号', name: 'xxxx.$com' }
  ]

  company = [
    { label: '公司名称', name: '公司信息/资源方' },
    { label: '账号ID', name: '22' },
    { label: '登录账号', name: 'xxxx.$com' },
    { label: '账号ID', name: '22' },
    { label: '登录账号', name: 'xxxx.$com' }
  ]

  opens = {
    list: [
      { label: '资质类型', name: '公司信息/资源方' },
      { label: '账号ID', name: '22' }
    ],
    imgs: {
      label: '资源图片',
      list: [
        'https://file.iviewui.com/iview-admin/login_bg.jpg',
        'https://file.iviewui.com/iview-admin/login_bg.jpg',
        'https://file.iviewui.com/iview-admin/login_bg.jpg'
      ]
    }
  }

  informa = {
    visibleInforma: false
  }

  async mounted() {
    // try {
    //   const {
    //     data: { user }
    //   } = await infoIndex()
    // } catch (ex) {}
  }

  handleInforma() {
    this.informa.visibleInforma = true
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

@c-bg: #fff;
.compad {
  padding: 20px 0 20px 30px;
}
.comli {
  padding-bottom: 20px;
  font-size: 14px;
  color: @c-sub-text;
}

.tableSubmit {
  text-align: center;
  & > button:last-child {
    margin-left: 20px;
  }
}
.content {
  background: @c-bg;
  h3 {
    font-size: 14px;
    height: 50px;
    line-height: 50px;
    padding-left: 30px;
    background: @c-head-bg;
  }
  ul {
    .compad;
    li {
      .comli;
      div {
        width: 80px;
      }
      p {
        color: @c-text;
        .imgs {
          margin-right: 20px;
        }
      }
    }
  }
  dl {
    .compad;
    height: 152px;
    dd {
      width: 50%;
      float: left;
      .comli;
      div {
        width: 80px;
        float: left;
      }
      p {
        color: @c-text;
      }
    }
  }
}

.accountList {
  h3 {
    font-size: 14px;
    height: 50px;
    line-height: 50px;
    padding-left: 30px;
    background: @c-head-bg;
  }
  .ivu-table-wrapper {
    margin: 30px 20px 20px;
  }
}
</style>
