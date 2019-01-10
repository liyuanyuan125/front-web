<template>
  <div class="page home-bg">
    <h2 class="layout-nav-title"><span @click="toAuth">权限管理</span> > 
      <span v-if="!$route.params.id">新建权限角色</span>
      <span v-else>编辑权限角色</span> 
    </h2>
    <Form ref="form" :model="form" label-position="left" :rules="rules" :label-width="100" class="edit-input">
      <FormItem label="角色名称" class="item-top" prop='name'>
        <Input v-model="form.name" placeholder="请输入权限角色名称"></Input>
      </FormItem>
      <FormItem label="相关权限">
        <Tree ref="tree" :data="list" @on-check-change="checkShow" show-checkbox></Tree>
      </FormItem>
    </Form>
    <div class="tableSubmit btnCenter">
      <button class="submitBtn button-ok" v-if="!$route.params.id" @click="handleInforma('form')">确定增加</button>
      <button class="submitBtn button-ok" v-else @click="handleInforma('form')">确定修改</button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { meanList, customerAdd, customerRole, customerSet } from '@/api/authUser'
import { getUser } from '@/store.ts'
import { isArray, isString } from '@/fn/type.ts'
import { uniq } from 'lodash'
import { toast } from '@/ui/modal'

@Component({
})
export default class Main extends ViewBase {
  role = []
  list: any = []
  form = {
    name: ''
  }
  perms: any = []
  rules = {
    name: [
       { required: true, message: '请输入角色名称', trigger: 'change' }
    ]
  }

  created() {
    this.seach()
  }

  get systemCode() {
    return getUser()!.systemCode
  }

  recursion(arr: any, brr: any = {}, parentKey = '') {
    for (const i in arr) {
      if (arr.hasOwnProperty(i)) {
        const item = arr[i] as any
        if (typeof item == 'object') {
          if (isArray(item)) {
            brr.children = []
            if (i == 'subPages' && item.length < 0) {
              this.recursion(item, brr.children)
            } else {
              const b = item.concat(arr.actions)
              this.recursion(b, brr.children, arr.key)
            }
          } else {
            brr[i] = {}
            this.recursion(item, brr[i], parentKey)
          }
        } else {
          if (arr.code) {
            brr.title = arr.name
            brr.code = arr.code
            brr.expand = true
            if (this.$route.params.id) {
              brr.checked = arr.check
            }
            brr.parentKey = parentKey
          } else {
            brr.title = arr.name
            brr.key = arr.key
            brr.expand = true
            brr.parentKey = ''
          }
        }
      }
    }
    return brr
  }

  checkShow(row: any) {
    const tree = this.$refs.tree as any
    const nodes = tree.getCheckedAndIndeterminateNodes() as any[]
    // 取出含有parentKey的对象
    const selseKey = nodes.filter((it: any) => {
      return it.parentKey
    })
    // 去重
    const parentsArray = uniq(selseKey.map((it: any) => {
      return it.parentKey
    }))
    // 定义perms对象
    const perms: any = {}
    // perms对象的属性为parentKey
    parentsArray.forEach((it: any) => {
      perms[it] = []
    })
    const codeArray: any = []
    // perms对象的属性为parentKey的值追加状态
    selseKey.forEach((it: any) => {
      if (parentsArray.includes(it.parentKey)) {
         perms[it.parentKey].push(it.code)
      }
    })
    // 格式化perms  parentsArray:code:code
    this.perms = Object.entries(perms).map((item, index) => {
      return `${item[0]}:${(item[1] as any).join(';')}`
    })
  }

  async seach() {
    const id = this.$route.params.id || 0
    try {
      if (!id) {
        const {
          data
        } = await meanList(this.systemCode, {type: 2})
        const meanLists: any = []
        const tree = this.recursion(data)
        meanLists.push(tree)
        this.list = meanLists
      } else {
        const {
          data: {
            menu,
            role
          }
        } = await customerRole(id)
        const meanLists: any = []
        const tree = this.recursion(menu)
        meanLists.push(tree)
        this.list = meanLists
        this.form.name = role.name
      }
    } catch (ex) {
      this.handleError(ex)
    } finally {
    }
  }

  async handleInforma(form: string) {
    const valid = await (this.$refs[form] as any).validate()
    const id = this.$route.params.id || 0
    if (!valid) {
      return
    }
    try {
      !id ? await customerAdd({
        name: this.form.name,
        systemCode: this.systemCode,
        perms: this.perms
      }) : await customerSet(
        id,
        {
        name: this.form.name,
        systemCode: this.systemCode,
        perms: this.perms
      })
      toast(!id ? '添加成功' : '修改成功')
      this.toAuth()
    } catch (ex) {
      this.handleError(ex)
    }
  }

  toAuth() {
    this.$router.push({name: 'account-auth'})
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
.page {
  .ivu-form-item {
    padding-left: 30px;
    color: @c-text;
  }
}
.ivu-tree {
  min-height: 300px;
}
</style>

