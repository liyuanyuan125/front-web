<template>
  <div class="detail-fix" v-if="showDlg" @click.self="flag">
    <div class="table-action">
      <a @class.stop="flag">清空购物车</a>
    </div>
    <div class="detail-modeal">
      <Table height="300" :loading="loading" :columns="columns" :data="tabledata">
        <template slot-scope="{ row }" slot="name">
          <div class="table-name">
            <img :src="row.mainPicUrl" alt=""> 
            <span>{{row.name}}</span>
          </div>
        </template>

        <template slot-scope="{ row }" slot="type">
          {{row.type.join('/')}}
        </template>
        <template slot-scope="{ row }" slot="read">
          {{row.read}}w+
        </template>
        <template slot-scope="{ row }" slot="flansNumber">
          {{row.fansNumber}}
        </template>
        <template slot-scope="{ row }" slot="flansFace">
          <div v-if="row.fansList.length > 0">
            <p v-for="it in row.fansList" :key="it.sex" class="flans-box">
              <span style="margin-left: 10px">{{it.sex}}</span>  <span>{{it.percent}}</span>
            </p>
          </div>
        </template>
        <template slot-scope="{ row }" slot="discuss">
          {{row.discuss}}
        </template>
        <template slot-scope="{ row }" slot="like">
          {{row.like}}
        </template>
        <template slot-scope="{ row }" slot="transmit">
          {{row.transmit}}
        </template>
        <template slot-scope="{ row }" slot="price">
          {{row.price}}
        </template>
        <template slot-scope="{ row }" slot="action">
          <div class="active">
            <p v-if="row.likeStatus == 1">收藏</p>
            <p v-else>取消收藏</p>
            <p @click="del(row.id)">删除</p>
          </div>
        </template>
      </Table>

      <!-- <Page :total="total" v-if="total>0" class="btnCenter"
        :current="form.pageIndex"
        :page-size="form.pageSize"
        :page-size-opts="[6, 20, 50, 100]"
        show-total
        show-sizer
        show-elevator
        @on-change="sizeChangeHandle"
        @on-page-size-change="currentChangeHandle"/> -->
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { cinemaList } from '@/api/popPlan'
import { clean } from '@/fn/object'
import { isEqual } from 'lodash'
import { toast, warning } from '@/ui/modal.ts'
import moment from 'moment'
import { queryList } from '@/api/kolList.ts'

const timeFormat = 'YYYY-MM-DD'
@Component
export default class DlgEditCinema extends ViewBase {
  @Prop() value!: number
  showDlg = false
  type = this.value
  loading = false
  tabledata = []

  get columns() {
    const title = ['微博账号', '公众号/微信号', '抖音账号', '快手账号', '小红书账号']
    return [
      {
        title: title[this.type],
        align: 'left',
        width: 160,
        slot: 'name'
      },
      {
        title: '账号分类',
        minWidth: 40,
        align: 'left',
        slot: 'type'
      },
      {
        title: '粉丝数',
        align: 'left',
        minWidth: 40,
        slot: 'flansNumber'
      },
      {
        title: '粉丝画像',
        align: 'left',
        minWidth: 40,
        slot: 'flansFace'
      },
      {
        title: '平均阅读数',
        minWidth: 51,
        align: 'left',
        slot: 'read'
      },
      {
        title: '平均评论数',
        minWidth: 51,
        align: 'left',
        slot: 'discuss',
      },
      {
        title: '平均点赞数',
        minWidth: 51,
        align: 'left',
        slot: 'like',
      },
      {
        title: '平均转发数',
        align: 'left',
        minWidth: 51,
        slot: 'transmit',
      },
      {
        title: '投放价格',
        align: 'left',
        minWidth: 40,
        slot: 'price',
      },
      {
        title: '',
        minWidth: 40,
        align: 'left',
        slot: 'action'
      }
    ]
  }

  flag() {
    this.showDlg = false
  }

  async del(id: number) {
    try {
      this.tabledata = this.tabledata.filter((it: any) => it.id !== id)
    } catch (ex) {

    }
  }

  async init() {
    this.showDlg = true
    try {
      const { data } = await queryList({})
      this.tabledata = data.items
    } catch (ex) {
      this.handleError(ex)
    }
  }

  cancel() {
    this.showDlg = false
  }

  @Watch('tabledata', {deep: true})
  watchTabledata(val: any) {
    if (val.length == 0) {
      this.$emit('done', val)
    }
    this.$emit('done', val)
  }

}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
.detail-fix {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, .6);
  z-index: 991;
  .detail-modeal {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 300px;
    z-index: 998;
    background: #fff;
  }
  .table-action {
    position: absolute;
    z-index: 999;
    bottom: 260px;
    right: 30px;
    background: #000;
    a {
      font-size: 16px;
      font-weight: bold;
    }
  }
  /deep/ .ivu-table-wrapper {
    margin: 0;
    /deep/ .ivu-table-header th {
      height: 60px;
      background: #000;
      color: #fff;
      line-height: 60px;
      span {
        font-size: 14px;
      }
    }
    /deep/ .ivu-table-cell {
      padding-right: 10px;
      padding-left: 10px;
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
    .active {
      p {
        cursor: pointer;
      }
    }
    .flans-modeal {
      position: absolute;
      margin-left: 60px;
      z-index: 999;
      margin-top: -130px;
    }
  }
}
</style>
