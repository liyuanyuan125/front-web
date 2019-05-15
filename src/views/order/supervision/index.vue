<template>
  <div class="page">
    <div class='t-title'>监播管理</div>
    <div class='title-tip'>
    	请按照影片在下方列表中上传广告监播视频,</br>
要求露出所包含的全部广告视频以及对应的影片片头信息、格式为 mp4
    </div>
    <div class='body'>
      <Row class='row-ul'>
       <Col span='6'><WeekDatePicker v-model="weekDate"/></Col>
        <Col :span="14">
          <Col style='margin-left: 12px;' span="8">
            <Select v-model='query.id' clearable  filterable  @on-change="seachs">
              <Option
                v-for="item in typeList"
                :key="item.key"
                :value="item.key"
                v-if='item.key!=0'
              >{{item.name}}（“未上传监播+监播文件审核未通过”）</Option>
            </Select>
          </Col>
        </Col>
        <Col span='4' class='chb'>
          <!-- <RadioGroup v-model='chgkey.status' type="button" @on-change='seachchg'>
              <Radio v-for='(it,index) in timechg' :key='it.key' :value='it.key' :label='it.key'>{{it.name}}</Radio>
            </RadioGroup> -->
            <!-- <span v-model='chgkey.status' v-for='(it,index) in timechg' :key='index' :value='it.key' @click='seachchg' :label='it.key'>{{it.name}}</span> -->
            <span @click='seachchgup'><&nbsp;上周</span>
            <span @click='seachchg'>本周</span>
            <span @click='seachchgdown'>下周&nbsp;></span>
        </Col>
      </Row>
      <div style='border: 1px solid #ccc;margin-top: 15px;border-bottom: 0px'>
      	<Row class='li-title'>
          <Col span='3'>影片名称</Col>
          <Col span='2' style='text-align: center;'>总投放时长</Col>
          <Col span='16'>广告列表</Col>
          <Col span='3' style='text-align: center;'>监播视频</Col>
        </Row>
        <ul class='itemul'>
        	<li class='li-item' v-for='(it,index) in itemlist' :key='index'>
        		<row>
        			<Col span='3'>{{it.name}}</Col>
        			<Col span='2' style='text-align: center;'>{{it.time}}</Col>
        			<Col span='16'>
        				<row>
                  <Col style='color: blue;cursor: pointer;' :span='6' v-for='(item,index) in it.list' :key='index'>
                    <Tooltip v-if='item.name.length > 7' :content="item.name">
                    <router-link :to="{path:'/order/dispatch' , params: {}}">{{item.name.slice(0,7)}}...</router-link>
                  </Tooltip>
                <router-link tag="a" :to="{path:'/order/dispatch' , params: {}}" v-if='item.name.length <= 7'>{{item.name}}</router-link>
                  ({{item.time}})
                  </Col>
                </row>
        			</Col>
        			<Col span='3' style='text-align: center;cursor: pointer;' v-if='it.video.key == 1' ><UploadButton @success="onUploadSuccess($event, 12)">上传</UploadButton></Col>
              <Col span='3' v-if='it.video.key == 2'>{{it.video.name}}&nbsp;&nbsp;<div class='imgs1'></div> </Col>
              <Col span='3' v-if='it.video.key == 3'>{{it.video.name}}&nbsp;&nbsp;<div v-if='it.video.key == 3' class='imgs2'></div>&nbsp;&nbsp;&nbsp;<span>删除</span></Col>
              <Col span='3' v-if='it.video.key == 4'>{{it.video.name}}&nbsp;&nbsp;<div v-if='it.video.key == 4' class='imgs3'></div>&nbsp;&nbsp;&nbsp;<span>删除</span></Col>
        		</row>
        	</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import moment from 'moment'
