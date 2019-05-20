<template>
  <div class="page">
    <div class='t-title'>
      <Row>
        <Col :span='12'>项目名称：2019年新款奔驰</Col>
        <Col :span='12'>检测平台：新浪微博</Col>
      </Row>
    </div>
    
    <div class='title-tip'>
      <Row>
       <Col :span='6'>检测到的发布数量<span>1</span></Col>
       <Col :span='6'>总任务数<span>2</span></Col>
       <Col :span='12'>预估完成度<span>50%</span></Col>
      </Row>
    </div>
    <div class='body'>
      <div style='margin-top: 15px;border-bottom: 0px'>
        <Row class='li-title'>
          <Col :span='5' class='li-ti-col'>任务账号</Col>
          <Col :span='3' class='li-ti-col'>任务类型</Col>
          <Col :span='4' class='li-ti-col'>期望执行时间</Col>
          <Col :span='8' class='li-ti-col'>内容</Col>
          <Col :span='4' class='li-ti-col'>发布时间</Col>
        </Row>
        <ul class='itemul'>
          <li class='li-item' v-for='(it,index) in itemlist' :key='index'>
            <row>
              <Col :span='5' class='li-ti-col'>
                  <div class="div-img">
                    <img src="./assets/over.jpg" alt="">
                  </div>
                  <Tooltip v-if='it.name.length > 5' :content="it.name">
                  <div>{{it.name.slice(0,5)}}...</div></Tooltip>
                  <div v-if='it.name.length <= 5'>{{it.name}}</div>
              </Col>
              <Col :span='3' class='li-ti-col'>{{it.zhifa}}</Col>
              <Col :span='4' class='li-ti-col'>{{it.createTimeTemp}}</Col>
              <Col :span='8' class='li-ti-col'>{{it.con}}<br>{{it.con}}</Col>
              <Col :span='4' class='li-ti-col'>{{it.createTimeTemp}}</Col>
            </row>
          </li>
        </ul>
      </div>
    </div>
    <Page
      :total="totalCount"
      v-if="totalCount>0"
      class="btnCenter plan-pages"
      :current="query.pageIndex"
      :page-size="query.pageSize"
      show-total
      show-elevator
      @on-change="handlepageChange"
      @on-page-size-change="handlePageSize"
    />
  </div>
</template>

<script lang="ts">
import { Component , Watch} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import moment from 'moment'
import { itemlist  } from '@/api/lastissue'
import { toMap } from '@/fn/array'
import { formatTimestamp } from '@/util/validateRules'


const timeFormat = 'YYYY-MM-DD HH:mm:ss'


@Component({
  components: {
  }
})
export default class Main extends ViewBase {

  query: any = {
    pageIndex: 1,
    pageSize: 20,
  }

  movieList: any = []


  itemlist: any = []

  totalCount = 0

  mounted() {
    this.seach()
  }




  async seach() {
    try {
      // 获取列表
      const datalist = await itemlist({id: 2})
      // console.log(datalist)
      this.itemlist = (datalist.data.items || []).map((it: any) => {
        return {
          ...it,
          createTimeTemp: moment(it.createTimeTemp).format(timeFormat),
        }
      })
    } catch (ex) {
      this.handleError(ex)
    } finally {
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
  height: 73px;
  background: rgba(249, 249, 249, 1);
  border-radius: 2px 2px 0 0;
  line-height: 20.5px;
  font-size: 13px;
  font-weight: 400;
  color: rgba(36, 129, 215, 1);
  padding: 20px 0 0 30px;
  span {
    margin-left: 15px;
    font-weight: bold;
    font-size: 26px;
  }
}
.body {
  margin-top: 10px;
  padding-top: 10px;
}
.li-title {
  padding: 0 10px 0 10px;
  height: 40px;
  background: rgba(249, 249, 249, 1);
  line-height: 40px;
  font-size: 13px;
  .li-ti-col {
    text-align: center;
  }
}
.li-item {
  padding: 10px 10px 0 10px;
  line-height: 40px;
  font-size: 14px;
  border-bottom: 1px solid #ccc;
  height: 140px;
  .li-ti-col {
    text-align: center;
  }
  .div-img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    margin-left: 13%;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      margin-left: 30px;
    }
  }
}

</style>
