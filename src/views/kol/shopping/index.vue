<template>
  <div class="page home-bg">
    <Header />
    <div>

    </div>
    <Table stripe  :columns="columns" :data="tableDate" ref="selection"  @on-selection-change="singleSelect"  @on-select-all="selectAll" >
      <template ref='title' slot="header">
        <div>
          <div class="top">
            <p>
              <span v-if="filename">影片：《{{filename}}》</span>
            </p>
            <p @click="checkFilm">
              切换
              <Icon v-if="!checkSelcet" type="ios-arrow-forward" />
              <Icon v-else type="ios-arrow-down" />            </p>
          </div>
          <div class="check-button" v-if="checkSelcet">
            <div>
                <RadioGroup v-model="filmCheck">
                  <Radio v-for="it in filmList" :key="it.key" :label="it.key">{{it.text}}</Radio>
               </RadioGroup>
            </div>
            <div class="check-btn">
              <Button @click="sure">确定</Button>
              <Button @click="checkFilm">取消</Button>
            </div>
          </div>
        </div>
      </template>
      <template style="marin-top: 100px" slot-scope="{ row }" slot="type">
        <div class="table-name">
          <img :src="row.mainPicUrl" alt=""> 
          <span>{{row.name}}</span>
        </div>
      </template>
      <template style="marin-top: 100px" slot-scope="{ row }" slot="action">
        {{row.fansNumber}}
      </template>
    </Table>

    <div class="checkAll">
      <span @click="handleSelectAll">
        <Checkbox v-model="checkboxAll"></Checkbox>全选
      </span>
      <div class="check-span">
        <ul>
          <li>已选账号 1 个  </li>
          <li>应付金额（不含撰稿费用）</li>
        </ul>
      </div>
      <Button @click="sure">立即预定</Button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { fileList, queryList } from '@/api/shopping'
import Header from './header.vue'
import { formatCurrency } from '@/fn/string'
import { uniqBy } from 'lodash'

@Component({
  components: {
    Header
  }
})
export default class DlgEditCinema extends ViewBase {
  @Prop() id!: number
  showDlg = true
  tableDate: any = []
  filmList: any = []
  filename: any = ''
  filmCheck = 0
  checkboxAll = false
  checkSelcet = false
  sumList: any = []
  checkId: any = []
  sum = 0
  sumcount = 0

  get tableDates() {
    if (this.tableDate && this.tableDate.length > 0) {
      return this.tableDate.map((it: any) => {
        if (this.checkId.includes(it.id)) {
          return {
            ...it,
            _checked: true
          }
        } else {
          return {
            ...it,
          }
        }
      })
    } else {
      return []
    }
  }

  get columns() {
    const columns: any = [
        { type: 'selection', width: 50, align: 'center' },
        {
          title: '账号分类',
          align: 'left',
          slot: 'type'
        },
        {
          title: '平台',
          align: 'left',
          key: 'platform'
        },
        {
          title: '投放方式',
          align: 'left',
          key: 'type'
        },
        {
          title: '操作',
          align: 'center',
          width: 160,
          slot: 'action'
        }
      ]
    return columns
  }


  created() {
    this.filmFind()
    this.init()
  }

  async filmFind() {
    try {
      const { data } = await fileList({})
      this.filmList = data.items || []
      this.filename = this.filmList.filter((it: any) => it.key == this.filmCheck)[0].text
    } catch (ex) {
      this.handleError(ex)
    }
  }

  handleSelectAll() {
    const selection = this.$refs.selection as any
    selection.selectAll(!this.checkboxAll)
  }

  singleSelect(select: any) {
    const ids = this.tableDate.map((it: any) => it.id)
    const dataId = select.map((it: any) => it.id)
    select.forEach((item: any) => {
      if (!this.checkId.includes(item.id)) {
        this.checkId.push(item.id)
        this.sumList.push(item)
      }
    })
    const filterId = ids.filter((it: any) => !dataId.includes(it))
    this.checkId = this.checkId.filter((it: any) => !filterId.includes(it))
    this.sumList = this.sumList.filter((it: any) => !filterId.includes(it.id))
    this.checkboxAll = select.length == this.tableDate.length ? true : false
  }

  sure() {
    this.filename = this.filmList.filter((it: any) => it.key == this.filmCheck)[0].text
    this.checkFilm()
  }

  checkFilm() {
    this.checkSelcet = !this.checkSelcet
    const names = this.tableDate.length > 0 ? 'ivu-table-body' : 'ivu-table-tip'
    const tip: any = document.getElementsByClassName(names)[0]
    if (this.checkSelcet) {
      tip.style.marginTop = '210px'
    } else {
      tip.style.marginTop = '80px'
    }
  }

  async init() {
    try {
      const { data } = await queryList({})
      this.tableDate = data.items
    } catch (ex) {
      this.handleError(ex)
    }
  }

  selectAll() {

  }

  cancel() {
    this.showDlg = false
  }

  @Watch('filmCheck')
  watchFilmCheck(val: number) {
    this.init()
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/common.less';
/deep/ .ivu-table-wrapper {
  /deep/ .ivu-table-header th {
    height: 60px;
    background: #000;
    color: #fff;
    line-height: 60px;
    span {
      font-size: 14px;
    }
  }
  .ivu-table-title {
    position: absolute;
    top: 60px;
    height: 80px;
    width: 100%;
    border: none;
    background: #f9f9f9;
    .top {
      display: flex;
      justify-content: space-between;
      margin-left: 18px;
      margin-right: 50px;
      line-height: 80px;
      font-size: 14px;
      p {
        cursor: pointer;
      }
    }
    .check-button {
      position: relative;
      height: 130px;
      overflow: auto;
      background: #f8f8f9;
      padding: 10px 50px 20px 50px;
      .check-btn {
        position: absolute;
        bottom: 20px;
        right: 20px;
        /deep/ .ivu-btn {
          height: 30px;
          margin-left: 20px;
          font-size: 12px;
        }
      }
    }
  }
  .ivu-table-tip {
    margin-top: 80px;
  }
  .ivu-table-body {
    margin-top: 80px;
  }
  .table-name {
    display: flex;
    padding: 20px 0;
    align-items: center;
    img {
      height: 60px;
      width: 60px;
      border-radius: 50%;
    }
    span {
      margin-left: 10px;
    }
  }
}
.check-span {
  ul {
    display: flex;
    color: #515a6e;
    li:last-child {
      margin-left: 30px;
    }
  }
}
</style>
