<template>
  <div class="page home-bg">
    <h2 class="layout-nav-title">权限管理 > 查看权限管理</h2>
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

@Component
export default class Main extends ViewBase {
  list: any = []
  role: any = []

  created() {
    this.seach()
  }

  recursion(arr: any, brr: any) {
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
      const brr: any = []
      meanList.push(menu)
      this.recursion(meanList, brr)
      this.role = role
    } catch (ex) {
      this.handleError(ex)
    } finally {
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

.auth-col {
  padding-bottom: 0;
}
</style>