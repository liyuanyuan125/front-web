<template>
  <div class="page-name">
    <h2 class="plan-title"><span class="adver-tiele" @click="toAuth">权限管理</span></h2>
    <div class="text-rows">
      <Row>
        <Col>
          <div class="auth-box">
            <p style="color: #fff"><label>权限角色 </label> {{role.name}}</p>
            <div class="tree">
              <p style="float:left">
                <label>相关权限</label>
              </p>
              <PermTree v-model="permTreeModal" readonly v-if="permTreeModal"/>
            </div>
          </div>
        </Col>
      </Row>
    </div>
    <div class="btn-center-footer">
      <Button v-auth="'account-manage.roles#edit'" type="primary" @click="toAuth" class="submitBtn button-ok">编辑</Button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { customerRole } from '@/api/authUser'
import { isArray } from '@/fn/type.ts'
import PermTree, { PermTreeModal } from '@/components/permTree'

@Component({
  components: {
    PermTree
  }
})
export default class Main extends ViewBase {
  list: any = []
  role: any = []
  permTreeModal: PermTreeModal | null = null

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
      this.permTreeModal = {
        menu,
        perms: (role && role.perms) || []
      }
      this.role = role
    } catch (ex) {
      this.handleError(ex)
    } finally {
    }
  }

  toAuth() {
    this.$router.push({name: 'account-auth-add', params: {id: this.$route.params.id}})
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
@import '~@/views/account/less/common.less';

/deep/ .ivu-input-wrapper,
/deep/ .ivu-input {
  background: rgba(255, 255, 255, 0.4);
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  border-radius: 5px;
  &::placeholder {
    font-size: 14px;
    color: #00202d;
  }
}
.auth-col {
  padding-bottom: 0;
}
.tree {
  display: flex;
}
.plan-title {
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
.auth-check {
  margin: 0 20px;
}
.auth-box {
  min-height: 300px;
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
}
.submitBtn {
  margin-top: 30px;
  .button-style(#fff, #00202d);
  border-radius: 25px;
}
.page-name {
  margin: 0 30px;
}
</style>