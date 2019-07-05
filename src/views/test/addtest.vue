<template>
	<div class='page'>
		<div class='t-title'>
			<div class='te-l'>基础设置</div>
		</div>
		<Row style='margin-top: 6px;margin-bottom: 20px;'>
			<Col :span='8'>
				<span>名称</span>&nbsp;&nbsp;
				 <Input v-model='query.name' enter-button placeholder="标题" style="width: 300px" />
			</Col>
			<Col :span='8'>
				<span>客户</span>&nbsp;&nbsp;
				 <Select v-model="query.customerId" placeholder="客户" style="width: 300px" clearable>
		            <Option v-for="it in kehulist" :key="it.id" :value="it.id"
		              :label="it.name">{{it.name}}</Option>
		          </Select>
			</Col>
			<Col :span='8'>
				<span>投放排期</span>&nbsp;&nbsp;
				 <DatePicker type="daterange" @on-change="dateChange" placement="bottom-end" placeholder="投放排期" class="input" style="width: 300px"></DatePicker>
			</Col>
		</Row>
		 <div class='t-title'>
			<div class='te-l'>投放影片</div>
		</div>
		<Film v-model="numsList" :begin="query.beginDate" :end="query.endDate" @donefilm="timerfilm"/>
		<div class='t-title'>
			<div class='te-l'>投放影院</div>
		</div>
		<div class='dis'>
			<div>请上传一份包含影院专资编码数据的xls文件，如上传错误，请下载模板
        <a href="http://aiads-file.oss-cn-beijing.aliyuncs.com/MISC/MISC/bkfh2gilkin0008001bg.xls" :download='"http://aiads-file.oss-cn-beijing.aliyuncs.com/MISC/MISC/bkfh2gilkin0008001bg.xls"'>【影院数据模板.xls】</a>
      </div>

			<Form class="create-form form-item"   enctype="multipart/form-data" ref="form"
      :label-width="120">上传文件
      <!-- <a href="javascript:;" class='file'> -->
			<input type="file" class='adds' @change="onChange" />
    <!-- </a> -->
      
			</Form>
      <span class='viewhtml'>{{inputhtml}}</span>

		</div>
		<div class='okbut' >
			<span @click='addform()'>提交</span>
		</div>
	</div>
</template>

<script lang="tsx">
import {Component, Watch} from 'vue-property-decorator'
import UploadButton, { SuccessEvent } from '@/views/order/components/UploadButton.vue'
import ViewBase from '@/util/ViewBase'
import moment from 'moment'
import { itemlist , addlist , editlist , dels , uplist } from '@/api/testlist'
import { brandsList } from '@/api/shopping'
import { subAccount } from '@/api/customer'
import { toMap } from '@/fn/array'
import jsxReactToVue from '@/util/jsxReactToVue'
import { formatTimestamp } from '@/util/validateRules'
import WeekDatePicker from '@/components/weekDatePicker'
import { confirm , toast , info } from '@/ui/modal'
import Uploader from '@/util/Uploader'
import Film from './film.vue'
const timeFormat = 'YYYY-MM-DD HH:mm:ss'
const uploader = new Uploader({
  filePostUrl: '/xadvert/v1/third-monitors/upload-cinemas',
  fileFieldName: 'file',
})

@Component({
  components: {
    UploadButton,
    Film
  }
})
export default class Main extends ViewBase {
  query: any = {
    name: '',
    customerId: null,
    brandId: null,
    productId: null,
    beginDate: null,
    endDate: null,
    cinemaCodes: [],
    deliveryMovies: []
  }

  file: File | any = null
  inputhtml: any = ''


  totalCount = 0
  beginDate = ''
  endDate = ''
  numsList: any = []
  itemdata: any = {}

  list: any = []
  showTime: any = []

  kehulist: any = []
  codelist: any = []

  mounted() {
    this.seach()
  }

