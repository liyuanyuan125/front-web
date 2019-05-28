<template>
  <div class='page'>
    <div class='bg'>

     <Form
          :model="dataForm"
          :label-width="120"
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
            <Col style='line-height: 40px;'>&nbsp;&nbsp;(选填)</Col>
          </Row>
          <Row class='add-line'>希望获得片方的资源</Row>
         <Row class='box' style='height: 200px ;padding: 20px;'>
              <Col span='9'>
                <Row>
                  <Col span='8'>
                    <div class='div-img'>
                      <img src="./assets/wait.jpg" alt="">
                    </div>
                  </Col>
                  <Col span='14' class='row-x'>
                    <Row style='font-size: 20px;font-weight: 500;margin-top: 6px;'>攀登者</Row>
                    <Row>剧情/冒险 (中国大陆)</Row>
                    <Row>2018-05-05 上映</Row>
                  </Col>
                </Row>
              </Col>
              <Col :span='12'>
                <!-- <Row class='bus' > <span class='tag'>电影海报</span><br><span class='hui'>后台配置的使用说明，吧啦啦啦啦</span> </Row>
                <Row class='bus' > <span class='tag'>电影票券</span>  &nbsp;  100张   <br><span class='hui'>后台配置的使用说明，吧啦啦啦啦</span></Row> -->
                <Row class='bus' v-for="item in lineqqq" :key='item.key'> <span @click="active(item.key)" class='tag' :class="['tag', moval == item.key ? 'activeClass' : '']">{{item.text}}</span><span class='hui'>后台配置的使用说明，吧啦啦啦啦</span> </Row>
                <Col span='16' class="inps" ><Input @on-focus='chgindex(2)' v-model="dataForm.accountNumber"  placeholder="可选填，例如‘奥迪Q3新款上线推广’"/></Col>
              </Col>
            </Row>
          <Row class='add-line' style='margin-top: 40;'>品牌方可提供资源</Row>
          <div class='bg' style='padding: 20px;margin-bottom: 30px;'>
            <Row class='add-row'>
              <Col :span="24">
                <Col :span='6' class='sxsd'>自有线上推广资源</Col>
                <Col :span='3'>
                  <!-- <Tag v-mode='dataForm.lines' :tagMess = 'line' :nus = '2'/> -->
                  <div style='margin-bottom: 18px;' @click="active2(item.key)" :class="['tag', val == item.key ? 'activeClass' : '']" v-for="item in line" :key="item.key">
                    {{item.text}}
                  </div>
                </Col>
                <Col :span='8'>
                  <!-- <Row class='add-row' v-for='(item , index) in line' :key='index'>
                    <Col :span='24' :key='index'><Input @on-focus='chgindex2(item.key)' v-model="dataForm.s + item.key" class="inp-style" :key='key' :placeholder='item.text'/></Col>
                  </Row> -->
                  <Row class='add-row'>
                    <Col :span='24'><Input @on-focus='chgindex2(1)' v-model="dataForm.accountNumber" class="inp-style" placeholder="可选填，例如‘奥迪Q3新款上线推广’"/></Col>
                  </Row>
                  <Row class='add-row'>
                    <Col :span='24'><Input @on-focus='chgindex2(2)' v-model="dataForm.accountNumber" class="inp-style" placeholder="可选填，例如‘奥迪Q3新款上线推广’"/></Col>
                  </Row>
                  <Row class='add-row'>
                    <Col :span='24'><Input @on-focus='chgindex2(3)' v-model="dataForm.accountNumber" class="inp-style" placeholder="可选填，例如‘奥迪Q3新款上线推广’"/></Col>
                  </Row>
                </Col>
                
              </Col>
            </Row>
            <Row class='add-row'>
              <Col :span="24">
                <div class='sxsd'>线下门店资源</div>
                <CheckboxGroup v-model="dataForm.lines">
                  <Checkbox  v-for="it in line" :key="it.key" :label="it.key"
                    class="check-item">{{it.text}}</Checkbox>
                </CheckboxGroup>
              </Col>
            </Row>
          </div>
          
          <Row class="add-row">
            <Col span="24">
              <FormItem label="留言" prop="remark">
                <Input
                  v-model="dataForm.remark"
                  class="inp-style-tex"
                  type="textarea"
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
  </div>
</template>

<script lang='ts'>
import {Component, Vue} from 'vue-property-decorator'
import Tag from './tag.vue'

