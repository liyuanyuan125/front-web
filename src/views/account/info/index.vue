<template>
  <div class="page home-bg">
    <com-statu :statuCode="displayStatus"></com-statu>
    <div class="content">
      <h3 class="layout-title">登录信息</h3>
      <Row class="text-rows">
        <Col :span="12">
          <p>
            <label>账号类型</label>
            {{accountType}}
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
            {{company.provinceName}} / {{company.cityName}}
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
              <!-- <img :src="item" v-for="item in company.images"  width="150px"
              @error="setErrorImg">-->
            </em>
          </p>
        </Col>
      </Row>
    </div>

    <!-- 审核以通过  displayStatus == 4 -->
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

    <div class="btnCenter sumbit-button" v-else>
      <button class="button-ok">
        <router-link tag="span" :to="{ name: 'account-info-edit' }">修改信息</router-link>
      </button>
    </div>

    <dlgChange v-model="queryDetail" v-if="queryDetail.visibleMess"></dlgChange>
    <dlgInforma v-model="informa" v-if="informa.visibleInforma"></dlgInforma>
  </div>
</template>

<script lang="tsx">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { accountDetail, accountChangeList } from '@/api/account'
import jsxReactToVue from '@/util/jsxReactToVue'
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
  account: any = {}
  company: any = {}
  systemList: any = []
  accountType = ''

  // 公司信息变更记录
  queryDetail: any = {
    visibleMess: false,
    changelist: {}
  }
  // 审核后修改公司信息
  informa = {
    visibleInforma: false
  }

  column = [
    { title: '变更编号', key: 'id' },
    { title: '账号变更提交时间', key: 'submitTime' },
    {
      title: '变更前信息',
      key: 'changeBefore',
      render: (hh: any, { row }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        return (
          <a
            on-click={this.beforeChange.bind(this, row.changeBefore)}
            class="detail-list">
            点击查看
          </a>
        )
        /* tslint:disable */
      }
    },
    {
      title: '变更后信息',
      key: 'changeEnd',
      render: (hh: any, { row }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        return (
          <a
            on-click={this.afterChange.bind(this, row.changeEnd)}
            class="detail-list">
            点击查看
          </a>
        )
        /* tslint:disable */
      }
    },
    { title: '审核状态', key: 'status' },
    {
      title: '备注',
      key: 'remark',
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
  dataList = []

  async mounted() {
    try {
      const { data } = await accountDetail()
      this.account = data.account
      this.company = data.company
      this.displayStatus = data.company.displayStatus - 1
      this.systemList = data.systemList

      const accountType = this.account.systems.map((item: any, index: any) => {
        if (this.systemList[index].code == item) {
          return this.systemList[index].desc
        }
      })
      this.accountType =
        accountType.length > 1
          ? `${accountType[0]} / ${accountType[1]}`
          : accountType.toString()
    } catch (ex) {
      this.handleError(ex)
    }
    this.accountChangeList()
  }
  async accountChangeList() {
    const { data } = await accountChangeList()
  }
  beforeChange(list: any) {
    this.queryDetail = {
      title: '账号变更前信息',
      changelist: list,
      visibleMess: true
    }
  }
  afterChange(list: any) {
    this.queryDetail = {
      title: '账号变更后信息',
      changelist: list,
      visibleMess: true
    }
  }
  handleInforma() {
    this.informa.visibleInforma = true
  }
  setErrorImg(e: any) {
    e.target.src = 'https://file.iviewui.com/iview-admin/login_bg.jpg'
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
.detail-list {
  color: #2481d7;
}
.sumbit-button {
  padding: 30px 0 50px;
}
</style>
