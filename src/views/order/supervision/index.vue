-<template>
  <div class="page">
    <div class='t-title'>监播管理</div>
    <div class='title-tip'>
      <div class='tip-left'><span style='color: #F9D85E;'>*</span>监播视频录制标准:</br>
    准备当日报纸或当日影票票根,带报头或票根拍摄厅号及/LOGO以及厅号,然后拍摄广告(广告播放起直至龙标出现)</br>
    备注：需拍摄一个包含上述内容的完整不间断视频</br>
    <span style='color: #F9D85E;'>*</span>拍摄视频命名规范: 日期、影片名称、影院名称、厅号、场次</div>
      <div class='tip-right'>
        <VideoPreviewer
          :url="videoUrl"
        >
          <span>
            <img src="./assets/goplan.png">
          </span>
          <em>查看监播示例</em>
        </VideoPreviewer>
      </div>
    </div>
    <div class='body'>
      <Row class='row-ul'>
       <Col span='6' class='data'><WeekDatePicker class='data-s' v-model="weekDate"/></Col>
        <Col :span="5">
          <Col style='margin-left: 12px;'>
            <Select
            v-model='query.cinemaId'
            clearable
            filterable
            placeholder="请输入专资编码或影院名称"
            remote
            :loading="loading"
            :remote-method="remoteMethod"
            @on-change="seachs">
              <Option
                v-for="(item, index) in movieList"
                :key="index"
                :value="item.id"
              >【{{item.code}}】{{item.shortName}}</Option>
            </Select>
          </Col>
        </Col>
        <Col :span="5">
          <Col style='margin-left: 12px;' :span='14'>
            <Select
            v-model='query.status'
            clearable
            filterable
            placeholder="请选择监播状态"
            @on-change="seachs">
              <Option
                v-for="(it) in statusList"
                :key="it.key"
                :value="it.key"
              >{{it.text}}</Option>
            </Select>
          </Col>
        </Col>
        <Col span='8' class='chb'>
            <span @click='seachchgup'><&nbsp;上周</span>
            <span @click='seachchg'>本周</span>
            <span @click='seachchgdown'>下周&nbsp;></span>
        </Col>
      </Row>
    </div>
    
    <!-- 通投数据 -->
    <Table
      v-if='normallist.length > 0'
      ref="selection"
      class="tables"
      :loading="tableLoading"
      :columns="columns"
      :data="normallist"
      :show-header='false'
      style='margin-top: 20px;'
    >
      <template slot="date" slot-scope="{row}" >
          {{row.beginDate}}～{{row.endDate}}
      </template>
      <template slot="orders" slot-scope="{row}" >
          <span v-for='(it ) in row.details' :key='it.orderId' >
            <router-link style='color: #00202D;' :to="{ name: 'order-dispatch-details', params: { id: it.orderId }}">
               <em v-for='(its) in deliveryPositionList' :key='its.key' v-if='it.deliveryPosition != null && it.deliveryPosition == its.key'>【{{its.text}}】</em>
              {{it.videoName}}({{it.videoLength}}s)&nbsp;&nbsp;&nbsp;
            </router-link>
          </span>
      </template>
      <template slot="status" slot-scope="{row}" >
        <div v-if='row.status == 1' >
          <OssUploader style='margin-left: -9%;' class='up1' :param="{fileType: 3, subCategory: 2}" mini @done="onUploadSuccess($event , row.id)"/>
          <UploadButton @success="onUploadimg($event, row.id)"></UploadButton>
        </div>
        <div v-if='row.status == 2' >
          <a class='aclick' href="javascript:;" v-if='row.alimg != "" '  @click='onView(row.alimg)'>查看TMS截图</a>
          <a class='aclick' @click='onViewVideo(row.fileUrl)' :class="row.alimg != '' ? 'mar' : ''" href="javascript:;">查看监播视频</a>
        </div>
        <div v-if='row.status == 3' >
          <a class='aclick' href="javascript:;" v-if='row.alimg != "" '  @click='onView(row.alimg)'>查看TMS截图</a>
          <a class='aclick' @click='onViewVideo(row.alimg)' :class="row.fileUrl != '' ? 'mar' : ''" href="javascript:;">查看监播视频</a>
        </div>
        <div v-if='row.status == 4'>
          <OssUploader class='up1' :param="{fileType: 3, subCategory: 2}" mini @done="onUploadSuccess($event , row.id)"/>
          <UploadButton @success="onUploadimg($event, row.id)"></UploadButton>
          <a class='aclick' href="javascript:;" v-if='row.fixRefuses != null' @click="viewrej(row)">查看拒绝原因</a>
          <a class='aclick mar' @click='onViewVideo(row.fileUrl)' href="javascript:;">查看监播视频</a>
          <a class='aclick' style='margin-bottom: 6px;' :class="row.fileUrl == null ? 'mar' : ''"  @click='onView(row.alimg)' href="javascript:;">查看TMS截图</a>
        </div>
      </template>
    </Table>
    <!-- 列表数据 -->
    <Table
      ref="selection"
      class="tables"
      :loading="tableLoading"
      :columns="columns"
      :data="itemlist"
      style='margin-top: 20px;'
    >
      <template slot="date" slot-scope="{row}" >
          {{row.beginDate}}～{{row.endDate}}
      </template>
      <template slot="orders" slot-scope="{row}" >
          <span v-for='(it ) in row.details' :key='it.orderId' >
            <router-link style='color: #00202D;' :to="{ name: 'order-dispatch-details', params: { id: it.orderId }}">
               <em v-for='(its) in deliveryPositionList' :key='its.key' v-if='it.deliveryPosition != null && it.deliveryPosition == its.key'>【{{its.text}}】</em>
              {{it.videoName}}({{it.videoLength}}s)&nbsp;&nbsp;&nbsp;
            </router-link>
          </span>
      </template>
      <template slot="status" slot-scope="{row}" >
        <div v-if='row.status == 1' >
          <OssUploader style='margin-left: -9%;' class='up1' :param="{fileType: 3, subCategory: 2}" mini @done="onUploadSuccess($event , row.id)"/>
          <UploadButton @success="onUploadimg($event, row.id)"></UploadButton>
        </div>
        <div v-if='row.status == 2' >
          <a class='aclick' href="javascript:;" v-if='row.alimg != "" '  @click='onView(row.alimg)'>查看TMS截图</a>
          <a class='aclick' @click='onViewVideo(row.fileUrl)' :class="row.alimg != '' ? 'mar' : ''" href="javascript:;">查看监播视频</a>
        </div>
        <div v-if='row.status == 3' >
          <a class='aclick' href="javascript:;" v-if='row.alimg != "" '  @click='onView(row.alimg)'>查看TMS截图</a>
          <a class='aclick' @click='onViewVideo(row.alimg)' :class="row.fileUrl != '' ? 'mar' : ''" href="javascript:;">查看监播视频</a>
        </div>
        <div v-if='row.status == 4'>
          <OssUploader class='up1' :param="{fileType: 3, subCategory: 2}" mini @done="onUploadSuccess($event , row.id)"/>
          <UploadButton @success="onUploadimg($event, row.id)"></UploadButton>
          <a class='aclick' href="javascript:;" v-if='row.fixRefuses != null' @click="viewrej(row)">查看拒绝原因</a>
          <a class='aclick mar' @click='onViewVideo(row.fileUrl)' href="javascript:;">查看监播视频</a>
          <a class='aclick' style='margin-bottom: 6px;' :class="row.fileUrl == null ? 'mar' : ''"  @click='onView(row.alimg)' href="javascript:;">查看TMS截图</a>
        </div>
      </template>
    </Table>
    <Modal v-model="viewerShow" title="查看图片" width="500" height="500">
      <img style="width: 100%;" :src="viewerImage">
    </Modal>
    <VideodlgEdit  ref="addOrUpdateVideo"  @refreshDataList="reloadSearch" v-if="addOrUpdateVisibleVideo" @done="reloadSearch"/>
    <dlgEdit  ref="addOrUpdate"   @refreshDataList="reloadSearch" v-if="addOrUpdateVisible" @done="reloadSearch"/>
  </div>
