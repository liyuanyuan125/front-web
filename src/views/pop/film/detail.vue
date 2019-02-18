<template>
  <div class="page home-bg">
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
            {{item.applyTime}}
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
          <em>
             <video :src="item.srcFileUrl" width="300" controls="controls"></video>
          </em>
        </p>
      </Col>
    </Row>
    <div class="btnCenter btn-footer" v-if="stauts == 1">
      <Button class="button-cancel" @click="cancelPlan" >取消广告计划</Button>
      <Button type="primary" class="button-ok" @click="toEdit">编辑</Button>
    </div>
    <div class="btnCenter btn-footer" v-else-if="stauts == 2">
      <Button class="button-cancel" @click="cancelPlan" >取消广告计划</Button>
      <Button type="primary" class="button-ok" @click="handlePayment">支付</Button>
    </div>
    <div class="btnCenter btn-footer" v-else-if="stauts == 5">
      <Button type="primary" class="button-ok" @click="toEdit">编辑</Button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { confirm, toast } from '@/ui/modal'
import { detailPop, popCancel, popPayment } from '@/api/popFilm'
import payDefault from './payDefault.vue'
import statusCode from './status.vue'

@Component({
  components: {
    payDefault,
    statusCode
  }
})
export default class Main extends ViewBase {
  status = 0
  item: any = []
  typeList = []
  statusList = []

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
      this.handleError(ex.msg)
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
      this.handleError(ex.msg)
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
      this.handleError(ex.msg)
    }
  }

  toEdit() {
    const id = this.item.id
    this.$router.push({name: 'pop-film-edit', params: {id}})
  }
}
</script>

<style lang="less" scoped>
.btn-footer {
  margin: 10px 0 40px;
  .edit-btn {
    margin-right: 20px;
  }
}
</style>
