<template>
  <div class="page">
    <div class='t-title'>订单状态： 派单中</div>
    <div class='box'>
      <Row style='margin-bottom: 10px;' class='tits'>订单信息</Row>
      <div class='title-tip'>
      	<Row>
         <Col :span='12'><span>项目名称：</span>2019年度奔驰品牌推广</Col>
         <Col :span='12'><span>订单编号：</span>234198515130105856</Col>
        </Row>
        <Row>
         <Col :span='12'><span>推广品牌：</span>奔驰</Col>
         <Col :span='12'><span>下单时间：</span>2018-0-09 14：21</Col>
        </Row>
        <Row>
         <Col :span='24'><span>推广内容：</span>2019年度奔驰品牌推广</Col>
        </Row>
      </div>
      <div class='body'>
        <Row class='tits'>片方提供资源</Row>
        <div style='margin-top: 15px;border-bottom: 0px'>
          <Row style='padding: 20px;height:200px;background:rgba(255,255,255,0.3);border-radius:5px;'>
            <Col span='3'>
              <div class='div-img'>
                <img src="./assets/wait.jpg" alt="">
              </div>
            </Col>
            <Col span='9' class='row-x'>
              <Row style='font-size: 20px;margin-top: 15px;'>攀登者</Row>
              <Row>剧情/冒险 (中国大陆)</Row>
              <Row>2018-05-05 上映</Row>
            </Col>
            <Col :span='10'>
              <Row class='bus' style='margin-top: 18px;'> 电影海报   <br><span class='hui'>后台配置的使用说明，吧啦啦啦啦</span> <span class='okbut'>立即下载</span></Row>
              <Row class='bus' > 电影票券  &nbsp;  100张   <br><span class='hui'>后台配置的使用说明，吧啦啦啦啦</span> <span class='okbut'>立即下载</span></Row>
              <Row></Row>
            </Col>
          </Row>
        </div>
      </div>
      <Row class='tits' style='margin-top: 20px;'>品牌方提供资源</Row>
      <div class='body' style='margin-top: 20px;height:120px;background:rgba(255,255,255,0.3);border-radius:5px;'>
        <Row class='row-ul'>
          <span class='hui'>品牌方提供资源：</span>123 ， 123
        </Row>
        <Row class='row-ul'>
          <span class='hui'>线下门店资源：</span>易拉宝，外卖盒
        </Row>
      </div>
      <div class='body'>
        <Row class='tits'>留言</Row>
        <Row class='liuyan'>
          46546545656
        </Row>
      </div>
      <div class='body'>
        <Row class='tits'>订单跟踪</Row>
        <div style='margin-top: 15px;background:rgba(255,255,255,0.3);border-radius:5px;padding : 30px;'>
          <ul>
            <li>
              <row class='itemss itemss-w'>
                <Col :span='3' class='ss-left'>ewqeqweqw<span></span></Col>
                <Col :span='18' class='ss-right'>qweqweqweqw</Col>
              </row>
            </li>
            <li  >
              <row class='itemss'>
                <Col :span='3' class='ss-left'>   qeqeqw<span></span></Col>
                <Col :span='18' class='ss-right'>qweqweqwe</Col>
              </row>
            </li>
          </ul>
        </div>
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
  padding-left: 30px;
  padding-right: 40px;
}
.t-title {
  height: 98px;
  background: rgba(0, 32, 45, 1);
  border-radius: 5px;
  opacity: 0.9;
  font-size: 24px;
  font-weight: 500;
  color: rgba(249, 216, 94, 1);
  line-height: 98px;
  text-align: center;
}
.box {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 1);
  padding: 50px;
  margin-top: 10px;
}
.title-tip {
  margin-top: 10px;
  width: 100%;
  line-height: 40px;
  font-size: 14px;
  font-weight: 400;
  height: 160px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  padding: 10px 30px 10px 30px;
  span {
    color: rgba(0, 32, 45, 0.5);
  }
}
.hui {
  color: rgba(0, 32, 45, 0.5);
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
  width: 120px;
  height: 160px;
  img {
    width: 100%;
    height: 100%;
  }
}
.row-x {
  line-height: 35px;
  font-weight: 500;
  margin-left: 10px;
}
.row-ul {
  line-height: 50px;
  padding-left: 30px;
}
.okbut {
  display: inline-block;
  text-align: center;
  line-height: 24px;
  width: 100px;
  height: 24px;
  background: rgba(0, 32, 45, 1);
  border-radius: 12px;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  position: absolute;
  top: 0;
  right: 45%;
}
.tits {
  font-weight: bold;
}
.itemss {
  line-height: 50px;
  font-size: 14px;
  .ss-left {
    border-right: 1px dashed rgba(179, 188, 192, 1);
    span {
      width: 11px;
      height: 11px;
      background: url('./assets/hui.png');
      background-size: cover;
      position: absolute;
      top: 37%;
      right: -4.5%;
    }
  }
  .ss-right {
    padding-left: 40px;
  }
}
.itemss-w {
  line-height: 50px;
  font-size: 14px;
  .ss-left {
    border-right: 1px dashed rgba(179, 188, 192, 1);
    span {
      width: 17px;
      height: 17px;
      background: url('./assets/blok.png');
      background-size: cover;
      position: absolute;
      top: 37%;
      right: -6%;
    }
  }
  .ss-right {
    padding-left: 40px;
  }
}
.bus {
  height: 75px;
  line-height: 25px;
}
.liuyan {
  margin-top: 15px;
  height: 50px;
  line-height: 50px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  padding-left: 30px;
}
</style>
