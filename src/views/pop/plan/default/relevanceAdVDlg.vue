<template>
  <div>
    <Modal v-model="value.visible" :title="value.title" width="800">
      <Form ref="forms" :model="form" :rules="rules" class="edit-input" :label-width="100">
        <FormItem label="已关联广告片" class="item-top">
          <div class="relvanMess" v-if="value.item">
            <p>
              <span>广告片ID</span>
              <em>{{value.item.id}}</em>
            </p>
            <p>
              <span>广告片名称</span>
              <em>{{value.item.name}}</em>
            </p>
          </div>
        </FormItem>
        <FormItem label="关联广告片">
          <Select v-model="form.voidID" clearable filterable>
            <Option v-for="item in releList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
      </Form>
      <div class="footer btnCenter footer-btn">
        <Button class="button-cancel" @click="value.visible = false">取消</Button>
        <Button type="primary" class="button-ok" @click="handleSumbit">确认</Button>
      </div>
    </Modal>
  </div>
</template>
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { queryRelevanceList, relevanceVideo } from '@/api/plan'

@Component
export default class Relevan extends ViewBase {
  @Prop({ type: Object }) value: any

  releList = []
  form = {
    voidID: null
  }
  rules = {
    voidID: [
      {
        require: true,
        trigger: 'change',
        validator(rule: any, value: string, callback: any) {
          !value ? callback(new Error('请选择关联广告片')) : callback()
        }
      }
    ]
  }

  mounted() {
    this.queryReleList()
  }
  async handleSumbit() {
    try {
      await relevanceVideo({
        id: this.value.item.id,
        videoId: this.form.voidID
      })
      this.$router.push({name: 'pop-planlist'})
    } catch (ex) {
      this.handleError(ex.msg)
    }
  }

  async queryReleList() {
    try {
      const {
        data: { items }
      } = await queryRelevanceList({
        status: 4,
        pageIndex: 1,
        pageSize: 99999
      })
      this.releList = items
    } catch (ex) {
      this.handleError(ex.msg)
    }
  }
}
</script>
<style lang="less" scoped>
.footer-btn {
  margin: 70px 0 30px;
}
.relvanMess {
  background: #f9f9f9;
  padding: 20px 30px;
  margin-top: 12px;
  p {
    font-size: 14px;
    color: #272727;
    span {
      display: inline-block;
      width: 120px;
    }
  }
}
/deep/ .ivu-select-input {
  height: 40px;
  line-height: 40px;
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


