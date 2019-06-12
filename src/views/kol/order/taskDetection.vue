<template>
  <div class="page">
    <div class='box'>
        <Row class='title'>
          <Col :span='8'>项目名称 ：<span style='font-weight: 500'>2019年新款奔驰</span></Col>
          <Col :span='8'>检测平台 ：新浪微博</Col>
        </Row>
        
        <div class='title-tip'>
          <Row class='as' style='height: 107px;line-height: 106px;border-bottom: 1px solid #fff'>
           <Col :span='8' style='position: relative;'>检测到的发布数量<span style='right: 25%'>1</span></Col>
           <Col :span='8' style='position: relative;'>总任务数<span style='right: 32%'>2</span></Col>
           <Col :span='8' style='position: relative;padding-left: 6%;text-align: left;'>预估完成度<span style='right: 37%'>50%</span></Col>
          </Row>
          <Row class='bs' style='height: 107px;line-height: 107px;'>
            <div style='float: left;width: 30%;'>检测周期 : 2019.02.02 至 2019.02.02</div>
            <div class='num'>总点赞 <em>1.32万</em></div>
            <div class='num'>总评论 <em>1.32万</em></div>
            <div class='num'>总转发 <em>1.32万</em></div>
          </Row>
        </div>
        <div class='body' >
          <div style=' border-bottom: 0px'>
            <Row class='li-title'>
              <Col :span='5' class='li-ti-col'>任务账号</Col>
              <Col :span='2' class='li-ti-col'>任务类型</Col>
              <Col :span='3' class='li-ti-col'>期望发布时间</Col>
              <Col :span='8' class='li-ti-col'>内容</Col>
              <Col :span='3' class='li-ti-col'>发布时间</Col>
              <Col :span='3' class='li-ti-col'>操作</Col>
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
                      <Col :span='12' style='line-height: 83px;font-size: 16px;font-weight: 500'>
                          <Tooltip v-if='it.name.length > 5' :content="it.name">
                          <div>{{it.name.slice(0,5)}}...</div></Tooltip>
                          <div v-if='it.name.length <= 5'>{{it.name}}</div>
                      </Col>
                    </Row>
                  </Col>
                  <Col :span='2' class='li-ti-col ss'>{{it.zhifa}}</Col>
                  <Col :span='3' class='li-ti-col ss'>{{it.createTimeTemp}}</Col>
                  <Col :span='8' class='li-ti-col'>{{it.con}}<span class='nums'>转发：1W+ 点赞：4W+ 评论：1W+</span></Col>
                  <Col :span='3' class='li-ti-col ss'>{{it.createTimeTemp}}</Col>
                  <Col :span='3' class='li-ti-col ss'><router-link class='jump' :to="{ name: 'order-order-taskDetection-detail', params: { id : it.id } }"
          >详情</router-link></Col>
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
.title {
  font-size: 20px;
  line-height: 50px;
  font-weight: 400;
  color: rgba(0, 32, 45, 1);
  margin-top: 20px;
}
.title-tip {
  height: 220px;
  background: rgba(0, 32, 45, 0.8);
  border-radius: 5px;
  margin-top: 20px;
  width: 100%;
  line-height: 20.5px;
  font-weight: 400;
  font-size: 16px;
  text-align: center;
  color: #fff;
  .as {
    span {
      margin-left: 15px;
      font-weight: 500;
      font-size: 38px;
      color: #f9d85e;
      position: absolute;
    }
  }
  .bs {
    em {
      position: absolute;
      left: 48%;
      font-weight: 500;
      font-size: 30px;
    }
    .num {
      width: 23%;
      float: left;
      position: relative;
      padding-left: 6%;
      text-align: left;
    }
  }
}
.body {
  margin-top: 20px;
  border: 1px solid rgba(255, 255, 255, 1);
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
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
    width: 70px;
    height: 70px;
    border-radius: 50%;
    margin-left: 13%;
    margin-top: 10px;
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
.jump {
  display: block;
  width: 90px;
  height: 30px;
  line-height: 30px;
  color: #00202d;
  background: rgba(255, 255, 255, 0.31);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 1);
  margin-left: 24%;
}
/deep/ .btnCenter {
  text-align: center;
  height: 100px;
  background: rgba(32, 67, 80, 1);
  margin: 0 20px 0 20px;
  line-height: 100px;
  color: #fff;
}
/deep/ .ivu-page-prev {
  border: 0;
  background: rgba(32, 67, 80, 1);
}
/deep/ .ivu-page-next {
  border: 0;
  background: rgba(32, 67, 80, 1);
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
  background: rgba(32, 67, 80, 1);
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
</style>
