<template>
  <div class="page">
    <Progress :percent="progress" status="active" class="progress"/>

    <VideoUploader v-model="videoUrl">
    </VideoUploader>

    <OssUploader v-model="ossUrl"/>

    <p>按时发送发放322323是非得失：<MiddleEllipsis class="shi">春眠不觉晓处处蚊子咬夜来风雨声花落知多少</MiddleEllipsis>是对方是否</p>

    <div><MiddleEllipsis class="shi">{{text}}</MiddleEllipsis></div>

    <div>
      <Button @click="changeText">改变文字</Button>
    </div>

    <!-- <UploadLabel useCircle/>

    <UploadButton/>

    <TripleDialog v-model="tripleShow">
      妳好呀
    </TripleDialog> -->

    <!-- <WeekDatePicker v-model="weekDate"/>

    <div>
      <a @click="visible = true">打开</a>
    </div>

    <CitySelectDialog
      v-model="visible"
      :cityIds.sync="cityIds"
      :topCityIds="topCityIds"
      @ok="onCitySelectOk"
    /> -->

    <!-- <ECharts :options="chartData" auto-resize class="chart"/> -->

    <!-- <KeepSelectTable
      border
      stripe
      :width="600"
      :data="tableData"
      :columns="tableColumns"
      :selectedIds.sync="selectedIds"
    >
      <template slot="name" slot-scope="{ row }">
        <span>name: {{row.name}}</span>
      </template>
    </KeepSelectTable>

    <Page :current.sync="tablePage" :total="18"/> -->
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import WeekDatePicker from '@/components/weekDatePicker'
import CitySelectDialog from '@/components/citySelectDialog'
import TripleDialog from '@/components/tripleDialog'
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import KeepSelectTable from '@/components/keepSelectTable'
import OSS from 'ali-oss'
import { get } from '@/fn/ajax'
import { devLog } from '@/util/dev'
import { dot } from '@/util/dealData'
import OssUploader from '@/components/ossUploader'
import VideoUploader from '@/components/videoUploader'
import UploadLabel from '@/components/uploadLabel'
import UploadButton from '@/components/UploadButton.vue'
import triple from '@/ui/triple'
import MiddleEllipsis from '@/components/middleEllipsis'
import { alert, warning, success, error } from '@/ui/modal'

@Component({
  components: {
    WeekDatePicker,
    CitySelectDialog,
    TripleDialog,
    ECharts,
    KeepSelectTable,
    OssUploader,
    VideoUploader,
    UploadLabel,
    UploadButton,
    MiddleEllipsis
  }
})
export default class AboutPage extends ViewBase {
  progress = 0

  videoUrl = 'http://aiads-file.oss-cn-beijing.aliyuncs.com/MISC/MISC/blrhqc9e2o7g008ukpkg.mp4'

  ossUrl = 'http://aiads-file.oss-cn-beijing.aliyuncs.com/MISC/MISC/blrhqc9e2o7g008ukpkg.mp4'

  tripleShow = false

  text = '春眠不觉晓'

  n = 1

  onBegin(ev: any) {
    devLog('=> onBegin', ev)
  }

  onProgress(ev: any) {
    devLog('=> onProgress', ev)
  }

  onIsPausedChanged(ev: any) {
    devLog('=> onIsPausedChanged', ev)
  }

  changeText() {
    this.text = this.n % 2 ? '春眠不觉晓处处蚊子咬夜来风雨声花落知多少' : '出门水电费'
    this.n++
  }

  // async onUpload(ev: Event) {
  //   const input = ev.target as HTMLInputElement
  //   const [ file = null ] = input.files || []
  //   const uploader = new OssUploader()
  //   uploader.on('cacheHit', (evt: CacheHitEvent) => {
  //     evt.useCache = true
  //   })
  //   .on('progress', (evt: ProgressEvent) => {
  //     this.progress = +evt.percent.toFixed(2)
  //   })
  //   uploader.upload(file!)
  //   setTimeout(() => input.value = '')
  // }

  // weekDate = [null, null]
  // weekDate = [new Date(2019, 4, 9), new Date(2019, 4, 15)]

  // cityIds = [349, 170, 353]

  // topCityIds = [349, 430, 170, 412, 413, 414, 415, 416, 417, 418, 419, 420, 421, 422, 423, 424, 425, 426, 427, 428]

  // visible = false

  // chartData: any = {
  //   tooltip: {
  //     trigger: 'item',
  //     formatter: '{a} <br/>{b} : {c} ({d}%)'
  //   },
  //   series: [
  //     {
  //       name: '近7日评论分析',
  //       type: 'pie',
  //       radius: [33, 49],
  //       label: {
  //         formatter: '{b}\n{d}%',
  //         lineHeight: 156
  //       },
  //       labelLine: {
  //         show: false
  //       },
  //       data: [
  //         { name: '正面', value: 80, itemStyle: { color: '#ca7273' } },
  //         { name: '中立', value: 30, itemStyle: { color: '#f3d872' } },
  //         { name: '负面', value: 20, itemStyle: { color: '#57b4c9' } }
  //       ]
  //     }
  //   ]
  // }

  // tablePage = 1

  // tableColumns = [
  //   { title: 'ID', key: 'id' },
  //   { title: '名称', slot: 'name' },
  //   { title: '年龄', key: 'age' },
  // ]

  // selectedIds = [12, 26, 23]

  // get tableData() {
  //   const page = this.tablePage
  //   return Array(10).fill(1).map((n, i) => ({
  //     id: page * 10 + i,
  //     name: `名字${page * 10 + i}`,
  //     age: page * 10 + i
  //   }))
  // }

  // onCitySelectOk({ fastList }: any) {
  //   debugger
  // }

  // async mounted() {
  //   // const xx = list.filter(it => it.subList != null)
  //   // console.log(xx)
  //   // const one = xx.filter(it => it.subList.length == 1)
  //   // console.log(one)
  // }
}
</script>

<style lang="less" scoped>
.page {
  padding: 15px;
  min-height: 1200px;
  background-color: #fff;
}

.progress {
  width: 288px;
}

.upload-button {
  position: relative;
  overflow: hidden;
  input {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
}

.shi {
  max-width: 168px;
}
</style>
