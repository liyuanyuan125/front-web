<template>
  <div class="total-wp">
    <div class="total-box">
      <ul>
        <li>
          <h6>总播放场次</h6>
          <p>
            <numAdd :addNum="data.showCountSum"></numAdd>场
          </p>
        </li>
        <li>
          <h6>总覆盖人次</h6>
          <p>
            <numAdd :addNum="data.personCountSum"></numAdd>
          </p>
        </li>
        <li>
          <h6>总收益</h6>
          <p>
            ￥<numAdd :addNum="data.profitAmountSum"></numAdd>
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import numAdd from './number.vue'

@Component({
  components: {
    numAdd
  }
})
export default class TotalPane extends Vue {
  @Prop({ type: Object, default: () => ({}) }) data!: any
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
.total-wp {
  background: rgba(0, 32, 45, 0.8);
  border-radius: 5px;
  margin-bottom: 20px;
  .total-box {
    ul {
      display: flex;
      flex-flow: row;
      justify-content: space-between;
      align-items: center;
      padding: 67px 95px;
      li {
        h6 {
          font-size: 16px;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
          line-height: 16px;
          text-align: center;
          margin-bottom: 20px;
          min-width: 200px;
        }
        p {
          font-size: 30px;
          font-weight: 500;
          color: rgba(255, 255, 255, 1);
          line-height: 30px;
          text-align: center;
          display: inline-block;
          min-width: 200px;
        }
      }
    }
  }
}
</style>
