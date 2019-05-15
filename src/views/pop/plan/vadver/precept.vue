<template>
  <div class="page home-bg">
    <Form :model="form" ref="dataform" label-position="left" :rules="rule" :label-width="100" class="edit-input forms">
      <PreceptHead />

      <h3 class="layout-title">投放影片</h3>
      <div class="item-top">
        <span class="item-detail">优先投放 3 部</span>
        <span class="custom">自定义投放电影</span>
      </div>
      <div class="item-top">
        <ul class="film-list" v-if="filmList.length > 0">
          <li v-for="(it) in filmList" :key="it.id"
            :class="['film-item']">
            <div class="film-top">
              <img :src="it.mainPicUrl" class="film-cover">
              <div>
                <p>{{it.name}}</span></p>
                <p>上映时间：<span>{{formatDate(it.openTime)}}</span></p>
                <p>影片类型：<span>{{it.type.join('/')}}</span></p>
                <p>想看人数：<span>{{it.viewNumber}}</span></p>
              </div>
            </div>
            <div class="film-center">
              <p>受众年龄：<span>{{it.age}}</span></p>
              <p>受众性别：<span>{{it.sex}}</span></p>
            </div>
            <div class="film-buttom">
              <dl>
                <dd>匹配度</dd>
                <dt>{{it.matching}}%</dt>
              </dl>
              <dl>
                <dd>投放周期</dd>
                <dt>{{it.week}}</dt>
              </dl>
            </div>
          </li>
        </ul>
      </div>

      <h3 class="layout-title">覆盖影院</h3>
      <div class="item-top">
        <span class="item-detail">影院总数</span>
        <span class="custom">自定义投放影院</span>
      </div>
      <div class="item-top">
        <div class="cinema-box">
          <div class="cinema-left"><PrecepFilm /></div>
          <div class="cinema-right">
            <Table :loading="loading"  stripe :columns="columns" :data="tableDate">
              <template slot-scope="{ row }" slot="citys">
                {{row.name}}
              </template>

              <template slot-scope="{ row }" slot="code">
                {{row.start}}
              </template>
            </Table>

            <Page :total="total" v-if="total>0" class="btnCenter"
              :current="pageIndex"
              :page-size="pageSize"
              :page-size-opts="[6, 20, 50, 100]"
              show-total
              show-sizer
              show-elevator
              @on-change="sizeChangeHandle"
              @on-page-size-change="currentChangeHandle"/>
          </div>
        </div>
      </div>

      <div class="btn-center">
        <Button type="primary" class="button-ok" @click="next('dataform')">确认导出方案</Button>
        <Button type="default" class="button-ok default-but" @click="back('dataform')">导出投放方案</Button>
        <Button type="default" class="button-ok default-but" @click="back('dataform')">联系商务</Button>
        <Button type="default" class="button-ok default-but" @click="back('dataform')">返回上一步</Button>
      </div>
    </Form>  
  </div>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import PreceptHead from './precepthead.vue'
import PrecepFilm from './preceptfile.vue'
import { orienteering, cinemaFilm } from '@/api/popPlan.ts'
import moment from 'moment'

const timeFormat = 'YYYY-MM-DD'
@Component({
  components: {
    PreceptHead,
    PrecepFilm
  }
})
export default class App extends ViewBase {
  form: any = {
    name: ''
  }
  pageIndex = 1
  pageSize = 6
  tableDate: any = []
  total = 0
  filmList: any = []
  loading = false
  columns = [
    {
      title: '影院名称',
      slot: 'citys',
      align: 'center'
    },
    {
      title: '转资编号',
      slot: 'code',
      align: 'center'
    },
    {
      title: '影院星级',
      slot: 'code',
      align: 'center'
    }
  ]

  get rule() {
    return {}
  }

  formatDate(data: any) {
    return data ? moment(data).format(timeFormat) : '暂无'
  }

  created() {
    this.init()
    this.seach()
  }

     // 每页数
  sizeChangeHandle(val: any) {
    this.pageIndex = val
    this.seach()
  }

  // 当前页
  currentChangeHandle(val: any) {
    this.pageSize = val
    this.seach()
  }

  async init() {
    const { data } = await orienteering({})
    this.filmList = data.items || []
  }

  async seach() {
    const { data: { items }} = await cinemaFilm({})
    this.tableDate = items || []
    this.total = this.tableDate.length
  }

  async next(dataform: any) {
    this.$emit('input', 3)
    try {
      const volid = await (this.$refs[dataform] as any).validate()
      if (volid) {
        this.$emit('input', 1)
      }
    } catch (ex) {
      this.handleError(ex)
    }
  }

  back(dataform: any) {
    this.$emit('input', 1)
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
.item-top {
  margin-left: 30px;
  font-size: 14px;
  color: #26344b;
  .item-detail {
    display: inline-block;
    width: 100px;
  }
  .custom {
    margin-left: 40px;
  }
}
.hint {
  position: absolute;
  left: 105px;
  top: 14px;
}
.button-ok {
  width: 200px;
  margin-right: 16px;
}
.btn-center {
  margin: 40px 0 30px;
  text-align: center;
}
.default-but {
  border: 1px solid #dcdee2;
  .button-style(#515a6e, rgba(236, 245, 255, 1));
}
.form-item-first:first-child {
  margin-bottom: 20px;
}
.film-list {
  display: flex;
  flex-wrap: wrap;
  column-count: 3;
  margin-top: -15px;
  margin-bottom: 40px;
  .film-item {
    flex: 1;
    position: relative;
    margin: 25px 20px 0 0;
    background: rgba(249, 249, 249, 1);
    padding: 10px;
    .film-top {
      display: flex;
      img {
        width: 30%;
        height: 130px;
        border: 5px solid #ccc;
      }
      div {
        margin-left: 20px;
        height: 30px;
        line-height: 30px;
      }
    }
    .film-center {
      margin: 15px 0;
      padding: 10px 0;
      border-top: 1px solid #ccc;
      border-bottom: 1px solid #ccc;
      p {
        height: 30px;
        line-height: 30px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        span {
          margin-left: 10px;
        }
      }
    }
    .film-buttom {
      display: flex;
      margin-top: 15px;
      margin-bottom: 15px;
      dl {
        flex: 1;
        dt {
          margin-top: 15px;
        }
      }
    }
  }
}
.cinema-box {
  display: flex;
  padding: 30px;
  margin-right: 20px;
  background: #f9f9f9;
  div {
    flex: 1;
    min-height: 400px;
  }
  .cinema-left {
    border-right: 1px solid #999;
  }
}
</style>

