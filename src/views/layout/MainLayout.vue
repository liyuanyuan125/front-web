<template>
  <div class="site-layout">
    <header class="site-header flex-box" ref="siteHeader">
      <h1 class="logo">
        <router-link :to="{ name: 'home' }" class="logo-link">
          <img src="~@/assets/site/logo.png" alt="Aiads投放管理平台" class="logo-img">
        </router-link>
      </h1>

      <Dropdown class="switcher" @on-click="onSwitcherClick">
        <a class="switcher-node"></a>
        <DropdownMenu slot="list">
          <div class="switcher-arrow"></div>
          <DropdownItem v-for="it in systemList" :key="it.code" :name="it.code"
            :selected="user.systemCode == it.code">{{it.name}}系统</DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <div class="flex-1"></div>

      <div class="flex-box">
        <span class="corp-name">{{system.name}}：{{user.companyName}}</span>
        <span class="user-name">用户：{{user.email}}</span>
        <a class="logout" title="退出" @click="logout"></a>
      </div>
    </header>

    <Layout ref="siteCenter" :style="{height: winHei, overflow: 'hidden'}" class="site-center">
      <Sider collapsible hide-trigger v-model="isOff" class="site-sider" :width="180" ref="sider">
        <Menu width="auto" theme="dark" :key="`menu-${system.code}`" class="sider-menu" :class="isOff && 'sider-menu-off'"
          :active-name="siderActiveName" :open-names="siderOpenNames" v-if="siderMenuList.length > 0">
          <template v-for="menu in siderMenuList">
            <Submenu v-if="menu.subPages.length > 0" :name="menu.name" :class="`menu-node-${menu.name}`">
              <template slot="title">{{menu.label}}</template>
              <MenuItem v-for="sub in menu.subPages" :key="sub.name" :name="sub.name">
                <router-link :to="{name: sub.route}">{{sub.label}}</router-link>
              </MenuItem>
            </Submenu>
            <MenuItem v-else :name="menu.name" class="menu-item-lv1" :class="`menu-node-${menu.name}`">
              <router-link :to="{name: menu.route}">{{menu.label}}</router-link>
            </MenuItem>
          </template>
        </Menu>
      </Sider>

      <Content class="site-content">
        <router-view :name="viewName"/>
      </Content>
    </Layout>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { getUser, checkUser, logout, User, switchSystem, getCurrentPerms } from '@/store'
import { systemList as allSystemList, SystemCode, PermPage } from '@/util/types'
import { getMenuList, SiderMenuItem } from './menuList'
import { cloneDeep, kebabCase } from 'lodash'
import event from '@/fn/event'
import { systemSwitched, SystemSwitchedEvent } from '@/util/globalEvents'
import { devInfo } from '@/util/dev'

let instance: any = null
let viewName: string = 'default'

event.on('route-perm', ({ has, to, from }: any) => {
  viewName = has ? 'default' : '403'
  instance && (instance.viewName = viewName)
})

@Component
export default class MainLayout extends ViewBase {
  user = getUser()

  allSystemList = allSystemList

  // winHei
  winHei: any = '100%'

  get systemList() {
    if (this.user != null) {
      const systems = this.user.systems
      const list = allSystemList.filter(it => systems.includes(it.code))
      return list
    }
    return []
  }

  get system(): { code: string, name: string } {
    const result = this.user != null
      && allSystemList.find(it => it.code == this.user!.systemCode)
      || { code: '', name: '' }
    return result
  }

  isOff = false

  viewName = 'default'

  permMenu: PermPage[] | null = null

  get siderMenuList() {
    const user = this.user
    if (user == null || this.permMenu == null) {
      return []
    }

    const permMenu = this.permMenu
    const list = getMenuList(permMenu, user.systemCode)

    return list
  }

  get siderOpenNames() {
    const activeName = this.siderActiveName
    const item = this.siderMenuList.find(it => {
      const exists = (it.subPages! || [{ name: it.name }]).some(
        t => t.name === activeName
      )
      return exists
    })
    return item != null ? [item.name] : []
  }

