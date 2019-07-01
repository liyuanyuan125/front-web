<template>
  <div class="pagehome">
    <div class="create-title-text">
      <p>平台映前广告计费标准最小时长单位为15s，为节省您的广告投放成本，建议广告片时长为15s的整倍数，例如（15s、30s、45s、60s等）
广告片通过审核后，平台会统一为您进行转码为影院可播放的格式；转码费用标准为【3,000.00元/15s】</p>
      <div v-if="status == 1" class="status-title">待审核，您上传的广告片正在审核中</div>
      <div v-if="status == 5" class="status-title">已拒绝，拒绝原因：{{refuseReason}}</div>
      <div v-if="status == 2" class="status-title">待支付，数字转制费{{item.transFee}}元</div>
      <div v-if="status == 3" class="status-title">转码中，您已支付{{item.transFee}}的数字转制费</div>
    </div>

    <!-- dcp下载 v-if="status == 4" -->
    <dl  class="form dcp-download">
      <dt class="dl-title flex-box"><span>格式</span><em>下载链接</em></dt>
      <dd v-if="item.attachments" v-for="it in item.attachments" :key="it.id" class="dcp-dd-list flex-box">
        <!-- <span>{{it.typeCode}}</span> -->
        <span  v-for="(ind, index) in typeList" :key="index" v-if="ind.key == it.typeCode ">{{ind.text}}</span>
        <a target="_blank" :href="it.fileUrl">{{it.fileUrl || '-'}}</a>
      </dd>
    </dl>

    <div class="form detail-inner">
      <p><label>名称：</label><em>{{item.name}}</em></p>
      <p><label>客户：</label><em>{{item.customerName}}</em></p>
      <p><label>品牌：</label><em>{{item.brandName}}</em></p>
      <p><label>产品：</label><em>{{item.productName}}</em></p>
      <p><label>广告片时长规格：</label><em>{{item.specification}}s</em></p>
      <p><label>广告片下载地址：</label><em>{{item.srcFileUrl}}</em></p>

      <div class="create-submit-btn">
         <Button v-if="status != 4" v-auth="'promotion.ad-video#edit'" type="primary" 
         class="btn" @click="$router.push({name: 'pop-film-edit', params: {id: item.id}})">编辑</Button>
         <Button v-if="status == 2" v-auth="'promotion.ad-video#pay'" type="primary"  class="btn" @click="handlePayment">支付</Button>
         <Button class="cancel-btn" @click="$router.push({name: 'pop-film'})">返回</Button>
      </div>
    </div>

    <!-- dcp下载 -->
    <!-- <div v-if="status == 4">
      <Row type="flex" justify="space-between" class="code-row-bg">
          <Col span="11" v-if="item.attachments" v-for="it in item.attachments" :key="it.id" class="down-load-dcp flex-box">
            <span>{{queryTypeList(it.typeCode)}}</span>
            <a :href="it.fileUrl" target="_blank"><img class="down-img" src="./assets/down-dcp.png"  width="14"/>下载DCP包</a>
          </Col>
      </Row>
      
     <h3 class="layout-title more-list">下载链接更新日志</h3>
      <div class="text-rows log-list">
        <p v-if="item.attachments" v-for="(ite, index) in item.attachments" :key="index">
          <span>{{formatTimes(ite.uploadTime)}}</span>
          <em>{{queryTypeList(ite.typeCode)}}Flat 格式DCP包下载链接已更新</em>
        </p>
      </div>
    </div> -->
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { confirm, toast } from '@/ui/modal'
import { formatTimes } from '@/util/validateRules'
import { detailPop, popPayment } from '@/api/popFilm'
import payDefault from './payDefault.vue'
import statusCode from './status.vue'
import { VuePlyr } from 'vue-plyr'
import 'vue-plyr/dist/vue-plyr.css'

@Component({
  components: {
    payDefault,
    statusCode,
    VuePlyr
  }
})
export default class Main extends ViewBase {
  // status = 5 拒绝原因
  refuseReason = ''

  // 状态
  status = 0

  item: any = []
  typeList = []
  statusList = []

  // get formatTimes() {
  //   return formatTimes
  // }
  mounted() {
    this.list()
  }

  async list() {
    const id = this.$route.params.id
    try {
      const { data: { item, typeList, statusList } } = await detailPop(id)
      this.item = item
      this.typeList = typeList
      this.statusList = statusList
      this.status = item.status
      this.refuseReason = item.refuseReason || '' // 拒绝原因
    } catch (ex) {
      this.handleError(ex)
    }
  }

  // async cancelPlan() {
  //   const name = this.item.name
  //   const id = this.item.id
  //   await confirm(`是否取消广告片：${name}`, {title: '取消广告片'})
  //   try {
  //     await popCancel(id)
  //     this.$router.push({name: 'pop-film'})
  //   } catch (ex) {
  //     this.handleError(ex)
  //   }
  // }

  async handlePayment() {
    await confirm(`是否要支付数字转制费用 ${this.item.transFee} 元`, {
      title: '支付广告片'
    })
    try {
      const id = this.item.id
      await popPayment(id)
      this.$router.push({name: 'pop-film'})
    } catch (ex) {
      this.handleError(ex)
    }
  }

  // queryTypeList(id: any) {
  //   let list: any = []
  //   list = this.typeList.filter((item: any) => item.key == id)
  //   return list[0].text || null
  // }

  // toEdit() {
  //   const id = this.item.id
  //   this.$router.push()
  // }
}
</script>

<style lang="less" scoped>
@import './com.less';
.dcp-download {
  .dl-title {
    font-size: 24px;
    font-weight: 400px;
    text-align: center;
    background: rgba(255, 255, 255, .3);
    height: 50px;
    line-height: 50px;
    span {
      flex: 1;
      border-right: solid 1px #fff;
    }
    em {
      flex: 2;
    }
  }
  .dcp-dd-list {
    border-bottom: solid 1px rgba(255, 255, 255, .8);
    height: 55px;
    line-height: 55px;
    text-align: center;
    font-size: 16px;
    span {
      flex: 1;
      border-right: solid 1px #fff;
    }
    a {
      flex: 2;
    }
  }
}
.detail-inner {
  padding: 39px 30px 40px;
  p {
    font-size: 14px;
    padding-bottom: 18px;
    label {
      padding-right: 6px;
    }
    em {
      font-size: 16px;
    }
  }
}
.btn-footer {
  margin: 10px 0 40px;
  .edit-btn {
    margin-right: 20px;
  }
}
.code-row-bg {
  padding: 20px 30px;
  .down-load-dcp {
    height: 60px;
    line-height: 60px;
    background: #f9f9f9;
    justify-content: space-between;
    padding: 0 30px;
    .down-img {
      position: relative;
      top: 3px;
      right: 10px;
    }
  }
}
.log-list {
  color: #444;
  span {
    margin-right: 30px;
  }
}
</style>
