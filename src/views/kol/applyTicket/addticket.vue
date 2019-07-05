<template>
  <div class="pages">
    <Form
        :model="query"
        ref="query"
        :rules="rule"
        label-position="left"
        :label-width="100"
        class="edit-input"
      >
     <Row>
       <Col class='box'>
         <Row>
           <Col class='fa-m' :span='12'>开票方： <span>北京智能广宣有限公司</span></Col>
           <Col v-if='this.$route.params.edit == "0" ' class='fa-m' :span='12'>发票总额：  <span style='font-size: 23px;'>￥<number :addNum='Number(this.list.totalTaxFee)' /></span></Col>
           <Col v-if='this.$route.params.key == "0" ' class='fa-m' :span='12'>发票总额：  <span style='font-size: 23px;'>￥<number :addNum='Number(this.money)' /></span></Col>
         </Row>
         <Row style='margin-top: 10px;'><span class='bx'>*</span>
          <!--  <Col :span='4' style='margin-top: 5px;width: 100px；'>发票内容：</Col>
           <Col :span='6'>
             <Select v-model="query.itemCode" placeholder="发票内容" filterable
                clearable class="component" >
                <Option v-for="it in faList" :key="it.key" :value="it.key"
                  :label="it.text" class="flex-box">
                  <span>{{it.text}}</span>
                </Option>
              </Select>
           </Col> -->
           <FormItem label="发票内容" prop="itemCode">
            <Select v-model="query.itemCode" placeholder="发票内容" filterable
                clearable class="component" >
                <Option v-for="it in faList" :key="it.key" :value="it.key"
                  :label="it.text" class="flex-box">
                  <span>{{it.text}}</span>
                </Option>
              </Select>
           </FormItem>
         </Row>
         <Row style='margin-top: 16px;'><span class='bx'>*</span>
           <!-- <Col :span='4' style='margin-top: 5px;width: 100px；'>发票类型</Col>
           <Col :span='20'>
             <RadioGroup v-model="query.invoiceType" >
              <Radio v-for="it in faType"  :key="it.key" :value="it.key" :label="it.key">{{it.text}}</Radio>
            </RadioGroup>
           </Col> -->
           <FormItem label="发票类型" prop="invoiceType">
            <RadioGroup v-model="query.invoiceType" @on-change='ass'>
              <Radio v-for="it in faType"  :key="it.key" :value="it.key" :label="it.key">{{it.text}}</Radio>
            </RadioGroup>
          </FormItem>
         </Row>
         <Row style='margin-top: 4px;'><span class='bx'>*</span>
           <!-- <Col :span='4' style='margin-top: 5px;width: 100px；'>抬头类型</Col>
           <Col :span='20'>
             <RadioGroup v-model="query.customerType" >
              <Radio v-for="it in taiType"  :key="it.key" :value="it.key" :label="it.key">{{it.text}}</Radio>
            </RadioGroup>
           </Col> -->
           <FormItem label="抬头类型" prop="customerType">
            <RadioGroup v-model="query.customerType" >
              <Radio v-for="it in taiType"  :key="it.key" :value="it.key" :label="it.key">{{it.text}}</Radio>
            </RadioGroup>
          </FormItem>
          </Row>
          <Row style='margin-top: 19px;'><span class='bx'>*</span>
           <!-- <Col :span='4' style='margin-top: 5px;'>发票抬头
           </Col>
           <Col :span='20'>
            <Input  v-model="query.name" ></Input>
           </Col> -->
           <FormItem label="发票抬头" prop="name">
            <Input v-model="query.name"></Input>
          </FormItem>
          </Row>
          <Row style='margin-top: 27px;'><span class='bx'>*</span>
           <!-- <Col :span='4' style='margin-top: 5px;'>税号
           </Col>
           <Col :span='20'>
            <Input  v-model="query.taxId" placeholder=''></Input>
           </Col> -->
           <FormItem label="税号" prop="taxId">
            <Input v-model="query.taxId"></Input>
          </FormItem>
          </Row>
          <Row  style='margin-top: 27px;'>
           <!-- <Col :span='4' style='margin-top: 5px;'><span class='hui'>地址</span></Col>
           <Col :span='20'>
            <AreaSelect v-model="area" />
            <br><br>
            <Input  v-model="query.address" placeholder='请输入详细地址'></Input>
           </Col> -->
           <FormItem v-if='query.invoiceType == 1' label="地址" prop="address">
            <AreaSelect v-model="area" />
            <br><br>
            <Input  v-model="query.address" placeholder='请输入详细地址'></Input>
          </FormItem>
          <FormItem v-if='query.invoiceType == 2' label="地址" prop="">
            <AreaSelect v-model="area" />
            <br><br>
            <Input  v-model="query.address" placeholder='请输入详细地址'></Input>
          </FormItem>
          </Row>
          <Row style='margin-top: 27px;'>
           <!-- <Col :span='4' style='margin-top: 5px;'><span class='hui'>电话</span></Col>
           <Col :span='20'>
            <InputNumber  v-model="query.telphone" placeholder=''></InputNumber >
           </Col> -->
           <FormItem v-if='query.invoiceType == 1' label="电话" prop="telphone">
            <Input v-model="query.telphone"></Input>
          </FormItem>
           <FormItem v-if='query.invoiceType == 2' label="电话" prop="">
            <Input v-model="query.telphone"></Input>
          </FormItem>
          </Row>
          <Row style='margin-top: 27px;'>
           <!-- <Col :span='4' style='margin-top: 5px;'><span class='hui'>开户行</span></Col>
           <Col :span='20'>
            <Input  v-model="query.accountBank" placeholder=''></Input>
           </Col> -->
           <FormItem v-if='query.invoiceType == 1'  label="开户行" prop="accountBank">
            <Input v-model="query.accountBank"></Input>
          </FormItem>
          <FormItem v-if='query.invoiceType == 2'  label="开户行" prop="">
            <Input v-model="query.accountBank"></Input>
          </FormItem>
          </Row>
          <Row style='margin-top: 27px;'>
          <!--  <Col :span='4' style='margin-top: 5px;'><span class='hui'>开户账号</span></Col>
           <Col :span='20'>
            <Input v-model="query.accountNumber" placeholder=''></Input>
           </Col> -->
           <FormItem  v-if='query.invoiceType == 1'  label="开户账号" prop="accountNumber">
            <Input v-model="query.accountNumber"></Input>
          </FormItem>
          <FormItem  v-if='query.invoiceType == 2'  label="开户账号" prop="">
            <Input v-model="query.accountNumber"></Input>
          </FormItem>
          </Row>
          <Row style='margin-top: 27px;'>
           <!-- <Col :span='4' style='margin-top: 5px;'><span class='hui'>备注说明</span></Col>
           <Col :span='20'>
            <Input  v-model="query.memo" placeholder=''></Input>
           </Col> -->
           <FormItem label="备注说明" prop="memo">
            <Input v-model="query.memo"></Input>
          </FormItem>
          </Row>
       </Col>
       <Col class='box' style='margin-left: 3%;'>
         <Row style='height: 100px;margin-top: 16px;'>
           <Col :span='16' style='margin-top: 13px;'>
             <p class='big'>发票邮寄信息</p>
             <p class='small'>目前仅支持纸质发票，申请通过后预计3天内寄出</p>
           </Col>
           <Col :span='8'>
             <div class='img'>
               <img src="./assets/ticket.png" alt="">
             </div>
           </Col>
         </Row>
         <Row style='margin-top: 27px;'>
           <!-- <Col :span='4' style='margin-top: 5px;'>邮寄地址<span class='bx'>*</span></Col>
           <Col :span='20'>
            <AreaSelect v-model="areas" />
            <br><br>
            <Input  v-model="query.addressDetail" placeholder='请输入详细地址'></Input>
           </Col> -->
           <FormItem label="邮寄地址" prop="addressDetail">
            <AreaSelect v-model="areas" />
            <br><br>
            <Input  v-model="query.addressDetail" placeholder='请输入详细地址'></Input>
          </FormItem>
          </Row>
          <Row style='margin-top: 27px;'>
           <!-- <Col :span='4' style='margin-top: 5px;'>联系人<span class='bx'>*</span></Col>
           <Col :span='20'>
            <Input  v-model="query.contact" placeholder='为方便寄出请输入全名'></Input>
           </Col> -->
           <FormItem label="联系人" prop="contact">
            <Input v-model="query.contact"></Input>
          </FormItem>
          </Row>
          <Row style='margin-top: 27px;'>
           <!-- <Col :span='4' style='margin-top: 5px;'>联系电话<span class='bx'>*</span></Col>
           <Col :span='20'>
            <InputNumber v-model="query.contactTelphone" placeholder='请输入能正常联系的电话'></InputNumber>
           </Col> -->
           <FormItem label="联系电话" prop="contactTelphone">
            <Input v-model="query.contactTelphone"></Input>
          </FormItem>
          </Row>
          <Row style='margin-top: 27px;'>
           <!-- <Col :span='4' style='margin-top: 5px;'><span class='hui'>留言</span></Col>
           <Col :span='20'>
            <Input type='textarea' style='max-height: 200px;' v-model="query.comment" placeholder='如有特殊情况请说明'></Input>
           </Col> -->
           <FormItem label="留言" prop="comment">
            <Input type='textarea' style='max-height: 200px;' v-model="query.comment" placeholder='如有特殊情况请说明'></Input>
          </FormItem>
          </Row>
       </Col>
     </Row>
     </Form>
     <div class='button'>
       <span class='cancel' @click='cancel()'>返回</span>
       <span class='ok' @click="ok('query')">确认提交</span>
     </div>
  </div>