</template>

<script lang="tsx">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import moment from 'moment'
import jsxReactToVue from '@/util/jsxReactToVue'
import { querylist ,  getcinid , addvideo , delvideo , movielist , addimg } from '@/api/supervision'
import { formatTimestamp } from '@/util/validateRules'
import UploadButton, { SuccessEvent } from '../components/UploadButton.vue'
import WeekDatePicker from '@/components/weekDatePicker'
import { confirm , toast , info } from '@/ui/modal'
import VideoPreviewer from '@/components/videoPreviewer'
import OssUploader from '@/components/ossUploader'
import { findIndex } from 'lodash'
// 查看视频
import VideodlgEdit from './videodlgEdit.vue'
// 查看原因
import dlgEdit from './dlgEdit.vue'


const timeFormat = 'YYYY-MM-DD'

const getstatus = (key: any, list: any[]) => {
    const i: any = findIndex(list, (it: any) => {
        return key == it.key
    })
    const res: string = (!list[i].text || list[i].text == '') ? '-' : list[i].text
    return res
}

@Component({
  components: {
    UploadButton,
    WeekDatePicker,
    VideoPreviewer,
    OssUploader,
    VideodlgEdit,
    dlgEdit
  }
})
export default class Main extends ViewBase {

  // 查看图片、视频
  viewerShow = false
  viewerImage = ''
  addOrUpdateVisibleVideo = false

