<template>
  <div class="page">
    <div class='t-title'>订单状态： <span v-for="it in statusList" v-if="it.key == item.status">
      
      <i v-if="[2,3].includes(item.status)">待审核</i>
      <i v-else>{{it.text}}</i>
      </span>
      </div>
    
    <div class='title-tip'>
      <Row style='font-size: 24px;line-height: 50px;font-weight: 500'>订单信息</Row>
    	<Row>
       <Col :span='12' style='display:flex;'>
        <div style='width: 13%;display: inline-block;'>项目名称：</div>
        <div style='width: 80%;display: inline-block;'>{{item.projectName}}</div>
      </Col>
       <Col :span='12'>订单编号：{{item.orderNo}}</Col>
      </Row>
      <Row>
       <Col :span='12'>推广品牌：{{item.brandName}}</Col>
       <Col :span='12'>下单时间：{{item.createTime == null ? '暂无时间' : createTime}}</Col>
      </Row>
      <Row>
       <Col :span='24'>推广产品：{{item.productName == null ? '暂无' : item.productName}}</Col>
      </Row>
      <Row>
       <Col :span='24' class='conover' style='display: flex;'>
       <div style='width: 6%;display: inline-block;'>推广内容：</div>
       <div style='width: 80%;display: inline-block;'>{{item.content == null ? '暂无' : item.content}}</div>
       </Col>
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
                      <img :src="it.accountPhotoUrl  == null ? 'http://img31.mtime.cn/ph/1473/1213473/1213473_290X440X4.jpg' : it.accountPhotoUrl" alt="">
                    </div>
                  </Col>
                  <Col :span='7' class='name'>
                    <Tooltip v-if='it.accountName.length > 5' max-width="200" transfer :content="it.name">
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
              <Col :span='3' class='li-ti-col ss'><span v-for='(item,index) in publishCategoryList' :key='index' v-if='item.key == it.publishCategoryCode'>{{item.text}}</span>
              <span v-if='it.publishCategoryCode == null'>暂无</span></Col>
              <Col :span='3' class='li-ti-col ss'>￥{{it.salePrice}}</Col>
              <Col :span='3' class='li-ti-col ss'>{{it.publishTime}}</Col>
              <Col :span='4' class='li-ti-col ss'>
              <span v-if='it.content == null'>暂无</span>
                  <Tooltip max-width="200" transfer v-if='it.content != null' :content="it.content">
                    <span class='overs'>{{it.content}}</span></Tooltip>
              </Col>
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
            <row class='itemss itemss-w'>
              <Col :span='4' class='ss-left'>{{orderLogList[0].createTime}}<span></span></Col>
              <Col :span='18' class='ss-right'>
                  <span v-for="it in statusList" v-if="it.key == orderLogList[0].status">{{it.text}}</span>
                  <span style='margin-left: 10px;'>{{orderLogList[0].remark}}</span></Col>
            </row>
          </li>
          <li v-for='(item,index) in orderLogList.slice(1)' :key='index'>
            <row class='itemss'>
              <Col :span='4' class='ss-left'>{{item.createTime}}<span></span></Col>
              <Col :span='18' class='ss-right'>
                  <span v-for="(it,index) in statusList"  :key='index' v-if="it.key == item.status">{{it.text}}</span>
                  <span style='margin-left: 10px;'>{{item.remark}}</span>
              </Col>
            </row>
          </li>
        </ul>
      </div>
    </div>
    <div style='margin-top: 40px;text-align: center;'>
      <Button class="bth" icon="md-return-left" @click="goback">返回上一页</Button>
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
const times = 'YYYY-MM-DD HH:mm'

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
  publishCategoryList: any = []

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
            publishTime: it.publishTime == null ? '暂无' : moment(it.publishTime).format(times)
          }
        })
        this.subStatusList = subStatusList
        this.orderLogList = (orderLogList || []).map((it: any) => {
          return {
            ...it,
            createTime: it.createTime == null ? '暂无' : moment(it.createTime).format(timeFormat)
          }
        })
        this.createTime = moment(this.item.createTime).format(timeFormat)
        this.publishCategoryList = publishCategoryList
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
  goback() {
    this.$router.go(-1)
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
.bth {
  width: 200px;
  height: 45px;
  border: 0;
  background: #00202d;
  color: #fff;
  border-radius: 25px;
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
.overs {
  overflow: hidden;
  height: 45px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-height: 22px;
}
.conover {
  line-height: 26px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
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
      right: -3%;
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
      right: -4.5%;
    }
  }
  .ss-right {
    padding-left: 40px;
  }
}
</style>
