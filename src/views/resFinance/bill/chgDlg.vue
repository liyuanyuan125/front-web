<template>
  <Modal
    v-model='showDlg'
    :transfer='true'
    :width='420'
    :title="'审核账单'"
    @on-cancel="cancel" >
    <Form ref="dataForm" :model="dataForm" label-position="left"  :label-width="50">
      <!-- <FormItem label="审核意见" prop="agree">
        <RadioGroup v-model="dataForm.agree" >
          <Radio v-for="it in statuslist" :key="it.key" :value="it.value" :label="it.key">{{it.text}}</Radio>
        </RadioGroup>
      </FormItem> -->
      <FormItem label="备注" prop="remark">
        <Input  type='textarea' v-model="dataForm.remark"></Input>
      </FormItem>
    </Form>
    <div slot="footer" class="dialog-footer">
      <Button @click="cancel">取消</Button>
      <Button type="primary" @click="dataFormSubmit()">确定</Button>
    </div>
  </Modal>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop } from 'vue-property-decorator'
import { warning , success, toast , info } from '@/ui/modal'
import moment from 'moment'
import { queryList , approval } from '@/api/bill'
import ViewBase from '@/util/ViewBase'
const timeFormat = 'YYYY-MM-DD'
const dataForm = {
  agree: true,
  remark: '',
}

@Component
export default class ComponentMain extends ViewBase {

  // loading = false
  showDlg = false
  id: any = 0
  ids: any = []

  statuslist: any = [
    {
      key: 1,
      text: '审核通过',
      value: '是'
    },
    {
      key: 2,
      text: '审核拒绝',
      value: '否'
    }
  ]

  dataForm: any = { ...dataForm }

  init(id: any , ids: any) {
    this.showDlg = true
    this.id = id || 0
    this.ids = ids
    ; (this.$refs.dataForm as any).resetFields()
  }

  cancel() {
    this.showDlg = false
    ; (this.$refs.dataForm as any).resetFields()
  }

  // 表单提交
  async dataFormSubmit() {
    try {
      // console.log({...this.dataForm , ids: this.ids})
      const res =  await approval ({...this.dataForm , ids: this.ids})
      toast('操作成功')
      this.showDlg = false
      this.$emit('done' )
      ; (this.$refs.dataForm as any).resetFields()
    } catch (ex) {
      this.handleError(ex)
      this.showDlg = false
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .ivu-input {
  border: 1px solid #ccc !important;
}
/deep/ textarea {
  min-height: 100px;
  max-height: 100px;
}
</style>
