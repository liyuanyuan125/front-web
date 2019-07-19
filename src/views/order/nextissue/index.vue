<template>
  <div class="page">
    <div class='t-title'>下刊管理</div>
    <div class='title-tip'>
    	本功能只展示需要提前（紧急）下刊的广告单;未在本页面展示的广告单，请统一在每周的周三进行批量下刊操作</br>
    	图例 “&nbsp;<div class='img-w1'></div>&nbsp;” ，表示需要下刊，请在影院的TMS广告排播系统中移除对应的广告片，然后再点击该图标即可设为“已下刊”</br>
		图例 “&nbsp;<div class='img-w2'></div>&nbsp;” ，表示已下刊，点击可设为“未下刊”
    </div>
    <div class='body'>
      <Row class='row-ul'>
       <Col span='6' class='data'> <Date-picker
                  type="date"
                  v-model="query.offDate"
                  @on-change="seachs"
                  placeholder="选择日期"
                  class="inp-style-center"
                ></Date-picker></Col>
        <Col :span="10">
          <Col style='margin-left: 12px;' span="14">
            <Select 
             class='sels' 
             v-model='query.cinemaId'  
             clearable
             filterable
             placeholder="请输入影院名称/专资编码查询" 
             remote
             :loading="loading"
             :remote-method="remoteMethod"
             @on-clear="movieList = []"
             @on-change="aes">
              <Option
                v-for="item in movieList"
                :key="item.id"
                :value="item.id"
              >{{item.shortName}}</Option>
            </Select>
          </Col>
        </Col>
      </Row>
      <div style='margin-top: 15px;'>
      	<Row class='li-title'>
          <Col :span='3'>影片名称</Col>
          <Col :span='2' >总投放时长</Col>
          <Col :span='15'>广告列表</Col>
          <div :span='2' @click="allover(5)" style='color: #57b4c9;cursor: pointer;font-size: 12px;float:right;'>一键设置为已下刊</div>
        </Row>
        <ul class='itemul'>
        	<li class='li-item' v-for='(it,index) in itemlist' :key='index'>
        		<row>
        			<Col span='3'>{{it.movieName}}</Col>
        			<Col span='2'>{{it.videoTotalLength}}s</Col>
        			<Col span='19'>
        				<row>
        					<Col style='color: #00202D;cursor: pointer;' :span='6' v-for='(item,index) in it.details' :key='index'>
                  
                  <div v-if='item.status == 1' @click="change(it.id , item.status, item.orderId)" class='imgs2'></div>
                  <div v-if='item.status == 2' @click="change(it.id , item.status, item.orderId)" class='imgs1'></div>
        					  <Tooltip v-if='item.videoName.length > 10' :content="item.videoName">
						        <router-link style='color: #00202D;margin-left: 25px;' :to="{ name: 'order-dispatch-details', params: { id: it.id }}">{{item.videoName.slice(0,10)}}...</router-link>
						      </Tooltip>
							  <router-link style='color: #00202D;margin-left: 25px;' tag="a" :to="{ name: 'order-dispatch-details', params: { id: it.id }}" v-if='item.videoName.length <= 10'>{{item.videoName}}</router-link>
						      ({{item.videoLength}}s)
        					</Col>
        				</row>
        			</Col>
        		</row>
        	</li>
          <li v-if='itemlist.length == 0' style='text-align: center;line-height: 50px;'>暂无数据</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component , Watch} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import moment from 'moment'
import { queryList ,   getcinid , oneover , oneout , allover , movielist } from '@/api/nextissue'
import { toMap } from '@/fn/array'
import { formatTimestamp } from '@/util/validateRules'
import WeekDatePicker from '@/components/weekDatePicker'
import { confirm , toast , info} from '@/ui/modal'


const timeFormat = 'YYYY-MM-DD'


@Component({
  components: {
    WeekDatePicker
  }
})
export default class Main extends ViewBase {
  query: any = {
    cinemaId: null,
    offDate: null,
  }



  movieList: any = []
  loading = false
  asd = false


  itemlist: any = []

  objArray: any = []
  deArray: any = []
  idsArray: any = []
  aaa: any = 0

  async mounted() {
    // const cinid = await getcinid()

    // if (cinid.data.cinemaId == 0) {
    //   info('当前用户没有关联影院')
    //   this.query.cinemaId = cinid.data.cinemaId
    // } else {
    //   this.query.cinemaId = cinid.data.cinemaId
    //   this.remoteMethod(cinid.data.cinemaName)
    // }

    this.query.offDate = new Date()
    this.seach()
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
    this.aaa = this.query.cinemaId
    if (this.query.cinemaId == undefined) {
      return
    }
    this.seach()
  }


