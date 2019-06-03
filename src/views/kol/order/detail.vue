<template>
  <div class="page">
    <div class='t-title'>订单状态： 派单中</div>
    
    <div class='title-tip'>
      <Row style='font-size: 24px;line-height: 50px;font-weight: 500'>订单信息</Row>
    	<Row>
       <Col :span='12'>项目名称：2019年度奔驰品牌推广</Col>
       <Col :span='12'>订单编号：234198515130105856</Col>
      </Row>
      <Row>
       <Col :span='12'>推广品牌：奔驰</Col>
       <Col :span='12'>下单时间：2018-0-09 14：21</Col>
      </Row>
      <Row>
       <Col :span='24'>推广产品：2019年度奔驰品牌推广</Col>
      </Row>
      <Row>
       <Col :span='24'>推广内容：2019年度奔驰品牌推广</Col>
      </Row>
    </div>
    <div class='body'>
      <Row class='row-ul'>
        <Col :span='2' class='taskorder'>任务清单</Col>
        <Col :span="5" class='taskok'> 已接单 (1/2) </Col>
      </Row>
      <div style='margin-top: 15px;border-bottom: 0px'>
      	<Row class='li-title'>
          <Col :span='5' class='li-ti-col'>账号</Col>
          <Col :span='3' class='li-ti-col'>平台</Col>
          <Col :span='3' class='li-ti-col'>任务类型</Col>
          <Col :span='3' class='li-ti-col'>价格</Col>
          <Col :span='3' class='li-ti-col'>期望发布时间</Col>
          <Col :span='4' class='li-ti-col'>任务内容</Col>
          <Col :span='3' class='li-ti-col'>接单状态</Col>
        </Row>
        <ul>
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
                    <div>{{it.type}}</div>
                  </Col>
                </Row>
              </Col>
              <Col :span='3' class='li-ti-col ss' style='padding-left: 40px;'><span class="s1"></span>{{it.weibo}}</Col>
              <Col :span='3' class='li-ti-col ss'>{{it.zhifa}}</Col>
              <Col :span='3' class='li-ti-col ss'>￥{{it.price}}</Col>
              <Col :span='3' class='li-ti-col ss'>{{it.createTimeTemp}}</Col>
              <Col :span='4' class='li-ti-col ss'>{{it.con}}</Col>
              <Col :span='3' class='li-ti-col ss'> 已接单<span class="s2"></span></Col>
        		</row>
        	</li>
        </ul>
      </div>
    </div>
    <div class='body' style='padding-left: 30px;'>
      <Row style='font-size: 24px;line-height: 50px;font-weight: 500'>订单跟踪</Row>
      <div style='margin-top: 15px;border-bottom: 0px'>
        <ul>
          <li>
            <row class='itemss itemss-w'>
              <Col :span='3' class='ss-left'>ewqeqweqw<span></span></Col>
              <Col :span='18' class='ss-right'>qweqweqweqw</Col>
            </row>
          </li>
          <li v-for='(it,index) in itemlist' :key='index'>
            <row class='itemss'>
              <Col :span='3' class='ss-left'>{{it.createTimeTemp}}<span></span></Col>
              <Col :span='18' class='ss-right'>{{it.con}}</Col>
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

}
</script>

<style lang="less" scoped>
.page {
  padding-left: 30px;
  padding-right: 40px;
  color: #00202d;
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
.title-tip {
  margin-top: 30px;
  width: 100%;
  line-height: 35px;
  font-size: 14px;
  font-weight: 500;
  padding: 20px 0 10px 30px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 1);
}
.body {
  margin-top: 30px;
  padding-top: 10px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 1);
}
.taskorder {
  font-size: 24px;
  line-height: 50px;
  margin-left: 30px;
  font-weight: bold;
}
.taskok {
  font-weight: 500;
  color: rgba(255, 83, 83, 1);
  font-size: 20px;
  line-height: 50px;
  margin-left: 20px;
}
.li-title {
  padding: 0 10px 0 10px;
  line-height: 65px;
  font-size: 13px;
  height: 56px;
  background: rgba(255, 255, 255, 0.6);
  opacity: 0.9;
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
    .s1 {
      display: inline-block;
      width: 25px;
      height: 20px;
      background: url('./assets/weibo.png');
      background-size: cover;
      position: absolute;
      top: 7px;
      left: 33%;
    }
    .s2 {
      display: inline-block;
      width: 18px;
      height: 18px;
      background: url('./assets/reok.png');
      background-size: cover;
      position: absolute;
      top: 10px;
      left: 67%;
    }
  }
  .div-img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      margin-left: 30px;
    }
  }
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
      right: -4%;
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
</style>
