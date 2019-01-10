<template>
  <div class="page home-bg">
    <h3 class="userTitle">
      <span class="nav-top-title">财务信息</span>
    </h3>
    <div class='fince'>
      <h3 class="userTitle">
        <span style='color:#222222;' class="nav-top-title">账户总览</span>
      </h3>
      <div class='fince-list'>
          <div class='fince-list-big'>
            <div class='fince-list-acc'>53,200.00</div>
            <p class='fince-list-sm'>账户余额/元</p>
          </div>
          <div class='fince-list-big'>
            <div class='fince-list-acc'>53,200.00</div>
            <p class='fince-list-sm'>可用金额/元</p>
          </div>
          <div class='fince-list-big'>
            <div class='fince-list-accd'>53,200.00</div>
            <p class='fince-list-sm'>冻结金额/元</p>
          </div>
      </div>
    </div>
    <div class="table-box">
      <div class="table-left-title">最近充值记录</div>
      <div class="table-right-title">查看更多</div>
    </div>
    <Table ref="selection" stripe class="tables" :loading="tableLoading" :columns="columns4" :data="cinemaData"></Table>
    <Page :total="total" v-if="total>0" class="btnCenter"
      :current="dataForm.pageIndex"
      :page-size="dataForm.pageSize"
      :page-size-opts="[10, 20, 50, 100]"
      show-total
      show-sizer
      show-elevator
      @on-change="sizeChangeHandle"
      @on-page-size-change="currentChangeHandle"/>
    <div class='finceadd'>
      <h3 class="userTitle">
        <span style='color:#222222;' class="nav-top-title">账户充值</span>
      </h3>
      <div class='fince-list'>
        <Form  :model='dataForm' :label-width='88' :rules='rules' label-position="left" class='form page' ref='dataForm'>
            <Row class='add-row'>
              <Col span="12">
                <FormItem label="银行账号">
                  <Input class='inp-style' placeholder="请输入汇款银行账号"/>
                </FormItem>
              </Col>
              <Col span='12'>
                <FormItem label="充值金额">
                  <Input class='inp-style' placeholder="请输入充值金额"/>
                </FormItem>
              </Col>
            </Row>
            <Row class='add-row'>
              <Col span="8">
                <FormItem label="汇款人姓名">
                  <Input class='inp-style-center' placeholder="请输入汇款人姓名"/>
                </FormItem>
              </Col>
              <Col span='8'>
                <FormItem label="汇款时间">
                  <Input class='inp-style-center' placeholder=""/>
                </FormItem>
              </Col>
              <Col span='8'>
                <FormItem label="联系电话">
                  <Input class='inp-style-center' placeholder="请输入联系人电话号码"/>
                </FormItem>
              </Col>
            </Row>
            <Row class='add-row'>
              <Col span="24">
                <FormItem label="备注">
                  <Input class='inp-style-tex' type='textarea' placeholder="限50字"/>
                </FormItem>
              </Col>
            </Row>
        </Form>
      </div>
    </div>
  </div>
</template>

