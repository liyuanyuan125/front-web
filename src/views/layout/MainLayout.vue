<template>
  <div class="site-layout">
    <header
      class="site-header flex-box"
      :style="{ backgroundImage: headerImage }"
    >
      <ul class="site-breadcrumb">
        <li v-for="(it, i) in breadcrumbs" :key="i" class="site-breadcrumb-item">
          <router-link
            :tag="i < breadcrumbs.length - 1 && it.route ? 'a' : 'label'"
            :to="i < breadcrumbs.length - 1 && it.route ? it.route : ''"
          >{{it.label}}</router-link>
          <i class="iconfont icon-right" v-if="i < breadcrumbs.length - 1"/>
        </li>
      </ul>

      <div class="flex-1"></div>

      <form class="search-form flex-mid" @submit.prevent="search">
        <input type="search" v-model="keyword" placeholder="搜索" class="search-input">
        <Button html-type="submit" class="search-submit">
          <i class="iconfont icon-search"/>
        </Button>
      </form>

      <router-link :to="{}" class="cart-node">
        <i class="iconfont icon-cart"/>
        <span class="cart-count" v-if="cartCount > 0">{{cartCount}}</span>
      </router-link>

      <router-link :to="{}" class="notice-node">
        <i class="iconfont icon-notice"/>
        <span class="notice-count" v-if="hasNotice"></span>
      </router-link>

      <!-- <Dropdown class="switcher" @on-click="onSwitcherClick">
        <a class="switcher-node"></a>
        <DropdownMenu slot="list">
          <div class="switcher-arrow"></div>
          <DropdownItem v-for="it in systemList" :key="it.code" :name="it.code"
            :selected="user.systemCode == it.code">{{it.name}}系统</DropdownItem>
        </DropdownMenu>
      </Dropdown> -->

      <div class="user-box flex-box">
        <!-- <span class="corp-name">{{system.name}}：{{user.companyName}}</span> -->
        <span class="user-name">用户：{{user.email}}</span>
        <a class="logout" title="退出" @click="logout">
          <i class="iconfont icon-exit"/>
        </a>
      </div>
    </header>

    <Layout class="site-center">
      <aside class="site-sider">
        <h1 class="logo">
          <router-link :to="{name: 'home'}" class="logo-link">
            <img src="./assets/logo.png" alt="Aiads投放管理平台" class="logo-img">
          </router-link>
        </h1>

        <ul
          :key="`menu-${system.code}`"
          class="sider-menu"
          v-if="siderMenu.list.length > 0"
        >
          <template v-for="menu in siderMenu.list">
            <li
              v-for="(sub, i) in [menu].concat(menu.subPages)"
              :key="sub.name"
              class="menu-item"
              :class="{
                [`menu-item-lv${i == 0 ? 1 : 2}`]: true,
                'menu-item-on': siderActiveName == sub.name,
                [`menu-item-${sub.name}`]: true,
              }"
            >
              <router-link
                :tag="sub.route ? 'a' : 'label'"
                :to="sub.route ? { name: sub.route } : ''"
                class="menu-item-in"
              >
                <i :class="`iconfont icon-${sub.icon}`" v-if="sub.icon"/>
                <em>{{sub.label}}</em>
              </router-link>
            </li>
          </template>
        </ul>
      </aside>

      <Content class="site-content">
        <router-view :name="viewName"/>
      </Content>
    </Layout>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { getUser, checkUser, logout, User, switchSystem, getCurrentPerms, switchTheme } from '@/store'
import { systemList as allSystemList, SystemCode, PermPage } from '@/util/types'
import { getMenu, SiderMenuItem, getBreadcrumbsForRoute } from './menuList'
import { cloneDeep } from 'lodash'
import event from '@/fn/event'
import { systemSwitched, SystemSwitchedEvent } from '@/util/globalEvents'
import { devInfo } from '@/util/dev'
import { usePosition } from '@/util/scroll'

let instance: any = null
let viewName: string = 'default'

event.on('route-perm', ({ has, to, from }: any) => {
  viewName = has ? 'default' : '403'
  instance && (instance.viewName = viewName)
})

const headerColor = 0x25668f

@Component
export default class MainLayout extends ViewBase {
  user = getUser()

  allSystemList = allSystemList

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

  // isOff = false

  viewName = 'default'

  permMenu: PermPage[] | null = null

  get siderMenu() {
    const user = this.user
    if (user == null || this.permMenu == null) {
      return { list: [], map: {} }
    }

    const permMenu = this.permMenu
    const result = getMenu(permMenu, user.systemCode)
    return result
  }

  get siderOpenNames() {
    const activeName = this.siderActiveName
    const item = this.siderMenu.list.find(it => {
      const exists = (it.subPages! || [{ name: it.name }]).some(
        t => t.name === activeName
      )
      return exists
    })
    return item != null ? [item.name] : []
  }

