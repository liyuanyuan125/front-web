<template>
  <div class="perm-tree">
    <Tree :data="treeData" multiple show-checkbox ref="tree"
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

// interface ValueMap {
//   pageMap: Dictionary<any>,
//   permMap: Dictionary<any>,
// }

const toTreeData = (nodes: Page[], perms: string[]) => {
  const permMap = toMap(perms)
  return walkTree(nodes, {
    onEachBefore(node, parentNodes) {
      const level = parentNodes.length
      const isLeaf = (node.subPages || []).length == 0

      const actions = node.actions || []
      const hasPerm = actions.some(it => it.code in permMap)
      const allPerm = actions.every(it => it.code in permMap)

      const page: any = {
        title: node.name,
        expand: false,
        checked: allPerm,
        indeterminate: hasPerm,
        extraData: {
          node,
          level,
          perms,
        },
        render: (hh: any, { data }: any) => {
          /* tslint:disable */
          const h = jsxReactToVue(hh)
          return <PermTreeItem value={data}/>
          /* tslint:enable */
        },
      }

      return page
    },

    onEachAfter(page) {
      // const pageOn = page.extraData.key in pageMap
      const isLeaf = page.children.length == 0
      const childrenChecked = page.children.some((t: any) => t.checked)

      // page.checked = isLeaf ? pageOn : false
      // page.expand = childrenChecked
      page.expand = true
    }
  })
}

const isSameList = (list1: string[] | number[] | null, list2: string[] | number[] | null) => {
  if (list1 == null || list2 == null) {
    return list1 == list2
  }

  const sorted1 = [ ...list1 ].sort()
  const sorted2 = [ ...list2 ].sort()
  return isEqual(sorted1, sorted2)
}

const isSameValue = (val1: PermTreeModal, val2: PermTreeModal) => {
  // return isSameList(val1.pages, val2.pages) &&
  //   isSameList(val1.perms, val2.perms)
}

// 标准化树，将 children key 更改为 children
const normalizeTree = (nodes: Page[]): Page[] => {
  const list = nodes.filter(it => it != null).map(it => {
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

  inValue = {} as PermTreeModal

  get treeData() {
    const menu = this.inValue.menu
    const perms = this.inValue.perms
    const tree = toTreeData(menu ? [ menu ] : [], perms)
    return tree
  }

  @Watch('value', { deep: true, immediate: true })
  watchValue(value: PermTreeModal) {
    const [ menu ] = normalizeTree([ value.menu ])
    this.inValue = {
      menu,
      perms: [ ...(value.perms || []) ],
    }
    // this.inValue = {
    //   // 有的情况下，pages 是 string[]，这里进行转换，使组件更健壮一些
    //   pages: (value.pages as any[] || []).map(it => parseInt(it, 10)),
    //   perms: [ ...(value.perms || []) ],
    // }
  }

  @Watch('inValue', { deep: true })
  watchInValue(value: PermTreeModal) {
    // if (!isSameValue(value, this.value)) {
    //   this.$emit('input', value)
    // }
  }

  onSelChange() {
    // const tree = this.$refs.tree as any
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
