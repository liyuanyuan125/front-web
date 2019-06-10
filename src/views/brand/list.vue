<template>
  <div class="model-home">
      <div class="list-title">
          <span class="count">已关联{{num}}个品牌</span>
          <Button type="primary" icon="md-add" @click="visibleBrand = true" class="btn-add">添加品牌</Button>
      </div>
      <div class="model-bg">
          <h2 class="flex-box model-table-title">
              <span class="col-first">品牌</span><span class="col-second">行业</span><span class="col-third">状态</span><span class="col-fourth">操作</span>
          </h2>
          <ul class="ul-list">
              <li v-for="item in list" :key="item.id">
                 <span class="col-first span-first"><img src="./assets/brand-logo.png" class="logo" /><em>{{item.title}}</em></span>
                 <span class="col-second">{{item.trade}}</span>
                 <span class="col-third">{{item.statusName}}</span>
                 <span v-if="item.status == 2" class="col-fourth">
                     <img src="./assets/add-icon.png" width="20" class="cursor" @click="$router.push({name: 'brand-moredetail'})" />
                 </span>
              </li>
          </ul>
          <pagination :pageList="pageList" :total="total" @uplist="uplist"></pagination>
      </div>
      <!-- 添加品牌 -->
      <Modal v-model="visibleBrand" title="添加品牌" width="700" class="modal-dlg"  @on-ok="addBrand">
        <Form ref="form" :model="form" :rules="rule" :label-width="90" class="edit-input">
            <FormItem label="品牌" >
                <Select v-model="form.brandId" filterable placeholder="请输入品牌模糊查询">
                    <Option value="1">1</Option>
                </Select>
            </FormItem>
            <FormItem label="上传图片">
                <Upload v-model="form.imageList" :max-count="8" multiple accept="images/*" confirm-on-del/>
                <div class="upload-tip">请上传您管理/代理此品牌的资质扫描件</div>
            </FormItem>
        </Form>
     </Modal>
  </div>
</template>

<script lang='ts'>
import {Component} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import pagination from '@/components/page.vue'
import Upload, { FileItem } from '@/components/upload'

@Component({
  components: {
      pagination,
      Upload
  }
})
export default class Main extends ViewBase {
    num = 3
    visibleBrand = false

    total = 34
    pageList = {
      pageIndex: 1,
      pageSize: 20
    }

    form = {}
    rule = {}

    list = [
        {
            title: '小米',
            trade: '汽车',
            status: 1,
            statusName: '待审核',
            id: 1,
        },
        {
            title: '小米',
            trade: '汽车',
            status: 2,
            statusName: '已关联',
            id: 2,
        },
        {
            title: '小米',
            trade: '汽车',
            status: 3,
            statusName: '审核不通过',
            id: 3
        },
    ]

    tableList() {}

    addBrand() {}

    uplist(size: any) {
      this.pageList.pageIndex = size
      this.tableList()
    }
}

</script>
<style lang='less' scoped>
@import '~@/views/brand/less/common.less';
.upload-box {
  background-color: none;
}
.list-title {
  display: flex;
  justify-content: space-between;
  color: #00202e;
  margin-bottom: 30px;
  .count {
    font-size: 24px;
    padding-left: 20px;
  }
}
.model-table-title {
  padding: 0 40px;
}
.col-first {
  width: 25%;
}
.col-second, .col-third {
  width: 30%;
  text-align: center;
}
.col-fourth {
  width: 15%;
  text-align: center;
}
.ul-list {
  color: #fff;
  padding: 0 40px;
  li {
    padding: 20px 0;
    display: flex;
    align-items: center;
    border-bottom: solid 1px rgba(188, 226, 240, .56);
    font-size: 14px;
    .span-first {
      display: flex;
      align-items: center;
    }
    .logo {
      width: 80px;
      height: 80px;
      border-radius: 5px;
      margin-right: 20px;
    }
  }
}
</style>