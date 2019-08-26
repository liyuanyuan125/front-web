<template>
  <Modal v-model="model" :width="width" v-bind="$attrs">
    <main class="modal-main">
      <slot></slot>
    </main>
    <div slot="footer">
      <Button :type="yesType" size="large" @click="$emit('yes')">{{yesText}}</Button>
      <Button :type="noType" size="large" @click="$emit('no')">{{noText}}</Button>
      <Button :type="cancelType" size="large" @click="onCancel">{{cancelText}}</Button>
    </div>
  </Modal>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { ButtonType } from '@/util/types'

@Component
export default class TripleDialog extends ViewBase {
  /** model，支持双向绑定 */
  @Prop({ type: Boolean, default: false }) value!: boolean

  /** 对话框宽度，默认 360 */
  @Prop({ type: Number, default: 360 }) width!: number

  /** 肯定按钮的文字，默认：是 */
  @Prop({ type: String, default: '是' }) yesText!: string

  /** 肯定按钮的类型，默认：primary */
  @Prop({ type: String, default: 'success' }) yesType!: ButtonType

  /** 否定按钮的文字，默认：否 */
  @Prop({ type: String, default: '否' }) noText!: string

  /** 否定按钮的类型，默认：default */
  @Prop({ type: String, default: 'info' }) noType!: ButtonType

  /** 取消按钮的文字，默认：取消 */
  @Prop({ type: String, default: '取消' }) cancelText!: string

  /** 取消按钮的类型，默认：text */
  @Prop({ type: String, default: 'default' }) cancelType!: ButtonType

  model = this.value

  onCancel() {
    this.model = false
  }

  @Watch('value')
  watchValue(value: boolean) {
    this.model = value
  }

  @Watch('model')
  watchModel(value: boolean) {
    this.$emit('input', value)
    // 关闭当做 cancel
    value || this.$emit('cancel')
  }
}
</script>

<style lang="less" scoped>
.modal-main {
  position: relative;
  padding: 18px 28px 0 0;
}
/deep/ .ivu-modal-footer {
  padding-bottom: 20px;
  .ivu-btn {
    min-width: 66px;
  }
}
</style>
