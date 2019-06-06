<template>
  <div class="pagehome">
    <div class="create-title-text">
      <p>平台映前广告计费标准最小时长单位为15s，为节省您的广告投放成本，请准确设置广告片时长规格；时长规格不得低于广告片实际时长 广告片通过审核后，
      平台会统一为您进行转码为影院可播放的格式；转码费用标准为【3,000.00元/15s】</p>
    </div>
     <Form :model="form" ref="dataform" :rules="rule" :label-width="100" class="form edit-input">
       <div class="item-center">
        <FormItem  label="名称" prop="name">
          <Input v-model="form.name" placeholder="请输入广告片名称" :maxlength="30"></Input>
        </FormItem>

        <FormItem  label="客户" >
          <customerList v-model="form.customerId" ref="refCust" />
        </FormItem>

        <FormItem  label="品牌" >
          <brandList v-model="form.brandId"  ref="refBrand" />
        </FormItem>

        <FormItem  label="产品" >
          <Select v-model="form.productId" clearable filterable>
            <Option v-for="(item, index) in productsListSel" :value="item.id" :key="index">{{ item.name }}</Option>
          </Select>
          <!-- <productList v-if="form.brandId" :brandld="form.brandld" v-model="form.productld" ref="refProduct" /> -->
        </FormItem>

        <FormItem label="广告片规格" prop="specification">
          <Select v-model="form.specification" @on-change="handleChangeSpe"  clearable filterable>
            <Option v-for="(item, index) in specificationList" :value="item.id" :key="index">{{ item.name }}</Option>
          </Select>
          <em class="remark">备注：不得低于广告片实际时长，否则将无法通过审核</em>
        </FormItem>

        <FormItem label="广告片下载地址" prop="srcFileUrl">
          <Input type="textarea" v-model="form.srcFileUrl" :row="6" placeholder="" />
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
import { popPartners, detailPop, createPop, editPop, transFee, productsList} from '@/api/popFilm'

import customerList from '@/components/selectList/customerList.vue'
import brandList from '@/components/selectList/brandList.vue'
import productList from '@/components/selectList/productList.vue'

@Component({
  components: {
    // UploadLabel,
    // VuePlyr,
    customerList,
    brandList,
    productList
  }
})
export default class Main extends ViewBase {
  form: any = {
    brandId: null,
    productId: null
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
        { required: true, message: '请输入下载地址', trigger: 'change'}
      ]
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
    this.productList(val)
  }
}
</script>

<style lang="less" scoped>
// @import '~@/site/lib.less';
// @import '~@/site/common.less';
@import '~@/views/kol/less/common.less';
@import './com.less';

.edit-form {
  padding: 20px 0 30px 30px;
}
.remark {
  color: #00202d;
  margin-left: 20px;
  font-size: 13px;
}
.item-center {
  position: relative;
  margin-left: 50%;
  transform: translateX(-50%);
  padding: 60px 0 66px;
}
</style>
