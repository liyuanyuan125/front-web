<template>
  <div class="page home-bg">
    <h2 class="layout-nav-title"><span @click="toAuth">权限管理</span> > 查看权限管理</h2>
    <div class="text-rows auth-col">
      <Row>
        <Col :span="12">
          <p>
            <label>权限角色</label>{{role.name}}
          </p>
        </Col>
      </Row>
    </div>
    <div class="text-rows">
      <Row>
        <Col :span="12">
          <p class="flex-box">
            <label>相关权限</label>
            <Tree :data="list"></Tree>
          </p>
        </Col>
      </Row>
    </div>
    <div class="btnCenter">
      <button class="button-ok">编辑</button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { customerRole } from '@/api/authUser'
import { isArray } from '@/fn/type.ts'

@Component
export default class Main extends ViewBase {
  list: any = []
  role: any = []

  created() {
    this.seach()
  }

  recursion(arr: any, brr: any = {}, root: boolean = false) {
    for (const i in arr) {
      if ( arr.hasOwnProperty(i)) {
        if ( typeof arr[i] == 'object') {
          if ( isArray(arr[i]) ) {
            brr.children = []
            if (i == 'subPages' && arr[i].length < 0) {
              this.recursion(arr[i], brr.children, false)
            } else {
              const b = arr[i].concat(arr.actions.filter((it: any) => {
                return it.check
              }))
              this.recursion(b, brr.children, true)
            }
          } else {
            brr[i] = {}
            this.recursion(arr[i], brr[i], root)
          }
        } else {
          if (arr.code) {
            brr.title = arr.name
            brr.code = arr.code
            brr.expand = true
          } else {
            brr.title = arr.name
            brr.key = arr.key
            brr.expand = true
          }
        }
      }
    }
    return brr
  }

  async seach() {
    const id = this.$route.params.id || 0
    try {
      const {
        data: {
          menu,
          role
        }
      } = await customerRole(id)
      const meanList: any = []
      const tree = this.recursion(menu)
      meanList.push(tree)
      this.list = meanList
      this.role = role
    } catch (ex) {
      this.handleError(ex)
    } finally {
    }
  }

  toAuth() {
    this.$router.push({name: 'account-auth'})
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

.auth-col {
  padding-bottom: 0;
}
</style>