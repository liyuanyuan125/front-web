<template>
  <div class="pagehome">
     <textDlg />
     <Form :model="form" ref="dataform" :rules="rule" :label-width="130" class="jyd-form film-edit">
       <div class="item-center">
        <FormItem  label="名称" prop="name">
          <Input v-model="form.name" placeholder="请输入广告片名称"  :maxlength="30" ></Input>
        </FormItem>

        <FormItem  label="客户" v-if="secondaryCode == 'daili'" >
          <customerList v-model="form.customerId" />
        </FormItem>

        <FormItem  label="品牌" >
          <brandList v-model="form.brandId" />
        </FormItem>

        <FormItem  label="产品" >
          <Select v-model="form.productId" clearable filterable >
            <Option v-for="(item, index) in productsListSel" :value="item.id" :key="index">{{ item.name }}</Option>
          </Select>
        </FormItem>

        <FormItem label="广告片规格" prop="specification">
          <Select v-model="form.specification"  clearable filterable>
            <Option v-for="(item, index) in specificationList" :value="item.id" :key="index">{{ item.name }}</Option>
          </Select>
          <em class="remark">备注：不得低于广告片实际时长，否则将无法通过审核</em>
        </FormItem>

        <FormItem label='广告片下载地址' prop="srcFileUrl">
          <Input type="textarea" v-model="form.srcFileUrl" class="input-textarea-col" :rows="5"  placeholder="" />
        </FormItem>

        <FormItem label="是否已转制">
          <RadioGroup v-model="form.translated">
            <Radio :label="1">是，已转制</Radio>
            <Radio :label="2">否，未转制</Radio>
        </RadioGroup>
          <em class="remark">影院进行排播时，需要将视频文件转制为特定的DCP包，请确定是否需要平台进行格式转制</em>
        </FormItem>

        <FormItem label="广告片小样">
          <OssUploader v-model="form.srcFileId" :param="{fileType: 3, subCategory: 1}"></OssUploader>
          <em class="remark">支持（.rmvb\.mp4\.mov）等视频格式；视频大小不超过100M；上传广告片小样可提升系统审核速度</em>
        </FormItem>

        <div v-if="secondaryCode == 'daili'">
          <FormItem label="营业执照编号" prop="licenseCode" >
            <Input v-model="form.licenseCode" placeholder="请输入执照编号"/>
          </FormItem>
          <FormItem label="营业执照有效期" prop="validity">
            <DatePicker v-model="form.validity" format="yyyy-MM-dd" type="daterange" placement="bottom-end" placeholder="请选择有效期"></DatePicker>
          </FormItem>

          <FormItem label="营业执照扫描件" prop="licenseFileId">
            <Upload v-model="form.licenseFileId" :max-count="1"  accept="images/*" confirm-on-del/>
              <div class="upload-tip">支持（.jpg/.jpeg/.png）等图片格式；图片大小不超过2M</div>
          </FormItem>

          <FormItem label="授权文件扫描件" prop="grantFileIds">
            <Upload  v-model="form.grantFileIds" :max-count="6" multiple accept="images/*"  confirm-on-del/>
              <div class="upload-tip">支持（.jpg/.jpeg/.png）等图片格式；图片大小不超过2M</div>
          </FormItem>
        </div>

         <div class=" create-submit-btn">
           <Button v-if="!$route.params.id" type="primary" class="btn"  @click="createSubmit('dataform')" >保存</Button>
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
import { confirm } from '@/ui/modal'
import Upload, { FileItem } from '@/components/upload'
import { popPartners, detailPop, createPop, editPop, transFee, productsList} from '@/api/popFilm'
import {intDate, formatValidDate, formatIntDateRange } from '@/util/dealData'
import { getUser } from '@/store'
import { scrollToError } from '@/util/form'
import { get } from 'lodash'

import customerList from '@/components/selectList/customerList.vue'
import brandList from '@/components/selectList/brandList.vue'
import productList from '@/components/selectList/productList.vue'
import OssUploader from '@/components/videoUploader'
import textDlg from './components/textDlg.vue'

@Component({
  components: {
    Upload,
    OssUploader,
    customerList,
    brandList,
    productList,
    textDlg
  }
})

export default class Main extends ViewBase {

  @Prop({ type: String}) id!: any

  form: any = {
    srcFileId: null,
    brandId: null,
    productId: null,
    validity: [], // 有效期
    grantFileIds: [],
    licenseBeginDate: '', // 营业执照开始和结束
    licenseEndDate: '',
    translated: 1
  }

  // 是否正在上传
  uploading = false
  fileId = null

  // 转码费
  transFee = ''

  errorPerm = ''
  customerList = []
  specificationList: any = []

  // 产品
  productsListSel = []

