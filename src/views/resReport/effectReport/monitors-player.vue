<template>
<div class="page-wrap">
  <h3>{{videoName === '' ? '' : videoName}}</h3>
  <div class="player-wrap">
    <vue-plyr ref="plyr" class="plyr-wrap" >
      <video :poster="videoPoster" :src="videoURL" ></video>
      <div class="offOn-button" @click="toggleHandler" v-if="listVisible">
        <Icon type="ios-arrow-forward" />
      </div>
      <div class="offOn-button off" @click="toggleHandler" v-else>
        <Icon type="ios-arrow-back" />
      </div>
    </vue-plyr>
    <div class="video-list-wrap" v-show="listVisible && playerIsReady">
      <h3>全部监播（{{totalCount}}）</h3>
      <div v-if="done && hasData" class="data-list" >
        <div span="4" v-for="(item, index) in dataList" :key="item.id" @click="selectItemHandler(index, item.id)"
        :class="`data-item ${item.playing ? 'cur' : ''}`" >
          <div class="inner">
            <Tooltip>
              <div slot="content">
                {{item.name}}
              </div>
              <a href="javascript:;"><div class="name">{{item.name}}</div></a>
            </Tooltip>
          </div>
        </div>
      </div>
      <div v-else-if="!done" class="loading-box">
        <TinyLoading />
      </div>        
      <div v-else class="noData-box">
        暂无数据
      </div>
      <Page
        v-if="done && hasData && totalCount > form.pageSize"
        class="info-page"
        :total="totalCount"
        :current="form.pageIndex"
        :page-size="form.pageSize"
        @on-change="handlePageChange"
        @on-page-size-change="handlePageSize"
      ></Page>
    </div>
  </div>
</div>
</template>
<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { VuePlyr } from 'vue-plyr'
import moment from 'moment'
import 'vue-plyr/dist/vue-plyr.css'
import { fetchList, fetchItem } from './data'
import TinyLoading from '@/components/TinyLoading.vue'
// 格式化时间
function formartDate(beginDate: string, endDate: string) {
  if ( beginDate === '' &&  endDate === '') {
    return ''
  } else {
    return moment(beginDate, 'YYYY-MM-DD').format('MM.DD') + '-' + moment(endDate, 'YYYY-MM-DD').format('MM.DD')
  }
}

/**
 * A simple HTML5, YouTube and Vimeo player https://plyr.io
 * @API https://github.com/sampotts/plyr
 */
@Component({
  components: {
    VuePlyr,
    TinyLoading
  }
})
export default class VideoPlayer extends ViewBase {

  playerIsReady = false

  done: boolean = false

  hasData: boolean = false

  totalPages: number = 0

  totalCount: number = 0

  listVisible: boolean = true

  form: any = {
    pageIndex: 1,
    pageSize: 11
  }

  planId = ''

  videoId = ''

  videoName = ''

  videoURL = ''

  videoPoster = ''

  dataList: any[] = []

  selectItemHandler(index: number, mid: string) {
    this.dataList.forEach((it: any) => {
      it.playing = false
    })
    this.dataList[index].playing = true
    this.fetchItemHandler(mid)
  }

  playerPlayHandler() {
    this.$nextTick(() => {
      if ( this.player && this.player.ready ) {
        this.playerIsReady = true
        this.player.play()
      }
    })
  }

  playerStopHandler() {
    this.$nextTick(() => {
      if ( this.player && this.player.ready ) {
        this.player.pause()
      }
    })
  }

