<template>
  <div class="page home-bg">
    <h2 class="layout-nav-title">
      <span @click="toAuth">权限管理</span> >
      <span v-if="!$route.params.id">新建权限角色</span>
      <span v-else>编辑权限角色</span>
    </h2>
    <Form
      ref="form"
      :model="form"
      label-position="left"
      :rules="rules"
      :label-width="100"
      class="edit-input"
    >
      <FormItem label="角色名称" class="item-top" prop="name">
        <Input v-model="form.name" placeholder="请输入权限角色名称"></Input>
      </FormItem>
      <FormItem label="相关权限" :error="errorPerm" :class="{'item-sign': isSign}">
        <PermTree v-model="permTreeModal" v-if="permTreeModal"/>
      </FormItem>
    </Form>
    <div class="tableSubmit btnCenter">
      <button class="submitBtn button-ok" v-if="!$route.params.id" @click="handleInforma">确定增加</button>
      <button class="submitBtn button-ok" v-else @click="handleInforma">确定修改</button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import {
  meanList,
  customerAdd,
  customerRole,
  customerSet
} from '@/api/authUser'
import { getUser } from '@/store.ts'
import { isArray, isString } from '@/fn/type.ts'
import { uniq } from 'lodash'
import { toast } from '@/ui/modal'
import PermTree, { PermTreeModal } from '@/components/permTree'

@Component({
  components: {
    PermTree
  }
})
export default class Main extends ViewBase {
  role = []
  list: any = []

  errorPerm = ''
  permTreeModal: PermTreeModal | null = null

  form = {
    name: ''
  }
  perms: any = []
  isSign = true

  created() {
    this.seach()
  }

  get rules() {
    return {
      name: [{ required: true, message: '请输入角色名称', trigger: 'change' }]
    }
  }

  get systemCode() {
    return getUser()!.systemCode
  }

  async seach() {
    const id = this.$route.params.id || 0
    try {
      if (id == 0) {
        const { data } = await meanList(this.systemCode, { type: 1 })
        this.permTreeModal = {
          menu: data,
          perms: id > 0 ? data.role.perms : []
        }
      } else {
        const {
          data: { menu, role }
        } = await customerRole(id)

        this.permTreeModal = {
          menu,
          perms: (role && role.perms) || []
        }

        this.form.name = (role && role.name) || ''
      }
    } catch (ex) {
      this.handleError(ex)
    } finally {
    }
  }

  async handleInforma() {
    if (this.permTreeModal != null) {
      if (this.permTreeModal.perms.length == 0) {
        this.errorPerm = '请输入相关权限'
        this.isSign = true
      } else {
        this.errorPerm = ''
        this.isSign = false
      }
    }
    const valid = await (this.$refs.form as any).validate()
    const id = this.$route.params.id || 0
    if (!valid || this.permTreeModal!.perms.length == 0) {
      return
    }
    try {
      !id
        ? await customerAdd({
            name: this.form.name,
            systemCode: this.systemCode,
            perms: this.permTreeModal ? this.permTreeModal.perms : []
          })
        : await customerSet(id, {
            name: this.form.name,
            systemCode: this.systemCode,
            perms: this.permTreeModal ? this.permTreeModal.perms : []
          })
      toast(!id ? '添加成功' : '修改成功')
      this.toAuth()
    } catch (ex) {
      this.handleError(ex.msg)
    }
  }

  toAuth() {
    this.$router.push({ name: 'account-auth' })
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
/deep/ .ivu-form-item-required .ivu-form-item-label::before {
  content: '';
}
.page {
  .ivu-form-item {
    padding-left: 30px;
    color: @c-text;
  }
}
.ivu-tree {
  min-height: 300px;
}
.submitBtn {
  margin-bottom: 30px;
}
// /deep/ .item-sign .ivu-form-item-label::before {
//   content: '*';
//   display: inline-block;
//   margin-right: 4px;
//   line-height: 1;
//   font-size: 12px;
//   color: #ed4014;
// }
</style>

