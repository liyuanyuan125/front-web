<template>
  <div class="page">
    <Row class="title">
      <Col class="title-col" :span="8">
        <img src="./assets/year.png" />
      </Col>
      <Col class="title-col" :span="8">
        <img src="./assets/month.png">
      </Col>
    </Row>
    <div v-if='viewimg' class="items">
      <img @click="jump()" src="./assets/2019-06.png" alt />
    </div>
    <div v-if='viewimg' class="items">
      <img @click="jump()" src="./assets/2019-05.png" alt />
    </div>
    <div v-if='viewimg' class="items">
      <img @click="jump()" src="./assets/2019-04.png" alt />
    </div>
    <div v-if='viewimg' class="items">
      <img @click="jump()" src="./assets/2019-03.png" alt />
    </div>
    <div v-if='!viewimg' class='nos'>暂无对账单管理数据</div>
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
</style>
