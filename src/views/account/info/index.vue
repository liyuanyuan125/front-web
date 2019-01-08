<template>
  <div class="page home-bg">
    <com-statu :statuCode="displayStatus"></com-statu>
    <div class="content">
      <h3 class="layout-title">登录信息</h3>
      <Row class="text-rows">
        <Col :span="12">
          <p>
            <label>账号类型</label>
            {{company.typeList}}
          </p>
          <p>
            <label>账号ID</label>
            {{account.id}}
          </p>
          <p>
            <label>登录邮箱</label>
            {{account.email}}
          </p>
        </Col>
      </Row>

      <h3 class="layout-title">公司信息</h3>
      <Row class="text-rows">
        <Col :span="12">
          <p>
            <label>公司名称</label>
            {{company.name}}
          </p>
          <p>
            <label>公司所在地</label>
            {{company.provinceName}}{{account.cityName}}
          </p>
        </Col>
        <Col :span="12">
          <p>
            <label>联系人</label>
            {{account.name}}
          </p>
          <p>
            <label>手机号码</label>
            {{account.mobile}}
          </p>
          <p>
            <label>邮箱</label>
            {{account.email}}
          </p>
        </Col>
      </Row>

      <h3 class="layout-title">开户信息</h3>
      <Row class="text-rows">
        <Col :span="24">
          <p>
            <label>资质类型</label>
            {{company.qualificationType}}
          </p>
          <p>
            <label>资质编号</label>
            {{company.qualificationCode}}
          </p>
          <p class="flex-box">
            <label>资质图片</label>
            <em>
              <img :src="item" v-for="item in company.images" width="150px">
            </em>
          </p>
        </Col>
      </Row>
    </div>

    <!-- 审核以通过 -->
    <div class="accountList" v-if="false">
      <h3 class="layout-title">账号变更记录</h3>
      <Table :columns="column" :data="dataList" stripe disabled-hover></Table>
      <div class="btnCenter sumbit-button">
        <button class="button-ok button-offset">
          <router-link tag="span" :to="{ name: 'account-info-accedit' }">修改信息</router-link>
        </button>
        <button class="button-ok" @click="handleInforma">变更账号</button>
      </div>
    </div>

    <div class="btnCenter sumbit-button">
      <button class="button-ok">
        <router-link tag="span" :to="{ name: 'account-info-edit' }">修改信息</router-link>
      </button>
    </div>

    <dlgChange v-model="queryDetail" v-if="queryDetail.visibleMess"></dlgChange>
    <dlgInforma v-model="informa" v-if="informa.visibleInforma"></dlgInforma>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { accountDetail } from '@/api/account'
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
  displayStatus = 0
  account = {}
  company = {}
  systemList = {}

  queryDetail: any = {
    visibleMess: false,
    changelist: {
      name: '北京智能',
      type: '公司账号',
      type2: 'xxxxx',
      code: '88888888888888888',
      img: [
        'https://file.iviewui.com/iview-admin/login_bg.jpg',
        'https://file.iviewui.com/iview-admin/login_bg.jpg',
        'https://file.iviewui.com/iview-admin/login_bg.jpg'
      ]
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
                  this.queryDetail.title = '账号变更前信息'
                  this.queryDetail.visibleMess = true
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
                  this.queryDetail.title = '账号变更后信息'
                  this.queryDetail.visibleMess = true
                }
              }
            },
            params.row.front
          )
        ])
      }
    },
    { title: '审核状态', key: 'status' },
    {
      title: '备注',
      key: 'remarks',
      render: (h: any, params: any) => {
        const { row } = params
        if (row.remarks.length > 10) {
          const splitText = row.remarks.substr(0, 10) + '.......'
          return h(
            'Tooltip',
            {
              props: {
                placement: 'top',
                content: row.remarks,
                maxWidth: '200px'
              }
            },
            splitText
          )
        } else {
          return h('span', {}, row.remarks)
        }
      }
    }
  ]

  dataList = [
    {
      id: 'John Brown1',
      times: '2016-10-03 9:00:00',
      front: '点击查看',
      after: '点击查看',
      status: '1',
      remarks:
        '北京智能广宣科技有限公司北京智能广宣科技有限公司北京智能广宣科技有限公司'
    },
    {
      id: 'John Brown2',
      times: '2016-10-03 9:00:00',
      front: '点击查看',
      after: '点击查看',
      status: '1',
      remarks: '北京智能广宣科技有限公司'
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

  informa = {
    visibleInforma: false
  }
  opens = {
    list: [
      'https://file.iviewui.com/iview-admin/login_bg.jpg',
      'https://file.iviewui.com/iview-admin/login_bg.jpg',
      'https://file.iviewui.com/iview-admin/login_bg.jpg'
    ]
  }

  async mounted() {
    try {
      const { data } = await accountDetail()
      this.account = data.account
      this.company = data.company
      this.systemList = data.systemList
      this.displayStatus = data.company.displayStatus
    } catch (ex) {
      ((this as any)[`onSubmit${ex.code}`] || this.handleError).call(this, ex)
    }
  }

  handleInforma() {
    this.informa.visibleInforma = true
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

.sumbit-button {
  padding: 30px 0 50px;
}
</style>
