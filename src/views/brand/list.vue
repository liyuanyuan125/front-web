<template>
  <div class="model-home">
    <div class="list-title">
      <span class="count">已关联{{total}}个品牌</span>
      <Button type="primary" icon="md-add" @click="visibleBrand = true" class="btn-add">添加品牌</Button>
    </div>
    <div class="model-bg">
      <h2 class="flex-box model-table-title">
        <span class="col-first">品牌</span>
        <span class="col-second">行业</span>
        <span class="col-third">状态</span>
        <span class="col-fourth">操作</span>
      </h2>
      <ul class="ul-lists">
        <li v-for="item in list" :key="item.id">
          <router-link
            :to="{ name: 'brand-home', params: { id: item.id } }"
            class="col-first span-first"
          >
            <img :src="item.logo" class="logo">
            <em>{{item.brandName}}</em>
          </router-link>

          <span
            class="col-second"
            v-for="ite in tradeStatus"
            :key="ite.key"
            v-if="ite.key == item.tradeCode"
          >{{ite.text}}</span>

          <span
            class="col-third"
            v-for="it in brandStatus"
            :key="it.key"
            v-if="it.key == item.status"
          >{{it.text}}</span>

          <span v-if="item.status == 15" class="col-fourth">
            <img
              src="./assets/add-icon.png"
              width="20"
              class="cursor"
              @click="$router.push({name: 'brand-moredetail', params: {id: item.id, brandId: item.brandId}})"
            >
          </span>
        </li>
      </ul>
      <ul class="no-data-list" v-if="list.length == 0">暂无数据</ul>
      <pagination :pageList="pageList" :total="total" @uplist="uplist"></pagination>
    </div>
    <!-- 添加品牌 -->
    <Modal v-model="visibleBrand" title="添加品牌" width="700" class="modal-dlg">
      <Form ref="form" :model="form" :rules="rule" :label-width="90" class="edit-input">
        <FormItem label="品牌" prop="brandId">
          <Select
            v-model="form.brandId"
            clearable
            filterable
            remote
            :loading="loading"
            class="select-dlg"
            :remote-method="remoteMethod"
            @on-clear="brandList = []"
            style="width: 400px"
            placeholder="请输入品牌模糊查询"
          >
            <Option v-for="item in brandList" :value="item.id">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="上传图片" prop="fileIds">
          <Upload v-model="form.fileIds" :max-count="8" multiple accept="images/*" confirm-on-del/>
          <div class="upload-tip">请上传您管理/代理此品牌的资质扫描件</div>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button class="btn-cancel" @click="handleCancel">取消</Button>
        <Button type="primary" @click="addBrand('form')">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script lang='ts'>
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import pagination from '@/components/page.vue'
import Upload, { FileItem } from '@/components/upload'
import { brandList, createBrand, selectBrand } from '@/api/brandList'

@Component({
  components: {
    pagination,
    Upload
  }
})
export default class Main extends ViewBase {
  visibleBrand = false

  total = 0
  pageList = {
    pageIndex: 1,
    pageSize: 20
  }

  form: any = {}

  // 品牌状态
  brandStatus = []
  // 品牌行业
  tradeStatus = []
  list = []

  loading = false
  brandList = []

  get rule() {
    return {
      brandId: [
        {
          require: true,
          trigger: 'blur',
          validator(rule: any, value: string[], callback: any) {
            !value ? callback(new Error('请选择品牌')) : callback()
          }
        }
      ],
      fileIds: [
        {
          require: true,
          trigger: 'change',
          validator(rule: any, value: string[], callback: any) {
            value.length == 0 ? callback(new Error('请选择上传图片')) : callback()
          }
        }
      ]
    }
  }

  mounted() {
    this.tableList()
  }

  async tableList() {
    try {
      const {
        data: { items, totalCount, brandRelationStatus, tradeCodeStatus }
      } = await brandList({
        ...this.pageList
      })
      this.list = items || []
      this.total = totalCount
      this.brandStatus = brandRelationStatus || []
      this.tradeStatus = tradeCodeStatus || []
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async remoteMethod(query: any) {
    try {
      if (query) {
        this.loading = true
        const {
          data: { items }
        } = await selectBrand({
          name: query,
          pageIndex: 1,
          pageSize: 400
        })
        this.brandList = items || []
      }
      this.loading = false
    } catch (ex) {
      this.handleError(ex)
      this.loading = false
    }
  }

  async addBrand(dataform: any) {
    const volid = await (this.$refs[dataform] as any).validate()
    if (!volid) {
      return
    }
    const list: any = this.brandList[0]
    // 处理filelds fileld集合
    const fileIds = this.form.fileIds.map((item: any) => item.fileId)
    try {
      const { data } = await createBrand({
        ...this.form,
        fileIds,
        brandName: list.name,
        brandEnName: list.enName
      })
      this.visibleBrand = false
      this.tableList()
    } catch (ex) {
      this.handleError(ex)
    }
  }

  handleCancel() {
    this.visibleBrand = false
    ; (this.$refs.form as any).resetFields()
  }

  uplist(size: any) {
    this.pageList.pageIndex = size
    this.tableList()
  }
}
</script>
<style lang='less' scoped>
@import '~@/views/brand/less/common.less';
.select-dlg {
  /deep/ .ivu-select {
    width: 400px;
  }
}
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
.col-second,
.col-third {
  width: 30%;
  text-align: center;
}
.col-fourth {
  width: 15%;
  text-align: center;
}
.ul-lists {
  color: #fff;
  padding: 0 40px;
  li {
    padding: 20px 0;
    display: flex;
    align-items: center;
    border-bottom: solid 1px rgba(188, 226, 240, 0.56);
    font-size: 14px;
    .span-first {
      display: flex;
      align-items: center;
      color: #fff;
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
