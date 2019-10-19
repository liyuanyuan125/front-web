<template>
  <div class="bill-detail">
    <div class="bill-modal-content">
      <div class="title bottom-40">基本信息</div>
      <ul class="flex-box row-items">
        <li class="flex-box"><em>影院名称</em><span>{{items.cinemaName}}</span></li>
        <li class="flex-box"><em>日期</em><span>{{FormatDateTime}}</span></li>
        <li class="flex-box"><em>曝光人次/人</em><span>{{readableThousands(items.personCount) || '-'}}</span></li>
      </ul>
       <ul class="flex-box row-items">
        <li class="flex-box"><em>广告片数量</em><span>{{items.videoCount}}</span></li>
         <li class="flex-box"><em>状态</em>
           <span v-if='items.billStatus == 1'>待平台确认</span>
            <span v-if='items.billStatus == 2'>待审核</span>
            <span v-if='items.billStatus == 3'>审核失败</span>
            <span v-if='items.billStatus == 4 && items.invoiceStatus == 1 && items.payStatus == 1'>待结算</span>
            <span v-if='items.billStatus == 4 && items.invoiceStatus == 1 && items.payStatus == 2'>已结算</span>
            <span v-if='items.billStatus == 4 && items.invoiceStatus == 2 && items.payStatus == 1'>待登记发票</span>
            <span v-if='items.billStatus == 4 && items.invoiceStatus == 2 && items.payStatus == 2'>已结算,待登记发票</span>
            <span v-if='items.billStatus == 4 && items.invoiceStatus == 3 && items.payStatus == 1'>待结算</span>
            <span v-if='items.billStatus == 4 && items.invoiceStatus == 3 && items.payStatus == 2'>已结算</span>
           <!-- <span v-for="it in billStatusList" :key="it.key" v-if="it.key == items.billStatus">{{it.text}}</span> -->
        </li>
        <li class="flex-box"><em>预计结算金额</em><span>{{formatNumber(items.amount)}}</span></li>
      </ul>
    </div>

    <div class="bill-modal-content">
      <div class="title bottom-20">广告片列表</div>
      <Table :columns="column" :data="dataList" disabled-hover>
        <!-- 是否通投 0通投 1-未通投-->
        <template slot="playMonitorTexts" slot-scope="{row}">
          <span v-if="row.playMonitorStatus == 4" class="status-error">{{row.playMonitorTexts}}</span>
          <span v-else class="status-pass">{{row.playMonitorTexts}}</span>
        </template>
        <template slot="movieName" slot-scope="{row: {movieName, movieCustom}}">
          <span v-if="movieCustom == 0">通投</span>
          <span v-else>{{movieName}}</span>
        </template>

      </Table>

      <Page
      :total="total"
      v-if="total>0"
      class="page-cover"
      :current="pageIndex"
      :page-size="pageSize"
      show-total
      @on-change="handlepageChange"
      @on-page-size-change="handlepageChange"
    />
    </div>

    <!-- resourceInvoiceStatus = 3 代表已登记 -->
    <div class="bill-modal-content" v-if="items.resourceInvoiceStatus == 3">
      <div class="title bottom-20">发票详情</div>
      <div class="flex-box detail-items">
        <ul>
          <li><em>公司名称</em>{{items.companyName}}</li>
          <li><em>公司地址</em>{{items.companyAddress}}</li>
          <li><em>开户银行</em>{{items.accountBank}}</li>
          <li><em>发票编号</em>{{items.invoiceNo}}</li>
          <li><em>发票日期</em>{{intDate(items.invoiceDate)}}</li>
          <li><em>发票内容</em>
            <i v-for="it in invoiceContentCodeList" :key="it.key" v-if="it.key == items.invoiceContentCode">{{it.text}}</i>
          </li>
          <li><em>快递公司</em>{{items.expressCompany || '-'}}</li>
        </ul>
        <ul>
          <li><em>纳税人识别号</em>{{items.taxPayerNo || '-'}}</li>
          <li><em>公司电话</em>{{items.companyPhone || '-'}}</li>
          <li><em>账户</em>{{items.accountNumber || '-'}}</li>
          <li><em>发票类型</em>
            <i v-for="it in invoiceTypeCodList" :key="it.key" v-if="it.key == items.invoiceType">{{it.text}}</i>
          </li>
          <li><em>发票金额</em>{{formatNumber(items.invoiceAmount) || '-'}}</li>
          <li><em>快递单号</em>{{items.expressNo || '-'}}</li>
        </ul>
      </div>
    </div>

    <div class="bill-modal-content">
      <div class="title bottom-20">操作日志</div>
      <Table :columns="columnLog" :data="dataLog" disabled-hover></Table>
    </div>

    <div class="bill-modal-content" v-if="audit">
       <div class="title bottom-20">审核操作</div>
        <Form ref="form" :model="form" :rules="rule" :label-width="115" class="audit-form">
          <Row  >
            <Col :span="12">
                  <FormItem label="账单人次">
                    <div class="account-count">{{items.personCount}}</div>
                  </FormItem>
                  <FormItem label="审核意见">
                     <RadioGroup v-model="agree">
                          <Radio :label="1">审核通过</Radio>
                          <Radio :label="0">审核拒绝</Radio>
                      </RadioGroup>
                  </FormItem>
                  <FormItem v-if="!agree" class="person-count" prop="resourcePersonCount" label="影城系统人次">
                    <span class="span-input"><Input type="number" v-model="form.resourcePersonCount" /> 人</span>
                  </FormItem>
                  <FormItem v-if="!agree" class="person-count" label="影城金额">
                    <span class="span-input"><Input type="number" v-model="form.resourceAmount" /> 元</span>
                  </FormItem>
                  <FormItem v-if="!agree" label="影城系统截图">
                    <span class="audit-upload">
                      <Upload v-model="form.pictures" :max-count="8" multiple accept="images/*" confirm-on-del/>
                        <div class="upload-tip">请上传格式为jpg/jpeg/png，大小不超过5M的图片</div>
                  </span>
                  </FormItem>
            </Col>
            <Col :span="12">
            <FormItem label="备注" v-if="!agree">
              <Input type="textarea" style="width: 90%" v-model="form.resourceRemark" :rows="5" />
            </FormItem>
            </Col>
          </Row>
        </Form>
         <div class="create-submit-btn submit-audit">
          <Button class="cancel-btn " @click="$router.push({name: 'resFinance-bill'})">取消</Button>
          <Button class="btn" @click="submitAudit('form')" >确定</Button>
        </div>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Watch, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import moment from 'moment'
