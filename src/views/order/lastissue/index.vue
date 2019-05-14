<template>
  <div class="page">
    <div class='t-title'>上刊管理</div>
    <div class='title-tip'>
    	下方仅显示需要上刊的广告,请及时确认上刊</br>
    	图例<div class='img-w1'></div>，表示需要排播，请先点击广告名称下载对应格式的DCP包并在影院的TMS系统中进行排播，然后再点击该图标即可设为“已排”</br>
		图例<div class='img-w2'></div> ，表示已排，点击可设为“未排”
    </div>
    <div class='body'>
      <Row class='row-ul'>
       <Col span='6'> <WeekDatePicker v-model="weekDate"/></Col>
        <Col :span="14">
          <Col style='margin-left: 12px;' span="8">
            <Select v-model='query.id' clearable  filterable  @on-change="seachs">
              <Option
                v-for="item in typeList"
                :key="item.key"
                :value="item.key"
                v-if='item.key!=0'
              >{{item.name}}(item.time)</Option>
            </Select>
          </Col>
        </Col>
        <Col span='4' class='chb'>
        	<!-- <RadioGroup v-model='chgkey.status' type="button" @on-change='seachchg'>
            	<Radio v-for='(it,index) in timechg' :key='it.key' :value='it.key' :label='it.key'>{{it.name}}</Radio>
          	</RadioGroup> -->
            <!-- <span v-for='(it,index) in timechg' :key='index'>{{it.name}}</span> -->
            <span @click='seachchgup'><&nbsp;上周</span>
            <span @click='seachchg'>本周</span>
            <span @click='seachchgdown'>下周&nbsp;></span>
        </Col>
      </Row>
      <div style='border: 1px solid #ccc;margin-top: 15px;border-bottom: 0px'>
      	<Row class='li-title'>
          <Col :span='3'>影片名称</Col>
          <Col :span='2' style='text-align: center;'>总投放时长</Col>
          <Col :span='16'>广告列表</Col>
          <div :span='2' @click="allover(5)" style='color: blue;cursor: pointer;font-size: 12px;float:right;'>一键设置为已排</div>
        </Row>
        <ul class='itemul'>
        	<li class='li-item' v-for='(it,index) in itemlist' :key='index'>
        		<row>
        			<Col span='3'>{{it.name}}</Col>
        			<Col span='2' style='text-align: center;'>{{it.time}}s</Col>
        			<Col span='19'>
        				<row>
        					<Col style='color: blue;cursor: pointer;' :span='6' v-for='(item,index) in it.list' :key='index'><div v-show='item.key == 1' @click="change(it.id, it)" class='imgs1'></div><div v-show='item.key == 2' @click="change(it.id, it)" class='imgs2'></div>
        					<!-- {{item.name.length}} -->
        					  <Tooltip v-if='item.name.length > 10' :content="item.name">
						        <router-link :to="{path:'/order/dispatch' , params: {}}">{{item.name.slice(0,10)}}...</router-link>
						      </Tooltip>
							  <router-link tag="a" :to="{path:'/order/dispatch' , params: {}}" v-if='item.name.length <= 10'>{{item.name}}</router-link>
						      ({{item.time}})
        					</Col>
        				</row>
        			</Col>
        		</row>
        	</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component , Watch} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import moment from 'moment'
import { queryList  } from '@/api/lastissue'
import { formatTimestamp } from '@/util/validateRules'
import WeekDatePicker from '@/components/weekDatePicker'


const timeFormat = 'YYYY-MM-DD'


@Component({
  components: {
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

  async allover(id: any) {
    try {
      await  confirm('是否确认将该影院所有广告状态设为已排？')
      // await dels({id})
      // this.$Message.success({
      //   content: `修改成功`,
      // })
      // this.reloadSearch()
    } catch (ex) {
      this.handleError(ex)
    }
  }

  // 修改状态
  async change(id: number , it: any) {
    try {

      await confirm('您确定修改当前状态信息吗？')
      // await setList ({
      //   id,
      //   status: row.status == 1 ? 2 : 1
      // })
      // this.$Message.success({
      //   content: `更改成功`,
      // })
      // this.reloadSearch()
    } catch (ex) {
    }
  }

  async seach() {
    try {
      const datalist = await queryList({ id : this.weekDate[0]})
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

  @Watch('query', {deep: true})
  watchQuery() {
    this.seach()
  }

  @Watch('weekDate', {deep: true})
  watchWeekDate() {
    this.seach()
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
  height: 100px;
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
    cursor: pointer;
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
}
</style>
