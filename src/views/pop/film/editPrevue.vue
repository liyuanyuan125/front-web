<template>
  <div class="pagehome">
     <textDlg />
     <Form :model="form" ref="dataform" :rules="rule" :label-width="130" class="jyd-form film-edit">
       <div class="item-center">
        <FormItem  label="名称" prop="name">
          <Input v-model="form.name" placeholder="请输入广告片名称"  :maxlength="30" ></Input>
        </FormItem>

        <FormItem label="广告片规格" prop="specification">
          <Select v-model="form.specification"  clearable filterable>
            <Option v-for="(item, index) in specificationList" :value="item.id" :key="index">{{ item.name }}</Option>
          </Select>
          <em class="remark">备注：不得低于广告片实际时长，否则将无法通过审核</em>
        </FormItem>

        <FormItem label='广告片下载地址' prop="srcFileUrl">
          <Input type="textarea" v-model="form.srcFileUrl" class="input-textarea-col" :rows="5"  placeholder="请输入广告片下载地址" />
        </FormItem>

        <FormItem label="是否已转制">
          <RadioGroup v-model="form.translated">
             <Radio :label="1">是，已转制</Radio>
             <Radio :label="2">否，未转制</Radio>
        </RadioGroup>
          <em class="remark">影院进行排播时，需要将视频文件转制为特定的DCP包，请确定是否需要平台进行格式转制</em>
        </FormItem>
        
        <FormItem label="广告片小样">
          <OssUploader v-model="form.srcFileId" :param="{fileType: 3, subCategory: 1}" accept="video/*"></OssUploader>
          <em class="remark">支持（.rmvb\.mp4\.mov）等视频格式；视频大小不超过100M；上传广告片小样可提升系统审核速度</em>
        </FormItem>

        <FormItem label="关联影片">
          <Select v-model="form.movieId"  clearable filterable>
            <Option v-for="item in movieList" :value="item.movieId" :key="item.movieId">{{ item.name }}</Option>
          </Select>
        </FormItem>

         <div class=" create-submit-btn">
           <Button v-if="!id" type="primary" class="btn"  @click="createSubmit('dataform')" >保存</Button>
           <Button v-else type="primary" class="btn"  @click="createSubmit('dataform')">保存修改</Button>
           <Button class="cancel-btn" @click="$router.push({name: 'pop-film'})">取消</Button>
         </div>

        </div>
     </Form>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { getUser } from '@/store'
import { confirm } from '@/ui/modal'
import Upload, { FileItem } from '@/components/upload'
import {detailPop, createPop, editPop, transFee, companyMovies } from '@/api/popFilm'

import OssUploader from '@/components/videoUploader'
import textDlg from './components/textDlg.vue'

@Component({
  components: {
    Upload,
    OssUploader,
    textDlg
  }
})

export default class Main extends ViewBase {
  @Prop({ type: Number}) id!: number

  form: any = {
    translated: 1,
    srcFileId: null
  }

  // 是否正在上传
  uploading = false
  fileId = null

  // 关联影片
  movieList = []

  // 转码费
  transFee = ''
  specificationList: any = []

  get rule() {
    return {
      name: [
        { required: true, message: '请输入广告片名称', trigger: 'change' }
      ],
      specification: [
        { required: true, message: '请选择广告片规格', trigger: 'change', type: 'number'  }
      ],
      srcFileUrl: [
        { required: true, message: '请输入下载地址', trigger: 'blur'}
      ],
    }
  }

  mounted() {
    this.creSpecificationList()
    this.companyMoviesList()
    // 编辑详情
    if (this.id) {
      this.detailList()
    }
  }

  creSpecificationList() {
    for ( let i = 1 ; i < 41; i ++) {
      this.specificationList.push({id: i * 15, name: i * 15})
    }
  }

  async detailList() {
    const id = this.id
    try {
      const { data: { item } } = await detailPop(id)
      this.form = {
        name: item.name,
        srcFileUrl: item.srcFileUrl,
        specification: item.specification,
        translated: item.translated,
        srcFileId: item.videoSamples && item.videoSamples[0].url, // 视频小样
        movieId: item.movieId
      }

      // 获取视频fileId
      this.fileId = item.videoSamples && item.videoSamples[0].fileId

      // 重新获取transFee 费用
      this.handleChangeSpe()
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async handleChangeSpe() {
     const specification = this.form.specification
     const translated = this.form.translated
     const id = this.id
     const { data } = await transFee({ specification, translated, id })
     this.transFee = data.transFee
     return data
  }

  async companyMoviesList() {
    const { data } = await companyMovies()
    this.movieList = data || []
  }


  async createSubmit(dataform: any) {
    const volid = await (this.$refs[dataform] as any).validate()
    if (!volid) { return}
    const data = await this.handleChangeSpe()
    const free = this.form.translated == 1 ? data.transFee : (data.promotionPrice || data.transFee)

    await confirm(`数字转制费用：${free} 元`, {title: '确认新建广告片'})
    // 判断调用添加还是编辑接口
    const id = this.id
    !id ? this.createSub() : this.editSubmit()
  }

  // 新建
  async createSub() {
    const srcFileId = this.form.srcFileId ? this.form.srcFileId.url : null
    const size = this.form.srcFileId ? this.form.srcFileId.clientSize : null
    try {
      const { data } = await createPop({
        ...this.form,
        srcFileId, // 视频小样
        size, // 视频大小
        transFee: this.transFee,
        videoType: 1, // 影片类型： 1 = 预告片 2 = 商业片
      })
      this.$router.push({name: 'pop-film'})
    } catch (ex) {
      this.handleError(ex)
    }
  }

  // 编辑
  async editSubmit() {
    // const volid = await (this.$refs[dataform] as any).validate()
    // if (!volid) {
    //   return
    // }

    const id = this.id

    // 视频(默认传后台fileId， 重新上传视频则传url和size)
    let srcFileId = null
    const size = this.form.srcFileId ? this.form.srcFileId.clientSize : null
    const url = this.form.srcFileId ? this.form.srcFileId.url : null

    if (!size && !url) {
      srcFileId = null
    } else if (!size && url) {
      srcFileId = this.fileId
    } else {
      srcFileId = this.form.srcFileId ? this.form.srcFileId.url : null
    }

    try {
      const { data } = await editPop({
        ...this.form,
        srcFileId, // 视频小样
        size: size || null, // 视频大小
        transFee: this.transFee,
        videoType: 1, // 影片类型： 1 = 预告片 2 = 商业片
      }, id)
      this.$router.push({name: 'pop-film'})
    } catch (ex) {
      this.handleError(ex)
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/views/kol/less/common.less';
@import './com.less';

.edit-form {
  padding: 20px 0 30px 30px;
}
.remark {
  color: #00202d;
  font-size: 12px;
  display: block;
}
.item-center {
  position: relative;
  margin-left: 50%;
  transform: translateX(-50%);
  padding: 60px 0 66px;
}
.jyd-form {
  /deep/ .ivu-form-item-content {
    .ivu-input-wrapper {
      width: 460px;
    }
    .ivu-select {
      width: 460px;
    }
  }
}
.film-edit {
  background: rgba(255, 255, 255, .3);
  border: solid 1px #fff;
  margin-top: 48px;
}
/deep/ .ivu-radio-wrapper {
  font-size: 14px;
  margin-right: 15px;
}
.upload-box {
  background: none;
}
</style>