  // 获取导航中全部可点击的页面 name
  get siderMenuNameMap() {
    const result = this.siderMenuList.reduce((map: any, it) => {
      const names = it.subPages && it.subPages.length > 0
        ? it.subPages.map(t => t.name)
        : [it.name]
      names.forEach(name => (map[name] = 1))
      return map
    }, {})
    return result
  }

  // 映射某些页面到 sider 菜单
  siderActiveMap: any = {
    // 'from-page-name': 'nav-name',
  }

  get siderActiveName() {
    const { name } = this.$route

    if (name == null) {
      return
    }

    // 若 name 在导航中，直接返回
    if (name in this.siderMenuNameMap) {
      return name
    }

    // 否则去掉最后的 -tail，再次判断，最多支持 a-b-c-d 四级
    const tail = /-\w+$/
    let remain = name
    for (let i = 0; i < 3 && tail.test(remain); i++) {
      remain = remain.replace(tail, '')
      if (remain in this.siderMenuNameMap) {
        return remain
      }
    }

    // 最后的手段：硬编码映射关系
    return this.siderActiveMap[name]
  }

  created() {
    // 初始化 viewName，设置全局 instance
    this.viewName = viewName
    instance = this

    checkUser()

    // 切换权限
    this.changePerm()
    event.on(systemSwitched, (ev: SystemSwitchedEvent) => {
      this.changePerm()
    })

    // 是有低优先级监听，以便其他地方可以拦截取消
    this.changeTheme()
    event.on(systemSwitched, (ev: SystemSwitchedEvent) => {
      this.$router.push({ name: 'home' })
      this.changeTheme()
    }, false)
  }

  async changePerm() {
    const perms = await getCurrentPerms()
    // 若无法获取权限，则退出
    if (perms == null) {
      return logout()
    }

    this.permMenu = perms.menu
  }

  changeTheme() {
    const user = getUser()
    if (user != null) {
      // classList 的兼容性不太好
      const html = document.documentElement
      const className = (html.className || '').trim()
      const remain = className.replace(/\btheme-\w+\b/, '')
      const name = kebabCase(user.systemCode)
      const newClass = [remain, `theme-${name}`].join(' ').trim()
      html.className = newClass
    }
  }

  onSwitcherClick(name: SystemCode) {
    switchSystem(name)
    this.$router.push({ name: 'home' })
  }

  logout() {
    logout()
    this.$router.push({ name: 'login' })
  }

