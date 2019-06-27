<template>
  <div class="precept-box " v-if="data">
    <Row class="precept">
      <Row class="" :gutter="16">
        <Col span="5" class="item">
          <div>
            <p class="title">曝光人次预估</p>
            <p class="number">
              <Number :addNum="data.estimatePersonCount/10000" />
            </p>
          </div>
        </Col>
        <Col span="5" class="item">
          <div>
            <p class="title">投放场次数预估</p>
            <p class="number">
              <Number :addNum="data.estimateShowCount/10000" />
            </p>
          </div>
        </Col>
        <Col span="5" class="item">
          <div>
            <p class="title">预估花费</p>
            <p class="number">
              <Number :addNum="data.estimateCostAmount/10000" />
            </p>
          </div>
          <div class="line-right"></div>
        </Col>
        <Col span="6" class="item item-dl">
          <dl>
            <dd>计划名称</dd>
            <dt>{{data.name}}</dt>
          </dl>
          <dl>
            <dd>广告片</dd>
            <dt>{{data.videoName}}</dt>
          </dl>
          <dl>
            <dd>投放排期</dd>
            <dt>{{formatDate(data.beginDate)}}至{{formatDate(data.endDate)}}</dt>
          </dl>
        </Col>
        <Col span="3" class="item item-dl">
          <dl>
            <dd>客户</dd>
            <dt style="width: 70px">{{data.customerName}}</dt>
          </dl>
          <dl>
            <dd>广告规格</dd>
            <dt>{{data.specification}}s</dt>
          </dl>
          <dl>
            <dd>投放周期</dd>
            <dt>{{days(data.beginDate, data.endDate)}}天</dt>
          </dl>
        </Col>
        <Col span="24" class="item" style="margin-top: 30px; color:#57B4C9">
        <img src="./assets/info.png" />
          以上曝光数据为根据影片想看指数、预售情况、近两年同档期影片市场表现情况综合预估,
          实际投放周期和投放场次数请以最终实际投放结果为准.
        </Col>
      </Row>
    </Row>
    
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import Number from '@/components/number.vue'
import moment from 'moment'
import { adverdetail } from '@/api/popPlan.ts'

const timeFormat = 'YYYY-MM-DD'
@Component({
  components: {
    Number
  }
})
export default class App extends ViewBase {
  @Prop() value: any

  data: any = {}

  created() {
    this.findId()
  }

  async findId() {
    try {
      const { data } = await adverdetail(this.$route.params.setid)
      this.data = data.item
      this.$emit('input', this.data)
    } catch (ex) {
      this.handleError(ex)
    }
  }

  days(begin: any, end: any) {
    const time = new Date(this.formatDate(end)).getTime() - new Date(this.formatDate(begin)).getTime()
    return time / (3600 * 24 * 1000) + 1
  }

  formatDate(data: any) {
    return data ? `${(data + '').slice(0, 4)}-${(data + '').substr(4, 2)}-${(data + '').substr(6, 2)}` : '暂无'
  }

  // formatDate(data: any) {
  //   return data ? moment(data).format(timeFormat) : '暂无'
  // }
}
</script>

<style lang="less" scoped>
.precept-box {
  margin-left: 30px;
  margin-right: 10px;
  .precept {
    padding: 0 30px;
    height: 186px;
    background: rgba(0, 32, 45, 1);
    border-radius: 5px;
    opacity: 0.9;
  }
  .item {
    color: #26344b;
    font-size: 14px;
    .title {
      margin-top: 30px;
      font-weight: 400;
      color: #fff;
      opacity: .8;
    }
  }
  .number {
    font-size: 30px;
    margin-top: 20px;
    color: #fff;
    display: inline-block;
    width: 180px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    /deep/ span::after {
      content: "万";
    }
    /deep/ span::before {
      content: "≈";
    }
  }
  .item-dl {
    display: flex;
    flex-wrap: wrap;
    align-content: center;
    margin-top: 20px;
    height: 100%;
  }
  dl {
    display: flex;
    height: 30px;
    line-height: 30px;
    width: 100%;
    dd {
      width: 60px;
      color: #fff;
      opacity: .8;
    }
    dt {
      margin-left: 10px;
      color: #fff;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
.line-right {
  position: absolute;
  width: 1px;
  height: 81px;
  top: 30px;
  right: 40px;
  background: #fff;
}
</style>
