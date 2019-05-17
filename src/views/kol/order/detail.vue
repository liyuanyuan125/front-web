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
      <Row class='row-ul'>
        <Col :span='2'>任务清单</Col>
        <Col :span="21"> 已接单 (1/2) </Col>
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
                  <Col :span='12' style='margin-left: -10px;'>
                    <Tooltip v-if='it.name.length > 5' :content="it.name">
                    <div>{{it.name.slice(0,5)}}...</div></Tooltip>
                    <div v-if='it.name.length <= 5'>{{it.name}}</div>
                    <div>{{it.type}}</div>
                  </Col>
                </Row>
              </Col>
              <Col :span='3' class='li-ti-col'>{{it.weibo}}</Col>
              <Col :span='3' class='li-ti-col'>{{it.zhifa}}</Col>
              <Col :span='3' class='li-ti-col'>￥{{it.price}}</Col>
              <Col :span='3' class='li-ti-col'>{{it.createTimeTemp}}</Col>
              <Col :span='4' class='li-ti-col'>{{it.con}}</Col>
              <Col :span='3' class='li-ti-col'>√ 已接单</Col>
        		</row>
        	</li>
        </ul>
      </div>
    </div>
    <div class='body' style='padding-left: 30px;'>
      <Row class='row-ul'>
        订单跟踪
      </Row>
      <div style='margin-top: 15px;border-bottom: 0px'>
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
  height: 105px;
  .li-ti-col {
    text-align: center;
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

</style>
