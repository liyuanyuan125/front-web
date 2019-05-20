<template>
  <div class='page'>
     <div class='t-title'>影片合作</div>
     <Form
          :model="dataForm"
          :label-width="100"
          label-position="left"
          class="form page"
          ref="dataForm"
        >
        <div style='padding: 20px;font-size: 14px;'>
          <Row>
            <Col span="12">
              <FormItem label="项目名称" prop="accountNumber">
                <Input v-model="dataForm.accountNumber" class="inp-style" placeholder="请输入汇款银行账号"/>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem label="推广品牌" prop="accountName">
                <Select v-model='dataForm.accountName'  clearable placeholder="推广品牌">
              <Option
                v-for="item in []"
                :key="item.key"
                :value="item.key"
                v-if='item.key!=0'
              >{{item.text}}</Option>
            </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem label="推广内容(选填)" prop="accountNumber">
                <Input v-model="dataForm.accountNumber" class="inp-style" placeholder="可选填，例如‘奥迪Q3新款上线推广’"/>
              </FormItem>
            </Col>
          </Row>
          <Row class='add-row'>希望获得片方的资源</Row>
         <Row style='    height: 180px;
    padding: 30px 20px 20px 20px;'>
              <Col span='9'>
                <Row>
                  <Col span='8'>
                    <div class='div-img'>
                      <img src="./assets/wait.jpg" alt="">
                    </div>
                  </Col>
                  <Col span='14' class='row-x'>
                    <Row>攀登者</Row>
                    <Row>剧情/冒险 (中国大陆)</Row>
                    <Row>2018-05-05 上映</Row>
                  </Col>
                </Row>
              </Col>
              <Col span='12'>
                <Row class='bu-s'><Button>海报授权</Button>由后台配置：若片方提供该资源，则对品牌方有何要求</Row>
                <Row class='bu-s'><Button>海报授权</Button>由后台配置：若片方提供该资源，则对品牌方有何要求</Row>
                <Row class='bu-s'><Button>海报授权</Button>由后台配置：若片方提供该资源，则对品牌方有何要求</Row>
              </Col>
            </Row>
          <Row class='add-row'>品牌方可提供资源</Row>
          <Row class='add-row'>
            <Col :span="12">
              <div class='sxsd'>自有线上推广资源</div>
              <RadioGroup v-model="dataForm.status" type="button">
                <Radio v-for='it in [{key: 1, text:"123"} , {key: 2, text:"123"}]' :key='it.key' :value='it.key' v-if='it.key!=0 && it.key!=4' :label='it.key'>{{it.text}}</Radio>
              </RadioGroup>
            </Col>
          </Row>
          <Row class='add-row'>
            <Col :span="12">
              <div class='sxsd'>线下门店资源</div>
              <RadioGroup v-model="dataForm.status" type="button">
                <Radio v-for='it in [{key: 1, text:"123"} , {key: 2, text:"123"}]' :key='it.key' :value='it.key' v-if='it.key!=0 && it.key!=4' :label='it.key'>{{it.text}}</Radio>
              </RadioGroup>
            </Col>
          </Row>
          <Row class="add-row">
            <Col span="24">
              <FormItem label="留言" prop="remark">
                <Input
                  v-model="dataForm.remark"
                  class="inp-style-tex"
                  type="textarea"
                  placeholder="限50字"
                />
              </FormItem>
            </Col>
          </Row>
        </div>
        </Form>
        <div class='btnq' style="text-align: center">
          <Button type="primary" @click="dataFormSubmit('dataForm')">提交意向</Button>
        </div>
  </div>
</template>

<script lang='ts'>
import {Component, Vue} from 'vue-property-decorator'

const dataForm = {
  accountNumber: '',
  accountName: '',
  amount: null,
  remittanceDate: null,
  contactPhone: '',
  remark: '',
  receipts: [],
  receipt: '',
}
@Component
export default class Main extends Vue {
  value1 = 0
  query: any = {
    filmName: '',
    status: 1,
    pageIndex: 1,
    pageSize: 4,
  }



  totalCount = 0
  dataForm: any = { ...dataForm }
  seachs() {
    this.query.pageIndex = 1
    this.seach()
  }

  async seach() {

  }

  handlepageChange(size: any) {
    this.query.pageIndex = size
    this.seach()
  }
  handlePageSize(size: any) {
    this.query.pageIndex = size
    this.seach()
  }

}

</script>
<style lang='less' scoped>
.t-title {
  width: 100%;
  height: 50px;
  background: rgba(249, 249, 249, 1);
  border-radius: 2px 2px 0 0;
  line-height: 50px;
  font-size: 14px;
  font-weight: 400;
  color: rgba(36, 129, 215, 1);
  padding-left: 30px;
}
.sxsd {
  width: 20%;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  text-align: left;
  float: left;
}
.add-row {
  margin-top: 10px;
}
.div-img {
  width: 90px;
  height: 130px;
  img {
    width: 100%;
    height: 100%;
  }
}
.row-x {
  line-height: 25px;
}
.bu-s {
  margin-top: 5px;
  button {
    height: 40px;
    margin-right: 6px;
  }
}
/deep/ .ivu-radio-group-button .ivu-radio-wrapper:last-child {
  border-radius: 0;
}
/deep/ .ivu-radio-group-button .ivu-radio-wrapper:first-child {
  border-radius: 0;
}
/deep/ .ivu-radio-group-button .ivu-radio-wrapper:hover {
  border-color: #dcdee2;
}
/deep/ .ivu-radio-group-button .ivu-radio-wrapper-checked::before {
  background: #3b98ff;
  opacity: 1;
}
/deep/ .ivu-radio-group-button .ivu-radio-wrapper::before, .ivu-radio-group-button .ivu-radio-wrapper::after {
  transition: all 0s !important;
}
</style>