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
              <FormItem label="项目名称" prop="projectName">
                <Input v-model="dataForm.projectName" class="inp-style" placeholder="请输入项目名称"/>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem label="推广品牌" prop="brandId">
                <Select v-model='dataForm.brandId'  clearable placeholder="推广品牌">
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
              <FormItem label="推广产品" prop="productId">
                <Select v-model='dataForm.productId'  clearable placeholder="推广产品">
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
              <FormItem label="推广内容(选填)" prop="projectDescription">
                <Input v-model="dataForm.projectDescription" class="inp-style" placeholder="可选填，例如‘奥迪Q3新款上线推广’"/>
              </FormItem>
            </Col>
            <Col span="12" style='line-height: 40px;'>&nbsp;&nbsp;(选填)</Col>
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
                <!-- <Row class='bus' v-for="item in lineqqq" :key='item.key'> 
                  <span @click="active(item.key)" class='tag' :class="['tag', moval == item.key ? 'activeClass' : '']">{{item.text}}</span><span class='hui'>后台配置的使用说明，吧啦啦啦啦</span> 
                </Row> -->
                <CheckboxGroup v-model="dataForm.haibao" class='bus'> 
                  <Checkbox   v-for="item in lineqqq" :key='item.key' :value='item.id' :label="item.key" class="check-item tag" style='margin-bottom: 40px;'>{{item.text}}</Checkbox> <span class='hui aaa'>后台配置的使用说明，暂无使用说明</span>  <span class='hui sss'>后台配置的使用说明，暂无使用说明</span>
                </CheckboxGroup>
                <Col span='16' class="inps" ><InputNumber @on-focus='chgindex(2)' v-model="dataForm.count"  placeholder="可选填，例如‘奥迪Q3新款上线推广’"/></InputNumber></Col>
              </Col>
            </Row>
          <Row class='add-line' style='margin-top: 40;'>品牌方可提供资源</Row>
          <div class='bg' style='padding: 20px;margin-bottom: 30px;'>
            <Row class='add-row'>
              <Col :span="24">
                <Col :span='6' class='sxsd'>自有线上推广资源</Col>
                <Col :span='3'>
                  <!-- <Tag v-mode='dataForm.lines' :tagMess = 'line' :nus = '2'/> -->
                  <div style='margin-bottom: 18px;' @click="active2(item.key)" :class="['tag', val == item.key ? 'activeClass' : '']" v-for="item in online" :key="item.key">
                    {{item.text}}
                  </div>
                </Col>
                <Col :span='8'>
                  <!-- <Row class='add-row' v-for='(item , index) in line' :key='index'>
                    <Col :span='24' :key='index'><Input @on-focus='chgindex2(item.key)' v-model="dataForm.s + item.key" class="inp-style" :key='key' :placeholder='item.text'/></Col>
                  </Row> -->
                  <Row class='add-row'>
                    <Col :span='24'><Input @on-focus='chgindex2(1)' v-model="dataForm.wechat" class="inp-style" placeholder="可选填，例如‘奥迪Q3新款上线推广’"/></Col>
                  </Row>
                  <Row class='add-row'>
                    <Col :span='24'><Input @on-focus='chgindex2(2)' v-model="dataForm.weibo" class="inp-style" placeholder="可选填，例如‘奥迪Q3新款上线推广’"/></Col>
                  </Row>
                  <Row class='add-row'>
                    <Col :span='24'><Input @on-focus='chgindex2(3)' v-model="dataForm.guang" class="inp-style" placeholder="可选填，例如‘奥迪Q3新款上线推广’"/></Col>
                  </Row>
                </Col>
                
              </Col>
            </Row>
            <Row class='add-row'>
              <Col :span="24">
                <div class='sxsd'>线下门店资源</div>
                <CheckboxGroup v-model="dataForm.lines">
                  <Checkbox  v-for="it in offlineResourceTypeList" :key="it.key" :label="it.key" :value='it.key'
                    class="check-item">{{it.text}}</Checkbox>
                </CheckboxGroup>
              </Col>
            </Row>
          </div>
          
          <Row class="add-row">
            <Col span="24">
              <FormItem label="留言" prop="message">
                <Input
                  v-model="dataForm.message"
                  class="inp-style-tex"
                  type="textarea"
                />
              </FormItem>
            </Col>
          </Row>
        </div>
        </Form>
        <div class='btnq' style="text-align: center">
          <Button class='ok' type="primary" @click="dataFormSubmit()">提交意向</Button>
        </div> 
    </div>
  </div>
