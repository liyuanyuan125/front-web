<template>
  <div>
    <Modal v-model="value.visibleMess" :title="value.title" width="800">
      <Row class="text-rows">
        <Col :span="24">
          <p v-if="companyType == 1">
            <label>公司名称</label>
            {{list.companyName}}
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
            <em class="flex-box">
              <ImagePreviewer
                v-for="(item, i) in list.qualificationImageList"
                :key="i"
                :url="item"
                class="qualification-image"
              />
            </em>
          </p>
        </Col>
      </Row>
      <div class="footer btn-center-footer">
        <Button type="primary" class="button-ok" @click="value.visibleMess = false">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ImagePreviewer from '@/components/imagePreviewer'

@Component({
  components: {
    ImagePreviewer
  }
})
export default class Change extends ViewBase {
  @Prop({ type: Object }) value!: any


  list: any = {}

  accountType = ''
  companyType = null

  mounted() {
    this.list = Object.assign(this.value.changelist)
    this.companyType = this.value.companyType
    const account: any = this.list.companyTypeList
    this.accountType =
      account.length > 1 ? `${account[0]} / ${account[1]}` : account.toString()
  }

  closeDlg() {
    this.value.visibleMess = false
  }
}
</script>

<style lang="less" scoped>
@import '~@/views/account/less/common.less';

.qualification-image {
  width: 150px;
  margin-right: 25px;
}

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

