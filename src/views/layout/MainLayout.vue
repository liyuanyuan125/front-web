<template>
  <div class="site-layout">
    <header class="site-header flex-box">
      <h1 class="logo">
        <router-link to="/" class="logo-link">
          <img src="./assets/logo.png" alt="Aiads投放管理平台">
        </router-link>
      </h1>

      <Dropdown class="switcher">
        <a class="switcher-node"></a>
        <DropdownMenu slot="list">
          <div class="switcher-arrow"></div>
          <DropdownItem v-for="it in systemList" :key="it.code"
            :selected="user.systemCode == it.code">{{it.name}}投放管理平台</DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <div class="flex-1"></div>

      <div class="flex-box">
        <span class="corp-name">{{systemName}}：{{user.companyName}}</span>
        <span class="user-name">用户：{{user.name}}</span>
        <a class="logout" title="退出" @click="logout">退出</a>
      </div>
    </header>

    <Layout class="site-center">
      <Sider collapsible hide-trigger v-model="isOff" class="site-sider"
        :width="180" ref="sider">
        <Menu width="auto" theme="dark" class="sider-menu"
          :class="isOff && 'sider-menu-off'"
          :active-name="siderActiveName"
          :open-names="siderOpenNames">
          <template v-for="menu in siderMenuList">
            <Submenu v-if="menu.subList" :name="menu.name"
              :class="`menu-node-${menu.name}`">
              <template slot="title">{{menu.label}}</template>
              <MenuItem v-for="sub in menu.subList" :key="sub.name" :name="sub.name">
                <router-link :to="{ name: sub.name }">{{sub.label}}</router-link>
              </MenuItem>
            </Submenu>
            <MenuItem v-else :name="menu.name" :class="`menu-node-${menu.name}`">
              <router-link :to="{ name: menu.name }">{{menu.label}}</router-link>
            </MenuItem>
          </template>
        </Menu>
      </Sider>

      <Content class="site-content">
        <router-view></router-view>
      </Content>
    </Layout>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { getUser, logout, User } from '@/store'
import { systemList as allSystemList } from '@/util/types'

@Component
export default class App extends ViewBase {
  user = getUser()

  allSystemList = allSystemList

  get systemList() {
    if (this.user != null) {
      const list = this.user.systems
        .map(code => allSystemList.find(it => it.code == code))
        .filter(it => it != null)
      return list
    }
    return []
  }

  get systemName() {
    if (this.user != null) {
      const item = allSystemList.find(it => it.code == this.user!.systemCode)
      return item != null ? item.name : ''
    }
    return ''
  }

  isOff = false

  siderMenuList = [
    {
      name: 'home',
      label: '首页',
    },
    {
      name: 'account',
      label: '账户管理',
      subList: [
        {
          name: 'account-info',
          label: '账号信息',
        },
        {
          name: 'account-user',
          label: '用户管理',
        },
        {
          name: 'account-auth',
          label: '权限管理',
        },
        {
          name: 'account-cinema',
          label: '影院管理',
        },
        {
          name: 'account-password',
          label: '修改密码',
        },
      ]
    },
  ]

  get siderOpenNames() {
    return this.siderMenuList.map(it => it.name)
  }

  // 获取导航中全部可点击的页面 name
  get siderMenuNameMap() {
    const result = this.siderMenuList.reduce((map: any, it) => {
      const names = it.subList != null
        ? it.subList.map(t => t.name)
        : [ it.name ]
      names.forEach(name => map[name] = 1)
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

    // 否则去掉最后的 -tail，再次判断
    const remain = name.replace(/-\w+$/, '')
    if (remain in this.siderMenuNameMap) {
      return remain
    }

    // 最后的手段：硬编码映射关系
    return this.siderActiveMap[name]
  }

  logout() {
    logout()
    this.$router.push({ name: 'login' })
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

@c-sider-bg: #0c3c6e;
@c-menu-open: #002d5b;
@c-sider-text: #91a5bc;

.site-header {
  position: relative;
  height: 60px;
  line-height: 60px;
  background-color: #fff;
  z-index: 8880;
}

.logo {
  width: 200px;
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
  content: " ";
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
  min-height: calc(100vh - 60px);
}
.site-content {
  position: relative;
  padding: 10px;
  overflow-x: auto !important;
}

.sider-menu {
  margin-bottom: 188px;
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
    }
    .ivu-menu-item {
      font-size: 12px;
      & > a {
        padding-left: 77px;
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
      padding: 18px 24px 18px 60px;
      color: @c-sider-text;
      background: @c-sider-bg no-repeat 30px center;
    }
  }
  .ivu-menu-item-selected {
    & > a {
      color: @c-button !important;
      &::before {
        content: '';
        position: absolute;
        left: 62px;
        top: 50%;
        width: 8px;
        height: 8px;
        margin-top: -4px;
        background: url(./assets/selected.png) no-repeat;
      }
    }
  }
  .menu-node-home a {
    background-image: url(./assets/home.png);
  }
  .menu-node-account {
    /deep/ .ivu-menu-submenu-title {
      background-image: url(./assets/account.png);
    }
  }
}
</style>