</template>

<script lang='ts'>
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { confirm, info } from '@/ui/modal'
import {
  queryList,
  editticket,
  addticket,
  itemlist,
  histories
} from '@/api/ticket'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { slice, clean } from '@/fn/object'
import { warning , success, toast } from '@/ui/modal'
import AreaSelect from '@/components/areaSelect'
import number from '@/components/number.vue'

@Component({
  components: {
    AreaSelect,
    number
  }
})

export default class Main extends ViewBase {
  totalCount = 0
  query: any = {
    itemCode: 1,
    totalTaxFee: 0,
    invoiceType: 1,
    customerType: 1,
    name: '',
    taxId: '',
    telphone: '',
    provinceId: 0,
    cityId  : 0,
    countyId: 0,
    address: '',
    accountBank: '',
    accountNumber: '',
    memo: '',
    contact: '',
    contactTelphone: null,
    contactProvinceId: 0,
    contactCityId: 0,
    contactCountyId: 0,
    addressDetail: '',
    comment: '',
    orderIds: [],
    orderNo: []
  }
  aaa: any = 0


  list: any = []
  area: number[] = []
  areas: number[] = []
  // 发票内容
  faList: any = []
  // 发票类型
  faType: any = []
  // 抬头类型
  taiType: any = []

  money: any =  0