import { querylist  } from '@/api/supervision'
import { formatTimestamp } from '@/util/validateRules'
import UploadButton, { SuccessEvent } from '@/components/UploadButton.vue'
import WeekDatePicker from '@/components/weekDatePicker'


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


  query: any = {
    id: 2,
  }

  typeList: any = [
    { key: 1, name: '123', time: '50s' },
    { key: 2, name: '123', time: '50s' },
    { key: 3, name: '123', time: '50s' },
  ]


  itemlist: any = []



  mounted() {
    this.seach()
    this.seachchg()
  }


  seachs() {
    this.seach()
  }

  reloadSearch() {
    this.seach()
    this.seachchg()
  }

  // 上传文件
  async onUploadSuccess({ files }: SuccessEvent, key: number) {
    // console.log(files)
      try {
        // await addvideo (this.$route.params.id , {
        //                                         name: files[0].clientName,
        //                                         fileId: files[0].fileId,
        //                                         typeCode: key
        //                                       })
        // toast('操作成功')
        this.seach()
      } catch (ex) {
        this.handleError(ex)
      }
  }

  // 本周
  seachchg() {
    /***参数都是以周一为基准的***/
    this.startTime = Number(new Date(this.getTime(0))) + (24 * 60 * 60 * 1000 * 3) - 8 * 60 * 60 * 1000  // 本周的开始时间
    this.endTime = Number(new Date(this.getTime(-6))) + (24 * 60 * 60 * 1000 * 3) + 16 * 60 * 60 * 1000 - 1 // 本周的结束时间

    // console.log(new Date(this.startTime))
    // console.log(new Date(this.endTime))
  }

  // 上周
  seachchgup() {
      // console.log(new Date(this.startTime -= this.datanum))
      // console.log(new Date(this.endTime -= this.datanum))
  }

  // 下周
  seachchgdown() {
      // console.log(new Date(this.startTime += this.datanum))
      // console.log(new Date(this.endTime += this.datanum))
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
      const datalist = await querylist(this.query)
      this.itemlist = datalist.data.items
      // console.log(this.itemlist)
      // this.typeList = datalist.data.statusList
      // this.planTypeList = datalist.data.planTypeList
      // this.itemlist = (datalist.data.items || []).map((it: any) => {
      //   return {
      //     ...it,
      //     createTime: moment(it.createTime).format(timeFormat),
      //     beginDate: moment(it.beginDate).format(timeFormat),
      //     endDate: moment(it.endDate).format(timeFormat)
      //   }
      // })
    } catch (ex) {
      this.handleError(ex)
    } finally {
    }
  }

}
</script>

<style lang="less" scoped>
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
.title-tip {
  margin-top: 20px;
  width: 100%;
  height: 85px;
  background: rgba(249, 249, 249, 1);
  border-radius: 2px 2px 0 0;
  line-height: 20.5px;
  font-size: 12px;
  font-weight: 400;
  color: rgba(36, 129, 215, 1);
  padding: 20px 0 0 30px;
  .img-w1 {
    display: inline-block;
    width: 20px;
    height: 17px;
    border: 1px solid #ccc;
    background: url('./assets/wait.jpg');
    background-size: cover;
    margin-left: 2px;
  }
  .img-w2 {
    display: inline-block;
    width: 20px;
    height: 17px;
    border: 1px solid #ccc;
    background: url('./assets/over.jpg');
    background-size: cover;
    margin-left: 2px;
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
    height: 32px;
    margin-right: 5px;
    text-align: center;
    line-height: 32px;
    font-size: 14px;
    background: rgba(249, 249, 249, 1);
  }
}
.li-title {
  // margin-top: 10px;
  padding: 0 10px 0 10px;
  height: 40px;
  background: #f2f2f2;
  line-height: 40px;
  font-size: 14px;
  border-bottom: 1px solid #ccc;
}
.li-item {
  padding: 0 10px 0 10px;
  line-height: 40px;
  font-size: 14px;
  border-bottom: 1px solid #ccc;
  .imgs1 {
    display: inline-block;
    width: 20px;
    height: 17px;
    border: 1px solid #ccc;
    background: url('./assets/over.jpg');
    background-size: cover;
    margin-right: 2px;
  }
  .imgs2 {
    display: inline-block;
    width: 20px;
    height: 17px;
    border: 1px solid #ccc;
    background: url('./assets/wait.jpg');
    background-size: cover;
    margin-right: 2px;
  }
  .imgs3 {
    display: inline-block;
    width: 20px;
    height: 17px;
    border: 1px solid #ccc;
    background: url('./assets/err.jpg');
    background-size: cover;
    margin-right: 2px;
  }
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
</style>
