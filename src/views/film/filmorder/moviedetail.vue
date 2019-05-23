<template>
  <div class="page">
    <div class='t-title'>订单状态： 派单中</div>
    
    <div class='title-tip'>
      <Row style='margin-bottom: 10px;'>订单信息</Row>
    	<Row>
       <Col :span='12'>项目名称：2019年度奔驰品牌推广</Col>
       <Col :span='12'>订单编号：234198515130105856</Col>
      </Row>
      <Row>
       <Col :span='12'>推广品牌：奔驰</Col>
       <Col :span='12'>下单时间：2018-0-09 14：21</Col>
      </Row>
      <Row>
       <Col :span='24'>推广内容：2019年度奔驰品牌推广</Col>
      </Row>
    </div>
    <div class='body'>
      <Row class='t-title'>片方提供资源</Row>
      <div style='margin-top: 15px;border-bottom: 0px'>
      	<Row style='background: #eee;padding: 10px;'>
         <Col :span='12'>合作影片</Col>
         <Col :span='12'>资源列表</Col>
        </Row>
        <Row style='padding: 20px;background: #ccc;'>
          <Col span='2'>
            <div class='div-img'>
              <img src="./assets/wait.jpg" alt="">
            </div>
          </Col>
          <Col span='12' class='row-x'>
            <Row>攀登者</Row>
            <Row>剧情/冒险 (中国大陆)</Row>
            <Row>2018-05-05 上映</Row>
          </Col>
          <Col :span='10'>
            <Row>1， 电影海报  <span class='okbut'>立即下载</span> *后台配置的使用说明，吧啦啦啦啦</Row>
            <Row>1， 电影海报  <span class='okbut'>立即下载</span> *后台配置的使用说明，吧啦啦啦啦</Row>
            <Row></Row>
          </Col>
        </Row>
      </div>
    </div>
    <div class='body'>
      <Row class='t-title'>品牌方提供资源</Row>
      <Row class='row-ul'>
        品牌方提供资源：123 ， 123
      </Row>
      <Row class='row-ul'>
        线下门店资源：易拉宝，外卖盒
      </Row>
    </div>
    <div class='body'>
      <Row class='row-ul'>
        留言：
      </Row>
    </div>
    <div class='body'>
      <Row class='t-title'>订单跟踪</Row>
      <div style='margin-top: 15px;border-bottom: 0px;padding-left: 30px;'>
        <ul class='itemul'>
          <li v-for='(it,index) in itemlist' :key='index'>
            <row style='line-height: 30px;'>
              <Col :span='3' class='li-ti-col'>{{it.createTimeTemp}}</Col>
              <Col :span='20' class='li-ti-col'>{{it.con}}</Col>
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
import { itemlist  } from '@/api/lastissue'
import { toMap } from '@/fn/array'
import { formatTimestamp } from '@/util/validateRules'


const timeFormat = 'YYYY-MM-DD HH:mm:ss'


@Component({
  components: {
  }
})
export default class Main extends ViewBase {



  movieList: any = []


  itemlist: any = []

  mounted() {
    this.seach()
  }




  async seach() {
    try {
      // 获取列表
      // const datalist = await itemlist({id: 2})
      // console.log(datalist)
      // this.itemlist = (datalist.data.items || []).map((it: any) => {
      //   return {
      //     ...it,
      //     createTimeTemp: moment(it.createTimeTemp).format(timeFormat),
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
.page {
  font-size: 14px;
}
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
  height: 130px;
  background: rgba(249, 249, 249, 1);
  border-radius: 2px 2px 0 0;
  line-height: 20.5px;
  font-size: 13px;
  font-weight: 400;
  color: rgba(36, 129, 215, 1);
  padding: 20px 0 0 30px;
}
.body {
  margin-top: 10px;
  padding-top: 10px;
  // padding-left: 30px;
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
.div-img {
  width: 90px;
  height: 130px;
  img {
    width: 100%;
    height: 100%;
  }
}
.row-x {
  line-height: 25px;
}
.row-ul {
  line-height: 40px;
  padding-left: 30px;
}
.okbut {
  display: inline-block;
  height: 30px;
  width: 70px;
  border: 1px solid red;
  text-align: center;
  background: #fff;
  line-height: 30px;
}
</style>
