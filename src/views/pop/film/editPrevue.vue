<template>
  <div class="pagehome">
    <div class="create-title-text">
      <p>平台映前广告计费标准最小时长单位为15s，为节省您的广告投放成本，请准确设置广告片时长规格；时长规格不得低于广告片实际时长 广告片通过审核后，
      平台会统一为您进行转码为影院可播放的格式；转码费用标准为【3,000.00元/15s】</p>
    </div>
     <Form :model="form" ref="dataform" :rules="rule" :label-width="130" class="jyd-form film-edit">
       <div class="item-center">
        <FormItem  label="名称" prop="name">
          <Input v-model="form.name" placeholder="请输入广告片名称"  :maxlength="30" ></Input>
        </FormItem>

        <FormItem  label="客户" >
          <customerList v-model="form.customerId" ref="refCust" />
        </FormItem>

        <FormItem  label="品牌" >
          <brandList v-model="form.brandId"  ref="refBrand" />
        </FormItem>

        <FormItem  label="产品" >
          <Select v-model="form.productId" clearable filterable >
            <Option v-for="(item, index) in productsListSel" :value="item.id" :key="index">{{ item.name }}</Option>
          </Select>
        </FormItem>

        <FormItem label="广告片规格" prop="specification">
          <Select v-model="form.specification" @on-change="handleChangeSpe"   clearable filterable>
            <Option v-for="(item, index) in specificationList" :value="item.id" :key="index">{{ item.name }}</Option>
          </Select>
          <em class="remark">备注：不得低于广告片实际时长，否则将无法通过审核</em>
        </FormItem>

        <FormItem label='广告片下载地址' prop="srcFileUrl">
          <Input type="textarea" v-model="form.srcFileUrl" class="input-textarea-col" :rows="5"  placeholder="" />
        </FormItem>

        <FormItem label="是否已转制">
          <RadioGroup v-model="form.translated">
            <Radio label="1">否，未转制</Radio>
            <Radio label="2">是，已转制</Radio>
        </RadioGroup>
          <em class="remark">影院进行排播时，需要将视频文件转制为特定的DCP包，请确定是否需要平台进行格式转制</em>
        </FormItem>

        <FormItem label="广告片小样">
          <em class="remark">支持（.rmvb\.mp4\.mov）等视频格式；视频大小不超过100M；上传广告片小样可提升系统审核速度</em>
        </FormItem>

        <FormItem label="关联影片">
          <Select v-model="form.specification" @on-change="handleChangeSpe"   clearable filterable>
            <Option v-for="(item, index) in specificationList" :value="item.id" :key="index">{{ item.name }}</Option>
          </Select>
        </FormItem>



         <div class=" create-submit-btn">
           <Button v-if="!$route.params.id" type="primary" class="btn"  @click="createSubmit('dataform')" >保存</Button>
           <Button v-else type="primary" class="btn"  @click="editSubmit('dataform')">保存修改</Button>
           <Button class="cancel-btn" @click="$router.push({name: 'pop-film'})">取消</Button>
         </div>

        </div>
     </Form>
  </div>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { getUser } from '@/store'
import { confirm } from '@/ui/modal'
import Upload, { FileItem } from '@/components/upload'
import { popPartners, detailPop, createPop, editPop, transFee, productsList} from '@/api/popFilm'

import customerList from '@/components/selectList/customerList.vue'
import brandList from '@/components/selectList/brandList.vue'
import productList from '@/components/selectList/productList.vue'

@Component({
  components: {
    Upload,
    // VuePlyr,
    customerList,
    brandList,
    productList
  }
})
export default class Main extends ViewBase {
  form: any = {
    brandId: null,
    productId: null,
    isConversion: '1',
    validity: [], // 有效期
    companyImgList: [],
    authImageList: []
  }

  // 是否正在上传
  uploading = false

  // 广告片时长
  length = 0

  // 转码费
  transFee = ''

  errorPerm = ''
  customerList = []
  specificationList: any = []

  // 产品
  productsListSel = []

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
    }
  }

  mounted() {
    this.creSpecificationList()
    // 编辑详情
    if (this.$route.params.id) {
      this.detailList()
    }
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
      }
      // 获取transFee
      this.handleChangeSpe(this.form.specification)
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async createSubmit(dataform: any) {
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
    if (specification) {
      const { data } = await transFee({ specification })
      this.transFee = data
    }
  }

  async createSub() {
    // 客户名称
    const customerName = (this.$refs.refCust as any).queryCustName()
    // 品牌名称
    const brandName = (this.$refs.refBrand as any).queryBrandName()
    // 产品名称
    const productName = this.queryProductName()
    try {
      const { data } = await createPop({
        ...this.form,
        transFee: this.transFee,
        customerName,
        brandName,
        productName
      })
      this.$router.push({name: 'pop-film'})
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async editSubmit(dataform: any) {
    // this.errorPerm =  this.srcFileId == '' ? '请选择上传视频' : ''
    const volid = await (this.$refs[dataform] as any).validate()
    if (!volid) {
      return
    }
    // 客户名称
    const customerName = (this.$refs.refCust as any).queryCustName()
    // 品牌名称
    const brandName = (this.$refs.refBrand as any).queryBrandName()
    // 产品名称
    const productName = this.queryProductName()

    const id = this.$route.params.id
    try {
      const { data } = await editPop({
        ...this.form,
        transFee: this.transFee, // transFee
        customerName,
        brandName,
        productName
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
  queryProductName() {
      const ary: any = this.productsListSel.filter( (item: any) => item.id == this.form.productId) || []
      const brandname = ary.length > 0 ? ary[0].name : ''
      return brandname
  }
  @Watch('form.brandId')
  watchBrand(val: any) {
    if (val) {
      this.productList(val)
    } else {
      this.productsListSel = []
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
