<template>
  <div class="component">
    <Table :columns="columns" :data="inValue" border disabled-hover size="small"/>
    <div class="act-bar">
      <a @click="onAdd" v-if="!type">添加关联影片</a>
    </div>
    <!-- <AddCFilmModel ref="addCinemaModel" :cinemaend = "incinematype" :addData="inValue" @done="columndata" /> -->
  </div>
</template>

<script lang="tsx">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
const makeMap = (list: any[]) => toMap(list, 'id', 'name')

@Component ({
  components: {
    // AddCFilmModel
  }
})
export default class ComponentMain extends ViewBase {
  /**
   * 值本身，可以使用 v-model 进行双向绑定
   */
  @Prop({ type: Array, default: () => [] }) value!: any[]

  // 判断新增和添加
  @Prop() type: any

  /**
   * 分润单位列表
   */

  /**
   * 是否为影院
   */
  @Prop() incinematype: any

  inValue: any[] = this.value
  addShow =  false
  get columns() {
    const column = [
      {
        title: '影片',
        align: 'center',
        key: 'shortName',
        render: (hh: any, { row: { cinemaName } }: any) => {
          /* tslint:disable */
          const h = jsxReactToVue(hh)
          return <a>{cinemaName}</a>
          /* tslint:enable */
        }
      },
      {
        title: '影片',
        align: 'center',
        key: 'shortName',
        render: (hh: any, { row: { cinemaName } }: any) => {
          /* tslint:disable */
          const h = jsxReactToVue(hh)
          return <a>{cinemaName}</a>
          /* tslint:enable */
        }
      },
      {
        title: '影片',
        align: 'center',
        key: 'shortName',
        render: (hh: any, { row: { cinemaName } }: any) => {
          /* tslint:disable */
          const h = jsxReactToVue(hh)
          return <a>{cinemaName}</a>
          /* tslint:enable */
        }
      },
      {
        title: '影片',
        align: 'center',
        key: 'shortName',
        render: (hh: any, { row: { id } }: any) => {
          /* tslint:disable */
          const h = jsxReactToVue(hh)
          return <a on-click={this.onDel.bind(this, id)}>删除</a>
          /* tslint:enable */
        }
      }
    ]
    return column
  }

  onAdd() {
    this.addShow = true
    this.$nextTick(() => {
      (this.$refs.addCinemaModel as any).init(this.inValue)
    })
  }

  columndata(val: any) {
    this.inValue = val
  }

  onSet(id: number) {
  }

  async onDel(id: number) {
    await confirm('确定要删除该项吗？')
    const index = this.inValue.findIndex(it => it.id == id)
    this.inValue.splice(index, 1)
  }

  @Watch('value')
  watchValue(val: any[]) {
    this.inValue = val
  }

  @Watch('inValue', { deep: true })
  watchInValue(val: any[]) {
    this.$emit('input', val)
  }
}
</script>

<style lang="less" scoped>
.component {
  padding: 9px 8px 2px 8px;
  background-color: #eee;
  border-radius: 4px;
}
</style>
