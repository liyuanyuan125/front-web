<template>
  <div>
    <Modal
      v-model="value.visibleMess"
      class-name="vertical-center-modal"
      :title="value.title"
      width="800"
    >
      <Row class="text-rows">
        <Col :span="24">
          <p>
            <label>公司信息</label>广告放/资源方
          </p>
          <p>
            <label>账号类型</label>xxxxxxxxx
          </p>
          <p>
            <label>资质类型</label>xxxxxxxxx
          </p>
          <p class="flex-box">
            <label>资质图片</label>
            <em>
              <img :src="item" v-for=" item in list.img" width="150">
            </em>
          </p>
        </Col>
      </Row>
    </Modal>
  </div>
</template>
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class Change extends ViewBase {
  @Prop({ type: Object }) value!: any
  list = {}
  mounted() {
    this.list = Object.assign(this.value.changelist)
  }
  closeDlg() {
    this.value.visibleMess = false
  }
}
</script>
<style lang="less" scoped>
/deep/ .ivu-modal-header {
  border-bottom: 0;
  padding: 10px 13px;
  background: #f9f9f9;
  font-weight: none;
  .ivu-modal-header-inner {
    font-weight: none;
  }
}
.ivu-modal-footer {
  border-top: 0;
}
</style>