  // 查看拒绝原因
  addOrUpdateVisible = false

  tableLoading = false

  videoUrl = 'https://monitor-video.oss-cn-beijing.aliyuncs.com/monitor-intro.mp4'

  startTime: any = Number(new Date(this.getTime(0))) + (24 * 60 * 60 * 1000 * 3) - 8 * 60 * 60 * 1000
  endTime: any = Number(new Date(this.getTime(-6))) + (24 * 60 * 60 * 1000 * 3) + 16 * 60 * 60 * 1000 - 1
  datanum: any = 24 * 60 * 60 * 1000 * 7 // 一周的时间戳

  weekDate = [new Date(this.startTime), new Date(this.endTime)]

  sd = moment(this.weekDate[0].getTime()).format(timeFormat).split('-')
  ed = moment(this.weekDate[1].getTime()).format(timeFormat).split('-')

  ad = moment(this.weekDate[0].getTime() - (24 * 60 * 60 * 1000 * 7)).format(timeFormat).split('-')
  bd = moment(this.weekDate[1].getTime() - (24 * 60 * 60 * 1000 * 7)).format(timeFormat).split('-')

  query: any = {
    cinemaId: null,
    beginDate: this.sd[0] + this.sd[1] + this.sd[2],
    endDate: this.ed[0] + this.ed[1] + this.ed[2],
    status: null,
  }

  movieList: any = []
  loading = false
  asd = false

  ossUrl: any = null
  fileUrl: any = null
  fileSize: any = null


  itemlist: any = []
  normallist: any = []

  // 监播状态列表
  statusList: any = []
  num = 6


  // 广告片投放位置
  deliveryPositionList: any = []

  // 拒绝原因
  fixRefusesList: any = []

  columns = [
    { title: '影院名称', key: 'cinemaName', align: 'center', width: 110, },
    { title: '影院专资码', key: 'code', align: 'center', width: 100, },
    { title: '时间段', slot: 'date', align: 'center', width: 110, },
    { title: '影片名称', key: 'movieName', align: 'center', width: 100, },
    { title: '总投放时长', key: 'videoTotalLengths', align: 'center', width: 80, },
    { title: '监播状态', key: 'statusText', align: 'center' , width: 100, },
    { title: '广告列表', slot: 'orders', align: 'center'},
    { title: '状态', slot: 'status', align: 'center'},
  ]



