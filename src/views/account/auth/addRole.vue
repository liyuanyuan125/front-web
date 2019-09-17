<template>
  <div class="page-name">
    <h2 class="plan-title">
      <span class="adver-tiele" @click="toAuth">权限管理</span>
      <!-- <span v-if="!$route.params.id">新建权限角色</span>
      <span v-else>编辑权限角色</span> -->
    </h2>
    <Form
      ref="form"
      :model="form"
      label-position="left"
      :rules="rules"
      :label-width="100"
      class="edit-input"
    >
      <FormItem style="margin-left: 30%" label="角色名称" class="item-top" prop="name">
        <Input v-model="form.name" placeholder="请输入权限角色名称"/>
      </FormItem>
      <Row>
        <Row class="auth-check">
          <Col span="24" class="auth-box">
            <FormItem label="相关权限" :error="errorPerm" :class="{'item-sign': isSign}">
              <PermTree v-model="permTreeModal" v-if="permTreeModal"/>
            </FormItem>
          </Col>
        </Row>
      </Row>
    </Form>
    <div class="tableSubmit btn-center-footer">
      <Button type="primary" class="submitBtn button-ok" v-if="!$route.params.id" @click="handleInforma">确定增加</Button>
      <Button type="primary" class="submitBtn button-ok" v-else @click="handleInforma">确定修改</Button>
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
import { getUser } from '@/store'
import { isArray, isString } from '@/fn/type.ts'
import { uniq } from 'lodash'
import { toast } from '@/ui/modal'
import PermTree, { PermTreeModal, Page } from '@/components/permTree'
import { walkTree } from '@/fn/tree'
import { devLog } from '@/util/dev'

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

  // 产品临时需求：资源方 - 代理商，不能选择「广告单管理」- [广告单] 下面的「确认」、「拒绝」权限
  dealMenu(menu: Page) {
    const user = getUser()
    if (user == null
      || user.systemCode != 'resource'
      || user.secondaryCode != 'agent'
    ) {
      return menu
    }
    const disabledActions = ['confirm', 'refuse']
    const [ newMenu ] = walkTree([ menu ], {
      childrenKey: 'subPages',
      onEachBefore(node) {
        devLog(node)
        if (node.key == 'resource.adOrderManage.order') {
          node.actions = node.actions.map(it => {
            it.disabled = disabledActions.includes(it.code)
            return it
          })
          node.tip = '由于您是影管合作，目前系统仅支持影管账号统一接单；影城子账号自助接单功能暂未开放，请知晓。'
        }
      }
    })
    return newMenu
  }

  async seach() {
    const id = this.$route.params.id || 0
    try {
      if (id == 0) {
        const { data } = await meanList(this.systemCode, { type: 1 })
        this.permTreeModal = {
          menu: this.dealMenu(data),
          perms: id > 0 ? data.role.perms : []
        }
      } else {
        const {
          data: { menu, role }
        } = await customerRole(id)

        this.permTreeModal = {
          menu: this.dealMenu(menu),
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
      this.handleError(ex)
    }
  }

  toAuth() {
    this.$router.push({ name: 'account-auth' })
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
@import '~@/views/account/less/formInput.less';

.item-top {
  padding-top: 20px;
}
.page-name {
  margin: 0 30px;
}
/deep/ .ivu-input-wrapper,
/deep/ .ivu-input {
  background: rgba(255, 255, 255, 0.4);
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  border-radius: 5px;
  width: 400px;
  &::placeholder {
    font-size: 14px;
    color: #00202d;
  }
}
/deep/ .ivu-form-item-required .ivu-form-item-label::before {
  content: '';
}
.page {
  .ivu-form-item {
    padding-left: 30px;
    color: @c-text;
  }
}
.plan-title {
  margin: 0 0 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #fff;
  .adver-tiele {
    color: #fff;
    font-size: 24px;
    font-weight: normal;
  }
  .btn-new {
    width: 193px;
    height: 48px;
    border-radius: 24px;
    line-height: 44px;
    font-size: 18px;
    padding: 0;
    float: right;
    .button-style(#00202d, #f9d85e);
  }
}
.ivu-tree {
  min-height: 300px;
}
.auth-check {
  margin: 0 20px;
}
.auth-box {
  min-height: 270px;
  padding: 30px;
  background: rgba(0, 32, 45, 0.8);
  border-radius: 8px;
  /deep/ .title {
    color: #fff;
  }
  /deep/ .ivu-icon {
    color: #fff;
  }
  /deep/ .ivu-checkbox .ivu-checkbox-inner {
    background: rgba(0, 32, 45, 0.8);
  }
  /deep/ .ivu-checkbox-checked .ivu-checkbox-inner, /deep/ .ivu-checkbox-indeterminate .ivu-checkbox-inner {
    background: #fe8135;
  }
  /deep/ label {
    color: #fff;
  }
  /deep/ .ivu-checkbox-wrapper-disabled {
    opacity: .5;
  }
}
.submitBtn {
  margin-top: 30px;
  .button-style(#fff, #00202d);
  border-radius: 25px;
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

