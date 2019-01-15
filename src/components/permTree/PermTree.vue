<template>
  <div class="perm-tree">
    <Tree :data="treeData" multiple :show-checkbox="!readonly" ref="tree"
      @on-select-change="onSelChange" @on-check-change="onSelChange"/>
  </div>
</template>

<script lang="tsx">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { listToTree } from '@/fn/tree'
import { walkTree } from '@/fn/tree'
import jsxReactToVue from '@/util/jsxReactToVue'
import { isEqual, Dictionary, uniq } from 'lodash'
import { toMap } from '@/fn/array'
import { Action, Page, PermTreeModal } from './types'
import PermTreeItem from './PermTreeItem.vue'

const toTreeData = (
  nodes: Page[],
  perms: string[],
  handler: (perms: string[]) => any,
  readonly: boolean
) => {
  const permMap = toMap(perms)
  return walkTree(nodes, {
    onEachBefore(node, parentNodes) {
      const level = parentNodes.length
      const isLeaf = (node.subPages || []).length == 0

      const actions = node.actions || []

      let checked = false
      let indeterminate = false

      if (isLeaf && actions.length > 0) {
        const hasPerm = actions.some(it => `${node.key}:${it.code}` in permMap)
        const allPerm = actions.every(it => `${node.key}:${it.code}` in permMap)
        checked = allPerm
        indeterminate = !allPerm && hasPerm
      }

      const page: any = {
        title: node.name,
        expand: false,
        checked,
        indeterminate,
        extraData: {
          node,
          level,
          perms,
          isLeaf
        },
        render: (hh: any, { data }: any) => {
          /* tslint:disable */
          const h = jsxReactToVue(hh)
          return <PermTreeItem v-model={data} on-change={handler}
            v-readonly={readonly}/>
          /* tslint:enable */
        }
      }

      return page
    },

    onEachAfter(page) {
      const isLeaf = page.children.length == 0
      const childrenChecked = page.children.some((t: any) => t.checked)

      // page.checked = isLeaf ? pageOn : false
      // page.expand = childrenChecked
      page.expand = true
    }
  })
}

const isSameList = (
  list1: string[] | number[] | null,
  list2: string[] | number[] | null
) => {
  if (list1 == null || list2 == null) {
    return list1 == list2
  }

  const sorted1 = [...list1].sort()
  const sorted2 = [...list2].sort()
  return isEqual(sorted1, sorted2)
}

const isSameValue = (val1: PermTreeModal, val2: PermTreeModal) => {
  return isSameList(val1.perms, val2.perms)
}

// 标准化树，将 children key 更改为 children
const normalizeTree = (nodes: Page[]): Page[] => {
  const list = nodes
    .filter(it => it != null)
    .map(it => {
      const children = normalizeTree(it.subPages)
      const item = {
        ...it,
        children
      }
      return item
    })
  return list
}

@Component
export default class PermTree extends ViewBase {
  /**
   * 值本身，可以使用 v-model 进行双向绑定
   */
  @Prop({ type: Object, default: () => {}, required: true }) value!: PermTreeModal

  /**
   * 只读模式
   */
  @Prop({ type: Boolean, default: false }) readonly!: boolean

  inValue = {} as PermTreeModal

  oldNodes: any[] | null = null

  get treeData() {
    const menu = this.inValue.menu
    const perms = this.inValue.perms
    const tree = toTreeData(menu ? [menu] : [], perms, this.onPermsChange.bind(this), this.readonly)
    return tree
  }

  onPermsChange(perms: string[]) {
    this.inValue.perms = perms
  }

  @Watch('value', { deep: true, immediate: true })
  watchValue(value: PermTreeModal) {
    const [ menu ] = normalizeTree([value.menu])
    this.inValue = {
      menu,
      perms: [...(value.perms || [])]
    }
  }

  @Watch('inValue', { deep: true })
  watchInValue(value: PermTreeModal) {
    if (!isSameValue(value, this.value)) {
      this.$emit('input', value)
    }
  }

  // @Watch('inValue.perms', { deep: true, immediate: true })
  // watchPerms(value: string[]) {
  //   this.$nextTick(() => {
  //     const tree = this.$refs.tree as any
  //     this.oldNodes = tree.getCheckedNodes() as any[]
  //     // console.log(this.oldNodes)
  //   })
  // }

  onSelChange() {
    const tree = this.$refs.tree as any
    const nodes = tree.getCheckedNodes() as any[]
    // debugger
    // console.log(nodes)
    // const nodes = tree.getCheckedAndIndeterminateNodes() as any[]
    // const { pages, perms } = nodes.reduce((result, { extraData: data } = {}) => {
    //   data.type == 'page'
    //     ? result.pages.push(parseInt(data.key, 10))
    //     : result.perms.push(String(data.key))
    //   return result
    // }, {
    //   pages: [],
    //   perms: [],
    // })
    // // 虑重
    // const uniqValue = {
    //   pages: uniq(pages) as number[],
    //   perms: uniq(perms) as string[],
    // }
    // this.inValue = uniqValue
  }
}
</script>

<style lang="less" scoped>
</style>
