<template>
  <div class="page">
    <div class='box'>
      
    
        <div class='t-title'>
          <Row>
            <Col class='t-b'>项目名称：2019年新款奔驰</Col>
          </Row>
          <Row>
            <Col class='t-s'>检测平台：新浪微博</Col>
          </Row>
        </div>
        
        <div class='title-tip'>
          <Row>
           <Col :span='8'>检测到的发布数量<span>1</span></Col>
           <Col :span='8'>总任务数<span>2</span></Col>
           <Col :span='8'>预估完成度<span>50%</span></Col>
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
                   <Row>
                      <Col :span='12'>
                        <div class="div-img">
                          <img src="./assets/over.jpg" alt="">
                        </div>
                      </Col>
                      <Col :span='12' style='margin-left: -10px;font-size: 16px;font-weight: 500'>
                          <Tooltip v-if='it.name.length > 5' :content="it.name">
                          <div>{{it.name.slice(0,5)}}...</div></Tooltip>
                          <div v-if='it.name.length <= 5'>{{it.name}}</div>
                          <div>gaoxiao</div>
                      </Col>
                    </Row>
                  </Col>
                  <Col :span='3' class='li-ti-col ss'>{{it.zhifa}}</Col>
                  <Col :span='4' class='li-ti-col ss'>{{it.createTimeTemp}}</Col>
                  <Col :span='8' class='li-ti-col'>{{it.con}}<span class='nums'>转发：1W+ 点赞：4W+ 评论：1W+</span></Col>
                  <Col :span='4' class='li-ti-col ss'>{{it.createTimeTemp}}</Col>
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

  totalCount = 20

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
.page {
  padding: 0 40px 0 30px;
}
.box {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 1);
}
.t-title {
  text-align: center;
  .t-b {
    font-size: 28px;
    font-weight: 400;
    color: rgba(0, 32, 45, 1);
    margin-top: 40px;
    line-height: 50px;
  }
  .t-s {
    line-height: 50px;
    font-size: 20px;
    font-weight: 400;
    color: #00202d;
    margin-bottom: 20px;
  }
}
.title-tip {
  margin-top: 20px;
  width: 100%;
  line-height: 20.5px;
  font-weight: 400;
  padding: 20px 0 0 30px;
  font-size: 16px;
  text-align: center;
  span {
    margin-left: 15px;
    font-weight: 500;
    font-size: 38px;
  }
}
.body {
  margin-top: 10px;
  padding-top: 10px;
}
.li-title {
  padding: 0 10px 0 10px;
  line-height: 56px;
  font-size: 14px;
  height: 56px;
  background: rgba(255, 255, 255, 0.6);
  opacity: 0.9;
  color: #6a8893;
  .li-ti-col {
    text-align: center;
  }
}
.li-item {
  padding: 10px 10px 0 10px;
  line-height: 40px;
  font-size: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
  height: 105px;
  .li-ti-col {
    text-align: center;
  }
  .ss {
    margin-top: 25px;
    font-size: 14px;
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
.nums {
  position: absolute;
  bottom: -123%;
  left: 21%;
}
</style>
