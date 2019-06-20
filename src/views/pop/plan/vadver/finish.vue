<template>
  <div class="plan-box" v-if="item">
    <h3 class="title">计划创建完毕，等待资源确认</h3>
    <div class="audit">
      平台会由专业映前投放专家对您的广告计划进行调整,请耐心等待。
    </div>
    <div class="finish-detail">
      <dl>
        <dd>覆盖影院</dd>
        <dt><Number :addNum="!!cinemaCount ? cinemaCount : 0" /></dt>
        <dt>
          <img src="./assets/yingyuanb.png" width="73" height="66px"/>
        </dt>
      </dl>
      <dl>
        <dd>投放影片</dd>
        <dt><Number :addNum=" planMovies " /></dt>
        <dt>
          <img src="./assets/dianyingpiao.png" width="73" height="66px"/>
        </dt>
      </dl>
      <dl>
        <dd>曝光人次预估</dd>
        <dt><Number :addNum="!!item.estimatePersonCount ? item.estimatePersonCount : 0" /></dt>
        <dt>
          <img src="./assets/renqun.png" width="73" height="66px"/>
        </dt>
      </dl>
      <dl>
        <dd>投放场次数预估</dd>
        <dt><Number :addNum="!!item.estimateShowCount ? item.estimateShowCount : 0" /></dt>
        <dt>
          <img src="./assets/toufangfangan.png" width="73" height="66px"/>
        </dt>
      </dl>
      <dl>
        <dd>预估花费</dd>
        <dt><Number :addNum="!!item.estimateCostAmount ? item.estimateCostAmount : 0" /></dt>
        <dt>
          <img src="./assets/qian-2.png" width="73" height="66px"/>
        </dt>
      </dl>
    </div>
    <div class="btn-center">
      <Button type="default" class="button-ok btn-next" @click="back('dataform')"><img width="16px" src="./assets/next.png" /> 返回上一步</Button>
      <Button type="default" class="button-ok btn-save" @click="back('dataform')"> 导出投放方案</Button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { adverdetail } from '@/api/popPlan.ts'
import Number from '@/components/number.vue'

@Component({
  components: {
    Number
  }
})
export default class Apps extends ViewBase {
  step = 0
  item: any = null
  cinemaCount = 0
  planMovies = 0

  created() {
    this.lodding()
  }

  async lodding() {
    try {
      const { data: {
          item,
          cinemaCount,
          planMovies
        } } = await adverdetail(this.$route.params.setid)
        this.item = item
        this.planMovies = (planMovies || []).length
        this.cinemaCount = cinemaCount
    } catch (ex) {
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

.plan-box {
  margin: 0 40px;
}
.title {
  text-align: center;
  font-size: 26px;
  margin-top: 40px;
}
.audit {
  text-align: center;
  margin-top: 32px;
  margin-bottom: 32px;
}
.btn-center {
  margin-top: 50px;
  text-align: center;
}
.btn-save {
  width: 200px;
  .button-style(#fff, #00202d);
  border-radius: 25px;
}
.btn-next {
  width: 200px;
  .button-style(#00202d, rgba(0, 0, 0, 0));
  vertical-align: middle;
  border-radius: 25px;
  img {
    vertical-align: middle;
  }
}
.finish-detail {
  height: 212px;
  background: rgba(0, 32, 45, .9);
  border-radius: 5px 0 0 5px;
  display: flex;
  dl {
    flex: 1;
    dd {
      margin-top: 42px;
      margin-bottom: 26px;
      text-align: center;
      font-weight: 400;
      color: rgba(255, 255, 255, .7);
      line-height: 16px;
    }
    dt:first-of-type {
      font-size: 30px;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      line-height: 30px;
      text-align: center;
    }
    dt:last-of-type {
      opacity: .9;
      text-align: center;
      margin-top: 30px;
    }
  }
}
</style>