import { confirm, toast, info } from '@/ui/modal'
import {intDate, readableThousands, textList, formatValidDateTime} from '@/util/dealData'
import { formatNumber } from '@/util/validateRules'
import { itemList, itemListbill, billAudit} from '@/api/bill'
import Upload, { FileItem } from '@/components/upload'
const format = 'YYYY-MM-DD HH:mm:ss'

@Component({
  components: {
    Upload
  }
})
export default class Main extends ViewBase {
  @Prop({ type: Number, default: 0}) id!: number
  @Prop({ type: Number, default: 1}) audit!: number

  pageIndex = 1
  pageSize = 20
  total = 0

  items: any = {}
  // 账单状态
  billStatusList: any[] = []
  // 发票登记
  resourceInvoiceStatusList = []
  // 发票类型
  invoiceTypeCodList = []
  // 发票内容
  invoiceContentCodeList = []

  formatNumber = formatNumber
  readableThousands = readableThousands
  intDate = intDate

  agree = 1
  form: any = {}

  column = [
    { title: '广告片名称', key: 'videoName', minWidth: 120 },
    { title: '影片名称', slot: 'movieName', minWidth: 150 },
    { title: '投放时长', key: 'specification', minWidth: 100 },
    { title: '执行开始时间', key: 'beginDate', minWidth: 160  },
    { title: '执行完成时间', key: 'endDate', minWidth: 160  },
    { title: '曝光人次', key: 'personCount', minWidth: 150  },
    { title: '结算单价（元/人次）', key: 'unitPrice', minWidth: 200  },
    { title: '金额(元)', key: 'amount', minWidth: 100  },
    { title: '监播文件', slot: 'playMonitorTexts', minWidth: 100 },
    { title: '是否结算', key: 'status', minWidth: 100  },
  ]
  dataList = []

  columnLog = [
    { title: '操作时间', key: 'createTime' },
    { title: '操作人', key: 'createName' },
    { title: '操作日志', key: 'describe' },
  ]
  dataLog = []

  get FormatDateTime() {
    const { year, month } = this.items
    const changeType = month + ''
    const mon = changeType.length > 1 ? month : `0${month}`
    return `${year}-${mon}`
  }

  get rule() {
    return {
      resourcePersonCount: [
        {
          require: true,
          trigger: 'change',
          validator(rule: any, value: string[], callback: any) {
            !value ? callback(new Error('影城系统人次不能为空')) : callback()
          }
        }
      ]
    }
  }

  mounted() {
    this.list()
    this.billDetail()
  }

