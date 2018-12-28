<template>
  <div class="site-layout">
    <header class="site-header flex-box">
      <h1 class="logo">
        <router-link to="/" class="logo-link">
          <img src="~@/assets/site/logo.png" alt="Aiads投放管理平台">
        </router-link>
      </h1>
      <div class="flex-1 flex-box">
        <a class="sider-toggle" @click="toggleSider" style="display:none">
          <Icon type="md-menu" size="24" class="menu-icon"
            :class="isOff && 'rotate-icon'"></Icon>
        </a>

        <div class="flex-1"></div>

        <Menu mode="horizontal" class="user-menu flex-box"
          @on-select='onMenuSelect'>
          <Submenu name="user">
            <template slot="title">
              <Icon type="md-person"></Icon>用户
            </template>
            <MenuItem name="settings">账户信息</MenuItem>
            <MenuItem name="logout">退出登录</MenuItem>
          </Submenu>
        </Menu>
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
import { logout } from '@/store'

@Component
export default class App extends ViewBase {
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

  toggleSider() {
    (this.$refs.sider as any).toggleCollapse()
  }

  onMenuSelect(name: string) {
    if (name == 'settings') {
      alert('暂未实现')
      // this.$router.push({ name })
    } else if (name == 'logout') {
      // TODO: do logout
      logout()
      this.$router.push({ name: 'login' })
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

@c-sider-bg: #0c3c6e;
@c-menu-open: #002d5b;
@c-sider-text: #91a5bc;

.site-layout {
  position: relative;
}
.site-header {
  position: relative;
  height: 60px;
  line-height: 60px;
  background-color: #fff;
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

// TODO: 右侧菜单收缩功能稍微开发完成
.menu-icon {
  transition: all .3s;
}
.rotate-icon {
  transform: rotate(-90deg);
}

.user-menu {
  height: 50px;
  line-height: 50px;
  background-color: transparent;
  &::after {
    display: none;
  }
  /deep/ .ivu-menu-submenu {
    border-bottom: 0 !important;
  }
  /deep/ .ivu-menu-submenu-title {
    color: #fff;
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
        background: url(~@/assets/main-layout/selected.png) no-repeat;
      }
    }
  }
  .menu-node-home a {
    background-image: url(~@/assets/main-layout/home.png);
  }
  .menu-node-account {
    /deep/ .ivu-menu-submenu-title {
      background-image: url(~@/assets/main-layout/account.png);
    }
  }
}
</style>