  async mounted() {
    const cinid = await getcinid()
    if (cinid.data.cinemaId == 0) {
      info('当前用户下没有关联影院')
      return
      // this.query.cinemaId = cinid.data.cinemaId
    } else {
      this.query.cinemaId = cinid.data.cinemaId
      this.remoteMethod(cinid.data.cinemaName)
    }
    this.seach()
    if (new Date().getDay() == 1 || new Date().getDay() == 2 || new Date().getDay() == 3 || new Date().getDay() == 0 ) {
      if (new Date().getDay() == 1) {
        this.num = 7
      } else if (new Date().getDay() == 2) {
        this.num = 7
      } else if (new Date().getDay() == 3) {
        this.num = 7
      } else if (new Date().getDay() == 4) {
        this.num = 6
      }
      this.weekDate = [
      new Date(this.startTime - (24 * 60 * 60 * 1000 * this.num)) ,
      new Date(this.endTime - (24 * 60 * 60 * 1000 * this.num))]
      this.query.beginDate = this.ad[0] + this.ad[1] + this.ad[2]
      this.query.endDate = this.bd[0] + this.bd[1] + this.bd[2]
      this.seach()
      return
    }
  }

  async remoteMethod(querys: any) {
    try {
      if (querys) {
        this.loading = true
        const {
          data: { items }
        } = await movielist({
          query: querys,
        })
        this.movieList = (items || []).map((it: any) => {
          return {
            ...it,
            label: '【' + it.code + '】' + it.shortName
          }
        })
      }
      this.loading = false
    } catch (ex) {
      this.handleError(ex)
      this.loading = false
    } finally {
    }
  }


  seachs() {
    if (this.query.cinemaId == undefined) {
      return
    }
    this.seach()
  }

  async empty() {
    const a = await movielist({pageIndex: 1, pageSize: 20})
    this.movieList = a.data.items
  }

  reloadSearch() {
    this.seach()
    // this.seachchg()
  }

  // 上传视频文件
  async onUploadSuccess(ev: any, id: number) {
      try {
        await addvideo (id , {
                        fileUrl: ev.url,
                        size: ev.file.size,
                        fileName: ev.file.name
                      })
        this.$Message.success({
          content: `上传成功`,
        })
        this.seach()
      } catch (ex) {
        this.handleError(ex)
      }
  }

  // 上传图片文件
  async onUploadimg({ files }: SuccessEvent, id: number) {
      try {
        await addimg (id , {
                        fileId: files[0].fileId,
                      })
        this.$Message.success({
          content: `上传成功`,
        })
        this.seach()
      } catch (ex) {
        this.handleError(ex)
      }
  }

  async dels(id: any) {
    try {
        await delvideo (id)
        this.$Message.success({
          content: `删除视频成功`,
        })
        this.reloadSearch()
      } catch (ex) {
        this.handleError(ex)
      }
  }

   // 查看拒绝原因
  viewrej(row: any) {
    this.addOrUpdateVisible = true
    this.$nextTick(() => {
      const myThis: any = this
      myThis.$refs.addOrUpdate.init(row , this.fixRefusesList)
    })
  }

