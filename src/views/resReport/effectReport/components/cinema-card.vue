<template>
  <ReportPane :title="title">
    <template slot="more">
      <a @click="moreFnHandle"
         class="more-link"
         href="javascript:;">查看数据</a>
    </template>
    <div class="cinema-list-wp">
      <dl v-if=" dataList[0].data && dataList[0].data.length > 0 ">
        <dt>{{dataList[0].listName}}</dt>
        <dd>
          <ul class="cinema-list">
            <li v-for=" (item, index) in dataList[0].data"
                :key="index">
              <div class="cinema-list-item-inner">
                <span>{{item.name}}</span>
                <span>{{item.count}}</span>
              </div>
            </li>
          </ul>
        </dd>
      </dl>
      <dl v-if=" dataList[1].data && dataList[1].data.length > 0 ">
        <dt>{{dataList[1].listName}}</dt>
        <dd>
          <ul class="cinema-list">
            <li v-for=" (item, index) in dataList[1].data"
                :key="index">
              <div class="cinema-list-item-inner">
                <span>{{item.name}}</span>
                <span>{{item.count}}</span>
              </div>
            </li>
          </ul>
        </dd>
      </dl>
      <dl v-if=" dataList[2].data && dataList[2].data.length > 0 ">
        <dt>{{dataList[2].listName}}</dt>
        <dd>
          <ul class="cinema-list">
            <li v-for=" (item, index) in dataList[2].data"
                :key="index">
              <div class="cinema-list-item-inner">
                <span>{{item.name}}</span>
                <span>{{item.count}}</span>
              </div>
            </li>
          </ul>
        </dd>
      </dl>
    </div>
  </ReportPane>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import numAdd from './number.vue'
import ReportPane from './report-pane.vue'

@Component({
  components: {
    numAdd,
    ReportPane
  }
})
export default class CinemaCard extends Vue {
  @Prop({ type: Object, default: () => ({}) }) data!: any
  totalCount: number = 123457
  title: string = `覆盖影院（ ${this.totalCount}家 ）`

  dataList: any[] = [
    {
      listName: '曝光人次 TOP10',
      data: [
        {
          id: 1,
          name: '北京万达影城CBD店',
          count: '31.71%'
        },
        {
          id: 2,
          name: '北京万达影城CBD店',
          count: '31.71%'
        },
        {
          id: 3,
          name: '北京万达影城CBD店',
          count: '31.71%'
        }
      ]
    },
    {
      listName: '曝光场次 TOP10',
      data: [
        {
          id: 1,
          name: '北京万达影城CBD店',
          count: '31.71%'
        },
        {
          id: 2,
          name: '北京万达影城CBD店',
          count: '31.71%'
        },
        {
          id: 3,
          name: '北京万达影城CBD店',
          count: '31.71%'
        }
      ]
    },
    {
      listName: '支出金额 TOP10',
      data: [
        {
          id: 1,
          name: '北京万达影城CBD店',
          count: '31.71%'
        },
        {
          id: 2,
          name: '北京万达影城CBD店',
          count: '31.71%'
        },
        {
          id: 3,
          name: '北京万达影城CBD店',
          count: '31.71%'
        }
      ]
    }
  ]
  moreFnHandle() {
    // console.log('查看数据!')
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
.cinema-list-wp {
  background: rgba(0, 32, 45, 0.8);
  border-radius: 5px;
  padding: 25px;
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  align-items: center;
  dl {
    width: 33%;
    padding: 0 20px;
    border-right: 1px solid #3191aa;
  }
  dl:last-child {
    border-right: 0;
  }
  ul.cinema-list {
    li {
      .cinema-list-item-inner {
        display: flex;
        flex-flow: row;
        justify-content: space-between;
        align-items: center;
      }
    }
  }
}
</style>
