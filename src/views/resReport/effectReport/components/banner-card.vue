<template>
  <div class="banner-wp">
    <div class="banner-box">
      <h1>2019款WEY新车发布影院广告</h1>
      <button class="show-more-link"
              @click="selectPlan">查看其它计划</button>
    </div>
    <div class="dsc-box">
      <div class="cell">
        <ul>
          <li><i class="icon-1">1</i><span class="name">投放排期</span><span>{{data.item0}}</span></li>
          <li><i class="icon-2">2</i><span class="name">投放周期</span><span>7天</span></li>
        </ul>
      </div>
      <div class="cell">
        <ul>
          <li><i class="icon-1">1</i><span class="name">投放排期</span><span>2019-05-01 ～ 2019-05</span></li>
          <li><i class="icon-2">2</i><span class="name">投放周期</span><span>7天</span></li>
        </ul>
      </div>
      <div class="cell">
        <ul>
          <li><i class="icon-1">1</i><span class="name">投放排期</span><span>2019-05-01 ～ 2019-05</span></li>
          <li><i class="icon-2">2</i><span class="name">投放周期</span><span>7天</span></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class BannerCard extends Vue {
  @Prop({ type: Object, default: () => ({}) }) data!: any

  selectPlan() {
    this.$emit('selectPlan')
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
.banner-wp {
  background: linear-gradient(91deg, rgba(91, 74, 119, 1) 0%, rgba(29, 88, 139, 1) 100%);
  .banner-box {
    h1 {
      font-size: 70px;
      color: #fff;
      padding-left: 70px;
    }
    .show-more-link {
      margin-left: 70px;
      margin-bottom: 46px;
      width: 300px;
      height: 50px;
      background: rgba(163, 213, 230, 1);
      border-radius: 25px;
      font-size: 18px;
      color: #00202d;
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
            background-repeat: none;
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
      background-image: url('../assets/icon-1.png');
    }
    i.icon-2 {
      background-image: url('../assets/icon-1.png');
    }
    i.icon-3 {
      background-image: url('../assets/icon-1.png');
    }
    i.icon-4 {
      background-image: url('../assets/icon-1.png');
    }
    i.icon-5 {
      background-image: url('../assets/icon-1.png');
    }
    i.icon-6 {
      background-image: url('../assets/icon-1.png');
    }
  }
}
</style>