  dateChange(data: any) {
    this.query.beginDate = Number(data[0].split('-')[0] +
      data[0].split('-')[1] + data[0].split('-')[2])
    this.query.endDate = Number(data[0].split('-')[0] +
      data[1].split('-')[1] + data[1].split('-')[2])
  }



  onChange(ev: Event) {
    const input = ev.target as HTMLInputElement
    this.file = input.files && input.files[0]
    this.inputhtml = this.file.name
  }


  timerfilm() {
    // this.seach()
  }


  async seach() {
    try {
      const { data } = await subAccount({pageSize: 88888888})
      this.kehulist = data.items || []
      if (this.$route.params.id != '0') {
        const items = await itemlist(this.$route.params.id)
        this.itemdata = items.data.item.name
        this.query.name = items.data.item.name
        this.query.customerId = items.data.item.customerId,
        this.query.brandId = items.data.item.brandId,
        this.query.productId = items.data.item.productId,
        this.query.beginDate = items.data.item.beginDate,
        this.query.endDate = items.data.item.endDate,
        this.query.cinemaCodes = items.data.item.deliveryCinemas,
        this.query.deliveryMovies = items.data.item.deliveryMovies
        // this.numsList = items.data.item.deliveryMovies
      }
      this.numsList = this.query.deliveryMovies
    } catch (ex) {
      this.handleError(ex)
    } finally {

    }
  }

  add() {
    this.$router.push({ path : '/test/addtest/0'})
  }

