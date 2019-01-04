<template>
  <div class="page home-bg">
    <com-statu :statuCode="statuCode"></com-statu>
    <div class="content">
      <h3 class="layout-title">登录信息</h3>
      <Row class="text-rows">
        <Col :span="12">
          <p>
            <label>账号类型</label>广告放/资源方
          </p>
          <p>
            <label>账号ID</label>xxxxxxxxx
          </p>
          <p>
            <label>登录账号</label>xxxxxxxxx
          </p>
        </Col>
      </Row>

      <h3 class="layout-title">公司信息</h3>
      <Row class="text-rows">
        <Col :span="12">
          <p>
            <label>公司名称</label>广告放/资源方
          </p>
          <p>
            <label>公司所在地</label>xxxxxxxxx
          </p>
        </Col>
        <Col :span="12">
          <p>
            <label>联系人</label>广告放/资源方
          </p>
          <p>
            <label>手机号码</label>xxxxxxxxx
          </p>
          <p>
            <label>邮箱</label>xxxxxxxxx
          </p>
        </Col>
      </Row>

      <h3 class="layout-title">开户信息</h3>
      <Row class="text-rows">
        <Col :span="24">
          <p>
            <label>资质类型</label>广告放/资源方
          </p>
          <p>
            <label>资质编号</label>xxxxxxxxx
          </p>
          <p class="flex-box">
            <label>资质图片</label>
            <em>
              <img :src="item" v-for="item in opens.list" width="150px">
            </em>
          </p>
        </Col>
      </Row>
    </div>

    <div class="accountList">
      <h3 class="layout-title">账号变更记录</h3>
      <Table :columns="column" :data="dataList" stripe disabled-hover></Table>
    </div>

    <!-- 审核以通过 -->
    <div class="btnCenter sumbit-button">
      <button class="button-ok button-offset">
        <router-link tag="span" :to="{ name: 'account-info-accedit' }">修改信息</router-link>
      </button>
      <button class="button-ok" @click="handleInforma">变更账号</button>
    </div>

    <div class="btnCenter sumbit-button" v-if="false">
      <button class="button-ok">
        <router-link tag="span" :to="{ name: 'account-info-edit' }">修改信息</router-link>
      </button>
    </div>

    <dlgChange v-model="queryDetail" v-if="queryDetail.visibleMess"></dlgChange>
    <dlgInforma v-model="informa" v-if="informa.visibleInforma"></dlgInforma>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { infoIndex } from '@/api/info'
import comStatu from './status.vue'
import dlgChange from './dlgChange.vue'
import dlgInforma from './dlgInformation.vue'

@Component({
  components: {
    comStatu,
    dlgChange,
    dlgInforma
  }
})
export default class Main extends ViewBase {
  statuCode = 0

  queryDetail: any = {
    visibleMess: false,
    changelist: {
      name: '北京智能',
      type: '公司账号',
      type2: 'xxxxx',
      code: '88888888888888888',
      img: [
        'https://file.iviewui.com/iview-admin/login_bg.jpg',
        'https://file.iviewui.com/iview-admin/login_bg.jpg',
        'https://file.iviewui.com/iview-admin/login_bg.jpg'
      ]
    }
  }

  column = [
    { title: '变更编号', key: 'id' },
    { title: '账号变更提交时间', key: 'times' },
    {
      title: '变更前信息',
      key: 'front',
      render: (h: any, params: any) => {
        return h('div', [
          h(
            'a',
            {
              style: {
                color: '#2481D7'
              },
              on: {
                click: () => {
                  this.queryDetail.title = '账号变更前信息'
                  this.queryDetail.visibleMess = true
                }
              }
            },
            params.row.front
          )
        ])
      }
    },
    {
      title: '变更后信息',
      key: 'after',
      render: (h: any, params: any) => {
        return h('div', [
          h(
            'a',
            {
              style: {
                color: '#2481D7'
              },
              on: {
                click: () => {
                  this.queryDetail.title = '账号变更后信息'
                  this.queryDetail.visibleMess = true
                }
              }
            },
            params.row.front
          )
        ])
      }
    },
    { title: '审核状态', key: 'status' },
    {
      title: '备注',
      key: 'remarks',
      render: (h: any, params: any) => {
        const { row } = params
        if (row.remarks.length > 10) {
          const splitText = row.remarks.substr(0, 10) + '.......'
          return h(
            'Tooltip',
            {
              props: {
                placement: 'top',
                content: row.remarks,
                maxWidth: '200px'
              }
            },
            splitText
          )
        } else {
          return h('span', {}, row.remarks)
        }
      }
    }
  ]

  dataList = [
    {
      id: 'John Brown1',
      times: '2016-10-03 9:00:00',
      front: '点击查看',
      after: '点击查看',
      status: '1',
      remarks:
        '北京智能广宣科技有限公司北京智能广宣科技有限公司北京智能广宣科技有限公司'
    },
    {
      id: 'John Brown2',
      times: '2016-10-03 9:00:00',
      front: '点击查看',
      after: '点击查看',
      status: '1',
      remarks: '北京智能广宣科技有限公司'
    },
    {
      id: 'John Brown3',
      times: '2016-10-03 9:00:00',
      front: '点击查看',
      after: '点击查看',
      status: '1',
      remarks: '/'
    }
  ]

  informa = {
    visibleInforma: false
  }

  opens = {
    list: [
      'https://file.iviewui.com/iview-admin/login_bg.jpg',
      'https://file.iviewui.com/iview-admin/login_bg.jpg',
      'https://file.iviewui.com/iview-admin/login_bg.jpg'
    ]
  }

  async mounted() {}

  handleInforma() {
    this.informa.visibleInforma = true
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

.sumbit-button {
  padding: 30px 0 50px;
}
</style>