  // detailList: any = {}

  mounted() {
    if (this.$route.params.edit == '0') {
      this.list = JSON.parse(sessionStorage.getItem(this.$route.params.key) as any)
      this.seach()
    } else if (this.$route.params.key == '0') {
      this.detail()
    }
  }

  ass() {
    this.aaa = this.query.invoiceType
    ; (this.$refs.query as any).resetFields()
    this.query.invoiceType = this.aaa
  }

  get rule() {
    return {
      itemCode: [
        { required: true, message: '请选择发票内容'  },
      ],
      name: [
        { required: true, message: '请输入发票抬头', trigger: 'blur' },
      ],
      taxId: [
        { required: true, message: '请输入税号', trigger: 'blur' },
      ],
      telphone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: '请输入正确的手机号码', trigger: 'blur'
          }
      ],
      accountBank: [
        { required: true, message: '请输入开户行', trigger: 'blur' },
      ],
      accountNumber: [
        { required: true, message: '请输入开户账号', trigger: 'blur' },
      ],
      memo: [
        { required: true, message: '请输入开户说明', trigger: 'blur' },
      ],
      contact: [
        { required: true, message: '为方便寄出请输入全名', trigger: 'blur' },
      ],
      contactTelphone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: '请输入正确的手机号码', trigger: 'blur'
          }
      ],
      // comment: [
      //   { required: true, message: '请输入留言'},
      // ],
      address: [
        { required: true, message: '请输入地址', trigger: 'blur' },
      ],
      addressDetail: [
        { required: true, message: '请输入详细地址', trigger: 'blur' },
      ]
    }
  }


  async seach() {
    try {
      const { data } = await queryList({pageIndex: 1, pageSize: 10})
      this.faList = data.itemList
      this.faType = data.invoiceTypeList
      this.taiType = data.customerTypeList
    } catch (ex) {
      this.handleError(ex)
    } finally {
    }
  }

  async detail() {
    try {
      const { data } = await itemlist(this.$route.params.edit)
      this.faList = (data.itemList || []).map((it: any) => {
        return {
          ...it,
          key: Number(it.key)
        }
      })
      this.faType = data.invoiceTypeList
      this.taiType = data.customerTypeList
      this.money = data.totalTaxFee
      this.query.itemCode = data.itemCode,
      this.query.totalTaxFee = data.totalTaxFee,
      this.query.invoiceType = data.invoiceType,
      this.query.customerType = data.customerType,
      this.query.name = data.name,
      this.query.taxId = data.taxId,
      this.query.telphone = data.telphone,
      this.query.provinceId = data.provinceId,
      this.query.cityId   = data.cityId,
      this.query.countyId = data.countyId,
      this.query.address = data.address,
      this.query.accountBank = data.accountBank,
      this.query.accountNumber = data.accountNumber,
      this.query.memo = data.memo,
      this.query.contact = data.contact,
      this.query.contactTelphone = data.contactTelphone,
      this.query.contactProvinceId = data.contactProvinceId,
      this.query.contactCityId = data.contactCityId,
      this.query.contactCountyId = data.contactCountyId,
      this.query.addressDetail = data.addressDetail,
      this.query.comment = data.comment,
      this.query.orderIds = (data.items || []).map((it: any) => {
        return it.id
      }),
      this.query.orderNo = (data.items || []).map((it: any) => {
        return it.orderNo
      })
    } catch (ex) {
      this.handleError(ex)
    } finally {
    }
  }

  his() {
    this.$router.push({ path : '/kol/applyTicket/ticketHis'})
  }

  down() {
    this.$router.push({ path : '/kol/applyTicket/addticket'})
  }

  cancel() {
    this.$router.go(-1)
  }

  async ok(dataForms: any) {
    // this.query.itemCode = Number(this.query.itemCode)
    const myThis: any = this
   myThis.$refs[dataForms].validate(async ( valid: any ) => {
      if (valid) {
        if (this.$route.params.edit == '0') {
          this.query.totalTaxFee = this.list.totalTaxFee
          this.query.orderIds = this.list.order_ids
          this.query.orderNo = this.list.order_no
          try {
            const res =  await addticket (this.query)
            toast('操作成功')
            this.$router.push({ path : '/kol/applyTicket'})
          } catch (ex) {
            this.handleError(ex)
          } finally {
          }
        } else if (this.$route.params.key == '0') {
          try {
            const res =  await editticket (this.$route.params.edit , this.query)
            toast('操作成功')
            this.$router.push({ path : '/kol/applyTicket'})
          } catch (ex) {
            this.handleError(ex)
          } finally {
          }
        }
      }
    })
  }

  @Watch('area')

  watchArea(val: number[]) {
    this.query.provinceId = val[0]
    this.query.cityId = val[1]
    this.query.countyId = val[2]
  }

  @Watch('areas')

  watchAreas(val: number[]) {
    this.query.contactProvinceId = val[0]
    this.query.contactCityId = val[1]
    this.query.contactCountyId = val[2]
  }
}
</script>
<style lang='less' scoped>
@import '~@/site/common.less';
.pages {
  padding: 10px 30px 0 30px;
}
.box {
  width: 48%;
  height: 782px;
  float: left;
  background: rgba(255, 255, 255, 0.4);
  border: 1px solid #eee;
  border-radius: 5px;
  padding: 20px 40px 20px 30px;
  font-size: 14px;
}
.fa-m {
  height: 40px;
  line-height: 40px;
  color: rgba(0, 32, 45, 0.5);
  span {
    color: #00202d;
    font-weight: bold;
  }
}
.bx {
  color: #d76d72;
  position: absolute;
  left: -7px;
  top: 11px;
}
.hui {
  color: rgba(0, 32, 45, 0.5);
}
.big {
  color: rgba(0, 32, 45, 0.8);
  font-size: 24px;
  font-weight: 500;
}
.small {
  color: rgba(0, 32, 45, 0.5);
  font-size: 13px;
  font-weight: 400;
}
.img {
  height: 75px;
  img {
    width: 100%;
    height: 100%;
  }
}
.button {
  height: 50px;
  line-height: 50px;
  text-align: center;
  margin-top: 50px;
  cursor: pointer;
  .cancel {
    font-size: 24px;
    color: rgba(0, 32, 45, 1);
  }
  .ok {
    width: 150px;
    height: 50px;
    background: rgba(0, 32, 45, 0.9);
    display: inline-block;
    font-size: 24px;
    color: rgba(255, 255, 255, 1);
    border-radius: 29px;
    margin-left: 25px;
  }
}
/deep/ textarea.ivu-input {
  height: 180px;
  border-radius: 5px;
}
/deep/ .ivu-select-selection {
  height: 35px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 1);
}
/deep/ .ivu-input {
  border-radius: 5px;
  height: 35px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 1);
}
/deep/ .ivu-input-number {
  border-radius: 5px;
  height: 35px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 1);
  width: 100%;
}
/deep/ .ivu-input-number-input {
  border-radius: 5px;
  height: 35px;
  background: rgba(255, 255, 255, 0.2);
  width: 100%;
}
/deep/ .ivu-select-single .ivu-select-selection .ivu-select-placeholder {
  display: block;
  height: 40px;
  line-height: 40px;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-left: 8px;
  padding-right: 24px;
  color: #00202d;
}
/deep/ .ivu-select-single .ivu-select-selection .ivu-select-selected-value {
  display: block;
  height: 40px;
  line-height: 40px;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-left: 8px;
  padding-right: 24px;
  color: #00202d;
}
/deep/ .edit-input .ivu-form-item-content .ivu-input-wrapper {
  width: 100%;
}
/deep/ .ivu-form-item {
  margin-bottom: 0;
}
/deep/ .edit-input .ivu-form-item-content .ivu-select-selection {
  width: 100%;
}
</style>