  // 本周
  seachchg() {
    /***参数都是以周一为基准的***/
    this.startTime = Number(new Date(this.getTime(0))) + (24 * 60 * 60 * 1000 * 3) - 8 * 60 * 60 * 1000  // 本周的开始时间
    this.endTime = Number(new Date(this.getTime(-6))) + (24 * 60 * 60 * 1000 * 3) + 16 * 60 * 60 * 1000 - 1 // 本周的结束时间

    if (new Date().getDay() == 4 || new Date().getDay() == 5 || new Date().getDay() == 6 ) {
      this.weekDate = [
      new Date(this.startTime) ,
      new Date(this.endTime)]
      const a = moment(this.weekDate[0].getTime()).format(timeFormat).split('-')
      const b  = moment(this.weekDate[1].getTime()).format(timeFormat).split('-')
      this.query.beginDate = a[0] + a[1] + a[2]
      this.query.endDate = b[0] + b[1] + b[2]
      // this.seach()
    } else if (
      new Date().getDay() == 1 || new Date().getDay() == 2 ||
      new Date().getDay() == 3) {
      this.weekDate = [new Date(this.startTime - (24 * 60 * 60 * 1000 * 7)),
      new Date(this.endTime - (24 * 60 * 60 * 1000 * 7))]
      const a = moment(new Date(this.startTime).getTime()).format(timeFormat).split('-')
      const b = moment(new Date(this.endTime).getTime()).format(timeFormat).split('-')
      this.query.beginDate = a[0] + a[1] + a[2]
      this.query.endDate = b[0] + b[1] + b[2]
      // this.seach()
    } else if (new Date().getDay() == 0) {
      this.weekDate = [new Date(this.startTime - (24 * 60 * 60 * 1000 * 6)),
      new Date(this.endTime - (24 * 60 * 60 * 1000 * 6))]
      const a = moment(new Date(this.startTime).getTime()).format(timeFormat).split('-')
      const b = moment(new Date(this.endTime).getTime()).format(timeFormat).split('-')
      this.query.beginDate = a[0] + a[1] + a[2]
      this.query.endDate = b[0] + b[1] + b[2]
      // this.seach()
    }
  }
  // 上周
  seachchgup() {
    if (new Date().getDay() == 5 || new Date().getDay() == 6) {
      let ss = this.startTime
      let ee = this.endTime
      this.weekDate = [
      new Date(ss -= this.datanum ) ,
      new Date(ee -= this.datanum)]
      const a = moment(this.weekDate[0].getTime()).format(timeFormat).split('-')
      const b  = moment(this.weekDate[1].getTime()).format(timeFormat).split('-')
      this.query.beginDate = a[0] + a[1] + a[2]
      this.query.endDate = b[0] + b[1] + b[2]
      this.startTime -= this.datanum
      this.endTime -= this.datanum
      this.seach()
    } else if (new Date().getDay() == 0) {
      let ss = this.startTime - (24 * 60 * 60 * 1000 * 6)
      let ee = this.endTime - (24 * 60 * 60 * 1000 * 6)
      this.weekDate = [
      new Date(ss -= this.datanum ) ,
      new Date(ee -= this.datanum)]
      const a = moment(this.weekDate[0].getTime()).format(timeFormat).split('-')
      const b  = moment(this.weekDate[1].getTime()).format(timeFormat).split('-')
      this.query.beginDate = a[0] + a[1] + a[2]
      this.query.endDate = b[0] + b[1] + b[2]
      this.startTime -= this.datanum
      this.endTime -= this.datanum
      this.seach()
    } else if (
      new Date().getDay() == 1 || new Date().getDay() == 2 ||
      new Date().getDay() == 3 || new Date().getDay() == 4 ) {
      let aa = this.startTime - (24 * 60 * 60 * 1000 * 7)
      let bb = this.endTime - (24 * 60 * 60 * 1000 * 7)
      this.weekDate = [new Date(aa -= this.datanum), new Date(bb -= this.datanum)]
      const a = moment(this.weekDate[0].getTime()).format(timeFormat).split('-')
      const b = moment(this.weekDate[1].getTime()).format(timeFormat).split('-')
      this.query.beginDate = a[0] + a[1] + a[2]
      this.query.endDate = b[0] + b[1] + b[2]
      this.startTime -= this.datanum
      this.endTime -= this.datanum
      this.seach()
    }
  }

