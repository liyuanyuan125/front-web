<template>
  <Modal
    v-model='showDlg'
    :transfer='true'
    :width='420'
    :title="'监播拒绝原因'"
    @on-cancel="cancel" >
    <ul>
        <li v-for="it in rowlist" :key='it.key'>{{it.name}}</li>
    </ul>
    <div slot="footer" class="dialog-footer">
      <Button @click="cancel">取消</Button>
      <Button type="primary" @click="dataFormSubmit">确定</Button>
    </div>
  </Modal>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop } from 'vue-property-decorator'
import { warning , success, toast } from '@/ui/modal'
import moment from 'moment'
import ViewBase from '@/util/ViewBase'
const timeFormat = 'YYYY-MM-DD'
import { findIndex } from 'lodash'

const getstatus = (key: any, list: any[]) => {
    const i: any = findIndex(list, (it: any) => {
        return key == it.key
    })
    const res: string = (!list[i].text || list[i].text == '') ? '-' : list[i].text
    return res
}

@Component
export default class ComponentMain extends ViewBase {

  loading = false
  showDlg = false
  id = 0

  rowlist: any = []
  fixRefusesList: any = []



  init(row: any , fixRefusesList: any) {
    this.showDlg = true
    this.rowlist = (row.fixRefuses || []).map((it: any) => {
        return {
            ...it,
            key: it,
            name: getstatus( it , fixRefusesList)
        }
    })
    this.rowlist.forEach((it: any) => {
      if (it.key == '9') {
          it.name = it.name + ':' + (row.refuseReason == null ? '暂无原因' : row.refuseReason)
      }
      if (it.key == '10') {
          it.name = it.name + ':' + (row.missTag == null ? '暂无原因' : row.missTag)
      }
    })
  }

  cancel() {
    this.showDlg = false
  }

  // 表单提交
  async dataFormSubmit(dataForms: any) {
    this.showDlg = false
  }

}
</script>

<style lang="less" scoped>
</style>
