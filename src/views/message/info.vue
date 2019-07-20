<template>
  <div class="message-info-page">
    <div class='top-wrap'>
      <a class="back-link" href="javascript:;" @click="back"> &lt; 返回列表 </a>
      <a class="read-all-button" @click="readAllHandler">全部标为已读</a>
    </div>
    <div class='message-info-wrap'>
      <div class="fetch-loading" v-if="loading">
        <TinyLoading /> 加载中</div>
      <div class="fetch-empty" v-if="!loading && !timeout && !data.id">暂无数据</div>
      <div class="fetch-timeout" v-if="timeout">
        请求超时，<a class="retry" @click="retry">点击重试</a>
      </div>
      <div class="inner" v-if="!loading && !timeout && data.id">
        <div class="top-panel">
          <div class="type-box"><i class="icons" :style=" `background-image: url('${data.icon}')` "></i>{{data.name}}</div>
          <div class="time-box">{{transTime(data.sendTime)}}</div>
        </div>
        <div class="content-panel">
          <div class="title-box">{{data.title}}</div>
          <div class="content-box" v-html="data.body"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { readItem, readAll } from '@/api/message'
import TinyLoading from '@/components/TinyLoading.vue'
import { findIndex, isEmpty } from 'lodash'
import moment from 'moment'
import { warning, success, toast } from '@/ui/modal'

const getName = (key: string, list: any[]) => {
  const i: number = findIndex(list, (it: any) => {
    return key === it.key
  })
  const res: string = list[i].text || ''
  return res
}

@Component({
  components: {
    TinyLoading
  }
})
export default class MessageInfo extends ViewBase {
  id: string = ''

  loading = false

  timeout = false

  data: any = {}

  statusList: any[] = []

  back() {
    this.$router.go(-1)
  }

  created() {
    this.id = this.$route.params.id || ''
    this.fetchData()
  }

  async fetchData() {
    if (this.loading) {
      return
    }
    if (this.id === '') {
      return
    }
    this.loading = true
    this.timeout = false
    try {
      const { data } = await readItem(this.id)
      const item = data.item || null
      const read = data.read || null
      const status = data.status || null

      if (item && item.id) {
        this.data = {
          ...item
        }
      }

      if (status && status.length > 0) {
        this.statusList = status
      }
      this.loading = false
    } catch (ex) {
      const name = ex && ex.code && `handle${ex.code}`
      ; ((this as any)[name] || this.handleError).call(this, ex)
    } finally {
      this.loading = false
    }
  }

  retry() {
    this.data = {}
    this.fetchData()
  }

  transTime(sendTime: any) {
    if (!sendTime || sendTime == '') {
      return ''
    }
    const today = moment(new Date()).format('YYYYMMDD')
    const curDate = moment(sendTime).format('YYYYMMDD')
    if (curDate === today) {
      return moment(sendTime).format('h:mm')
    } else {
      return moment(sendTime).format('MM-DD')
    }
  }

  async readAllHandler() {
    try {
      const { data } = await readAll()
      if (data) {
        await toast('操作成功')
      } else {
        await toast('操作失败')
      }
    } catch (ex) {
      const name = ex && ex.code && `handle${ex.code}`
      ; ((this as any)[name] || this.handleError).call(this, ex)
    } finally {
      this.loading = false
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

.fetch-loading,
.fetch-empty,
.fetch-timeout {
  color: #888;
  font-size: 16px;
  text-align: center;
  user-select: none;
}

.message-info-page {
  position: relative;
  .top-wrap {
    min-height: 30px;
    margin-bottom: 20px;
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    a.back-link {
      color: #fff;
    }
    a.read-all-button {
      display: inline-block;
      width: 138px;
      height: 30px;
      background: rgba(0, 32, 45, 1);
      border-radius: 15px;
      color: #fff;
      text-align: center;
      line-height: 30px;
      cursor: pointer;
    }
  }
  .message-info-wrap {
    background: rgba(255, 255, 255, 0.7);
    border-radius: 5px;
    border: 1px solid rgba(255, 255, 255, 1);
    min-height: 350px;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    .inner {
      width: 100%;
      padding: 25px;
    }
    .top-panel {
      display: flex;
      flex-flow: row;
      justify-content: space-between;
      align-items: center;
      .type-box {
        // 标题// 标题
        width: 190px;
        display: flex;
        flex-flow: row;
        justify-content: flex-start;
        align-items: center;
        font-size: 16px;
        font-weight: 500;
        color: rgba(0, 32, 45, 1);
        i.icons {
          // 图标
          width: 30px;
          height: 30px;
          display: inline-block;
          background-position: center center;
          background-size: contain;
          background-repeat: no-repeat;
          padding: 0 25px 0 35px;
        }
      }
      .time-box {
        // 时间
        font-size: 14px;
        font-weight: 400;
        color: rgba(0, 32, 45, 0.5);
      }
    }
    .content-panel {
      padding: 15px 100px;
      .title-box {
        font-size: 16px;
        font-weight: 500;
        color: rgba(0, 32, 45, 1);
        padding-bottom: 20px;
        border-bottom: 1px solid rgba(49, 145, 170, 0.5);
      }
      .content-box {
        padding: 15px 0;
      }
    }
  }
}
</style>