  // 下周
  seachchgdown() {
    if (new Date().getDay() == 5 || new Date().getDay() == 6 ) {
      let ss = this.startTime
      let ee = this.endTime
      this.weekDate = [
      new Date(ss += this.datanum ) ,
      new Date(ee += this.datanum)]
      const a = moment(this.weekDate[0].getTime()).format(timeFormat).split('-')
      const b  = moment(this.weekDate[1].getTime()).format(timeFormat).split('-')
      this.query.beginDate = a[0] + a[1] + a[2]
      this.query.endDate = b[0] + b[1] + b[2]
      this.startTime += this.datanum
      this.endTime += this.datanum
      this.seach()
    } else if (new Date().getDay() == 0) {
      let ss = this.startTime - (24 * 60 * 60 * 1000 * 6)
      let ee = this.endTime - (24 * 60 * 60 * 1000 * 6)
      this.weekDate = [
      new Date(ss += this.datanum ) ,
      new Date(ee += this.datanum)]
      const a = moment(this.weekDate[0].getTime()).format(timeFormat).split('-')
      const b  = moment(this.weekDate[1].getTime()).format(timeFormat).split('-')
      this.query.beginDate = a[0] + a[1] + a[2]
      this.query.endDate = b[0] + b[1] + b[2]
      this.startTime += this.datanum
      this.endTime += this.datanum
      this.seach()
    } else if (
      new Date().getDay() == 1 || new Date().getDay() == 2 ||
      new Date().getDay() == 3 ) {
      let ss = this.startTime - (24 * 60 * 60 * 1000 * 7)
      let ee = this.endTime - (24 * 60 * 60 * 1000 * 7)
      this.weekDate = [new Date(ss += this.datanum), new Date(ee += this.datanum)]
      const a = moment(this.weekDate[0].getTime()).format(timeFormat).split('-')
      const b = moment(this.weekDate[1].getTime()).format(timeFormat).split('-')
      this.query.beginDate = a[0] + a[1] + a[2]
      this.query.endDate = b[0] + b[1] + b[2]
      this.startTime += this.datanum
      this.endTime += this.datanum
      this.seach()
     } else if (new Date().getDay() == 4 ) {
      this.weekDate = [new Date(this.startTime += this.datanum), new Date(this.endTime += this.datanum)]
      const a = moment(this.weekDate[0].getTime()).format(timeFormat).split('-')
      const b = moment(this.weekDate[1].getTime()).format(timeFormat).split('-')
      this.query.beginDate = a[0] + a[1] + a[2]
      this.query.endDate = b[0] + b[1] + b[2]
      this.seach()
     }
  }

  getTime(n: any) {
    const now = new Date()
    let year = now.getFullYear()
    // 因为月份是从0开始的,所以获取这个月的月份数要加1才行
    let month = now.getMonth() + 1
    let date = now.getDate()
    const day = now.getDay()

    if (day !== 0 ) {
        n = n + ( day - 1 )
    } else {
        n = n + day
    }
    if ( day ) {
        // 这个判断是为了解决跨年的问题
        if (month > 1) {
            month = month
        } else {  // 这个判断是为了解决跨年的问题,月份是从0开始的
            year = year - 1
            month = 12
        }
    }

    now.setDate( now.getDate() - n )
    year = now.getFullYear()
    month = now.getMonth() + 1
    date = now.getDate()
    const s = year + '-' + ( month < 10 ? ('0' + month ) : month ) + '-' + (date < 10 ? ('0' + date ) : date )
    return s
  }