  async addform() {
    if (this.$route.params.id == '0') {
      if (this.numsList.length == 0) {
       info('请选择影片')
       return
      }
    }
    if (this.numsList.length > 0) {
      // this.query.deliveryMovies.push(this.numsList)
      this.query.deliveryMovies = (this.numsList || []).map((it: any) => {
        return {
          movieId: it.movieId,
          beginDate: it.beginDate,
          endDate: it.endDate
        }
      })
    } else {
      this.query.deliveryMovies = (this.numsList || []).map((it: any) => {
        return {
          movieId: it.movieId,
          beginDate: it.beginDate,
          endDate: it.endDate
        }
      })
      // this.query.deliveryMovies = [
      // 	{
      //     movieId: 55165,
      //     beginDate: 20120202,
      //     endDate: 20120203
      //   }
      // ]
    }

    if (this.file == null) {
      // TODO: 如果文件是必选的，提示选择文件
    }


    const  a = await uploader.upload(this.file)
    this.codelist = a.items
    try {
      if (this.$route.params.id != '0') {
        if (this.codelist.length > 0) {
          this.query.cinemaCodes = a.items
        }
        await editlist(this.$route.params.id , this.query)
      } else if (this.$route.params.id == '0') {
        this.query.cinemaCodes = a.items
        await addlist(this.query)
      }
      this.$router.push({ path : '/test'})
    } catch (ex) {
      this.handleError(ex)
    } finally {
    }
  }
}
</script>
<style lang="less" scoped>
.page {
  padding: 15px;
}
.t-title {
  line-height: 60px;
  height: 60px;
  .te-l {
    width: 20%;
    float: left;
    font-size: 24px;
    color: #fff;
  }
  .te-r {
    float: right;
    width: 193px;
    height: 47px;
    background: rgba(249, 216, 94, 1);
    border-radius: 25px;
    text-align: center;
    line-height: 47px;
    margin-top: 6px;
    font-size: 20px;
    font-weight: 400;
    cursor: pointer;
  }
}
.tiptis {
  font-size: 17px;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  line-height: 36px;
  background: rgba(0, 32, 45, 1);
  border-radius: 5px 0 0 0;
  opacity: 0.9;
  padding: 15px;
  margin-top: 20px;
  margin-bottom: 30px;
}
.dis {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 1);
  padding: 20px;
  height: 115px;
  div {
    line-height: 24px;
    margin-bottom: 15px;
  }
}
.okbut {
  margin-top: 30px;
  margin-left: 41%;
  cursor: pointer;
  span {
    display: block;
    width: 200px;
    height: 50px;
    background: rgba(0, 32, 45, 1);
    border-radius: 25px;
    text-align: center;
    line-height: 50px;
    color: #fff;
    font-size: 18px;
    cursor: pointer;
  }
}
/deep/ .ivu-input {
  height: 40px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 1);
  &::-webkit-input-placeholder {
    color: #00202d;
  }
}
/deep/ .ivu-input-search {
  cursor: pointer;
  padding: 0 16px !important;
  color: #fff !important;
  border-color: #000 !important;
  position: relative;
  z-index: 2;
  height: 40px;
  background: rgba(0, 32, 45, 1) !important;
  border-radius: 5px;
}
/deep/ .button-text {
  margin: 0 3px;
  display: inline-block;
  text-align: center;
  line-height: 24px;
  width: 100px;
  height: 24px;
  background: rgba(0, 32, 45, 1);
  border-radius: 12px;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
}
/deep/ .btnCenter {
  text-align: center;
  height: 100px;
  margin: 0 20px 0 20px;
  line-height: 100px;
  color: #fff;
}
/deep/ .ivu-page-prev {
  border: 0;
  background: rgba(255, 255, 255, 0);
}
/deep/ .ivu-page-next {
  border: 0;
  background: rgba(255, 255, 255, 0);
}
/deep/ .ivu-page-item-active {
  border-color: #eee;
  background: #eee !important;
  border-radius: 50%;
  color: #fff;
  width: 30px;
  height: 30px;
}
/deep/ .ivu-page-item {
  border: 0;
  display: inline-block;
  vertical-align: middle;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  line-height: 30px;
  margin-right: 4px;
  text-align: center;
  list-style: none;
  user-select: none;
  cursor: pointer;
  font-weight: 500;
  transition: border 0.2s ease-in-out, color 0.2s ease-in-out;
}
/deep/ .ivu-table th, /deep/ .ivu-table-header {
  background: rgba(0, 32, 45, 0.8);
  height: 60px;
  line-height: 60px;
  color: rgba(179, 188, 192, 1);
  font-size: 14px;
  font-weight: 400;
}
/deep/ .ivu-table td {
  background: rgba(32, 67, 80, 1);
  transition: background-color 0.2s ease-in-out;
  font-size: 14px;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  height: 50px;
  line-height: 50px;
}
/deep/ .ivu-table-stripe .ivu-table-body tr.ivu-table-row-hover td {
  background: rgba(32, 67, 80, 1);
}
/deep/ .ivu-table-body {
  background: rgba(32, 67, 80, 1);
}
/deep/ .ivu-table-tip {
  overflow-x: auto;
  overflow-y: hidden;
  background: rgba(32, 67, 80, 1);
}
/deep/ .ivu-form .ivu-form-item-label, /deep/ .ivu-icon-ios-arrow-forward::before, /deep/ .ivu-icon-ios-arrow-back::before {
  color: #fff;
}
/deep/ .ivu-table-wrapper {
  margin: 30px 0 0;
  border: none;
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
.create-form {
  position: relative;
  display: block;
  float: left;
  width: 83px;
  background: #d0eeff;
  border: 1px solid #99d3f5;
  border-radius: 4px;
  padding: 4px 12px;
  overflow: hidden;
  color: #1e88c7;
  text-decoration: none;
  text-indent: 0;
  line-height: 20px;
}
.adds {
  width: 200px;
  position: absolute;
  font-size: 100px;
  left: 0;
  top: 0;
  opacity: 0;
}
.viewhtml {
  display: inline-block;
  height: 30px;
  line-height: 30px;
  margin-left: 20px;
}
/deep/ .ivu-input-prefix i {
  font-size: 16px;
  line-height: 32px;
  color: #808695;
  margin-top: 5px;
}
/deep/ .ivu-input-suffix i {
  font-size: 16px;
  line-height: 32px;
  color: #808695;
  margin-top: 4px;
}
</style>


