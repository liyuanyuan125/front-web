<template>
  <div class="page bgHei">
     <com-statu :statuCode="statuCode"></com-statu>
    <div class="content">
      <h3>登录信息</h3>
      <ul>
        <li class="flex-box" v-for="item in loginMes">
          <div>{{item.label}}</div>
          <p>{{item.name}}</p>
        </li>
      </ul>
      <h3>公司信息</h3>
      <dl>
        <dd v-for="item in company">
          <div>{{item.label}}</div>
          <p>{{item.name}}</p>
        </dd>
      </dl>
      <h3>开户信息</h3>
      <ul>
        <li class="flex-box" v-for="item in opens.list">
          <div>{{item.label}}</div>
          <p>{{item.name}}</p>
        </li>
        <li class="flex-box">
          <div>{{opens.imgs.label}}</div>
          <p>
            <img class="imgs" v-for="item in opens.imgs.list" :src="item" alt="alias" width="150px">
          </p>
        </li>
      </ul>
    </div>
    <div class="btnCenter">
      <button class="submitBtn">
        <router-link tag="span" :to="{ name: 'account-info-edit' }">编辑账号信息</router-link>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import UrlManager from '@/util/UrlManager'
import { infoIndex } from '@/api/info'
import comStatu from './status.vue'

@Component({
  components: {
    comStatu
  }
})
export default class Main extends UrlManager {
  statuCode = 0
  loginMes = [
    { label: '账号类型', name: '公司信息/资源方' },
    { label: '账号ID', name: '22' },
    { label: '登录账号', name: 'xxxx.$com' }
  ]

  company = [
    { label: '公司名称', name: '公司信息/资源方' },
    { label: '账号ID', name: '22' },
    { label: '登录账号', name: 'xxxx.$com' },
    { label: '账号ID', name: '22' },
    { label: '登录账号', name: 'xxxx.$com' }
  ]

  opens = {
    list: [
      { label: '资质类型', name: '公司信息/资源方' },
      { label: '账号ID', name: '22' }
    ],
    imgs: {
      label: '资源图片',
      list: [
        'https://file.iviewui.com/iview-admin/login_bg.jpg',
        'https://file.iviewui.com/iview-admin/login_bg.jpg',
        'https://file.iviewui.com/iview-admin/login_bg.jpg'
      ]
    }
  }

  async mounted() {
    try {
      const {
        data: { user }
      } = await infoIndex()
    } catch (ex) {}
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

@c-bg: #fff;
.compad {
  padding: 20px 0 20px 30px;
}
.comli {
  padding-bottom: 20px;
  font-size: 14px;
  color: @c-sub-text;
}

.content {
  background: @c-bg;
  h3 {
    font-size: 14px;
    height: 50px;
    line-height: 50px;
    padding-left: 30px;
    background: @c-head-bg;
  }
  ul {
    .compad;
    li {
      .comli;
      div {
        width: 80px;
      }
      p {
        color: @c-text;
        .imgs {
          margin-right: 20px;
        }
      }
    }
  }
  dl {
    .compad;
    height: 152px;
    dd {
      width: 50%;
      float: left;
      .comli;
      div {
        width: 80px;
        float: left;
      }
      p {
        color: @c-text;
      }
    }
  }
}
</style>