  async seach() {
    try {

      if (this.query.cinemaId == undefined) {
        info('请选择影院')
        return
      }
      const datalist = await querylist(this.query)
      this.statusList = datalist.data.statusList
      // 列表
      this.itemlist = datalist.data.items == null ? [] : datalist.data.items.map((it: any) => {
        return {
          ...it,
          beginDate: String(it.beginDate).slice(0, 4) + '/' + String(it.beginDate).slice(4, 6)
          + '/' + String(it.beginDate).slice(6, 8),
          endDate: String(it.endDate).slice(0, 4) + '/' + String(it.endDate).slice(4, 6) + '/'
          + String(it.endDate).slice(6, 8),
          fileName: it.fileName == null ? '' : it.fileName,
          statusText: getstatus(it.status , this.statusList),
          videoTotalLengths: String(it.videoTotalLength) + 's',
          alimg: it.imgs.length == 0 ? '' : it.imgs[it.imgs.length - 1].fileUrl
        }
      })
      this.deliveryPositionList = datalist.data.deliveryPositionList
      this.fixRefusesList = datalist.data.fixRefusesList
      // 通投
      const a = datalist.data.normal
      this.normallist = datalist.data.normal == null ? [] : datalist.data.normal = [{
        ...datalist.data.normal,
        beginDate: String(a.beginDate).slice(0, 4) + '/' + String(a.beginDate).slice(4, 6)
          + '/' + String(a.beginDate).slice(6, 8),
        endDate: String(a.endDate).slice(0, 4) + '/' + String(a.endDate).slice(4, 6) + '/'
          + String(a.endDate).slice(6, 8),
        movieName: '通投',
        fileName: a.fileName == null ? '' : a.fileName,
        statusText: getstatus(a.status , this.statusList),
        videoTotalLengths: String(a.videoTotalLength) + 's',
        alimg: a.imgs.length == 0 ? '' : a.imgs[a.imgs.length - 1]
      }]
      this.asd = false

    } catch (ex) {
      this.handleError(ex)
    } finally {
    }
  }

  // 查看图片，视频
  onView(url: string) {
    this.viewerImage = url
    this.viewerShow = true
  }

  onViewVideo(src: any) {
    this.addOrUpdateVisibleVideo = true
    this.$nextTick(() => {
      const myThis: any = this
      myThis.$refs.addOrUpdateVideo.init(src)
    })
  }

  @Watch('ossUrl', {deep: true})
  watchQuery() {
  }

  @Watch('weekDate', {deep: true})
  watchWeekDate() {
    const aa = moment(this.weekDate[0].getTime()).format(timeFormat).split('-')
    const bb = moment(this.weekDate[1].getTime()).format(timeFormat).split('-')
    this.query.beginDate =  aa[0] + aa[1] + aa[2]
    this.query.endDate =  bb[0] + bb[1] + bb[2]
    // if (this.asd == false) {
      this.seach()
    // }
  }

}
</script>