  async allover(id: any) {
    try {
      await  confirm('是否确认将该影院所有广告状态设为下刊？')
      if (this.query.offDate.length == 8) {
        this.query.offDate = this.query.offDate
      } else {
        const a  = moment(this.query.offDate.getTime()).format(timeFormat).split('-')
        this.query.offDate = a[0] + a[1] + a[2]
      }
      await allover({
        offDate: Number(this.query.offDate),
        cinemaId: this.query.cinemaId
      })
      this.$Message.success({
        content: `修改成功`,
      })
      this.seach()
    } catch (ex) {
      this.handleError(ex)
    }
  }

  // 修改状态
  async change(id: any , status: number , orderid: any) {
    try {
      if (status == 1) {
        await confirm('您确定修改当前状态信息吗？')
        await oneover ({id, orderId : orderid})
        this.$Message.success({
          content: `更改成功`,
        })
        this.seach()
      } else if (status == 2) {
        await confirm('您确定修改当前状态信息吗？')
        await oneout ({id, orderId : orderid})
        this.$Message.success({
          content: `更改成功`,
        })
        this.seach()
      }
    } catch (ex) {
    }
  }

  async aes() {
    if (this.query.cinemaId == undefined) {
      this.query.cinemaId = this.aaa
    }
    try {

      if (this.query.offDate == '') {
        return
      }
      if (String(this.query.offDate).length == 8) {
        this.query.offDate = this.query.offDate
      } else {

        const a  = moment(this.query.offDate.getTime()).format(timeFormat).split('-')
        this.query.offDate = a[0] + a[1] + a[2]
      }
      const data = this.query.offDate

      if (this.query.cinemaId == undefined) {
        info('请选择影院')
        return
      }

      // 获取上刊列表
      const datalist = await queryList({cinemaId: this.query.cinemaId, offDate: data})
      this.itemlist = datalist.data.items
      this.asd = false

    } catch (ex) {
      this.handleError(ex)
    } finally {
    }
  }

  async seach() {
    try {

      if (this.query.offDate == '') {
        return
      }
      if (String(this.query.offDate).length == 8) {
        this.query.offDate = this.query.offDate
      } else {

        const a  = moment(this.query.offDate.getTime()).format(timeFormat).split('-')
        this.query.offDate = a[0] + a[1] + a[2]
      }
      const data = this.query.offDate
      // 获取默认影院
      // if (this.query.cinemaId != this.query.cinemaId) {
        const cinid = await getcinid(this.query.offDate)

        if (cinid.data.cinemaId == 0) {
          info('当前用户没有关联影院')
          this.query.cinemaId = cinid.data.cinemaId
        } else {
          this.query.cinemaId = cinid.data.cinemaId
          this.remoteMethod(cinid.data.cinemaName)
        }
      // }

      if (this.query.cinemaId == undefined) {
        info('请选择影院')
        return
      }

      // 获取上刊列表
      const datalist = await queryList({cinemaId: this.query.cinemaId, offDate: data})
      this.itemlist = datalist.data.items
      this.asd = false

    } catch (ex) {
      this.handleError(ex)
    } finally {
    }
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
  .img-w1 {
    display: inline-block;
    width: 17px;
    height: 16px;
    background: url('./assets/wait.png');
    background-size: cover;
    margin-left: 2px;
  }
  .img-w2 {
    display: inline-block;
    width: 20px;
    height: 20px;
    background: url('./assets/over.png');
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
  line-height: 40px;
  font-size: 14px;
  background: #c2d6e3;
}
.li-item {
  color: #00202d;
  padding: 0 10px 0 10px;
  line-height: 40px;
  font-size: 14px;
  background: #abc8d9;
  border-bottom: 1px solid rgba(255, 255, 255, 0.26);
  .imgs1 {
    display: inline-block;
    width: 17px;
    height: 17px;
    background: url('./assets/over.png');
    background-size: cover;
    margin-right: 2px;
    position: absolute;
    top: 12px;
  }
  .imgs2 {
    display: inline-block;
    width: 17px;
    height: 16px;
    background: url('./assets/wait.png');
    background-size: cover;
    margin-right: 2px;
    position: absolute;
    top: 12px;
  }
}
// .data {
//   height: 40px;
//   background: rgba(255, 255, 255, 0.8);
//   border-radius: 5px;
//   border: 1px solid rgba(255, 255, 255, 1);
// }
.data-s {
  margin-top: 4px;
  margin-left: 15%;
  font-size: 14px;
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
/deep/ .ivu-date-picker {
  width: 100%;
}
/deep/ .ivu-input {
  height: 40px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 1);
  &::-webkit-input-placeholder {
    color: rgba(136, 136, 136, 1);
  }
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
