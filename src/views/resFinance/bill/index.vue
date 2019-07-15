<template>
  <div class="page">
    <Row class="title">
      <Col class="title-col" :span="6">
        <!-- <img src="./assets/year.png" /> -->
        <Select v-model="query.year" placeholder="选择年份" >
          <Option v-for="it in years" :key="it.key" :value="it.key"
            :label="it.text">{{it.text}}</Option>
        </Select>
      </Col>
      <Col class="title-col" :span="6">
        <!-- <img src="./assets/month.png"> -->
        <Select v-model="query.mounth" placeholder="选择月份" >
          <Option v-for="it in mountes" :key="it.key" :value="it.key"
            :label="it.text">{{it.text}}</Option>
        </Select>
      </Col>
    </Row>
    <div v-if='viewimg && (query.mounth == 6 || query.mounth == 0)' class="items">
      <img src="./assets/2019-06.png" alt />
    </div>
    <div v-if='viewimg && (query.mounth == 5 || query.mounth == 0)' class="items">
      <img src="./assets/2019-05.png" alt />
    </div>
    <div v-if='viewimg && (query.mounth == 4 || query.mounth == 0)' class="items">
      <img src="./assets/2019-04.png" alt />
    </div>
    <div v-if='viewimg && (query.mounth == 3 || query.mounth == 0)' class="items">
      <img src="./assets/2019-03.png" alt />
    </div>
    <div v-if='!viewimg || (query.mounth != 3 || query.mounth != 4 || query.mounth != 5 || query.mounth != 6 || query.mounth != 0)' class='nos'>暂无对账单管理数据</div>
  </div>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { getUser } from '@/store'
import moment from 'moment'
import { toMap } from '@/fn/array'
import { confirm, toast, info } from '@/ui/modal'

@Component
export default class Main extends ViewBase {
  // 查看用户信息
  user: any = getUser()!
  // userList: any = {}
  // 显示图片
  viewimg: any = false
  // 不显示图片
  noviewimg: any = false

  query: any = {
    year: 1,
    mounth: 0,
  }

  // 年份
  years: any = [{
    key: 1,
    text: '2019'
  }]
  // 月份
  mountes: any = [
    {
      key: 0,
      text: '全部账单'
    },
    {
      key: 1,
      text: '一月'
    },
    {
      key: 2,
      text: '二月'
    },
    {
      key: 3,
      text: '三月'
    },
    {
      key: 4,
      text: '四月'
    },
    {
      key: 5,
      text: '五月'
    },
    {
      key: 6,
      text: '六月'
    },
    {
      key: 7,
      text: '七月'
    },
    {
      key: 8,
      text: '八月'
    },
    {
      key: 9,
      text: '九月'
    },
    {
      key: 10,
      text: '十月'
    },
    {
      key: 11,
      text: '十一月'
    },
    {
      key: 12,
      text: '十二月'
    }
  ]

  mounted() {
    const corpIds: any = VAR.env == 'prd' ? [642, 644] : [120]
    if (corpIds.indexOf(this.user.companyId) != -1) {
      this.viewimg = true
    } else {
      this.viewimg = false
    }
  }

  // jump() {
  //   this.$router.push({ name: 'resFinance-bill-detail' })
  // }
}
</script>

<style lang="less" scoped>
.title {
  // height: 46px;
  margin-top: 15px;
  margin-bottom: 20px;
  .title-col {
    // height: 46px;
    margin-right: 15px;
    img {
      width: 73%;
      height: 83%;
    }
  }
}
.items {
  // height: 185px;
  margin-top: 10px;
  cursor: pointer;
  img {
    width: 100%;
    height: 100%;
  }
}
.nos {
  height: 30px;
  text-align: center;
  color: #fff;
  font-size: 16px;
  line-height: 30px;
}
/deep/ .ivu-select-selection {
  height: 40px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 1);
}
/deep/ .ivu-select-input {
  margin-top: 3px;
}

/deep/ .ivu-select-single .ivu-select-selection .ivu-select-placeholder {
  display: block;
  height: 40px;
  line-height: 40px;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-left: 8px;
  padding-right: 24px;
  color: #00202d;
}
/deep/ .ivu-select-single .ivu-select-selection .ivu-select-selected-value {
  display: block;
  height: 40px;
  line-height: 40px;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-left: 8px;
  padding-right: 24px;
  color: #00202d;
}
</style>
