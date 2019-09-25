<template>
  <div>
    <section class="pane-wp">
      <h4 class="pane-head flex-box">
        <em>
          {{title}}
        </em>
        <router-link target='_blank' :to="{ name: 'effect-report-monitorsPlayer', params: { planId}}" class="more-link" >查看更多</router-link>
      </h4>
      <div class="pane-body">
        <div class="nodata-wp" v-if="data.length === 0">
          暂无数据
        </div>
        <div class="user-content-wp" v-else>
          <div class="user-pane-group">
            <ul class="video-list">
              <li v-for="it in realData" :key="it.id">
                <router-link target='_blank' :to="{ name: 'effect-report-monitorsPlayer', params: { planId, videoId: it.id}}">
                  <div class="v-item">
                    <div class="v-thumb" :style="`background-image: url( ${it.img} ) `"></div>
                    <div class="v-meta">
                      <div class="v-meta-title">{{it.time}}</div>
                      <div class="v-meta-entry"><span>{{it.name}}</span></div> 
                    </div>
                    <Icon color="#fff" type="md-arrow-dropright-circle" />
                  </div>
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({})
export default class MonitorsCard extends Vue {
  @Prop({ type: Array, default: () => [] }) data!: any
  @Prop({ type: Number, default: 0 }) planId!: number

  title: string = '监播视频'

  get realData() {
    // 防止接口返回超过限额数量的数据
    return this.data.length > 5 ? this.data.slice(0, 5) : this.data
  }

}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
ul.video-list {
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: center;
  padding: 15px;
  li {
    width: 25%;
    position: relative;
    // border: 1px solid #fff;
    display: flex;
    flex-flow: row;
    justify-content: center;
    align-items: center;
    .v-item {
      border-radius: 5px;
      overflow: hidden;
      position: relative;
      background: rgba(0, 32, 45, 0.2);
      .ivu-icon {
        position: absolute;
        left: 50%;
        top: 50%;
        font-size: 39px;
        transform: translate(-50%, -90%);
        cursor: pointer;
      }
      .v-thumb {
        background-repeat: none;
        background-size: cover;
        width: 210px;
        height: 210px;
      }
      .v-meta {
        overflow: hidden;
        zoom: 1;
        z-index: 3;
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 80px;
        background: rgba(0, 32, 45, 0.8);
        padding-top: 8px;
        color: #fff;
        cursor: pointer;
        .v-meta-title {
          margin: 0 8px;
          height: 20px;
          line-height: 20px;
          color: #fff;
          word-break: break-all;
          word-wrap: break-word;
        }
        .v-meta-entry {
          margin: 0 8px;
          margin-right: 10px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
      }
    }
  }
}
.user-pane-group {
  background: rgba(0, 32, 45, 0.8);
  width: 100%;
  border-radius: 0 0 5px 5px;
  .user-pane-head {
    background-color: #153845;
    margin-top: 20px;
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 40px 0 29px;
    height: 30px;
  }
  .user-pane-body {
    margin: 10px 0;
    padding: 25px;
  }
}
.pane-wp {
  min-width: 287px;
  min-height: 254px;
  color: #fff;
  font-size: 14px;
  user-select: none;
  margin-top: 20px;
  .pane-head {
    padding: 24px 30px;
    justify-content: space-between;
    font-weight: 400;
    background: rgba(0, 32, 45, 1);
    border-radius: 5px 5px 0 0;
  }
  .pane-body {
    position: relative;
  }
  .nodata-wp {
    background: rgba(0, 32, 45, 0.6);
    border-radius: 0 0 5px 5px;
    padding: 25px;
    display: flex;
    flex-flow: row;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    color: #999;
  }
  .user-content-wp {
    // nxd
    padding: 0;
  }
}
.more-link {
  color: #fff;
  opacity: 0.6;
  &:hover {
    color: #f3d872;
  }
}
</style>
