<template>
  <ReportPane :title="title">
    <template slot="more">
      <a @click="moreFnHandle"
         class="more-link"
         href="javascript:;">查看数据</a>
    </template>
    <div class="film-list-wp">
      <ul class="film-list">
        <li v-for="(item, index) in data" :key="index">
          <div class="inner">
            <div class="left">
              <dl class="film-card">
                <dt><img :src="item.poster" /></dt>
                <dd>
                  <div class="dsc-box">
                    <h5 class="name">{{item.name}}</h5>
                    <div class="score">时光评分：{{item.score}}</div>
                    <div class="time">{{item.time}}上映</div>
                    <div class="type">{{item.type}}</div>
                  </div>
                  <div class="count-box">
                    <div>
                      <h6>曝光人次</h6>
                      <p>{{item.viewCount}}</p>
                    </div>
                    <div>
                      <h6>曝光场次</h6>
                      <p>{{item.scheduleCount}}</p>
                    </div>
                    <div>
                      <h6>曝光人次占比</h6>
                      <p>{{item.viewRate}}%</p>
                    </div>
                  </div>
                </dd>
              </dl>
            </div>
            <div class="right">
              <h6>关注此片的人群画像</h6>
              <div class="age-pane">
                <div class="bar-box">
                  <ul>
                    <li v-for="(it, i) in item.userPortrait.ages"
                        :key="i">
                      <AgeBar :value="(it.value)"
                              :name="it.key"
                              :isMax="it.isMax"></AgeBar>
                    </li>
                  </ul>
                </div>
                <div class="header">
                  <div class="item">
                    <i class="male"
                       :style="`width: ${getSize(item.userPortrait.male)}; height: ${getSize(item.userPortrait.male)}`"><span>男</span><em>{{item.userPortrait.male}}%</em></i>
                  </div>
                  <div class="item">
                    <i class="female"
                       :style="`width: ${getSize(item.userPortrait.female)}; height: ${getSize(item.userPortrait.female)}`"><span>女</span><em>{{item.userPortrait.female}}%</em></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </ReportPane>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import ReportPane from './report-pane.vue'
import AgeBar from './x-age-bar.vue'

@Component({
  components: {
    ReportPane,
    AgeBar
  }
})
export default class MoviesCard extends Vue {
  @Prop({ type: Number, default: () => 0 }) moviesTotal?: number
  @Prop({ type: Array, default: () => [] }) data!: any[]


  get title() {
    return `覆盖影片（ ${this.moviesTotal}部 ）`
  }

  getSize(percent: number) {
    let width = `100%`
    if (percent === 50) {
      width = '100%'
    } else if (percent < 50) {
      width = `70%`
    } else if (percent > 50) {
      width = `90%`
    }
    return width
  }
  moreFnHandle() {
    this.$emit('showMore')
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
.film-list-wp {
  background: rgba(0, 32, 45, 0.8);
  border-radius: 5px;
  padding: 25px;
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  align-items: center;
  dl {
    width: 33%;
    padding: 0 20px;
    border-right: 1px solid #3191aa;
  }
  dl:last-child {
    border-right: 0;
  }
}
ul.film-list {
  width: 100%;
  li {
    margin-bottom: 50px;
    .inner {
      padding: 15px;
      display: flex;
      flex-flow: row;
      justify-content: space-between;
      align-items: center;
      .left {
        width: 45%;
      }
      .right {
        width: 45%;
      }
    }
  }
}
dl.film-card {
  display: flex;
  flex-flow: row;
  justify-content: flex-start;
  align-items: center;
  padding: 0;
  width: 100%;
  dt {
    padding-right: 15px;
    img {
      max-width: 165px;
      height: 220px;
    }
  }
  dd {
    flex: 1;
    .dsc-box {
      .name {
        font-size: 20px;
        font-weight: 500;
        color: rgba(255, 255, 255);
        line-height: 40px;
        height: 40px;
      }
      .score {
        font-size: 14px;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 30px;
        height: 30px;
        background: rgba(0, 32, 45, 1);
        display: inline-block;
        padding: 0 10px;
      }
      .time {
        font-size: 14px;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        line-height: 30px;
        height: 30px;
      }
      .type {
        font-size: 14px;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        line-height: 30px;
        height: 30px;
      }
    }
    .count-box {
      border-top: 1px solid hsl(192, 55%, 43%, 0.6);
      border-bottom: 1px solid hsl(192, 55%, 43%, 0.6);
      padding: 10px 0 15px 0;
      display: flex;
      flex-flow: row;
      justify-content: space-between;
      align-items: center;
      div:first-child {
        padding-left: 10px;
      }
      div:last-child {
        padding-right: 10px;
      }
      h6 {
        font-size: 14px;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 35px;
        height: 35px;
      }
      p {
        font-size: 18px;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        line-height: 18px;
      }
    }
  }
}
.age-pane {
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  height: 196px;
  background: rgba(0, 32, 45, 0.6);
  padding: 0 17px;
  min-width: 600px;
  .bar-box {
    margin-right: 10px;
    min-width: 375px;
    ul {
      display: flex;
      flex-flow: row;
      justify-content: space-between;
      align-items: flex-start;
      li {
        margin-right: 15px;
        margin-bottom: 0;
      }
    }
  }
  .header {
    flex: 1;
    display: flex;
    flex-flow: row;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    div.item {
      display: flex;
      flex-flow: column;
      justify-content: center;
      align-items: center;
      height: 80px;
      width: 80px;
    }
    i {
      position: relative;
      border-radius: 50%;
      span {
        position: absolute;
        bottom: 0;
        left: 0;
        display: inline-block;
        width: 100%;
        text-align: center;
      }
      em {
        position: absolute;
        bottom: -33px;
        left: 0;
        display: inline-block;
        width: 100%;
        text-align: center;
        font-size: 18px;
        font-weight: 500;
        line-height: 17px;
      }
    }
    i.male {
      background: url('../assets/male.png') rgba(0, 182, 204, 0.2) center 30% no-repeat;
      background-size: 35%;
      border: 1px solid #00b6cc;
      color: #00b6cc;
      display: block;
      em {
        color: rgba(87, 180, 201);
      }
    }
    i.female {
      background: url('../assets/female.png') rgba(218, 108, 112, 0.2) center 30% no-repeat;
      background-size: 35%;
      border: 1px solid #da6c70;
      color: #da6c70;
      display: block;
      em {
        color: rgba(202, 114, 115);
      }
    }
  }
}
</style>
