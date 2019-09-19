<template>
  <div class="page home-bg as">
    <com-statu :statuCode="displayStatus" v-if="displayStatus != 5"></com-statu>
    <div class="content">
      <div class="bs" v-if="company.companyType == 1">
        <Button type="primary" class="button-ok bok"  :to="{ name: 'account-info-accedit' }" >修改</Button>
        <h3 class="layout-title">公司信息</h3>
        <Row class="text-rows" >
          <Col :span="12">
            <p>
              <label class="hui">公司名称</label>
              {{company.name}}
            </p>
            <p>
              <label class="hui">公司所在地</label>
              {{company.provinceName}} / {{company.cityName}}
            </p>
            <p>
              <label class="hui">管理账号</label>
              {{account.name}}({{account.mobile}})
            </p>
          </Col>
          <Col :span="12">
            <p>
              <label class="hui">联系人</label>
              {{company.contact || '-'}}
            </p>
            <p>
              <label class="hui">手机号码</label>
              {{company.contactTel || '-'}}
            </p>
            <p>
              <label class="hui">邮箱</label>
              {{company.email || '-'}}
            </p>
          </Col>
        </Row>
      </div>
      <div class="bs">
        <Button  v-if="displayStatus == 3"  type="primary" class="button-ok bok" @click="handleInforma" >修改</Button>
        <h3 class="layout-title">开户信息</h3>
        <Row class="text-rows">
          <Col :span="24">
            <p v-if="company.companyType == 1">
              <label class="hui">资质类型</label>
              <span v-for="item in qualificationTypeList" :key="item.code" v-if="item.code == company.qualificationType">{{item.desc}}</span>
            </p>
            <p v-else>
              <label class="hui">资质类型</label>
              <span v-for="item in personQualificationTypeList" :key="item.code" v-if="item.code == company.qualificationType">{{item.desc}}</span>
            </p>

            <p>
              <label class="hui">资质编号</label>
              {{company.qualificationCode}}
            </p>
            <p class="flex-box">
              <label class="hui">资质图片</label>
              <em class="flex-box">
                <ImagePreviewer
                  v-for="(item, i) in company.images"
                  :key="i"
                  :url="item.url"
                  class="qualification-image"
                />
              </em>
            </p>
          </Col>
        </Row>
      </div>
    </div>

    <!-- 审核以通过 displayStatus == 3  -->
    <div class="accountList" v-if="displayStatus == 3">
      <h3 class="layout-title">账号变更记录</h3>
      <Table :columns="column" :data="dataList" disabled-hover>
        <template slot="changeBefore" slot-scope="{row}">
          <a class="detail-list" @click="changeDetail(row.changeBefore, '变更前信息')">点击查看</a>
        </template>
        <template slot="changeEnd" slot-scope="{row}">
          <a class="detail-list" @click="changeDetail(row.changeEnd, '变更后信息')">点击查看</a>
        </template>
        <template slot="remark" slot-scope="{row}">
          <span v-if="!row.remark">/</span>
          <Tooltip v-else :content="row.remark">{{handleSplit(row.remark)}}</Tooltip>
        </template>
      </Table>
    </div>

    <dlgChange v-model="queryDetail" v-if="queryDetail.visibleMess"></dlgChange>

    <dlgInforma
      v-model="informa"
      v-if="informa.visibleInforma"
      @updataChangeList="updataChangeList"
    ></dlgInforma>
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
  // systemList: any = []

  detailDate: any = []

  // 公司信息变更记录
  queryDetail: any = {
    visibleMess: false,
    changelist: {}
  }

  // 审核后修改公司信息
  informa = {
    visibleInforma: false,
    dataList: []
  }

  qualificationTypeList = [] // 资质类型
  personQualificationTypeList = [] // 身份证

  column = [
    { title: '变更编号', key: 'id' },
    { title: '账号变更提交时间', key: 'timeName', minWidth: 120 },
    { title: '变更前信息', slot: 'changeBefore' },
    { title: '变更后信息', slot: 'changeEnd' },
    { title: '审核状态', key: 'status' },
    { title: '备注',  slot: 'remark'}
  ]

  dataList = []

  async mounted() {
    this.detailList()
  }

  async detailList() {
     try {
      const { data } = await accountDetail()
      this.detailDate = data
      this.displayStatus = data.company.displayStatus - 1
      this.account = data.account
      this.company = data.company
      // this.systemList = data.systemList
      this.qualificationTypeList = data.qualificationTypeList || []
      this.personQualificationTypeList = data.personQualificationTypeList || []

      // this.queryAccuontList()
    } catch (ex) {
      this.handleError(ex)
    }
    // 审核后 账号变更记录
    this.accountChangeList()
  }

  handleSplit(val: any) {
    const remark = val.length > 10 ? val.substr(0, 10) + '.......' : val
    return remark
  }

  updataChangeList() {
    this.informa.visibleInforma = false
    // this.detailList()
  }

  // queryAccuontList() {
  //   // 账号类型转换
  //   const array: any[] = []
  //   this.account.systems.map((item: any) => {
  //     const a = this.systemList.filter((sys: any) => {
  //       if (sys.code == item.code) {
  //         array.push(sys.desc)
  //         return sys.desc
  //       }
  //     })
  //   })
  // }

  async accountChangeList() {
    try {
      const { data } = await accountChangeList()
      data.map((item: any) => {
        item.timeName = formatTimes(item.submitTime)
      })
      this.dataList = data
    } catch (ex) {
      this.handleError(ex)
    }
  }

  changeDetail(list: any, title: string) {
    this.queryDetail = {
      title,
      changelist: list,
      visibleMess: true,
      companyType: this.company.companyType
    }
  }

  handleInforma() {
    this.informa = {
      visibleInforma: true,
      dataList: this.detailDate
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
@import '~@/views/account/less/common.less';

.as {
  background: rgba(255, 255, 255, 0);
  padding: 20px 30px 0 30px;
  position: relative;
}

.stateContent {
  padding: 50px 0 50px 60px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
}

.layout-title {
  background: rgba(255, 255, 255, 0);
  font-size: 24px;
  font-weight: 500;
  color: rgba(0, 32, 45, 1);
  margin-top: 10px;
}

.bs {
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 30px;
  background: rgba(255, 255, 255, 0.3);
  position: relative;
}

.hui {
  color: rgba(0, 32, 45, 0.7);
}

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

.accountList {
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 30px;
  background: rgba(255, 255, 255, 0.3);
}

.bok {
  width: 200px;
  height: 50px;
  border-radius: 25px;
  color: #fff;
  position: absolute;
  right: 10px;
  z-index: 999;
  top: 10px;
  line-height: 38px;
}

/deep/ .ivu-table th,
/deep/ .ivu-table-header {
  background: rgba(216, 236, 240, 1);
  height: 40px;
  line-height: 40px;
  color: rgba(0, 32, 45, 1);
  font-size: 15px;
  font-weight: 400;
}

/deep/ .ivu-table td {
  background: rgba(159, 208, 219, 1);
  transition: background-color 0.2s ease-in-out;
  font-size: 13px;
  font-weight: 400;
  color: rgba(0, 32, 45, 1);
  height: 50px;
  line-height: 50px;
}

/deep/ .ivu-table-stripe .ivu-table-body tr.ivu-table-row-hover td {
  background: rgba(159, 208, 219, 1);
}

/deep/ .ivu-table-body {
  background: rgba(159, 208, 219, 1);
}

/deep/ .ivu-table-wrapper {
  margin: 20px 30px 20px;
  border: none;
}

/deep/ .ivu-table-tip {
  overflow-x: auto;
  overflow-y: hidden;
  background: rgba(159, 208, 219, 1);
}
</style>
