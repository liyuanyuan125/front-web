<template>
  <div>
    <h2 class="model-table-title list-title">
      <span class="count">全部门店（）家</span>
      <Button type="primary"  class="btn-edit" @click="visibleShop = true">添加门店</Button>
    </h2>
    <ul class="ul-list">
      <li class="li-items">
        <div class="first-item">
          <p>北京德奥达汽车进出口有限公司</p>
          <p>详细地址</p>
        </div>
        <div class="second-item">国籍</div>
        <div class="third-item">北京</div>
        <div class="fourth-item">电话000000000</div>
        <div class="fifth-item">
          <img src="~@/views/pop/assets/edit-icon.png" alt="alias" class="img" width="20" />
          <img src="~@/views/pop/assets/del-icon.png" alt="alias" class="img" width="20" />
        </div>
      </li>
    </ul>
     <pagination :pageList="pageList" :total="total" @uplist="uplist"></pagination>
     <!-- 添加门店 -->
      <Modal v-model="visibleShop" title="添加门店" width="700" class="modal-dlg"  @on-ok="addShop">
        <Form ref="form" :model="form" :rules="rule" :label-width="90" class="edit-input">
            <FormItem label="门店名称" >
                <Input v-model="form.name" placeholder="为门店命名，方便快速查找" />
            </FormItem>
            <FormItem label="所在地">
                <div class="input-area">
                  <Select v-model="form.nationality" placeholder="国籍" style="width: 150px">
                    <Option value="1">1</Option>
                  </Select>
                  <areaSelect v-model="form.areas" placeholder="省市区" style="width: 260px" />
                </div>
                <div>
                  <Input v-model="form.detailAdress" placeholder="详细地址" />
                </div>
            </FormItem>
            <FormItem label="联系电话" >
                <Input v-model="form.tel" placeholder="请输入联系电话" />
            </FormItem>
        </Form>
     </Modal>
  </div>
</template>

<script lang='ts'>
import {Component} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import pagination from '@/components/page.vue'
import areaSelect from '@/components/areaSelect/AreaSelect.vue'

@Component({
  components: {
    pagination,
    areaSelect
  }
})
export default class Main extends ViewBase {
  total = 34
  pageList = {
    pageIndex: 1,
    pageSize: 20
  }

  // 添加门店
  visibleShop = false
  form = {
    areas: []
  }
  get rule() {
    return {}
  }

  tableList() {}
  addShop() {}
  uplist(size: any) {
    this.pageList.pageIndex = size
    this.tableList()
  }
}

</script>
<style lang='less' scoped>
@import '~@/views/brand/less/common.less';

.ul-list {
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
    .second-item {
      width: 10%;
    }
    .third-item {
      width: 10%;
    }
    .fourth-item {
      width: 25%;
    }
    .fifth-item {
      width: 10%;
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