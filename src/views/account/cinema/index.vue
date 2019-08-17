<template>
  <div class="page">
    <h3 class="plan-title">
      <span class="adver-tiele">影院管理</span>
    </h3>
    <div class="search-input">
      <Input v-model="dataForm.searchKey" style="width: 400px"  placeholder="请输入专资编码或影院名称" />
      <Button  type="primary" class="bth-search" @click="seachList">
        <Icon type="ios-search" size="22"/>
      </Button>
    </div>
    <div class="list-box">
      <div class="list-table">
        <Table stripe :columns="columns4" :data="cinemaData">
          <template slot="contactTel" slot-scope="{row, index}">
            <div v-if="editIndex === index"  class="input-tel">
              <Input  v-model="editTel" style="width: 160px" :maxlength="11" @on-blur="handleBlur(row.id, row.contactTel)"/>
            </div>

            <Tooltip v-else content="点击可编辑" placement="right" class="contact-tel" >
              <span @click="handleEditTel(row, index)" >{{row.contactTel ? row.contactTel : '点击设置'}}</span>
            </Tooltip>

          </template>
          <template slot-scope="{row}" slot="action">
            <a v-auth="'account-manage.managecinema#view'" @click="toDetail(row.id)" class="operation" >详情</a>
          </template>
        </Table>
        <Page :total="total" v-if="total>0" class="btn-center-footer"
          :current="dataForm.pageIndex"
          :page-size="dataForm.pageSize"
          :page-size-opts="[10, 20, 50, 100]"
          show-total
          show-sizer
          show-elevator
          @on-change="sizeChangeHandle"
          @on-page-size-change="currentChangeHandle"/>
      </div>
    </div>
    
  </div>
</template>

<script lang="tsx">
import { Component, Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { cinmeaList, editCompanyTel } from '@/api/cinema'
import { clean } from '@/fn/object'
import jsxReactToVue from '@/util/jsxReactToVue'
import { validataTel } from '@/util/validateRules'
import { info } from '@/ui/modal'

@Component
export default class Main extends ViewBase {
  dataForm = {
    searchKey: '',
    pageIndex: 1,
    pageSize: 20,
  }

  query = ''
  total = 0
  cinemaData: any = []
  loading = false
  tableLoading = false

  options: any = []
  columns4 = [
    { title: '省份', key: 'provinceName', align: 'center' },
    {
      title: '城市',
      key: 'cityName',
      align: 'center'
    },
    {
      title: '专资编码',
      key: 'code',
      align: 'center'
    },
    {
      title: '影院名称',
      key: 'name',
      minWidth: 110,
      align: 'center'
    },
    {
      title: '影厅数',
      key: 'hallCount',
      align: 'center'
    },
    {
      title: '总座位数',
      key: 'seatCount',
      align: 'center'
    },
    {
      title: '上下刊短信通知手机号',
      slot: 'contactTel',
      minWidth: 130,
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      slot: 'action'
    }
  ]

  // 编辑通讯手机号
  // isEditTel = false
  editIndex = -1
  editTel = ''

  mounted() {
    this.seach()
  }

  async seach() {
    this.tableLoading = true
    try {
      const {
        data: {
          items,
          totalCount
        }
      } = await cinmeaList({...this.dataForm})
      this.cinemaData = items || []
      this.total = totalCount || 0
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.tableLoading = false
    }
  }
  seachList() {
    this.dataForm.pageIndex = 1
    this.seach()
  }
  toDetail(id: any) {
    this.$router.push({ name: 'account-cinema-detail', params: {id} })
  }
   // 每页数
  sizeChangeHandle(val: any) {
    this.dataForm.pageIndex = val
    this.seach()
  }

  // 当前页
  currentChangeHandle(val: any) {
    this.dataForm.pageSize = val
    this.seach()
  }

  handleEditTel(row: any, index: number) {
    this.editIndex = index
    this.editTel = row.contactTel
  }

  async handleBlur(id: number, tel: string) {
    const msg = validataTel(this.editTel)
    if (!this.editTel) {
      await info('手机号不能为空')
      return
    }
    if (msg) {
      await info(msg)
      return
    }
    // 未做修改
    if (tel == this.editTel) {
      return
    }
    try {
      const { data } = await editCompanyTel({
        cinemaId: id,
        contactTel: this.editTel
      })
      this.editIndex = -1
      this.seach()
    } catch (ex) {
      this.handleError(ex)
    }
  }
}
</script>

<style lang="less" scoped>
// @import '~@/site/common.less';
@import '../less/table.less';
.page {
  padding: 30px 0 0 20px;
}
.search-input {
  margin-left: 30px;
  display: flex;
  justify-content: center;
  padding: 10px 0;
  /deep/ .ivu-input {
    line-height: 40px;
    font-size: 14px;
    height: 40px;
    background: rgba(255, 255, 255, 0.4);
    border-radius: 5px 0 0 5px;
    &::placeholder {
      font-size: 14px;
      color: #00202d;
    }
  }
}
.plan-title {
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #fff;
  .adver-tiele {
    color: #fff;
    font-size: 24px;
    font-weight: normal;
  }
}
.contact-tel {
  cursor: pointer;
  padding: 10px 15px;
}
.input-tel {
  /deep/ .ivu-input-wrapper {
    .ivu-input {
      background: rgba(255, 255, 255, 0.4);
      width: 100%;
      color: #fff;
    }
  }
}
</style>
