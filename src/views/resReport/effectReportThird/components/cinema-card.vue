<template>
  <ReportPane :title="title">
    <template slot="more">
      <a @click="moreFnHandle"
         class="more-link"
         href="javascript:;">查看数据</a>
    </template>
    <div class="cinema-list-wp">
      <dl v-if=" data.viewRate.data && data.viewRate.data.length > 0 ">
        <dt>{{data.viewRate.listName}}</dt>
        <dd>
          <ul class="cinema-list">
            <li v-for=" (item, index) in data.viewRate.data"
                :key="index">
              <div class="cinema-list-item-inner">
                <span>{{item.name}}</span>
                <span>{{item.count}}%</span>
              </div>
            </li>
          </ul>
        </dd>
      </dl>

      <dl v-if=" data.scheduleRate.data && data.scheduleRate.data.length > 0 ">
        <dt>{{data.scheduleRate.listName}}</dt>
        <dd>
          <ul class="cinema-list">
            <li v-for=" (item, index) in data.scheduleRate.data"
                :key="index">
              <div class="cinema-list-item-inner">
                <span>{{item.name}}</span>
                <span>{{item.count}}%</span>
              </div>
            </li>
          </ul>
        </dd>
      </dl>

      <!-- <dl v-if=" data.costRate.data && data.costRate.data.length > 0 ">
        <dt>{{data.costRate.listName}}</dt>
        <dd>
          <ul class="cinema-list">
            <li v-for=" (item, index) in data.costRate.data"
                :key="index">
              <div class="cinema-list-item-inner">
                <span>{{item.name}}</span>
                <span>{{item.count}}%</span>
              </div>
            </li>
          </ul>
        </dd>
      </dl> -->
    </div>
  </ReportPane>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import numAdd from './number.vue'
import ReportPane from './report-pane.vue'

@Component({
  components: {
    numAdd,
    ReportPane
  }
})
export default class CinemaCard extends Vue {
  @Prop({ type: Object, default: () => ({}) }) data!: any

  get title() {
    return `覆盖影院（ ${this.data.totalCount}家 ）`
  }

  moreFnHandle() {
    this.$emit('showMore')
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
.cinema-list-wp {
  border-radius: 5px;
  padding: 25px;
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  align-items: center;
  dl {
    width: 49%;
    border-right: 1px solid rgba(49, 145, 170, 0.5);
    padding: 0 15px;
    dt {
      height: 30px;
      line-height: 30px;
      background: rgba(0, 32, 45, 0.3);
      font-size: 14px;
      font-weight: 400;
      color: #fff;
      padding: 0 20px;
    }
    dd {
      padding: 10px 20px;
    }
  }
  dl:last-child {
    border-right: 0;
  }
  ul.cinema-list {
    li {
      margin-bottom: 20px;
      span {
        font-size: 14px;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
      }
      .cinema-list-item-inner {
        display: flex;
        flex-flow: row;
        justify-content: space-between;
        align-items: center;
      }
    }
  }
}
</style>