  async fetchItemHandler(mid: string) {
    // console.log(mid)
    let queryId = ''
    if ( mid !== '') {
      queryId = mid
    } else {
      return
    }

    const mockObj = {
      ...this.form
    }

    try {
      const {
        data
      } = await fetchItem(queryId)
      const { beginDate, endDate, id, cinemaName, movieName, url, img } = data || null
      if (!url || url === '') {
        this.playerStopHandler()
      }
      this.videoId = id
      this.videoName = `
        ${cinemaName} ${formartDate(beginDate, endDate)}${movieName ? '《' + movieName + '》' : ''}监播
      `
      this.videoURL = url
      this.videoPoster = img
      this.playerPlayHandler()
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async fetchListHandler() {
    this.done = false
    this.hasData = false

    const mockObj = {
      ...this.form
    }

    try {
      const {
        data
      } = await fetchList( this.planId, { ...mockObj })
      const totalCount = data.totalCount || 0
      const items = data.items || null
      if (items && items.length > 0) {
        let res: any[] = []
        res = items.map((it: any) => {
          return {
            id: it.id,
            url: it.url,
            name: `
            ${it.cinemaName} ${formartDate(it.beginDate, it.endDate)}${it.movieName ? '《' + it.movieName + '》' : ''}
            `,
            playing: false
          }
        })
        // 防止接口返回超过限额数量的数据
        this.dataList = res.length > 11 ? res.slice(0, 11) : res
        this.totalCount = totalCount
        this.playerIsReady = true
        this.listVisible = true
        this.hasData = true
      } else {
        this.listVisible = false
      }
      this.done = true
    } catch (ex) {
      this.handleError(ex)
    }
  }

  get player() {
    return (this.$refs.plyr as any).player
  }

  created() {
    this.planId = this.$route.params.planId || ''
    this.videoId = this.$route.params.videoId || ''
    if ( this.videoId !== '' ) {
      this.fetchItemHandler(this.videoId)
    }
    if ( this.planId !== '' ) {
      this.fetchListHandler()
    }
  }

  destroyed() {
    this.player.destroy()
  }

  toggleHandler() {
    this.listVisible = !this.listVisible
  }

  handlePageChange(val: any) {
    this.form.pageIndex = val
    this.fetchListHandler()
  }

  handlePageSize(val: any) {
    this.form.pageIndex = val
  }

}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
/deep/ .ivu-tooltip-inner {
  white-space: inherit;
}
.page-wrap {
  padding-top: 40px;
  h3 {
    color: #fff;
    font-size: 18px;
    position: relative;
    top: -20px;
  }
}
.player-wrap {
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: flex-start;
  background: rgba(0, 32, 45, 0.8);
  border-radius: 8px;
  padding: 40px 0;
  position: relative;
  min-height: 600px;
  .plyr-wrap {
    flex: 1;
    .plyr audio, .plyr video {
      height: 555px;
    }
  }
  .offOn-button {
    color: #fff;
    position: absolute;
    right: 420px;
    top: 50%;
    transform: translate(0, -50%);
    width: 21px;
    height: 114px;
    background: rgba(0, 32, 45, 0.8);
    border-radius: 8px 0 0 8px;
    z-index: 9;
    display: flex;
    flex-flow: row;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    &:hover {
      background: rgba(255, 255, 255, 0.8);
      color: rgba(0, 32, 45, 0.8);
    }
  }
  .offOn-button.off {
    right: 1px;
  }
  .video-list-wrap {
    width: 420px;
    position: relative;
    height: 518px;
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    h3 {
      position: absolute;
      top: -90px;
      left: 10px;
      color: #fff;
      font-size: 18px;
    }
    .data-list {
      width: 100%;
      padding-top: 10px;
      .data-item.cur {
        a {
          color: rgba(133, 229, 253, 0.6) !important;
        }
      }
      .data-item {
        margin-bottom: 24px;
        .inner {
          height: 22px;
          font-size: 16px;
          font-weight: 400;
          line-height: 22px;
          a {
            color: rgba(255, 255, 255, 1);
          }
          a:hover {
            color: rgba(133, 229, 253, 0.6);
          }
          .name {
            width: 385px;
            .cut-text;
          }
        }
      }
    }
  }
}
//底部页码
.info-page {
  text-align: center;
  color: #fff;
  /deep/ .ivu-page-prev,
  /deep/ .ivu-page-next,
  /deep/ .ivu-page-item,
  /deep/ .ivu-page-item-jump-prev,
  /deep/ .ivu-page-item-jump-next {
    width: 35px;
    height: 35px;
    border-radius: 20px;
    background: none;
    border: none;
    color: #fff;
  }
  /deep/ .ivu-page-item {
    a {
      color: #fff;
    }
  }
  /deep/ .ivu-page-item-active a,
  /deep/ .ivu-page-item-active:hover a {
    display: inline-block;
    width: 35px;
    height: 35px;
    border-radius: 20px;
    line-height: 35px;
    text-align: center;
    background: rgba(208, 233, 246, 0.9);
    color: rgba(0, 32, 45, 1);
  }
}
.loading-box {
  width: 100%;
  height: 500px;
  text-align: center;
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
}
.noData-box {
  width: 100%;
  height: 500px;
  text-align: center;
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  color: #999;
}
</style>