const dataForm = {
  accountNumber: '',
  accountName: '',
  amount: null,
  remittanceDate: null,
  contactPhone: '',
  remark: '',
  receipts: [],
  receipt: '',
  lines: [0],
  s1 : '1',
  s2 : '2',
  s3 : '3',
}
@Component({
  components: {
    Tag,
  }
})
export default class Main extends Vue {
  value1 = 0
  query: any = {
    filmName: '',
    status: 1,
    pageIndex: 1,
    pageSize: 4,
  }

  moval = 1
  val = 1

  line: any = [
    {key: 1, text: '易拉宝'},
    {key: 2, text: '外卖盒'},
    {key: 3, text: '线下大屏'},
    {key: 4, text: '餐桌贴纸'},
    {key: 5, text: '宣传单'}
  ]

  lineqqq: any = [
    {key: 1, text: '海报授权'},
    {key: 2, text: '电影票券'}
  ]



  totalCount = 0
  dataForm: any = { ...dataForm }

  mounted() {
    this.dataForm.s1 = '456'
    // this.dataForm = {
    //   ...dataForm,
    //   s = ''
    // }
  }
  seachs() {
    this.query.pageIndex = 1
    this.seach()
  }

  active(id: any) {
    this.moval = id
  }

  chgindex(id: any) {
     this.active(id)
  }
  active2(id: any) {
    this.val = id
  }
  chgindex2(id: any) {
    this.active2(id)
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
@import '~@/site/lib.less';
.page {
  padding: 10px 40px 0 30px;
}
.bg {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 1);
}
.sxsd {
  width: 140px;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  text-align: left;
  float: left;
}
.add-row {
  margin-bottom: 18px;
}
.add-line {
  line-height: 50px;
  margin-top: 20px;
}
.div-img {
  width: 120px;
  height: 160px;
  img {
    width: 100%;
    height: 100%;
  }
}
.row-x {
  line-height: 35px;
}
.bu-s {
  margin-top: 5px;
  button {
    height: 40px;
    margin-right: 6px;
  }
}
.bus {
  margin-bottom: 20px;
}
.tag {
  margin-bottom: 10px;
  width: 100px;
  display: block;
  text-align: center;
  margin-right: 30px;
  height: 40px;
  line-height: 40px;
  color: #00202d;
  font-size: 14px;
  border: 1px solid #fff;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  cursor: pointer;
}
.activeClass {
  color: #fff;
  background: #00202d;
  border-radius: 4px;
  border: 1px solid #00202d;
  position: relative;
  &::after {
    content: '\2713';
    color: #fff;
    position: absolute;
    right: -8px;
    top: -8px;
    border: 1px solid #00202d;
    background: #00202d;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    text-align: center;
    line-height: 16px;
    z-index: 999;
  }
}
.box {
  height: 200px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 5px;
}
.check-ra {
  /deep/ .ivu-checkbox {
    display: none;
  }
  /deep/&.ivu-checkbox-wrapper-checked {
    color: #fff;
    border-color: #00202d;
    background-color: #00202d;
    &::after {
      content: '\2713';
      color: #fff;
      position: absolute;
      right: -8px;
      top: -8px;
      border: 1px solid #00202d;
      background: #00202d;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      text-align: center;
      line-height: 16px;
    }
  }
}
.check-item {
  position: relative;
  top: 3px;
  min-width: 100px;
  height: 40px;
  line-height: 40px;
  border-radius: 4px;
  text-align: center;
  margin-right: 15px;
  font-size: 14px;
  color: #00202d;
  border: 1px solid #fff;
  background: rgba(255, 255, 255, 0.3);
  user-select: none;
  .check-ra;
}
.inps {
  position: absolute;
  top: 50%;
  left: 24%;
}
.hui {
  color: rgba(0, 32, 45, 0.5);
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
/deep/ .ivu-select-single .ivu-select-selection .ivu-select-placeholder, .ivu-select-single .ivu-select-selection .ivu-select-selected-value {
  margin-top: 3px;
  // color: #00202d;
  font-size: 14px;
}
/deep/ .ivu-input {
  height: 40px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 1);
}
/deep/ .ivu-select-selection {
  height: 40px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 1);
}
/deep/ .ivu-select-input {
  margin-top: 3px;
  color: #00202d;
}
/deep/ .ivu-form .ivu-form-item-label {
  font-size: 14px;
}
/deep/ textarea.ivu-input {
  height: 100px;
}
/deep/ .ivu-checkbox {
  display: none;
}
/deep/&.ivu-checkbox-wrapper-checked {
  color: #fff;
  border-color: @c-button;
  background-color: @c-button;
  &::after {
    content: '\2713';
    color: #fff;
    position: absolute;
    right: -8px;
    top: -8px;
    border: 1px solid #00202d;
    background: #00202d;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    text-align: center;
    line-height: 16px;
  }
}
</style>