<template>
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
        <Col :span="10">
          <Col style='margin-left: 12px;' span="14">
            <Select
            v-model='query.cinemaId'
            clearable
            filterable
            placeholder="请输入专资编码或影院名称"
            remote
            :loading="loading"
            :remote-method="remoteMethod"
            @on-clear="movieList = []"
            @on-change="seachs">
              <Option
                v-for="(item, index) in movieList"
                :key="index"
                :value="item.id"
              >【{{item.code}}】{{item.shortName}}</Option>
            </Select>
          </Col>
        </Col>
        <Col span='8' class='chb'>
          <!-- <RadioGroup v-model='chgkey.status' type="button" @on-change='seachchg'>
              <Radio v-for='(it,index) in timechg' :key='it.key' :value='it.key' :label='it.key'>{{it.name}}</Radio>
            </RadioGroup> -->
            <!-- <span v-model='chgkey.status' v-for='(it,index) in timechg' :key='index' :value='it.key' @click='seachchg' :label='it.key'>{{it.name}}</span> -->
            <span @click='seachchgup'><&nbsp;上周</span>
            <span @click='seachchg'>本周</span>
            <span @click='seachchgdown'>下周&nbsp;></span>
        </Col>
      </Row>
      <Row style='margin-top: 15px;'>
        <li class='li-item' v-if='normallist.length != 0'>
            <row>
              <Col span='3'>通投</Col>
              <Col span='2' >{{normallist.videoTotalLength}}s</Col>
              <Col span='14'>
                <row>
                  <Col style='color: #00202D;cursor: pointer;' :span='6' v-for='(item,index) in normallist.details' :key='index' v-if='item.deleted == false && item.offShelfStatus == 1'>
                    <Tooltip v-if='item.videoName.length > 7' :content="item.videoName">
                        <router-link style='color: #00202D;' :to="{ name: 'order-dispatch-details', params: { id: item.orderId }}">
                           <em v-for='(its,index) in deliveryPositionList' :key='index' v-if='item.deliveryPosition != null && item.deliveryPosition == its.key'>【{{its.text}}】</em>
                          {{item.videoName.slice(0,7)}}...
                        </router-link>
                      </Tooltip>
                    <router-link style='color: #00202D;' tag="a" :to="{ name: 'order-dispatch-details', params: { id: item.orderId }}" v-if='item.videoName.length <= 7'>
                      <em v-for='(its,index) in deliveryPositionList' :key='index' v-if='item.deliveryPosition != null && item.deliveryPosition == its.key'>【{{its.text}}】</em>
                      {{item.videoName}}
                    </router-link>
                  ({{item.videoLength}}s)
                  </Col>
                </row>
              </Col>
              <Col span='5' style='text-align: center;cursor: pointer;' v-if='normallist.status == 1' >

                <!-- <UploadButton @success="onUploadSuccess($event, normallist.id)">上传</UploadButton> -->
                <OssUploader :param="{fileType: 3, subCategory: 2}" mini @done="onUploadSuccess($event , normallist.id)"/>

              </Col>
              <Col span='5' v-if='normallist.status == 2' style='text-align: center;'><Tooltip v-if='normallist.fileName.length > 15' :content="normallist.fileName">{{normallist.fileName.slice(0,15)}}...</Tooltip><span v-else>{{normallist.fileName}}</span>&nbsp;&nbsp;<div class='imgs1'></div>&nbsp;&nbsp;&nbsp;<a style='margin-left: 20px;' @click='dels(normallist.id)'>删除</a> </Col>
              <Col span='5' v-if='normallist.status == 3' style='text-align: center;'><Tooltip v-if='normallist.fileName.length > 15' :content="normallist.fileName">{{normallist.fileName.slice(0,15)}}...</Tooltip><span v-else>{{normallist.fileName}}</span>&nbsp;&nbsp;<div v-if='normallist.status == 3' class='imgs2'></div></Col>
              <Col span='5' v-if='normallist.status == 4' style='text-align: center;'><Tooltip v-if='normallist.fileName.length > 15' :content="normallist.fileName">{{normallist.fileName.slice(0,15)}}...</Tooltip><span v-else>{{normallist.fileName}}</span>&nbsp;&nbsp;<div v-if='normallist.status == 4' class='imgs3'></div>&nbsp;&nbsp;&nbsp;<a style='margin-left: 20px;' @click='dels(normallist.id)'>删除</a> </Col>
            </row>
          </li>
          <!-- <div  v-if='normallist.length == 0' style='text-align: center;line-height: 50px;'>暂无通投数据</div> -->
      </Row>
      <!-- <OssUploader v-model="ossUrl" :param="{fileType: 3, subCategory: 2}" mini /> -->
      <div style=' margin-top: 15px; '>
        <Row class='li-title'>
          <Col span='3' >影片名称</Col>
          <Col span='2' >总投放时长</Col>
          <Col span='14'>广告列表</Col>
          <Col span='5' style='text-align: center;'>监播视频</Col>
        </Row>
        <ul class='itemul'>
          <li class='li-item' v-for='(it,index) in itemlist' :key='it.id'>
            <row>
              <Col span='3'>{{it.movieName}}</Col>
              <Col span='2' >{{it.videoTotalLength}}s</Col>
              <Col span='14'>
                <row>
                  <Col style='color: #00202D;cursor: pointer;' :span='6' v-for='(item,index) in it.details' :key='index'  v-if='item.deleted == false && item.offShelfStatus == 1'>
                    <Tooltip v-if='item.videoName.length > 7' :content="item.videoName">
                    <router-link style='color: #00202D;' :to="{ name: 'order-dispatch-details', params: { id: it.orderId }}">
                      <em v-for='(its,index) in deliveryPositionList' :key='index' v-if='item.deliveryPosition != null && item.deliveryPosition == its.key'>【{{its.text}}】</em>
                        {{item.videoName.slice(0,7)}}...
                      </router-link>
                  </Tooltip>
                <router-link style='color: #00202D;' tag="a" :to="{ name: 'order-dispatch-details', params: { id: it.orderId }}" v-if='item.videoName.length <= 7'>
                      <em v-for='(its,index) in deliveryPositionList' :key='index' v-if='item.deliveryPosition != null && item.deliveryPosition == its.key'>【{{its.text}}】</em>
                        {{item.videoName}}
                      </router-link>
                  ({{item.videoLength}}s)
                  </Col>
                </row>
              </Col>
              <Col span='5' style='text-align: center;cursor: pointer;' v-if='it.status == 1' >
                <OssUploader :param="{fileType: 3, subCategory: 2}" mini @done="onUploadSuccess($event , it.id)"/>
              </Col>
              <Col span='5' v-if='it.status == 2' style='text-align: center;'><Tooltip v-if='it.fileName.length > 15' :content="it.fileName">{{it.fileName.slice(0,15)}}...</Tooltip><span v-else>{{it.fileName}}</span>&nbsp;&nbsp;<div class='imgs1'></div>&nbsp;&nbsp;&nbsp;<a style='margin-left: 20px;' @click='dels(it.id)'>删除</a> </Col>
              <Col span='5' v-if='it.status == 3' style='text-align: center;'><Tooltip v-if='it.fileName.length > 15' :content="it.fileName">{{it.fileName.slice(0,15)}}...</Tooltip><span v-else>{{it.fileName}}</span>&nbsp;&nbsp;<div v-if='it.status == 3' class='imgs2'></div></Col>
              <Col span='5' v-if='it.status == 4' style='text-align: center;'><Tooltip v-if='it.fileName.length > 15' :content="it.fileName">{{it.fileName.slice(0,15)}}...</Tooltip><span v-else>{{it.fileName}}</span>&nbsp;&nbsp;<div v-if='it.status == 4' class='imgs3'></div>&nbsp;&nbsp;&nbsp;<a style='margin-left: 20px;' @click='dels(it.id)'>删除</a> </Col>
            </row>
          </li>
          <li v-if='itemlist.length == 0' style='text-align: center;line-height: 50px;'>暂无数据</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component , Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import moment from 'moment'
