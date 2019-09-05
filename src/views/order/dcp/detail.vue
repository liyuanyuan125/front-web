<template>
  <div class="page home-bg">
    <h3 class="userTitle">
      <span>DCP包  > 下载DCP包 </span>
    </h3>
    <div class="search-input">
      <div>
        <span class="search-left">执行单ID</span>
        <span class="">{{orderId}}</span>
      </div>
      <div>
        <span class="search-left">广告片名称</span>
        <span>{{videoName}}</span>
      </div>
    </div>
    <Table ref="selection" stripe :loading="tableLoading"  :columns="columns4" :data="authDate"></Table>
  </div>
</template>

<script lang="tsx">
import { Component, Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { getUser } from '@/store'
import { queryList } from '@/api/dcp'
import { clean } from '@/fn/object'
import jsxReactToVue from '@/util/jsxReactToVue'
import moment from 'moment'
import { confirm, toast } from '@/ui/modal'
import { toMap } from '@/fn/array'

const makeMap = (list: any[]) => toMap(list, 'key', 'text')
const timeFormatDate = 'YYYY-MM-DD HH:mm:ss'

@Component
export default class Main extends ViewBase {

  dataForm: any = {
    searchKey: '',
    pageIndex: 1,
    pageSize: 10,
  }

  typeList: any = null
  orderId = ''
  videoName = ''
  query = ''
  loading = false
  tableLoading = false
  options: any = []
  list: any = []
  total = 0

  get systemCode() {
    return getUser()!.systemCode
  }

  columns4 = [
    { title: '格式', width: 200, key: 'typeListText', align: 'center' },
    {
      title: '下载链接',
      key: 'name',
      align: 'center',
      render: (hh: any, { row: { name, fileUrl } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        return <a href={fileUrl} target='_blank' download = {name}>{fileUrl}</a>
        /* tslint:enable */
      }
    }
  ]

  get cachedMap() {
    return {
      typeList: makeMap(this.typeList),
    }
  }

  get authDate() {
    const cachedMap = this.cachedMap
    const list = (this.list || []).map((it: any) => {
      return {
       ...it,
       typeListText: cachedMap.typeList[it.typeCode]
      }
    })
    return list
  }

  mounted() {
    this.seach()
  }

  async seach() {
    this.tableLoading = true
    try {
      const {
        data: {
          orderId,
          videoName,
          attachments,
          typeList
        }
      } = await queryList(this.$route.params.id)
      this.list = attachments
      this.orderId = orderId
      this.videoName = videoName
      this.typeList = typeList
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.tableLoading = false
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
.bth-search {
  cursor: pointer;
}
.search-input {
  margin-left: 30px;
  .search-left {
    display: inline-block;
    margin-bottom: 16px;
    width: 80px;
    color: #888;
    margin-right: 30px;
  }
}
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
  .flex-box {
    span {
      display: block;
      height: 40px;
      width: 80px;
      text-align: center;
      padding-top: 8px;
    }
    .info-title {
      line-height: 40px;
      margin-right: 20px;
      font-size: 14px;
      color: rgba(51, 51, 51, 1);
    }
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
    padding: 0 30px 0;
    display: flex;
    justify-content: space-between;
    color: #989898;
  }
  /deep/ .operation {
    margin-right: 6px;
  }
}
/deep/ .ivu-input-wrapper {
  width: 400px;
  .ivu-input {
    width: 400px;
    line-height: 40px;
    height: 40px;
  }
}
/deep/ .ivu-table-cell > span:only-child:empty {
  &::before {
    content: '-';
  }
}
</style>
