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
import { isEqual, Dictionary, uniq, intersection } from 'lodash'
import { toMap } from '@/fn/array'
import { Action, Page, PermTreeModal, TreeItem } from './types'
import PermTreeItem from './PermTreeItem.vue'

const toTreeData = (
  nodes: Page[],
  allPerms: string[],
  handler: (perms: string[]) => any,
  readonly: boolean
) => {
  const allPermMap = toMap(allPerms)
  return walkTree(nodes, {
    onEachBefore(node, parentNodes) {
      const level = parentNodes.length
      const isLeaf = (node.subPages || []).length == 0

      const actions = node.actions || []

      let checked = false
      let indeterminate = false
      let actionList = [] as Action[]

      if (isLeaf && actions.length > 0) {
        actionList = actions.map(it => ({
          ...it,
          code: `${node.key}:${it.code}`,
        }))
        const hasPerm = actionList.some(it => it.code in allPermMap)
        const allPerm = actionList.every(it => it.code in allPermMap)
        checked = allPerm
        indeterminate = !allPerm && hasPerm
      }

      const page: any = {
        title: node.name,
        expand: false,
        checked,
        indeterminate,
        extraData: {
          name: node.name,
          key: node.key,
          actions: actionList,
          isLeaf,
          level,
          allPerms,
          tip: node.tip || ''
        },
        render: (hh: any, { data }: any) => {
          /* tslint:disable */
          const h = jsxReactToVue(hh)
          return <PermTreeItem v-model={data.extraData}
            on-change={handler} v-readonly={readonly}/>
          /* tslint:enable */
        }
      }

      return page
    },

    onEachAfter(page, parentNodes) {
      const hasChecked = page.checked || page.indeterminate
      hasChecked && parentNodes.forEach(parent => {
        parent.indeterminate = true
        parent.expand = true
      })
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

const listNotEmpty = (list: any[] | null) => (list || []).length > 0

// 标准化树，将 children key 更改为 children
const normalizeTree = (nodes: Page[]): Page[] => {
  const list = nodes
    .filter(it => it != null)
    // 过滤掉 subPages 与 actions 都为空的节点，这些节点不需要编辑
    .filter(it => listNotEmpty(it.subPages) || listNotEmpty(it.actions))
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

const permListFromItems = (items: TreeItem[]) => {
  const result = items.reduce((list: string[], it) => {
    const { actions } = it.extraData
    const subList = (actions || []).map(act => act.code)
    return list.concat(subList)
  }, [])
  return result
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

  inner = {} as PermTreeModal

  oldNodes: any[] | null = null

  get treeData() {
    const menu = this.inner.menu
    const perms = this.inner.perms
    const tree = toTreeData(menu ? [menu] : [], perms,
      this.onPermsChange.bind(this), this.readonly)
    return tree
  }

  onPermsChange(perms: string[]) {
    this.inner.perms = perms
  }

  @Watch('value', { deep: true, immediate: true })
  watchValue(value: PermTreeModal) {
    const [ menu ] = normalizeTree([value.menu])
    this.inner = {
      menu,
      perms: [...(value.perms || [])]
    }
  }

  @Watch('inner', { deep: true })
  watchInner(value: PermTreeModal) {
    if (!isSameValue(value, this.value)) {
      this.$emit('input', value)
    }
  }

  onSelChange() {
    const tree = this.$refs.tree as any

    // 获取全部选择或半选择的节点
    const items = tree.getCheckedAndIndeterminateNodes() as TreeItem[]
    // 过滤掉非叶子节点
    const pageItems = items.filter(it => it.extraData.isLeaf)

    // 全选节点 -> 全选 perms，半选节点 -> 半选 perms
    const checkedItems = pageItems.filter(it => it.checked)
    const halfItems = pageItems.filter(it => !it.checked)
    const checkedPerms = permListFromItems(checkedItems)
    const halfPerms = permListFromItems(halfItems)

    // 取当前 perms 与半选 perms 的交集
    const keepPerms = intersection(halfPerms, this.inner.perms)

    // 将全选 perms 与上一步产生的交集合同，去重，就是最终的 perms
    const perms = uniq(checkedPerms.concat(keepPerms))
    this.inner.perms = perms
  }
}
</script>

<style lang="less" scoped>
</style>