</template>

<script lang='ts'>
import {Component, Watch} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import moment from 'moment'
import { queryList , addlist , filmlist  } from '@/api/filmorder'
import { toMap } from '@/fn/array'
import { formatTimestamp } from '@/util/validateRules'
import WeekDatePicker from '@/components/weekDatePicker'
import { confirm , toast } from '@/ui/modal'
import Tag from './tag.vue'

// const dataForm: any = {
// }
@Component({
  components: {
    Tag,
  }
})
export default class Main extends ViewBase {
  value1 = 0
  dataForm: any = {
    movieId: null,
    projectName: '',
    projectDescription: '',
    brandId: 20,
    productId: null,
    companyId: null,
    message: null,
    count: null,
    wechat: '',
    weibo: '',
    guang: '',
    movieResource: {
      material: {
        need: 1,
      },
      coupon: {
        need: 1,
        count: 2,
      }
    },
    brandResource: {
      online: [
          {
            channelCode: 'weibo',
            channelDataId: 'id'
          }
      ],
      offline: [
          {
            channelCode: 'yilabao'
          },
          {
            channelCode: 'screen'
          }
      ]
    },
    lines: [],
    haibao: [],
    s1 : '1',
    s2 : '2',
    s3 : '3',
  }

  moval = 1
  val = 1

  itemlist: any = []
  statusList: any = []
  typeList: any = []
  offlineResourceTypeList: any = []
  channelCodeList: any = []

  query: any = {}

  online: any = [
    {key: 1, id: 'wechat' , text: '微信公众号'},
    {key: 2, id: 'weibo' , text: '微博'},
    {key: 3, id: 'official-website' , text: '官网'},
  ]

  lineqqq: any = [
    {key: 1,  text: '海报授权'},
    {key: 2,  text: '电影票券'}
  ]

  asd: any = []
  hai: any = false
  dian: any = false


  totalCount = 0


  mounted() {
    this.dataForm.s1 = '456'
    this.dataForm.movieId = this.$route.params.id
    this.seach()
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
    this.asd = []
    try {
      const { data } = await queryList({})
      this.itemlist = data.items
      this.statusList = data.statusList
      this.typeList = data.typeList
      this.offlineResourceTypeList = data.offlineResourceTypeList
      this.channelCodeList = data.channelCodeList
    } catch (ex) {
    }
  }

  async dataFormSubmit() {
    for ( const i in this.dataForm.lines) {
      if ( 1 == 1 ) {
        this.asd.push({channelCode : this.dataForm.lines[i]})
      }
    }
    if (this.dataForm.haibao.indexOf(1) == -1) {
      this.hai = false
    } else {
      this.hai = true
    }

    if (this.dataForm.haibao.indexOf(2) == -1) {
      this.dian = false
    } else {
      this.dian = true
    }

    this.query = {
      movieId: this.dataForm.movieId,
      projectName: this.dataForm.projectName,
      projectDescription: this.dataForm.projectDescription,
      brandId: this.dataForm.brandId,
      productId: this.dataForm.productId,
      companyId: this.dataForm.companyId,
      message: this.dataForm.message,
      movieResource: {
        material: {
          need: this.hai,
        },
        coupon: {
          need: this.dian,
          count: this.dataForm.count,
        }
      },
      brandResource: {
        onlines: [
            {
              channelCode: 'wechat',
              channelDataId: this.dataForm.wechat
            },
            {
              channelCode: 'weibo',
              channelDataId: this.dataForm.weibo
            },
            {
              channelCode: 'official-website',
              channelDataId: this.dataForm.guang
            }
        ],
        offlines: this.asd
      }
    }
    try {
      const { data } = await addlist(this.query)
      this.$router.push({ path : '/film/filmorder/movielist'})
    } catch (ex) {
    }
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
  margin-top: 10px;
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
.ok {
  width: 200px;
  height: 50px;
  background: rgba(0, 32, 45, 1);
  border-radius: 25px;
  margin-bottom: 45px;
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
  top: 54.5%;
  left: 24%;
}
.hui {
  color: rgba(0, 32, 45, 0.5);
}
.sss {
  position: absolute;
  left: 0;
  bottom: 0;
}
.aaa {
  position: absolute;
  left: 0;
  bottom: 52%;
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
</style>