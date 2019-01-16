<template>
  <div>
    <Modal
      v-model="value.visibleMess"
      :title="value.title"
      width="800"
    >
      <Row class="text-rows">
        <Col :span="24">
          <p>
            <label>公司名称</label>
            {{list.companyName}}
          </p>
          <p>
            <label>账号类型</label>
            {{accountType}}
          </p>
          <p>
            <label>资质类型</label>
            {{list.qualificationType}}
          </p>
          <p>
            <label>资质编号</label>
            {{list.qualificationCode}}
          </p>
          <p class="flex-box">
            <label>资质图片</label>
            <em>
              <img :src="item" v-for=" item in list.qualificationImageList" width="150">
            </em>
          </p>
        </Col>
      </Row>
      <div class="footer btnCenter">
        <Button type="primary" class="button-ok" @click="value.visibleMess = false">关闭</Button>
      </div>
    </Modal>
  </div>
</template>
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class Change extends ViewBase {
  @Prop({ type: Object }) value!: any
  list: any = {}
  accountType = ''
  mounted() {
    this.list = Object.assign(this.value.changelist)
    const account: any = this.list.companyTypeList
    this.accountType = account.length > 1 ? `${account[0]} / ${account[1]}` : account.toString()
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
}
/deep/ .ivu-modal-footer {
  display: none;
}
</style>