import { querylist ,  getcinid , addvideo , delvideo , movielist } from '@/api/supervision'
import { formatTimestamp } from '@/util/validateRules'
import UploadButton, { SuccessEvent } from '../components/UploadButton.vue'
import WeekDatePicker from '@/components/weekDatePicker'
import { confirm , toast , info } from '@/ui/modal'
import VideoPreviewer from '@/components/videoPreviewer'
import OssUploader from '@/components/ossUploader'


const timeFormat = 'YYYY-MM-DD'

@Component({
  components: {
    UploadButton,
    WeekDatePicker,
    VideoPreviewer,
    OssUploader
  }
})
export default class Main extends ViewBase {

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
  }

  movieList: any = []
  loading = false
  asd = false

  ossUrl: any = null
  fileUrl: any = null
  fileSize: any = null


  itemlist: any = []
  normallist: any = []


  // 广告片投放位置
  deliveryPositionList: any = []




  async mounted() {
    // this.asd = true
    // this.remoteMethod('')
    const cinid = await getcinid()
    if (cinid.data.cinemaId == 0) {
      info('当前用户下没有关联影院')
      return
      // this.query.cinemaId = cinid.data.cinemaId
    } else {
      this.query.cinemaId = cinid.data.cinemaId
      this.remoteMethod(cinid.data.cinemaName)
    }
    if (new Date().getDay() == 5 || new Date().getDay() == 6) {
      this.weekDate = [
      new Date(this.startTime + (24 * 60 * 60 * 1000 * 7)) ,
      new Date(this.endTime + (24 * 60 * 60 * 1000 * 7))]
      const a = moment(this.weekDate[0].getTime()).format(timeFormat).split('-')
      const b  = moment(this.weekDate[1].getTime()).format(timeFormat).split('-')
      this.query.beginDate = a[0] + a[1] + a[2]
      this.query.endDate = b[0] + b[1] + b[2]
      this.seach()
    } else if (new Date().getDay() == 1 || new Date().getDay() == 2 || new Date().getDay() == 3 ) {
      this.weekDate = [
      new Date(this.startTime - (24 * 60 * 60 * 1000 * 7)) ,
      new Date(this.endTime - (24 * 60 * 60 * 1000 * 7))]
      this.query.beginDate = this.ad[0] + this.ad[1] + this.ad[2]
      this.query.endDate = this.bd[0] + this.bd[1] + this.bd[2]
      this.seach()
      return
    }
    if (new Date().getDay() == 4) {
      this.seach()
    }
    if (new Date().getDay() == 0) {
      this.weekDate = [
      new Date(this.startTime + (24 * 60 * 60 * 1000 * 1)) ,
      new Date(this.endTime + (24 * 60 * 60 * 1000 * 1))]
      const a = moment(this.weekDate[0].getTime()).format(timeFormat).split('-')
      const b  = moment(this.weekDate[1].getTime()).format(timeFormat).split('-')
      this.query.beginDate = a[0] + a[1] + a[2]
      this.query.endDate = b[0] + b[1] + b[2]
      this.seach()
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
        this.movieList = items || []
      }
      this.loading = false
    } catch (ex) {
      this.handleError(ex)
      this.loading = false
    }
  }


  seachs() {
    if (this.query.cinemaId == undefined) {
      return
    }
    this.seach()
  }

  reloadSearch() {
    this.seach()
    // this.seachchg()
  }

  // 上传文件
  async onUploadSuccess(ev: any, id: number) {
      try {
        await addvideo (id , {
                        fileUrl: ev.url,
                        size: ev.file.size,
                        fileName: ev.file.name
                      })
        this.$Message.success({
          content: `更改成功`,
        })
        // setTimeout(() => {
          // (this.$Spin as any).hide()
          this.seach()
        // }, 1000)
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

  // 本周
  seachchg() {
    /***参数都是以周一为基准的***/
    this.startTime = Number(new Date(this.getTime(0))) + (24 * 60 * 60 * 1000 * 3) - 8 * 60 * 60 * 1000  // 本周的开始时间
    this.endTime = Number(new Date(this.getTime(-6))) + (24 * 60 * 60 * 1000 * 3) + 16 * 60 * 60 * 1000 - 1 // 本周的结束时间

    if (new Date().getDay() == 5 || new Date().getDay() == 6 || new Date().getDay() == 0) {
      this.weekDate = [
      new Date(this.startTime + (24 * 60 * 60 * 1000 * 7)) ,
      new Date(this.endTime + (24 * 60 * 60 * 1000 * 7))]
      const a = moment(this.weekDate[0].getTime()).format(timeFormat).split('-')
      const b  = moment(this.weekDate[1].getTime()).format(timeFormat).split('-')
      this.query.beginDate = a[0] + a[1] + a[2]
      this.query.endDate = b[0] + b[1] + b[2]
      // this.seach()
    } else if (
      new Date().getDay() == 1 || new Date().getDay() == 2 ||
      new Date().getDay() == 3 || new Date().getDay() == 4 ) {
      this.weekDate = [new Date(this.startTime), new Date(this.endTime)]
      const a = moment(new Date(this.startTime).getTime()).format(timeFormat).split('-')
      const b = moment(new Date(this.endTime).getTime()).format(timeFormat).split('-')
      this.query.beginDate = a[0] + a[1] + a[2]
      this.query.endDate = b[0] + b[1] + b[2]
      // this.seach()
    }
  }
  // 上周
  seachchgup() {
    if (new Date().getDay() == 5 || new Date().getDay() == 6 || new Date().getDay() == 0) {
      let ss = this.startTime + (24 * 60 * 60 * 1000 * 7)
      let ee = this.endTime + (24 * 60 * 60 * 1000 * 7)
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
      this.weekDate = [new Date(this.startTime -= this.datanum), new Date(this.endTime -= this.datanum)]
      const a = moment(this.weekDate[0].getTime()).format(timeFormat).split('-')
      const b = moment(this.weekDate[1].getTime()).format(timeFormat).split('-')
      this.query.beginDate = a[0] + a[1] + a[2]
      this.query.endDate = b[0] + b[1] + b[2]
      this.seach()
    }
  }

  // 下周
  seachchgdown() {
    if (new Date().getDay() == 5 || new Date().getDay() == 6 || new Date().getDay() == 0) {
      let ss = this.startTime + (24 * 60 * 60 * 1000 * 7)
      let ee = this.endTime + (24 * 60 * 60 * 1000 * 7)
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
      new Date().getDay() == 3 || new Date().getDay() == 4 ) {
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

      // 影院列表
      // const movieList = await movielist()
      // this.movieList = movieList.data.items
      // if (this.asd == true) {
      //   // 获取默认影院id
      //   const cinid = await getcinid()
      //   if (cinid.data.cinemaId == 0) {
      //     info('当前用户下没有关联影院')
      //     this.query.cinemaId = cinid.data.cinemaId
      //   } else {
      //     this.query.cinemaId = cinid.data.cinemaId
      //     this.remoteMethod(cinid.data.cinemaName)
      //   }
      // }
      if (this.query.cinemaId == undefined) {
        info('请选择影院')
        return
      }
      const datalist = await querylist(this.query)
      this.itemlist = datalist.data.items == null ? [] : datalist.data.items
      this.deliveryPositionList = datalist.data.deliveryPositionList
      this.normallist = datalist.data.normal == null ? [] : datalist.data.normal
      this.asd = false

    } catch (ex) {
      this.handleError(ex)
    } finally {
    }
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
  padding: 0 10px 0 10px;
  height: 40px;
  background: #c2d6e3;
  line-height: 40px;
  font-size: 14px;
}
.li-item {
  color: #00202d;
  padding: 0 10px 0 10px;
  line-height: 40px;
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
/deep/ .ivu-btn:hover {
  color: #000;
  border-color: #f2f2f2;
  background: #f2f2f2;
}
/deep/ .ivu-btn {
  border-color: #f2f2f2;
  background: #f2f2f2;
}
/deep/ .ivu-btn:focus {
  box-shadow: 0;
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
  &::-webkit-input-placeholder {
    color: #00202d;
  }
}
/deep/ .oss-uploader-mini {
  width: 68px;
  height: 20px;
  border: 0;
  border-radius: 0;
  margin-left: 39%;
  margin-top: 7px;
}
/deep/ .oss-uploader-mini .action-all {
  top: -11px;
  right: -10px;
}
/deep/ .oss-uploader-mini .action-done {
  left: 38px;
  width: auto;
}
</style>
