<template>
  <div>
    <h2 class="model-table-title list-title">
      <span class="count">全部门店（{{total}}）家</span>
      <Button type="primary"  class="btn-edit" @click="handleAddShop">添加门店</Button>
    </h2>
    <ul class="ul-lists">
      <li class="li-items" v-for="item in list" :key="item.id">
        <div class="first-item">
          <p>{{item.name}}</p>
          <p class="item-address">{{item.address}}</p>
        </div>
        <!-- <div class="second-item">国籍</div> -->
        <div class="third-item">{{item.provinceName}}</div>
        <div class="fourth-item">{{item.phone}}</div>
        <div class="fifth-item">
          <img src="../assets/add-icon.png" alt="alias" @click="editShow(item)" class="img" width="20" />
          <img src="~@/views/pop/assets/del-icon.png" alt="alias" @click="delShowList(item.id)" class="img" width="20" />
        </div>
      </li>
    </ul>
     <ul class="no-data-list" v-if="list.length == 0">暂无数据</ul>
     <pagination :pageList="pageList" :total="total" @uplist="uplist"></pagination>
     <!-- 添加门店 -->
      <Modal v-model="visible.visibleShop" v-if="visible.visibleShop" :title="visible.title" width="700" class="modal-dlg">
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
          <Button class="btn-cancel" @click="handleCancel">取消</Button>
          <Button type="primary" @click="addShop">确定</Button>
        </div>
     </Modal>
  </div>
</template>

<script lang='ts'>
import {Component, Prop} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import pagination from '@/components/page.vue'
import areaSelect from '@/components/areaSelect/AreaSelect.vue'
import {confirm} from '@/ui/modal'
import { shopList, createList, editList, delShopList } from '@/api/brandList'

@Component({
  components: {
    pagination,
    areaSelect
  }
})
export default class Main extends ViewBase {
  @Prop({ type: Number, default: 0}) brandId!: number

  total = 0
  pageList = {
    pageIndex: 1,
    pageSize: 20
  }
  list = []

  // 添加门店
  visible: any = {
    visibleShop: false,
    title: '',
    flag: 1 // 1-创建 2-编辑
  }
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
    this.tableList()
  }

  async tableList() {
    try {
      const { data: {items, totalCount} } = await shopList({
        ...this.pageList,
        brandId: this.brandId
      })
      this.total = totalCount
      this.list = items
    } catch (ex) {
      this.handleError(ex)
    }
  }
  // 添加门店
  handleAddShop() {
    this.visible = {
      visibleShop: true,
      title: '添加门店',
      flag: 1
    }
  }

  // 编辑门店
  async editShow(item: any) {
    this.visible = {
      visibleShop: true,
      title: '编辑门店',
      flag: 2
    }

    this.form = {
      name: item.name,
      areas: [item.provinceId, item.cityId, item.countyId],
      address: item.address,
      phone: item.phone,
      id: item.id
    }
  }

  // 删除门店
  async delShowList(id: number) {
    await confirm('你确定要删除当前门店吗', {title: '删除门店'})
    try {
      const { data } = await delShopList(id)
      this.tableList()
    } catch (ex) {
      this.handleError(ex)
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
      if (this.visible.flag == 1) { // create
        const { data } = await createList({
          ...this.form,
          brandId: this.brandId,
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
          brandId: this.brandId,
          provinceId,
          provinceName,
          cityId,
          cityName,
          countyId,
          countyName
        })
      }
      this.tableList()
      this.form = {}
      this.visible.visibleShop = false
    } catch (ex) {
      this.visible.visibleShop = false
      this.handleError(ex)
    }
  }

  handleCancel() {
    this.visible.visibleShop = false
    this.form = {}
  }

  uplist(size: any) {
    this.pageList.pageIndex = size
    this.tableList()
  }
}

</script>
<style lang='less' scoped>
@import '~@/views/brand/less/common.less';

.ul-lists {
  padding: 0 40px;
  .li-items {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #fff;
    border-bottom: solid 1px rgba(188, 226, 240, .56);
    padding: 23px 0;
    .img {
      cursor: pointer;
      margin-right: 20px;
    }
    .first-item {
      width: 45%;
    }
    .third-item {
      width: 20%;
    }
    .fourth-item {
      width: 25%;
    }
    .fifth-item {
      width: 10%;
    }
    .item-address {
      font-size: 12px;
      color: #b3bcc0;
      padding-top: 4px;
    }
  }
}
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