<script lang="tsx">
import { Component, Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { cinmeaList } from '@/api/cinema'
import { clean } from '@/fn/object'
import jsxReactToVue from '@/util/jsxReactToVue'

@Component
export default class Main extends ViewBase {
  dataForm = {
    query: '',
    pageIndex: 1,
    pageSize: 10,
  }
  total = 0
  cinemaData: any = []
  loading = false
  tableLoading = false
  options: any = []
  columns4 = [
    { title: '充值ID', key: 'provinceName', align: 'center' },
    {
      title: '申请时间',
      key: 'countyName',
      align: 'center'
    },
    {
      title: '银行账号',
      key: 'code',
      align: 'center'
    },
    {
      title: '汇款人姓名',
      key: 'shortName',
      align: 'center'
    },
    {
      title: '汇款时间',
      key: 'hallCount',
      align: 'center'
    },
    {
      title: '联系人电话',
      key: 'seatCount',
      align: 'center'
    },
    {
      title: '充值金额/元',
      key: 'seatCount',
      align: 'center'
    },
    {
      title: '备注',
      key: 'seatCount',
      align: 'center'
    },
    {
      title: '汇款凭证',
      align: 'center',
      render: (hh: any, { row: { id } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        return <a on-click={this.toDetail.bind(this, id)} class="operation" >查看</a>
        /* tslint:enable */
      }
    },
    {
      title: '状态',
      align: 'center',
      render: (hh: any, { row: { id } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        return <a on-click={this.toDetail.bind(this, id)} class="operation" >查看</a>
        /* tslint:enable */
      }
    }
  ]

  created() {
    this.seach()
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

  async queryCode(query: any) {
    if (query !== '') {
      this.loading = true
      try {
        const {
          data: {
            items
          }
        } = await cinmeaList({
          query
        })
        const code: any = []
        const shortName: any = []
        items.forEach((it: any) => {
          if ( it.code.includes(query) ) {
            code.push({
              value: it.code,
              label: it.code
            })
          }
        })
        items.forEach((it: any) => {
          if ( it.shortName.includes(query) ) {
            shortName.push({
              value: it.shortName,
              label: it.shortName
            })
          }
        })
        this.options = [...code, ...shortName]
        this.loading = false
      } catch (ex) {
        this.options = []
      }
    } else {
      this.options = []
    }
  }

  async seach() {
    this.tableLoading = true
    try {
      const query = { ...this.dataForm }
      const {
        data: {
          items,
          totalCount
        }
      } = await cinmeaList(clean({...query}))
      this.cinemaData = items
      this.total = totalCount
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.tableLoading = false
    }
  }

  toDetail(id: any) {
    this.$router.push({ name: 'account-cinema-detail', params: {id} })
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

.colBg {
  font-size: 14px;
  height: 50px;
  line-height: 50px;
  padding: 0 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  background: @c-head-bg;
}
.page {
  background: #fff;
  height: 100%;
  font-size: 14px;
  .ivu-select {
    width: auto;
    margin-left: 25px;
    /deep/ .ivu-select-selection {
      height: 40px;
      /deep/ .ivu-select-input {
        height: 40px;
        width: 400px;
        margin-bottom: 30px;
      }
    }
    /deep/ .ivu-select-dropdown {
      /deep/ li, /deep/ .ivu-select-loading {
        line-height: 35px;
        height: 35px;
      }
      /deep/ .ivu-select-item {
        line-height: 25px;
        height: 35px;
      }
    }
  }
  .table-box {
    div {
      display: inline-block;
    }
    background: rgba(249, 249, 249, 1);
    border-radius: 2px 2px 0  0;
    height: 50px;
    text-align: center;
    line-height: 50px;
    font-size: 14px;
  }
  .table-left-title {
    float: left;
    padding-left: 1.2%;
    color: #222;
  }
  .table-right-title {
    float: right;
    padding-right: 1.2%;
    color: #2481d7;
  }
  .userTitle {
    .colBg;
    .addUser {
      width: 140px;
      height: 40px;
      line-height: 40px;
      display: block;
      text-align: center;
      color: #fff;
      cursor: pointer;
      background: @c-button;
    }
  }
  .tableTotal {
    padding: 0 30px 20px;
    display: flex;
    justify-content: space-between;
    color: #989898;
  }
  .tables {
    margin: 20px;
  }
  .fince-list {
    .fince-list-big {
      width: 32%;
      display: inline-block;
      height: 160px;
      background: rgba(255, 248, 242, 1);
      border-radius: 2px;
      margin-left: 1%;
      margin-bottom: 12px;
      .fince-list-acc {
        width: 100%;
        font-size: 36px;
        font-weight: 400;
        color: rgba(254, 129, 53, 1);
        line-height: 36px;
        text-align: center;
        margin-top: 50px;
      }
      .fince-list-accd {
        width: 100%;
        font-size: 36px;
        font-weight: 400;
        color: rgba(254, 129, 53, 1);
        line-height: 36px;
        text-align: center;
        margin-top: 50px;
      }
      .fince-list-sm {
        width: 100%;
        height: 14px;
        font-size: 14px;
        font-weight: 400;
        color: rgba(136, 136, 136, 1);
        line-height: 14px;
        text-align: center;
        margin-top: 20px;
      }
    }
  }
  .add-row {
    padding-left: 30px;
    padding-right: 40px;
  }
  .inp-style {
    width: 97%;
    border: 1px solid rgba(210, 210, 210, 1);
    border-radius: 2px;
  }
  .inp-style-center {
    width: 95%;
    border: 1px solid rgba(210, 210, 210, 1);
    border-radius: 2px;
  }
  .inp-style-tex {
    width: 98.5%;
    border: 1px solid rgba(210, 210, 210, 1);
    border-radius: 2px;
  }
}
</style>
