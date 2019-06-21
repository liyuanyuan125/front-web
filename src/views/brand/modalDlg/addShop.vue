<template>
  <div>
      <Modal v-model="value.visibleShop" :title="value.title" width="700" class="modal-dlg">
        <Form ref="form" :model="form" :rules="rule" :label-width="90" class="edit-input">
            <FormItem label="门店名称" prop="name" >
                <Input v-model="form.name" placeholder="为门店命名，方便快速查找" />
            </FormItem>
            <FormItem label="所在地" prop="areas">
                <div class="input-area">
                  <areaSelect v-model="form.areas" ref="areas" placeholder="省市区" style="width: 260px" />
                </div>
            </FormItem>
            <FormItem label="详细地址" prop="address">
              <div>
                  <Input v-model="form.address" placeholder="详细地址" />
                </div>
            </FormItem>
            <FormItem label="联系电话" prop="phone" >
                <Input v-model="form.phone" :maxlength="11" placeholder="请输入联系电话" />
            </FormItem>
        </Form>
        <div slot="footer">
          <Button class="btn-cancel" @click="value.visibleShop = false">取消</Button>
          <Button type="primary" @click="addShop">确定</Button>
        </div>
     </Modal>
  </div>
</template>

<script lang='ts'>
import {Component, Prop} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { shopList, createList, editList, delShopList } from '@/api/brandList'
import areaSelect from '@/components/areaSelect/AreaSelect.vue'

@Component({
  components: {
    areaSelect
  }
})
export default class Main extends ViewBase {
  @Prop({type: Object}) value!: any

  form: any = {
    areas: []
  }

  get rule() {
    return {
      name: [{ required: true, type: 'string', message: '门店名不能为空', trigger: 'blur' }],
      areas: [{ required: true, type: 'array', message: '所在地不能为空', trigger: 'change' }],
      address: [{ required: true, type: 'string', message: '详细地址不能为空', trigger: 'blur' }],
      phone: [{ required: true, type: 'string', message: '联系电话不能为空', trigger: 'blur' }],
    }
  }

  mounted() {
    if (this.value.flag == 2) {
      const item = this.value.items
      this.form = {
        name: item.name,
        areas: item.areas,
        address: item.address,
        phone: item.phone,
        id: item.id
      }
    }
  }
  async addShop() {
    const volid = await (this.$refs.form as any).validate()
    if (!volid) { return }
    const provinceId = this.form.areas[0]
    const cityId = this.form.areas[1]
    const countyId = this.form.areas[2]
    const dataList = (this.$refs.areas as any).data
    let provinceName = null
    let cityName = null
    let countyName = null

    dataList.map( (item: any) => {
      if (item.value == provinceId) {
        provinceName = item.label
        item.children.map((it: any) => {
          if (it.value == cityId) {
            cityName = item.label
            it.children.map((ite: any) => {
              if (ite.value == countyId) {
                countyName = ite.label
              }
            })
          }
        })
      }
    })

    try {
      if (this.value.flag == 1) { // create
        const { data } = await createList({
          ...this.form,
          brandId: this.value.brandId,
          provinceId,
          provinceName,
          cityId,
          cityName,
          countyId,
          countyName
        })
      } else {
        const { data } = await editList({ // edit
          ...this.form,
          brandId: this.value.brandId,
          provinceId,
          provinceName,
          cityId,
          cityName,
          countyId,
          countyName
        })
      }
      this.$emit('updata')
      this.value.visibleShop = false
    } catch (ex) {
      this.value.visibleShop = false
      this.handleError(ex)
    }
  }

}

</script>
<style lang='less' scoped>
@import '~@/views/brand/less/common.less';
/deep/ .input-area {
  margin-bottom: 20px;
  .ivu-select-selection {
    width: auto;
    margin-right: 15px;
  }
  .ivu-input-wrapper {
    width: auto;
  }
  .ivu-cascader-rel {
    width: auto;
  }
}
</style>