  mounted() {
    this.$nextTick(() => {
      const winHeight = document.documentElement.clientHeight || document.body.clientHeight
      const headerHeight = (this.$refs.siteHeader as any).offsetHeight
      this.winHei = winHeight - headerHeight + 'px'
     //  console.log(headerHeight)
      // (this.$refs.siteCenter as any).style = {height: '513px'}
    })
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

@c-sider-bg: #0c3c6e;
@c-menu-open: #002d5b;
@c-sider-text: #91a5bc;

.site-layout {
  min-width: 1200px;
  max-width: 1600px;
  margin: auto;
}

.site-header {
  position: relative;
  height: 60px;
  line-height: 60px;
  background-color: #fff;
  z-index: 188;
}

.logo {
  width: 155px;
  font-weight: 400;
  font-size: 18px;
}
.logo-link {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  color: #fff;
}
.logo-img {
  height: 50px;
}

.switcher {
  position: relative;
  left: -17px;
  /deep/ .ivu-select-dropdown {
    margin-top: 10px;
    margin-left: -50px;
    padding: 22px 0;
  }
  /deep/ .ivu-dropdown-menu {
    position: relative;
  }
  /deep/ .ivu-dropdown-item {
    position: relative;
    padding: 6px 32px;
    font-size: 14px !important;
    text-indent: 10px;

    &:hover {
      background-color: fade(@c-button, 10%);
    }
  }
  /deep/ .ivu-dropdown-item-selected {
    color: @c-button;
    background-color: transparent;

    &::before {
      content: '';
      position: absolute;
      left: 20px;
      top: 50%;
      width: 14px;
      height: 14px;
      margin-top: -7px;
      border: 2px solid @c-button;
      border-radius: 100%;
      background-color: transparent;
    }
  }
}
.switcher-node {
  display: block;
  width: 80px;
  height: 60px;
  background: url(./assets/downTriangle.png) no-repeat 15% 65%;
}

.switcher-arrow,
.switcher-arrow::after {
  position: absolute;
  width: 0;
  height: 0;
  border: solid transparent;
}
.switcher-arrow {
  top: -33px;
  left: 50%;
  margin-left: -10px;
  border-width: 0 10px 10px;
  border-bottom-color: rgba(217, 217, 217, 0.5);
}
.switcher-arrow::after {
  content: ' ';
  top: 1px;
  margin-left: -10px;
  border-width: 0 10px 10px 10px;
  border-bottom-color: #fff;
}

.corp-name {
  color: @c-sub-text;
  padding-left: 34px;
  background: url(./assets/person.png) no-repeat left center;
}
.user-name {
  color: @c-primary;
  margin-left: 30px;
}
.logout {
  position: relative;
  margin-left: 31px;
  padding: 0 30px;
  color: transparent;
  background: url(./assets/exit.png) no-repeat center;
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 15px;
    width: 1px;
    height: 30px;
    background-color: @c-border;
  }
}

.site-center {
  position: relative;
  background-color: transparent;
}
.site-sider {
  position: relative;
  background-color: @c-sider-bg;
  border-right: 1px solid #eee;
  overflow-y: scroll;
  min-height: 100%;
  // min-height: calc(100vh - 60px);
}
.site-content {
  position: relative;
  padding: 10px;
  overflow: auto;
}
.ivu-menu {
  z-index: 99;
}
.sider-menu {
  padding-top: 9px;
  margin-bottom: 10px;
  background-color: @c-sider-bg;
  &::after {
    display: none;
  }
  /deep/ .ivu-menu-submenu {
    padding-left: 0 !important;
    background-color: @c-sider-bg;
    .ivu-menu-submenu-title {
      padding-left: 60px;
      background: no-repeat 30px center;
      line-height: 20px;
      i {
        margin-right: 5px;
      }
    }
    .ivu-menu-item {
      font-size: 12px;
      & > a {
        padding: 10px 24px 10px 77px;
      }
    }
    .ivu-menu-item-selected {
      & > a {
        color: @c-primary;
      }
    }
    &.ivu-menu-opened {
      background-color: @c-menu-open;
    }
  }
  .ivu-menu-item {
    padding: 0 !important;
    & > a {
      position: relative;
      display: block;
      padding: 10px 24px 10px 77px;
      color: @c-sider-text;
      background: @c-sider-bg no-repeat 30px center;
    }
  }
  .menu-item-lv1 {
    & > a {
      padding-left: 59px;
      line-height: 28px;
      background-position: 30px 48.5%;
      &::before {
        display: none;
      }
    }
  }
  .ivu-menu-item-selected {
    & > a {
      color: @c-button !important;
      &::before {
        content: '';
        position: absolute;
        left: 57px;
        top: 50%;
        margin-top: -5px;
        width: 10px;
        height: 10px;
        border: solid 1px #f65202;
        border-radius: 50%;
      }
    }
    &.menu-node-home > a::before {
      content: '';
      width: 0;
      height: 0;
      border: none;
    }
  }
  .menu-node-home {
    /deep/ & > .ivu-menu-submenu-title,
    & > a {
      background-image: url(./assets/home.png);
    }
  }
  .menu-node-pop {
    /deep/ & > .ivu-menu-submenu-title,
    & > a {
      background-image: url(./assets/pop.png);
    }
  }
  .menu-node-report {
    /deep/ & > .ivu-menu-submenu-title,
    & > a {
      background-image: url(./assets/report.png);
    }
  }

  .menu-node-customer {
    /deep/ & > .ivu-menu-submenu-title,
    & > a {
      background-image: url(./assets/customer.png);
    }
  }

  .menu-node-order {
    /deep/ & > .ivu-menu-submenu-title,
    & > a {
      background-image: url(./assets/order.png);
    }
  }
  .menu-node-finance,
  .menu-node-resfinance {
    /deep/ & > .ivu-menu-submenu-title,
    & > a {
      background-image: url(./assets/finance.png);
    }
  }

  .menu-node-account {
    /deep/ & > .ivu-menu-submenu-title,
    & > a {
      background-image: url(./assets/account.png);
    }
  }
}
</style>
