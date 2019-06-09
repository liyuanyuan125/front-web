<template>
  <div>
    <Modal v-model="value.visible"
      :transfer='false'
      :width='560'
      :closable='false'
      :mask-closable='false'>
      <div class="title">
        <i @click="value.visible = false"></i>
        <p>关联广告片</p>
        <Form ref="forms" :model="form" style="margin-top: 30px" :rules="rules" :label-width="100">
          <FormItem label="已关联广告片" class="item-top" v-if="value.item.videoId">
            <div class="relvanMess">
              <p>
                <span>广告片ID</span>
                <em>{{value.item.videoId}}</em>
              </p>
              <p class="flex-box">
                <span>广告片名称</span>
                <em>{{value.item.videoName}}</em>
              </p>
            </div>
          </FormItem>
          <FormItem label="关联广告片" prop="voidID">
            <Select v-model="form.voidID" clearable filterable style="width:400px">
              <Option v-for="item in releList" :value="item.id" :key="item.id">{{ item.customerName }}</Option>
            </Select>
          </FormItem>
        </Form>
      </div>
      <div slot="footer" class="foot btnCenter footer-btn">
        <Button class="button-cancel foot-cancel-button" @click="value.visible = false">取消</Button>
        <Button type="primary" class="button-ok foot-button" @click="handleSumbit">确认</Button>
      </div>
    </Modal>
  </div>
</template>
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { queryRelevanceList, relevanceVideo } from '@/api/plan'
import { advertising } from '@/api/popPlan.ts'

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
        trigger: 'blur',
        validator(rule: any, value: string, callback: any) {
          !value ? callback(new Error('请选择关联广告片')) : callback()
        }
      }
    ]
  }

  async init() {
    try {
       const { data } = await advertising( {
        pageIndex: 1,
        pageSize: 200000,
        status: 4
      } )
      this.releList = data.items || []
    } catch (ex) {
      this.handleError(ex)
    }
  }

  mounted() {
    // 编辑
    if (this.value.item) {
      this.form.voidID = this.value.item.videoId
    }
    this.init()
  }
  async handleSumbit() {
    const volid = await (this.$refs.forms as any).validate()
    if (!volid) {
      return
    }

    try {
      await relevanceVideo({
        id: this.value.id,
        videoId: this.form.voidID
      })
      this.value.visible = false
      this.$emit('submitRelevance')
    } catch (ex) {
      this.handleError(ex)
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
      this.handleError(ex)
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@/site/lib.less';
/deep/ .ivu-modal-body {
  padding: 0;
}
/deep/ .ivu-select-selection,
/deep/ .ivu-select,
/deep/ .ivu-select-input {
  background: rgba(255, 255, 255, 0.4);
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  border-radius: 5px;
  &::placeholder {
    font-size: 14px;
    color: #00202d;
  }
}
.title {
  border-radius: 5px 5px 0 0;
  text-align: center;
  margin-bottom: 30px;
  font-size: 30px;
  font-weight: 500;
  padding: 20px;
  color: #00202d;
  i {
    position: absolute;
    right: -12px;
    top: -12px;
    display: block;
    width: 27px;
    height: 27px;
    background: #fff;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid rgba(209, 216, 219, 1);
    &::before {
      display: block;
      content: "×";
      font-size: 26px;
      line-height: 24px;
      text-align: center;
    }
  }
}

@cancel-color: rgba(59, 152, 255, 1);

.foot-button-box {
  width: 196px;
  height: 50px;
  margin-right: 20px;
}
.foot {
  text-align: center;
  height: 60px;
  .foot-button {
    width: 103px;
    height: 38px;
    border-radius: 19px;
    line-height: 34px;
    font-size: 14px;
    padding: 0;
    .button-style(#fff, #00202d);
  }
  .foot-cancel-button {
    width: 103px;
    height: 38px;
    border-radius: 5px;
    line-height: 34px;
    font-size: 14px;
    padding: 0;
    margin-right: 20px;
    .button-style(#00202d, rgba(255, 255, 255, 0.6));
  }
}
</style>


