<template>
  <div class="page home-bg">
     <div class="layout-nav-title">
       <router-link :to="{name: 'pop-film'}" >广告片</router-link> >
        <span v-if="!$route.params.id"> 新建广告片</span>
        <span v-else> 编辑广告片</span>
     </div>

     <Form :model="form" ref="dataform" label-position="left" :rules="rule" :label-width="100" class="edit-input edit-form">
        <FormItem  label="广告片名称" prop="name">
          <Input v-model="form.name" placeholder="请输入广告片名称"></Input>
        </FormItem>

        <FormItem  label="选择客户" prop="customerId">
          <Select v-model="form.customerId"  clearable>
            <Option v-for="(item, index) in customerList" :value="item.id" :key="index">{{ item.name }}</Option>
          </Select>
        </FormItem>

        <FormItem label="广告片规格" prop="specification">
          <Select v-model="form.specification" @on-change="handleChangeSpe"  clearable filterable>
            <Option v-for="(item, index) in specificationList" :value="item.id" :key="index">{{ item.name }}</Option>
          </Select>
          <em class="remark">备注：广告片规格请输入15s的倍数</em>
        </FormItem>

        <FormItem label="上传广告片" :error="errorPerm">
          <section class="player-box" :class="{
              'player-box-has': !!videoUrl,
              'player-box-uploading': uploading,
            }">
            <div class="player-wrap flex-mid">
              <vue-plyr class="video-player" :options="playerOptions" ref="plyr" v-once>
                <video></video>
              </vue-plyr>
            </div>

            <div class="player-controls" v-if="videoUrl && !playing">
              <a class="player-play" @click="player.togglePlay()"></a>
              <a class="player-change" @click="uploader && uploader.pick()"></a>
            </div>

            <UploadLabel class="upload-label" ref="uploader" @start="uploadStart"
              @done="uploadDone" @end="uploadEnd" use-circle v-show="!videoUrl">
              <div class="upload-in">
                <p class="upload-tip">上传广告片</p>
                <p>小于2G的视频文件</p>
              </div>
            </UploadLabel>
          </section>
        </FormItem>

        <FormItem label="广告片时长" v-if="$route.params.id || length > 0">
          <span class="span-class">{{length}}s</span>
        </FormItem>
     </Form>
     <div class="btnCenter create-submit-btn">
       <Button v-if="!$route.params.id" type="primary" :disabled="btnSubmit" @click="createSubmit('dataform')" class="button-ok">提交审核</Button>
       <Button v-else type="primary" class="button-ok" @click="editSubmit('dataform')">保存修改</Button>
     </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { getUser } from '@/store'
import { confirm } from '@/ui/modal'
import { popPartners, detailPop, createPop, editPop, transFee} from '@/api/popFilm'
import UploadLabel, { StartEvent, SuccessEvent } from '@/components/uploadLabel'
import { format as durationFormat } from '@/fn/duration'
import getBlobDuration from 'get-blob-duration'
import { VuePlyr } from 'vue-plyr'
import 'vue-plyr/dist/vue-plyr.css'
import { devInfo, devError } from '@/util/dev'

@Component({
  components: {
    UploadLabel,
    VuePlyr
  }
})
export default class Main extends ViewBase {
  form: any = {
    name: '',
    customerId: '',
    specification: ''
  }

  // 播放器
  player: any = null

  // 标记是否正在播放
  playing = false

  // 源视频文件上传后的ID
  srcFileId = ''

  // 视频地址
  videoUrl = ''

  // 是否正在上传
  uploading = false

  // 广告片时长
  length = 0

  // 转码费
  transFee = ''

  // 视频上传but按钮置灰
  btnSubmit = false

  errorPerm = ''

  customerList = []
  specificationList: any = []

  playerOptions: any = {
    controls: ['play', 'progress', 'current-time', 'mute',
      'volume', 'captions', 'settings', 'fullscreen'],
  }

  get uploader() {
    const uploader = this.$refs.uploader as any
    return uploader
  }

  get rule() {
    return {
      name: [
        { required: true, message: '请输入广告片名称', trigger: 'change' }
      ],
      customerId: [
        { required: true, message: '请选择客户', trigger: 'change', type: 'number'  }
      ],
      specification: [
        { required: true, message: '请选择广告片规格', trigger: 'change', type: 'number'  }
      ]
    }
  }

  get duration() {
    return durationFormat(this.length)
  }

  async mounted() {
    this.initPlayer()

    this.partnersList()
    this.creSpecificationList()
    // 编辑
    if (this.$route.params.id) {
      this.detailList()
    }
  }

