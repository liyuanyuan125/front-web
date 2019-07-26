<template>
  <Modal
    v-model='showDlg'
    :transfer='true'
    :width='420'
    :title="'审核账单'"
    @on-cancel="cancel" >
    <Form ref="dataForm" :model="dataForm" label-position="left"  :label-width="100">
      <FormItem label="审核意见" prop="status">
        <RadioGroup v-model="dataForm.status" >
          <Radio v-for="it in statuslist" :key="it.key" :value="it.key" :label="it.key">{{it.text}}</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="备注" prop="remark">
        <Input style="width:100px" type='textarea' v-model="dataForm.remark"></Input>
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
  orderItemId: 0,
  confirmPrice: '',
  confirmRemark: '',
}

@Component
export default class ComponentMain extends ViewBase {

  // loading = false
  showDlg = false
  id = 0

  statuslist: any = [
    {
      key: 1,
      text: '审核通过'
    },
    {
      key: 2,
      text: '审核拒绝'
    }
  ]

  dataForm: any = { ...dataForm }

  // init(id: number , price: any , mark: any) {
  //   this.showDlg = true
  //   this.dataForm.orderItemId = id
  //   this.dataForm.confirmPrice = price
  //   this.dataForm.confirmRemark = mark
  //   this.id = id || 0
  //   ; (this.$refs.dataForm as any).resetFields()
  //   if (this.id) {
  //       // console.log(this.id)
  //   }
  // }

  // cancel() {
  //   // this.dataForm.beginDate
  //   this.showDlg = false
  //   ; (this.$refs.dataForm as any).resetFields()
  // }

  // // 表单提交
  // async dataFormSubmit() {
  //   try {
  //     const res =  await edit (this.dataForm)
  //     toast('操作成功')
  //     this.showDlg = false
  //     this.$emit('done' )
  //     ; (this.$refs.dataForm as any).resetFields()
  //   } catch (ex) {
  //     this.handleError(ex)
  //     this.showDlg = false
  //   }
  // }

  // async mounted() {
  //   try {
  //     const relist = await queryList({orderStatus : 9})
  //     this.relist = relist.data.items
  //   } catch (ex) {
  //     this.handleError(ex)
  //   }
  // }

}
</script>

<style lang="less" scoped>
</style>