  get secondaryCode() {
    return getUser()!.secondaryCode
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
      ],
      srcFileUrl: [
        { required: true, message: '请输入下载地址', trigger: 'blur'}
      ],
      licenseCode: [
        { required: true, message: '请输入执照编号', trigger: 'blur'}
      ],
      validity: [
        {
          required: true,
          message: '有效期不能为空',
          trigger: 'change',
          type: 'array',
          validator(rule: any, value: any[], callback: any) {
            value[0] == '' ? callback(new Error(rule.message)) : callback()
          }
        }
      ],
      licenseFileId: [
        {
          required: true,
          message: '营业执照扫描件',
          trigger: 'change',
          type: 'array',
          validator(rule: any, value: any[], callback: any) {
            !value ? callback(new Error(rule.message)) : callback()
          }
        }
      ],
      grantFileIds: [
        {
          required: true,
          message: '授权文件扫描件',
          trigger: 'change',
          type: 'array',
          validator(rule: any, value: any[], callback: any) {
            value && value.length == 0 ? callback(new Error(rule.message)) : callback()
          }
        }
      ],
    }
  }

  async mounted() {
    this.creSpecificationList()
    // 编辑详情
    if (this.$route.params.id) {
      this.detailList()
    }
  }

  scrollToError() {
    const form = this.$refs.dataform as any
    this.$nextTick(() => scrollToError(form))
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
        brandId: item.brandId,
        productId: item.productId,
        srcFileUrl: item.srcFileUrl,
        specification: item.specification,
        translated: item.translated,
        licenseCode: item.licenseCode,
        srcFileId: item.videoSamples && item.videoSamples[0].url, // 视频小样
        validity: [formatValidDate(item.licenseBeginDate), formatValidDate(item.licenseEndDate)],
        licenseFileId: item.licenseFiles ? item.licenseFiles : [],
        grantFileIds: item.grantFiles ? item.grantFiles : [],
      }
      // 获取视频fileId
      this.fileId = item.videoSamples && item.videoSamples[0].fileId
      // 重新获取transFee
      this.handleChangeSpe()
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async handleChangeSpe() {
     const specification = this.form.specification
     const translated = this.form.translated
     const { data } = await transFee({ specification, translated })
     this.transFee = data.transFee
     return data
  }

  async createSubmit(dataform: any) {
    const volid = await (this.$refs[dataform] as any).validate()
    if (!volid) { return this.scrollToError()}
    // 二次确定弹框
    const data = await this.handleChangeSpe()
    const free = this.form.translated == 1 ? data.transFee : (data.promotionPrice || data.transFee)
    await confirm(`数字转制费用：${free} 元`, {title: '确认新建广告片'})
    // 判断调用添加还是编辑接口
    const id = this.$route.params.id
    !id ? this.createSub() : this.editSubmit()
  }


  async createSub() {
    // 视频
    const srcFileId = this.form.srcFileId ? this.form.srcFileId.url : null
    const size = this.form.srcFileId ? this.form.srcFileId.clientSize : null

    // 营业执照扫描文件
    const licenseFileId = this.form.licenseFileId ? this.form.licenseFileId[0].fileId : null
    // 授权扫描文件
    const grantFileIds = (this.form.grantFileIds || []).map((it: any) => it.fileId)

    // 删除多余字段
    delete this.form.validity
    try {
      const { data } = await createPop({
        ...this.form,
        transFee: this.transFee,
        srcFileId,
        size,
        licenseFileId,
        grantFileIds,
        videoType: 2, // 影片类型 1 = 预告片 2 = 商业片
      })
      this.$router.push({name: 'pop-film'})
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async editSubmit() {
    // const volid = await (this.$refs[dataform] as any).validate()
    // if (!volid) {
    //   return this.scrollToError()
    // }
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

    // 营业执照扫描文件
    const licenLen = this.form.licenseFileId.length
    const licenseFileId = licenLen >= 1 ? this.form.licenseFileId[0].fileId : null
    // 授权扫描文件
    const grantFileIds = (this.form.grantFileIds || []).map((it: any) => it.fileId)

    // 删除多余字段
    delete this.form.validity

    const id = this.$route.params.id
    try {
      const { data } = await editPop({
        ...this.form,
        transFee: this.transFee,
        srcFileId,
        size: size || null,
        licenseFileId,
        grantFileIds: grantFileIds.length >= 1 ? grantFileIds : null ,
        videoType: 2, // 影片类型 1 = 预告片 2 = 商业片
      }, id)
      this.$router.push({name: 'pop-film'})
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async productList(brandId: any) {
      try {
          const { data: {items}} = await productsList({
              brandId,
              pageIndex: 1,
              pageSize: 400
          })
          this.productsListSel = items
      } catch (ex) {
          this.handleError(ex)
      }
  }

  @Watch('form.brandId')
  watchBrand(val: any) {
    if (val) {
      this.productList(val)
    } else {
      this.productsListSel = []
    }
  }

  @Watch('form.validity')
  watchValidity(val: any) {
    this.form.licenseBeginDate = formatValidDate(val[0], {format: 'YYYYMMDD', blank: null})
    this.form.licenseEndDate = formatValidDate(val[1], {format: 'YYYYMMDD', blank: null})
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