  // 获取导航中全部可点击的页面 name
  get siderMenuNameMap() {
    const result = this.siderMenu.list.reduce((map: any, it) => {
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

  headerOpacity = 0

  get headerImage() {
    const red = headerColor >> 0x10
    const green = (headerColor & 0xff00) >> 0x08
    const blue = headerColor & 0xff
    const rgba = `rgba(${red}, ${green}, ${blue}, ${this.headerOpacity}%)`
    const result = `linear-gradient(${rgba}, ${rgba})`
    return result
  }

  get breadcrumbs() {
    const list = getBreadcrumbsForRoute(this.$route, this.siderMenu.map)
    return list
  }

  keyword = ''

  cartCount = 8

  hasNotice = true

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
    switchTheme()
    event.on(systemSwitched, (ev: SystemSwitchedEvent) => {
      this.$router.push({ name: 'home' })
      switchTheme()
    }, false)
  }

  search() {
    debugger
  }

  async changePerm() {
    const perms = await getCurrentPerms()
    // 若无法获取权限，则退出
    if (perms == null) {
      return logout()
    }

    this.permMenu = perms.menu
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
    usePosition().then((pos: number) => {
      const opacity = Math.min(Math.floor(pos / 55 * 100), 100)
      this.headerOpacity = opacity
    })
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
@import './iconfont.less';

@c-sider-bg: #001f2c;
@c-menu-open: #002d5b;
@c-sider-text: #91a5bc;

.site-layout {
  position: relative;
  min-width: 1200px;
  max-width: 1600px;
  min-height: 100vh;
  margin: auto;
  background: url(~@/assets/site/bg.jpg) no-repeat center top fixed;
  background-size: cover;
}

.site-header {
  position: fixed;
  width: 100vw;
  max-width: inherit;
  height: 55px;
  line-height: 55px;
  padding-left: 120px;
  z-index: 188;
  background: no-repeat 120px 0;
}

.switcher {
  position: relative;
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

.user-box {
  position: relative;
  margin-left: 25px;

  &,
  a {
    color: #fff;
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 15px;
    width: 2px;
    height: 24px;
    background-color: #fff;
  }
}

.corp-name {
  color: @c-sub-text;
  padding-left: 34px;
  background: url(./assets/person.png) no-repeat left center;
}

.user-name {
  margin-left: 20px;
}

.logout {
  position: relative;
  padding: 0 15px;
  .iconfont {
    font-size: 18px;
  }
}

.site-center {
  position: relative;
  background-color: transparent;
  padding-top: 55px;
}

.site-sider {
  position: fixed;
  top: 0;
  width: 120px;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: scroll;
  z-index: 198;
  user-select: none;
  display: flex;
  flex-direction: column;
  &::after {
    content: '';
    flex: 1;
    background-color: @c-sider-bg;
    min-height: 30vh;
  }
}

.logo {
  position: relative;
  width: inherit;
  height: 152px;
  background-color: @c-sider-bg;
}

.logo-link {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
}

.logo-img {
  width: 95px;
  height: 64px;
}

.sider-menu {
  width: inherit;
}

.menu-item {
  line-height: 36px;
  background-color: @c-sider-bg;
  .iconfont {
    position: absolute;
    left: 10px;
  }
}

.menu-item-on {
  background-color: transparent;
  & > .menu-item-in {
    opacity: 1;
  }
}

.menu-item-in {
  position: relative;
  display: inline-block;
  width: 100%;
  height: 100%;
  padding-left: 36px;
  color: #fff;
  opacity: .7;
}

.site-breadcrumb {
  display: flex;
  user-select: none;
  margin-left: 4px;
  font-size: 14px;
  a,
  label,
  .iconfont {
    display: inline-block;
    color: #fff;
    height: 100%;
    vertical-align: top;
    padding: 0 5px;
  }
  .iconfont {
    padding: 0 1px;
  }
}

.site-breadcrumb-item {
  &:last-child {
    font-size: 18px;
    position: relative;
    top: -1px;
  }
}

.search-form {
  position: relative;
  display: inline-block;
  .icon-search {
    color: #fff;
  }
}

.search-input {
  width: 150px;
  height: 30px;
  line-height: 20px;
  padding: 5px 35px 5px 15px;
  border: 0;
  outline: 0;
  color: #fff;
  background-color: rgba(99, 145, 177, .7);
  border-radius: 88px;
  transition: width ease-in-out .3s;
  &::-webkit-input-placeholder {
    color: #ccc;
  }
  &:focus {
    width: 300px;
    &::-webkit-input-placeholder {
      color: transparent;
    }
  }
}

.search-submit {
  position: absolute;
  top: 50%;
  right: 0;
  height: 30px;
  transform: translateY(-50%);
  border: 0;
  padding: 0 9px;
  background-color: transparent;
  margin-top: -1px;
  border-radius: 0 88px 88px 0;
  overflow: hidden;
}

.cart-node,
.notice-node {
  position: relative;
  margin-left: 18px;
  color: #fff;
  padding: 0 5px;
  .iconfont {
    font-size: 18px;
  }
}

.cart-count {
  position: absolute;
  top: 12px;
  right: -2px;
  min-width: 14px;
  height: 14px;
  line-height: 12px;
  font-size: 9px;
  color: #fdfeff;
  background-color: #ca7273;
  border-radius: 88px;
  text-align: center;
  padding: 0 3px;
}

.notice-count {
  position: absolute;
  top: 16px;
  right: 7px;
  width: 6px;
  height: 6px;
  border-radius: 100%;
  background-color: #ca7273;
}

.site-content {
  position: relative;
  padding: 10px 10px 10px 130px;
  overflow: auto;
}
</style>
