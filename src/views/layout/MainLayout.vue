<template>
  <div class="site-layout">
    <header
      class="site-header flex-box"
      :style="{ backgroundImage: headerImage }"
    >
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
          v-if="siderMenuList.length > 0"
        >
          <template v-for="menu in siderMenuList">
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
import { getMenuList, SiderMenuItem } from './menuList'
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

  headerOpacity = 0

  get headerImage() {
    const red = headerColor >> 0x10
    const green = (headerColor & 0xff00) >> 0x08
    const blue = headerColor & 0xff
    const rgba = `rgba(${red}, ${green}, ${blue}, ${this.headerOpacity}%)`
    const result = `linear-gradient(${rgba}, ${rgba})`
    return result
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
    switchTheme()
    event.on(systemSwitched, (ev: SystemSwitchedEvent) => {
      this.$router.push({ name: 'home' })
      switchTheme()
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
  width: 1200px;
  max-width: 1600px;
  min-height: 100vh;
  margin: auto;
  background: url(./assets/bg.jpg) no-repeat center top;
  background-size: cover;
  background-attachment: fixed;
}

.site-header {
  position: fixed;
  width: 100vw;
  max-width: inherit;
  height: 55px;
  line-height: 55px;
  padding-left: 126px;
  z-index: 188;
  background: no-repeat 120px 0;
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
  padding-top: 55px;
}

.site-sider {
  position: fixed;
  top: 0;
  width: 126px;
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
  height: 70px;
}

.sider-menu {
  width: inherit;
}

.menu-item {
  line-height: 36px;
  background-color: @c-sider-bg;
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
  padding-left: 38px;
  color: #fff;
  opacity: .7;
}

.iconfont {
  position: absolute;
  left: 16px;
}

.site-content {
  position: relative;
  padding: 10px 10px 10px 136px;
  overflow: auto;
}
</style>