  initPlayer() {
    const plyr = this.$refs.plyr as any
    const player = this.player = plyr.player
    // player.playing 不是响应式的
    player.on('playing', () => this.playing = true)
    player.on('pause', () => this.playing = false)
    player.on('ended', () => this.playing = false)
  }

  async uploadStart({ blob }: StartEvent) {
    this.srcFileId = ''
    this.btnSubmit = true
    this.length = 0
    const duration = await getBlobDuration(blob)
    this.length = Math.floor(duration)
    this.errorPerm = ''

    this.uploading = true

    // 销毁 player，清空 videoUrl
    this.videoUrl = ''
  }

  uploadDone({ file, blob }: SuccessEvent) {
    this.srcFileId = file.fileId
    this.videoUrl = file.url
    this.btnSubmit = false
  }

  uploadEnd() {
    this.uploading = false
  }

  creSpecificationList() {
    for ( let i = 1 ; i < 41; i ++) {
      this.specificationList.push({id: i * 15, name: i * 15})
    }
  }

  async detailList() {
    const id = this.$route.params.id
    try {
      const { data: { item } } = await detailPop(id)
      this.form = {
        name: item.name,
        customerId: item.customerId,
        specification: item.specification,
      }
      this.length = item.length
      this.srcFileId = item.srcFileId
      this.videoUrl = item.srcFileUrl || ''
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async createSubmit(dataform: any) {
    this.errorPerm =  this.srcFileId == '' ? '请选择上传视频' : ''
    const volid = await (this.$refs[dataform] as any).validate()
    if (!volid) {
      return
    }
    // 二次确定弹框
    const specification = this.form.specification
    try {
      const { data } = await transFee({ specification })
      await confirm(`数字转制费用：${data} 元`, {title: '确认新建广告片'})
      this.createSub()
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async handleChangeSpe(specification: any) {
     const { data } = await transFee({ specification })
     this.transFee = data
  }

  async createSub() {
    const customerName: any = this.customerList.filter( (item: any) => item.id == this.form.customerId)
    try {
      const { data } = await createPop({
        ...this.form,
        srcFileId: this.srcFileId,
        length: this.length,
        transFee: this.transFee,
        customerName: customerName[0].name
      })

      this.$router.push({name: 'pop-film'})
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async editSubmit(dataform: any) {
    this.errorPerm =  this.srcFileId == '' ? '请选择上传视频' : ''
    const volid = await (this.$refs[dataform] as any).validate()
    if (!volid) {
      return
    }
    const id = this.$route.params.id
    try {
      const { data } = await editPop({
        ...this.form,
        srcFileId: this.srcFileId,
        length: this.length,
        transFee: this.transFee
      }, id)
      this.$router.push({name: 'pop-film'})
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async partnersList() {
    const id = getUser()!.id
    try {
      const { data: {items} } = await popPartners(id)
      this.customerList = items
    } catch (ex) {
      this.handleError(ex)
    }
  }

  @Watch('videoUrl', { immediate: true })
  watchVideoUrl(value: string) {
    this.player && this.player.stop()
    value && this.$nextTick(() => {
      this.player.source = {
        type: 'video',
        sources: [
          { src: value, type: 'video/mp4' }
        ]
      }
    })
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
@import '~@/site/common.less';

.duration-len {
  padding-top: 5px;
}
.create-submit-btn {
  margin-bottom: 30px;
}
.edit-form {
  padding: 20px 0 30px 30px;
}
.remark {
  color: #c5c8ce;
  margin-left: 20px;
  font-size: 13px;
}

.player-box {
  position: relative;
  margin-top: 15px;
  width: 300px;
  height: 225px;
}

.player-wrap {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
}

.player-box:not(.player-box-has) {
  .upload-label-empty:hover {
    border-color: @c-button;
    background-color: #fffbf8;
    &::before {
      content: '+';
      display: flex;
      height: 100%;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      color: @c-button;
    }
    .upload-in,
    /deep/ .upload-has {
      display: none;
    }
  }
}

.player-box:not(.player-box-has),
.player-box-uploading {
  .player-wrap {
    visibility: hidden;
  }
}

.upload-label {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  border: solid 1px #ccc;
  border-radius: 2px;
}

.upload-in {
  display: inline-block;
  width: 100%;
  height: 100%;
  text-align: center;
  color: #888;
  font-size: 12px;
}
.upload-tip {
  margin: 100px 0 50px;
}

.player-controls {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.player-play,
.player-change {
  display: inline-block;
  width: 56px;
  height: 56px;
  background: url(./assets/play.png) no-repeat center;
  margin: 0 37px;
}
.player-change {
  background-image: url(./assets/change.png);
}
</style>
