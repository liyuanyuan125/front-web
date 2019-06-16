<template>
  <div class="page">
    <div class='t-title'>订单状态： <span v-for="it in statusList" v-if="it.key == item.status">{{it.text}}</span></div>
    
    <div class='title-tip'>
      <Row style='font-size: 24px;line-height: 50px;font-weight: 500'>订单信息</Row>
    	<Row>
       <Col :span='12'>项目名称：{{item.projectName}}</Col>
       <Col :span='12'>订单编号：{{item.orderNo}}</Col>
      </Row>
      <Row>
       <Col :span='12'>推广品牌：{{item.brandName}}</Col>
       <Col :span='12'>下单时间：{{item.createTime == null ? '暂无时间' : createTime}}</Col>
      </Row>
      <Row>
       <Col :span='24'>推广产品：{{item.productName}}</Col>
      </Row>
      <Row>
       <Col :span='24'>推广内容：{{item.content}}</Col>
      </Row>
    </div>
    <div class='body'>
      <Row class='row-ul'>
        <Col :span='2' class='taskorder'>任务清单</Col>
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
        	<li class='li-item' v-for='(it,index) in taskItemList' :key='index'>
        		<row>
        			<Col :span='5' class='li-ti-col'>
                <Row>
                  <Col :span='12'>
                    <div class="div-img">
                      <img :src="it.accountPhotoUrl  == null ? 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2431454871,3087430277&fm=27&gp=0.jpg' : it.accountPhotoUrl" alt="">
                    </div>
                  </Col>
                  <Col :span='7' class='name'>
                    <Tooltip v-if='it.accountName.length > 5' :content="it.name">
                    <div>{{it.accountName.slice(0,5)}}...</div></Tooltip>
                    <div v-if='it.accountName.length <= 5'>{{it.accountName}}</div>
                    <div v-for="code in accountCategoryList" v-if="code.key == it.accountTypeCode">{{code.text}}</div>
                  </Col>
                </Row>
              </Col>
              <Col :span='3' class='li-ti-col ss' style='padding-left: 40px;'>
                 <div class="flex-box-items">
                 <img src="~@/views/brand/assets/microblog.png" v-if="it.channelCode == 'weibo'" width="20" height="20" alt="alias" />
                 <img src="~@/views/brand/assets/quick.png" v-if="it.channelCode == 'kuaishou'" width="20" height="20" alt="alias" />
                 <img src="~@/views/brand/assets/vibrato.png" v-if="it.channelCode == 'douyin'" width="20" height="20" alt="alias" />
                 <img src="~@/views/brand/assets/wechat.png" v-if="it.channelCode == 'wechat'" width="20" height="20" alt="alias" />
                 <em style='margin-left: 5px;' v-for="item in channelCodeList" v-if="item.key == it.channelCode">{{item.text}}</em>
                 </div>
              </Col>
              <Col :span='3' class='li-ti-col ss'>{{it.publishCategoryCode}}</Col>
              <Col :span='3' class='li-ti-col ss'>￥{{it.salePrice}}</Col>
              <Col :span='3' class='li-ti-col ss'>{{it.publishTime}}</Col>
              <Col :span='4' class='li-ti-col ss'>{{it.content}}</Col>
              <Col :span='3' class='li-ti-col ss'>
              <i v-for="item in subStatusList" :key="item.key" v-if="item.key == it.status">{{item.text}}</i>
              </Col>
        		</row>
        	</li>
        </ul>
      </div>
    </div>
    <div class='body' style='padding-left: 30px;'>
      <Row style='font-size: 24px;line-height: 50px;font-weight: 500'>订单日志</Row>
      <div style='margin-top: 15px;border-bottom: 0px'>
        <ul>
          <li>
            <!-- <row class='itemss itemss-w'>
              <Col :span='3' class='ss-left'>ewqeqweqw<span></span></Col>
              <Col :span='18' class='ss-right'>qweqweqweqw</Col>
            </row> -->
          </li>
          <li v-for='item in orderLogList' :key='item.orderId'>
            <row class='itemss'>
              <Col :span='3' class='ss-left'>{{item.createTime}}<span></span></Col>
              <Col :span='18' class='ss-right'>
                  <p v-for="it in statusList" v-if="it.key == item.status">{{it.text}}</p>
                  <p>{{item.remark}}</p>
              </Col>
            </row>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Prop} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import moment from 'moment'
import { itemlist  } from '@/api/lastissue'
import { toMap } from '@/fn/array'
import { formatTimestamp } from '@/util/validateRules'
import { orderDetail } from '@/api/kolOrderList'
import { querySelectList } from '@/api/brandList'

const timeFormat = 'YYYY-MM-DD HH:mm:ss'


@Component({
  components: {
  }
})
export default class Main extends ViewBase {
  @Prop({type: Number, default: 0}) id?: number
  movieList: any = []
  item: any = []
  itemlist: any[] = []
  statusList = []
  createTime: any = ''
  publishTime: any = ''

  // 任务清单
  taskItemList = []
  // 账号类型
  accountCategoryList = []
  // 全部推广平台
  channelCodeList = []
  // 子订单任务状态
  subStatusList = []
  // 订单日志
  orderLogList = []

  mounted() {
    this.seach()
    this.querySelectList()
  }

  async seach() {
    try {
      const { data: {
        item,
        statusList,
        publishCategoryList,
        orderLogList,
        accountCategoryList,
        taskItemList,
        subStatusList
        } } = await orderDetail(this.id)
        this.item = item || {}
        this.statusList = statusList || []
        this.accountCategoryList = accountCategoryList || []
        // this.taskItemList = taskItemList
        this.taskItemList = (taskItemList || []).map((it: any) => {
          return {
            ...it,
            publishTime: String(it.publishTime).slice(0, 4) + '-' + String(it.publishTime).slice(4, 6)
            + '-' + String(it.publishTime).slice(6, 8)
          }
        })
        this.subStatusList = subStatusList
        this.orderLogList = orderLogList
        this.createTime = moment(this.item.createTime).format(timeFormat)
    } catch (ex) {
      this.handleError(ex)
    }
    // try {
    //   // 获取列表
    //   const datalist = await itemlist({id: 2})
    //   // console.log(datalist)
    //   this.item = (datalist.data.items || []).map((it: any) => {
    //     return {
    //       ...it,
    //       createTimeTemp: moment(it.createTimeTemp).format(timeFormat),
    //     }
    //   })
    // } catch (ex) {
    //   this.handleError(ex)
    // } finally {
    // }
  }
  // 获取推广平台
  async querySelectList() {
    try {
      const { data: {channelCodeList} } = await querySelectList()
      this.channelCodeList = channelCodeList
    } catch (ex) {
      this.handleError(ex)
    }
  }

}
</script>

<style lang="less" scoped>
.flex-box-items {
  display: flex;
  align-items: center;
}
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
.name {
  margin-left: -10px;
  font-size: 16px;
  font-weight: 500;
  line-height: 33px;
  margin-top: 10px;
}
.body {
  margin-top: 30px;
  padding-top: 10px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 1);
}
.taskorder {
  font-size: 20px;
  line-height: 50px;
  margin-left: 30px;
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
  background: rgba(255, 255, 255, 0.7);
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
  &:nth-child(2n) {
    background: rgba(255, 255, 255, .5);
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
