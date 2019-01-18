<template>
  <div class="page home-bg">
    <com-statu :statuCode="displayStatus" v-if="displayStatus != 5"></com-statu>
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
            {{queryTypeList(company.qualificationType)}}
          </p>
          <p>
            <label>资质编号</label>
            {{company.qualificationCode}}
          </p>
          <p class="flex-box">
            <label>资质图片</label>
            <em class="flex-box">
              <ImagePreviewer v-for="(item, i) in company.images" :key="i"
                :url="item.url" class="qualification-image"/>
            </em>
          </p>
        </Col>
      </Row>
    </div>

    <!-- 审核以通过 displayStatus == 3  -->
    <div class="accountList" v-if="displayStatus == 3">
      <h3 class="layout-title">账号变更记录</h3>
      <Table :columns="column" :data="dataList" stripe disabled-hover></Table>
      <div class="btnCenter sumbit-button">
        <Button class="button-ok button-offset" type="primary">
          <router-link tag="span" :to="{ name: 'account-info-accedit' }">修改信息</router-link>
        </Button>
        <Button type="primary" class="button-ok" @click="informa.visibleInforma = true">变更账号</Button>
      </div>
    </div>

    <div class="btnCenter sumbit-button" v-else>
      <Button class="button-ok" type="primary">
        <router-link tag="span" :to="{ name: 'account-info-edit' }">修改信息</router-link>
      </Button>
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
import { formatTimes } from '@/util/validateRules'
import comStatu from './status.vue'
import dlgChange from './dlgChange.vue'
import dlgInforma from './dlgInformation.vue'
import ImagePreviewer from '@/components/imagePreviewer'

@Component({
  components: {
    comStatu,
    dlgChange,
    dlgInforma,
    ImagePreviewer
  }
})
export default class Main extends ViewBase {
  displayStatus: any = 5
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
    visibleInforma: false,
    qualificationTypeList: []
  }

  column = [
    { title: '变更编号', key: 'id' },
    { title: '账号变更提交时间', key: 'timeName' },
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
        if (row.remark && row.remark.length > 10) {
          const splitText = row.remark.substr(0, 10) + '.......'
          return h(
            'Tooltip',
            {
              props: {
                placement: 'top',
                content: row.remark,
                maxWidth: '200px'
              }
            },
            splitText
          )
        } else if (!row.remark) {
           return h('span', {}, '/')
        } else {
          return h('span', {}, row.remark)
        }
      }
    }
  ]

  dataList = []

  async mounted() {
    try {
      const { data } = await accountDetail()
      this.displayStatus = data.company.displayStatus - 1
      this.account = data.account
      this.company = data.company
      this.systemList = data.systemList
      this.informa.qualificationTypeList = data.qualificationTypeList

      this.queryAccuontList()
    } catch (ex) {
      this.handleError(ex)
    }
    // 审核后 账号变更记录
    this.accountChangeList()
  }
  queryAccuontList() {
    // 账号类型转换
    let array:any[] = []
    this.account.systems.map( (item: any) => {
     const a = this.systemList.filter( (sys: any) => {
       if (sys.code == item) {
        array.push(sys.desc)
         return sys.desc
       }
     })
    })
    this.accountType = array.length > 1 ? `${array[0]} / ${array[1]}` : array.toString()
  }
  queryTypeList(val: any) {
    // 查询资质类型
    let list: any = this.informa.qualificationTypeList
    for ( let i =0; i<list.length; i++) {
      if (list[i].code == val) {
        return list[i].desc
      }
    }
  }

  async accountChangeList() {
    const { data } = await accountChangeList()
    data.map( (item: any) => {
      item.timeName = formatTimes(item.submitTime)
    })
    this.dataList = data
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

  // setErrorImg(e: any) {
  //   e.target.src = 'https://file.iviewui.com/iview-admin/login_bg.jpg'
  // }
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

.qualification-image {
  width: 150px;
  margin-right: 25px;
}
</style>