<style lang="less" scoped>
.page {
  padding-left: 30px;
  padding-right: 40px;
  list-style: none;
}
.t-title {
  width: 100%;
  height: 50px;
  border-radius: 2px 2px 0 0;
  line-height: 50px;
  font-size: 24px;
  font-weight: 400;
  color: #fff;
}
.title-tip {
  margin-top: 20px;
  width: 100%;
  background: #00202d;
  line-height: 32px;
  font-size: 15px;
  font-weight: 400;
  color: #fff;
  padding: 30px 0 27px 30px;
  border-radius: 5px 0 0 0;
  opacity: .9;
  height: 188px;
  .tip-left {
    float: left;
    width: 80%;
  }
  .tip-right {
    width: 14%;
    float: right;
    padding-top: 32px;
    span {
      display: block;
      width: 48px;
      height: 48px;
      margin-left: 11%;
      background: #4fa6bb;
      border-radius: 50%;
      cursor: pointer;
      img {
        width: 50%;
        height: 61%;
        margin: 21% 0 0 31%;
      }
    }
    em {
      color: rgba(79, 166, 187, 1);
      font-size: 14px;
      cursor: pointer;
    }
  }
}
.body {
  width: 100%;
  margin-top: 10px;
  padding-top: 10px;
}
.chb {
  span {
    display: inline-block;
    width: 30%;
    height: 40px;
    margin-right: 5px;
    text-align: center;
    line-height: 40px;
    font-size: 14px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 5px;
    border: 1px solid rgba(255, 255, 255, 1);
    cursor: pointer;
    color: #00202d;
  }
}
.li-title {
  color: #00202d;
  // padding: 0 10px 0 10px;
  height: 40px;
  background: #c2d6e3;
  line-height: 40px;
  font-size: 14px;
}
.li-item {
  color: #00202d;
  // padding: 0 10px 0 10px;
  line-height: 47px;
  font-size: 14px;
  background: #abcbdd;
  border-bottom: 1px solid rgba(255, 255, 255, 0.26);
  .imgs1 {
    display: inline-block;
    width: 20px;
    height: 20px;
    // border: 1px solid #ccc;
    background: url('./assets/wait.png');
    background-size: cover;
    margin-right: 2px;
    position: absolute;
    top: 10px;
  }
  .imgs2 {
    display: inline-block;
    width: 20px;
    height: 20px;
    // border: 1px solid #ccc;
    background: url('./assets/over.png');
    background-size: cover;
    margin-right: 2px;
    position: absolute;
    top: 10px;
  }
  .imgs3 {
    display: inline-block;
    width: 20px;
    height: 20px;
    // border: 1px solid #ccc;
    background: url('./assets/dels.png');
    background-size: cover;
    margin-right: 2px;
    position: absolute;
    top: 10px;
  }
}
.data {
  height: 40px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 1);
}
.data-s {
  margin-top: 4px;
  margin-left: 15%;
  font-size: 14px;
}
.txtali {
  text-align: center;
}
// /deep/ .ivu-btn:hover {
//   color: #000;
//   border-color: #f2f2f2;
//   background: #f2f2f2;
// }
// /deep/ .ivu-btn {
//   border-color: #f2f2f2;
//   background: #f2f2f2;
// }
// /deep/ .ivu-btn:focus {
//   box-shadow: 0;
// }
/deep/ .ivu-select-selection {
  height: 40px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 1);
}
/deep/ .ivu-select-input {
  margin-top: 3px;
  color: #00202d;
  &::-webkit-input-placeholder {
    color: #00202d;
  }
}
/deep/ .oss-uploader-mini {
  display: inline-block;
  width: 40%;
  margin-right: 5%;
  height: 32px;
  border: 0;
  border-radius: 0;
  margin-top: 6px;
  i {
    font-size: 12px !important;
  }
}
.aclick {
  background: #5cade2;
  cursor: pointer;
  color: #fff;
  border-radius: 5px;
  width: 32%;
  height: 32px;
  text-align: center;
  line-height: 32px;
  font-size: 12px;
  float: left;
  margin-left: 5%;
  margin-top: 6px;
}
/deep/ .oss-uploader-mini .action-all {
  top: -11px;
  right: -10px;
}
/deep/ .oss-uploader-mini .action-done {
  left: 38px;
  width: auto;
}
/deep/ .up1 .ivu-icon-ios-cloud-upload::before {
  content: '上传监播视频';
}
/deep/ .up2 .ivu-icon-ios-cloud-upload::before {
  content: '上传TMS截图';
}
/deep/ .handle-in {
  width: 80%;
  background: #5cade2;
  flex-direction: column;
  cursor: pointer;
  color: #fff;
  border-radius: 5px;
}
/deep/ .ivu-table-wrapper {
  margin: 0;
}
/deep/ .ivu-table th {
  background: #c2d6e3 !important;
  color: #00202d;
  font-weight: normal;
}
/deep/ .ivu-table td {
  background: #abcbdd;
  color: #00202d;
  font-weight: normal;
}
a:hover, /deep/ .handle-in:hover {
  color: #fff;
}
/deep/ tr.ivu-table-row-hover td {
  background: #abcbdd;
}
/deep/ .ivu-table-row {
  border-bottom: 1px solid #ccc;
}
.mar {
  margin-left: 13%;
}

</style>
