<template>
  <div class="plan-box" v-if="item">
    <h3 class="title">计划创建完毕，等待资源确认</h3>
    <div class="audit">
      平台会由专业映前投放专家对您的广告计划进行调整，请耐心等待，或联系商务人员
    </div>
    <div class="finish-detail">
      <dl>
        <dd>投放场次数预估</dd>
        <dt>
          <p v-if="!!item.estimateShowCount && (item.estimateShowCount + '').length > 4">
            <Number :addNum="!!item.estimateShowCount ? item.estimateShowCount/100000*7 : 0" />万 ~ 
            <Number :addNum="!!item.estimateShowCount ? item.estimateShowCount/100000*13 : 0" />万
          </p>
          <p v-else>
            <Number :flag="2"  :addNum="Math.floor(item.estimateShowCount * 7 / 10)" /> ~ 
            <Number :flag="2"  :addNum="Math.floor(item.estimateShowCount * 13 / 10)" />
          </p>
        </dt>
        <!-- <dt>
          <img src="./assets/toufangfangan.png" width="73" height="66px"/>
        </dt> -->
      </dl>
      <dl>
        <dd>预估花费</dd>
        <dt>
          <p v-if="!!item.estimateCostAmount && (item.estimateCostAmount + '').length > 4">
            <Number :addNum="!!item.estimateCostAmount ? item.estimateCostAmount / 10000 : 0" />万
            <!-- <Number :addNum="!!item.estimateCostAmount ? item.estimateCostAmount : 0" />万 -->
          </p>
          <p v-else>
            <Number :flag="2"  :addNum="item.estimateCostAmount" /> 
            <!-- <Number :flag="2"  :addNum="item.estimateCostAmount * 13 / 10" /> -->
          </p>
        </dt>
        <!-- <dt>
          <img src="./assets/qian-2.png" width="73" height="66px"/>
        </dt> -->
      </dl>
      <dl>
        <dd>曝光人次预估</dd>
        <dt>
           <p v-if="!!item.estimatePersonCount && (item.estimatePersonCount + '').length > 4">
            <Number :addNum="!!item.estimatePersonCount ? item.estimatePersonCount/100000*7 : 0" />万 ~ 
            <Number :addNum="!!item.estimatePersonCount ? item.estimatePersonCount/100000*13 : 0" />万 
          </p>
          <p v-else>
            <Number :flag="2"  :addNum="Math.floor(item.estimatePersonCount*7/10)" /> ~ 
            <Number :flag="2"  :addNum="Math.floor(item.estimatePersonCount*13/10)" />
          </p>
        </dt>
        <!-- <dt>
          <img src="./assets/renqun.png" width="100" height="66px"/>
        </dt> -->
      </dl>
    </div>
    <div class="finish-detail">
       <dl>
        <dd>覆盖影院</dd>
        <dt><Number :flag="2" :addNum="!!cinemaCount ? cinemaCount : 0" />家</dt>
        <!-- <dt>
          <img src="./assets/yingyuanb.png" width="73" height="66px"/>
        </dt> -->
      </dl>
      <dl>
        <dd>投放影片</dd>
        <dt>{{planMovies}}部</dt>
        <!-- <dt>
          <img src="./assets/dianyingpiao.png" width="73" height="66px"/>
        </dt> -->
      </dl>
    </div>
    <div class="btn-center">
      <Button type="default" class="button-ok btn-next" @click="back('dataform')"><img width="16px" src="./assets/next.png" /> 返回上一步</Button>
      <Button type="default" class="button-ok btn-save" @click="next('dataform')">确定方案</Button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { adverdetail } from '@/api/popPlan.ts'
import Number from '@/components/number.vue'
import { sureEdit } from '@/api/plan'

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

  back() {
    this.$emit('input', {
      step: 2,
      setid: this.$route.params.setid
    })
    if (this.$route.name == 'pop-planlist-edit' || this.$route.name == 'pop-planlist-add') {
      this.$router.push({
        name: 'pop-planlist-edit',
        params: { step: '2', setid: this.$route.params.setid  }
      })
    } else {
      this.$router.push({
        name: 'pop-business-edit',
        params: { step: '2', setid: this.$route.params.setid  }
      })
    }
  }
  async next() {
    try {
      await sureEdit(this.$route.params.setid)
      this.$router.push({
        name: 'pop-planlist',
      })
    } catch (ex) {
      this.handleError(ex)
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

.plan-box {
  margin: 0 30px;
}
.title {
  text-align: center;
  font-size: 30px;
  margin-top: 40px;
}
.audit {
  text-align: center;
  font-size: 18px;
  margin-top: 32px;
  margin-bottom: 32px;
}
.btn-center {
  margin: 50px 0 30px;
  text-align: center;
}
.btn-save {
  width: 200px;
  font-weight: 500;
  .button-style(#fff, #00202d);
  border-radius: 25px;
  line-height: 34px;
}
.btn-next {
  width: 200px;
  font-weight: 500;
  .button-style(#00202d, rgba(0, 0, 0, 0));
  vertical-align: middle;
  border-radius: 25px;
  line-height: 34px;
  img {
    vertical-align: middle;
  }
}
.finish-detail {
  height: 152px;
  background: rgba(0, 32, 45, .9);
  border-radius: 5px 0 0 5px;
  display: flex;
  dl {
    flex: 1;
    dd {
      font-size: 16px;
      margin-top: 42px;
      text-align: center;
      font-weight: 400;
      color: #7f7f7f;
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

