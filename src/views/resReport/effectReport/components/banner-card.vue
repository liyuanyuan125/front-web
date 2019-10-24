<template>
  <div class="banner-wp">
    <div class="banner-box flex-box">
      <p>Effect Report</p>
      <h1>{{data.item6}}</h1>
      <a href="javascript:;"
         class="show-more-link"
         @click="selectPlan">查看其它计划</a>
    </div>
    <div class="dsc-box">
      <div class="cell">
        <ul>
          <li><i class="icon-1"></i><span class="name">投放排期</span><span>{{data.item0}}</span></li>
          <li><i class="icon-4"></i><span class="name">已投天数</span><span>{{data.item1}}天</span></li>
        </ul>
      </div>
      <div class="cell">
        <ul>
          <li><i class="icon-2"></i><span class="name">广告片</span><span>{{data.item2}}</span></li>
          <li><i class="icon-5"></i><span class="name">广告规格</span><span>{{data.item3}}s</span></li>
        </ul>
      </div>
      <div class="cell">
        <ul>
          <li><i class="icon-3"></i><span class="name">投放状态</span><span>{{data.item4}}</span></li>
          <li><i class="icon-6"></i><span class="name">最后更新时间</span><span>{{data.item5}}</span></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { datarange, formatDate } from '@/fn/duration.ts'

@Component({
  components: {}
})
export default class BannerCard extends Vue {
  @Prop({ type: Object, default: () => ({}) }) data!: any

  days(begin: any, end: any) {
    datarange(begin, end)
  }

  selectPlan() {
    this.$emit('selectPlan')
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
.banner-wp {
  background: url('../assets/banner.png') top center no-repeat;
  background-size: 100%;
  // min-height: 400px;
  border-radius: 5px;
  .banner-box {
    height: 262px;
    flex-flow: column;
    justify-content: center;
    align-items: flex-start;
    padding: 50px 0 0 70px;
    h1 {
      font-size: 65px;
      color: #fff;
      width: 100%;
      .cut-text();
    }
    p {
      font-size: 24px;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      line-height: 24px;
    }
    .show-more-link {
      width: 300px;
      height: 50px;
      line-height: 50px;
      background: rgba(163, 213, 230, 1);
      border-radius: 25px;
      font-size: 18px;
      color: #00202d;
      text-align: center;
    }
  }
  .dsc-box {
    background: rgba(208, 233, 246, 0.9);
    border-radius: 5px;
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    align-items: center;
    padding: 10px 70px;
    margin-bottom: 20px;
    .cell {
      width: 30%;
      ul {
        li {
          display: flex;
          flex-flow: row;
          justify-content: flex-start;
          align-items: center;
          margin: 20px 0;
          font-size: 16px;
          i {
            width: 20px;
            height: 20px;
            display: inline-block;
            margin-right: 10px;
            background-repeat: no-repeat;
            background-size: contain;
          }
          span.name {
            display: inline-block;
            margin-right: 10px;
            font-size: 14px;
          }
        }
      }
    }
    i.icon-1 {
      background-image: url('../assets/icon-a-1.png');
    }
    i.icon-2 {
      background-image: url('../assets/icon-a-2.png');
    }
    i.icon-3 {
      background-image: url('../assets/icon-a-3.png');
    }
    i.icon-4 {
      background-image: url('../assets/icon-a-4.png');
    }
    i.icon-5 {
      background-image: url('../assets/icon-a-5.png');
    }
    i.icon-6 {
      background-image: url('../assets/icon-a-6.png');
    }
  }
}
</style>
