<template>
  <div class="page home-bg">
     <div class="layout-nav-title">
       <router-link :to="{name: 'pop-film'}" >广告片</router-link> > 
        <span > 查看广告片</span>
     </div>
    <payDefault :status="status" v-if="status == 1 || status == 2 || status == 3 || status == 4"></payDefault>
    <statusCode :statuCode="status" v-else-if="status == 5 || status == 6"></statusCode>
    <h3 class="layout-title">概览</h3>
    <div class="text-rows">
      <Row>
        <Col :span="12">
          <p>
            <label>广告片ID</label>
            {{item.id}}
          </p>
          <p>
            <label>客户名称</label>
            {{item.customerName}}
          </p>
          <p>
            <label>广告片规格</label>
            {{item.specification}}s
          </p>
          <p>
            <label>数字专制费用/¥</label>
            {{item.transFee}}
          </p>
        </Col>
        <Col :span="12">
          <p>
            <label>广告片名称</label>
            {{item.name}}
          </p>
          <p>
            <label>创建时间</label>
            {{formatTimes(item.applyTime)}}
          </p>
          <p>
            <label>广告片时长</label>
            {{item.length}}s
          </p>
        </Col>
      </Row>
    </div>
    <h3 class="layout-title">广告片浏览</h3>
    <Row class="text-rows">
      <Col :span="12">
        <p class="flex-box">
          <label>广告片</label>
          <em class="video-play">
            <VuePlyr>
               <video :src="item.srcFileUrl"  ></video>
            </VuePlyr>
          </em>
        </p>
      </Col>
    </Row>

    <!-- dcp下载 -->
    <div v-if="status == 4">
      <h3 class="layout-title">DCP包下载</h3>
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
    </div>

    <div class="btnCenter btn-footer" v-if="status == 1">
      <Button v-auth="'promotion.ad-video#cancel'" class="button-cancel" @click="cancelPlan" >取消广告片</Button>
      <Button v-auth="'promotion.ad-video#edit'" type="primary" class="button-ok" @click="toEdit">编辑</Button>
    </div>
    <div class="btnCenter btn-footer" v-else-if="status == 2">
      <Button v-auth="'promotion.ad-video#cancel'" class="button-cancel" @click="cancelPlan" >取消广告片</Button>
      <Button v-auth="'promotion.ad-video#pay'" type="primary" class="button-ok" @click="handlePayment">支付</Button>
    </div>
    <div class="btnCenter btn-footer" v-else-if="status == 5">
      <Button v-auth="'promotion.ad-video#edit'" type="primary" class="button-ok" @click="toEdit">编辑</Button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { confirm, toast } from '@/ui/modal'
import { formatTimes } from '@/util/validateRules'
import { detailPop, popCancel, popPayment } from '@/api/popFilm'
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
  status = 0
  item: any = []
  typeList = []
  statusList = []
  get formatTimes() {
    return formatTimes
  }
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
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async cancelPlan() {
    const name = this.item.name
    const id = this.item.id
    await confirm(`是否取消广告片：${name}`, {title: '取消广告片'})
    try {
      await popCancel(id)
      this.$router.push({name: 'pop-film'})
    } catch (ex) {
      this.handleError(ex)
    }
  }
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
  queryTypeList(id: any) {
    let list: any = []
    list = this.typeList.filter((item: any) => item.key == id)
    return list[0].text || null
  }
  toEdit() {
    const id = this.item.id
    this.$router.push({name: 'pop-film-edit', params: {id}})
  }
}
</script>

<style lang="less" scoped>
.video-play {
  width: 300px;
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
