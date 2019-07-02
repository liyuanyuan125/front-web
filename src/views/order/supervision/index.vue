<template>
  <div class="page">
    <div class='t-title'>监播管理</div>
    <div class='title-tip'>
    	请按照影片在下方列表中上传广告监播视频,</br>
要求露出所包含的全部广告视频以及对应的影片片头信息、格式为 mp4
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
            placeholder="请输入影院名称/专资编码查询" 
            remote
            :loading="loading"
            :remote-method="remoteMethod"
            @on-clear="movieList = []"
            @on-change="seachs">
              <Option
                v-for="item in movieList"
                :key="item.id"
                :value="item.id"
              >{{item.shortName}}</Option>
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
      <div style=' margin-top: 15px; '>
      	<Row class='li-title'>
          <Col span='3' >影片名称</Col>
          <Col span='2' >总投放时长</Col>
          <Col span='14'>广告列表</Col>
          <Col span='5' style='text-align: center;'>监播视频</Col>
        </Row>
        <ul class='itemul'>
        	<li class='li-item' v-for='(it,index) in itemlist' :key='index'>
        		<row>
        			<Col span='3'>{{it.movieName}}</Col>
        			<Col span='2' >{{it.videoTotalLength}}s</Col>
        			<Col span='14'>
        				<row>
                  <Col style='color: #00202D;cursor: pointer;' :span='6' v-for='(item,index) in it.details' :key='index'>
                    <Tooltip v-if='item.videoName.length > 7' :content="item.videoName">
                    <router-link style='color: #00202D;' :to="{path:'/order/dispatch' , params: {}}">{{item.videoName.slice(0,7)}}...</router-link>
                  </Tooltip>
                <router-link style='color: #00202D;' tag="a" :to="{path:'/order/dispatch' , params: {}}" v-if='item.videoName.length <= 7'>{{item.videoName}}</router-link>
                  ({{item.videoLength}}s)
                  </Col>
                </row>
        			</Col>
        			<Col span='5' style='text-align: center;cursor: pointer;' v-if='it.status == 1' ><UploadButton @success="onUploadSuccess($event, it.id)">上传</UploadButton></Col>
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


const timeFormat = 'YYYY-MM-DD'

@Component({
  components: {
    UploadButton,
    WeekDatePicker
  }
})
export default class Main extends ViewBase {

  startTime: any = Number(new Date(this.getTime(0))) + (24 * 60 * 60 * 1000 * 3) - 8 * 60 * 60 * 1000
  endTime: any = Number(new Date(this.getTime(-6))) + (24 * 60 * 60 * 1000 * 3) + 16 * 60 * 60 * 1000 - 1
  datanum: any = 24 * 60 * 60 * 1000 * 7 // 一周的时间戳

  weekDate = [new Date(this.startTime), new Date(this.endTime)]

  sd = moment(this.weekDate[0].getTime()).format(timeFormat).split('-')
  ed = moment(this.weekDate[1].getTime()).format(timeFormat).split('-')

  query: any = {
    cinemaId: null,
    beginDate: this.sd[0] + this.sd[1] + this.sd[2],
    endDate: this.ed[0] + this.ed[1] + this.ed[2],
  }

  movieList: any = []
  loading = false
  asd = false


  itemlist: any = []



  async mounted() {
    // this.asd = true
    // this.remoteMethod('')
    const cinid = await getcinid()
    if (cinid.data.cinemaId == 0) {
      info('当前用户下没有关联影院')
      this.query.cinemaId = cinid.data.cinemaId
    } else {
      this.query.cinemaId = cinid.data.cinemaId
      this.remoteMethod(cinid.data.cinemaName)
    }
    if (new Date().getDay() == 5 || new Date().getDay() == 6 || new Date().getDay() == 0) {
      this.weekDate = [
      new Date(this.startTime + (24 * 60 * 60 * 1000 * 7)) ,
      new Date(this.endTime + (24 * 60 * 60 * 1000 * 7))]
      const a = moment(this.weekDate[0].getTime()).format(timeFormat).split('-')
      const b  = moment(this.weekDate[1].getTime()).format(timeFormat).split('-')
      this.query.beginDate = a[0] + a[1] + a[2]
      this.query.endDate = b[0] + b[1] + b[2]
      this.seach()
    } else if (new Date().getDay() == 1 || new Date().getDay() == 2 || new Date().getDay() == 3 ) {
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
    this.seachchg()
  }

  // 上传文件
  async onUploadSuccess({ files }: SuccessEvent, id: number) {
    // console.log(files)
      try {
        await addvideo (id , {
                        fileName: files[0].clientName,
                        fileId: files[0].fileId
                      })
        this.$Message.success({
          content: `更改成功`,
        })
        this.reloadSearch()
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
    } else if (new Date().getDay() == 1 || new Date().getDay() == 2 || new Date().getDay() == 3 ) {
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
    } else if (new Date().getDay() == 1 || new Date().getDay() == 2 || new Date().getDay() == 3 ) {
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
    } else if (new Date().getDay() == 1 || new Date().getDay() == 2 || new Date().getDay() == 3 ) {
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
      this.itemlist = datalist.data.items
      this.asd = false

    } catch (ex) {
      this.handleError(ex)
    } finally {
    }
  }

  // @Watch('query', {deep: true})
  // watchQuery() {
  //   if (this.query.cinemaId == null) {
  //     return
  //   }
  //   this.seach()
  // }

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
  background: rgba(0, 32, 45, 1);
  line-height: 32px;
  font-size: 16px;
  font-weight: 400;
  color: #fff;
  padding: 35px 0 35px 30px;
  border-radius: 5px 0 0 0;
  opacity: 0.9;
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
    border: 1px solid #ccc;
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
    border: 1px solid #ccc;
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
    border: 1px solid #ccc;
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
}
</style>