  async list() {
    try {
      const { data: {
        item,
        billStatusList,
        invoiceTypeCodList,
        invoiceContentCodeList
      } } = await itemList(this.id)
      this.items = item || {}

      this.billStatusList = billStatusList || []
      this.invoiceTypeCodList = invoiceTypeCodList || []
      this.invoiceContentCodeList = invoiceContentCodeList || []

      this.dataLog = (item.resourceBillLogs || []).map( (it: any) => {
        return {
          ...it,
          createTime: formatValidDateTime(it.createTime),
        }
      })
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async billDetail() {
    try {
      const { data: {
        totalCount, items, statusList, playMonitorStatusList} } = await itemListbill(this.id, {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      })
      this.dataList = (items || []).map((it: any) => {
        return {
          ...it,
          specification: it.specification ? it.specification + 's' : '0s',
          beginDate: intDate(it.beginDate),
          endDate: intDate(it.endDate),
          personCount: readableThousands(it.personCount),
          amount: formatNumber(it.amount),
          playMonitorTexts: textList(playMonitorStatusList, [it.playMonitorStatus])[0],
          status: textList(statusList, [it.status])[0]
        }
      })
      this.total = totalCount
    } catch (ex) {
      this.handleError(ex)
    }
  }

  handlepageChange(size: any) {
    this.pageIndex = size
    this.list()
  }

  async submitAudit(dataform: any) {
    const agree = this.agree ? true : false
    if (!agree) {
      const volid = await (this.$refs[dataform] as any).validate()
      if (!volid) {
        return
      }
    }
    const pictures = (this.form.pictures || []).map((it: any) => it.fileId)
    try {
      const { data } = await billAudit({
        ...this.form,
        agree,
        id: this.id,
        pictures
      })
      this.$router.push({name: 'resFinance-bill'})
    } catch (ex) {
      this.handleError(ex)
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/views/kol/less/common.less';
@import '~@/views/pop/film/com.less';
@import '~@/views/resFinance/less/page.less';

.detail-items {
  font-size: 14px;
  color: #00202d;
  ul {
    flex: 1;
    li {
      display: flex;
      padding-bottom: 20px;
      em {
        color: rgba(0, 32, 45, 0.7);
        width: 120px;
      }
    }
  }
}
.submit-audit {
  margin-bottom: 30px;
}
.status-pass {
  color: #5f961f;
}
.status-error {
  color: #e86267;
}
.bottom-40 {
  padding-bottom: 40px;
}
.bottom-20 {
  padding-bottom: 20px;
}
.bill-detail {
  padding: 54px 56px 38px 38px;
}
.bill-modal-content {
  background: rgba(255, 255, 255, .6);
  border-radius: 5px;
  padding: 30px 40px 10px;
  margin-bottom: 30px;
  .title {
    font-size: 24px;
    color: #00202d;
  }
}
.row-items {
  font-size: 16px;
  color: #00202d;
  li {
    flex: 1;
    padding-bottom: 30px;
  }
  em {
    display: block;
    width: 116px;
    color: rgba(0, 32, 45, .7);
  }
  .remark {
    display: block;
    width: 100%;
  }
}

/deep/ .audit-form {
  .account-count {
    padding-top: 4px;
  }
  .ivu-form-item-content {
    font-size: 14px;
  }
  .ivu-input-wrapper {
    width: auto;
    margin-right: 10px;
  }
  .ivu-form-item-label {
    font-size: 15px;
    color: #00202d;
    padding: 13px 15px 0 0;
  }
  .ivu-input {
    background: rgba(255, 255, 255, 0.8);
    font-size: 14px;
    border-radius: 5px;
  }
  .person-count {
    .span-input {
      display: flex;
      align-items: center;
    }
    .ivu-input {
      width: 200px;
      height: 40px;
    }
  }
}
/deep/ .ivu-table-wrapper {
  margin: 0;
}
/deep/ .ivu-table {
  background: none;
}
/deep/ .ivu-table th,
/deep/ .ivu-table-header {
  background: #fff;
  height: 40px;
  color: rgba(0, 32, 45, 1);
  font-size: 15px;
  font-weight: 400;
}

/deep/ .ivu-table td {
  background: none;
  transition: background-color 0.2s ease-in-out;
  font-size: 13px;
  font-weight: 400;
  color: rgba(0, 32, 45, 1);
  height: 60px;
}

/deep/ .ivu-radio-wrapper {
  font-size: 14px;
}

.upload-box {
  background: none;
}
.upload-tip {
  font-size: 14px;
}
</style>
