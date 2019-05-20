<template>
  <Modal v-model='showDlg'
  title="订单确认"
  :transfer='false'
  :width='770'
  :mask-closable='false'
  :styles="{top: '10px'}"
  @on-cancel="cancel()">
    <div class="detail-box">
      <Row>
        <Row>
          <Col style="margin-top: 20px" span='5'>希望推广的影片</Col>
          <Col style="margin-top: 20px" :span="10">
            <Dropdown @on-click="drop" trigger="click">
              <a href="javascript:void(0)">
                {{showDlg}}
                <Icon type="ios-arrow-down"></Icon>
              </a>
              <DropdownMenu slot="list">
                <DropdownItem v-for="(it, index) in data" :key="index" name="1">{{it.text}}</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </Col>
        </Row>
        <Row>
          <Col span='4'>投放资源数量</Col>
        </Row>
      </Row>
      <div>
        <ul>

        </ul>
      </div>
      <Row>
        <Col span='3'>期望发布时间</Col>
        <Col span='3'>合计费用</Col>
      </Row>
    </div>
    <div slot="footer" class="foot">
      <Button class="foot-button" type="primary" @click="open">确定订单</Button>
    </div>
  </Modal>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { fileList, queryList } from '@/api/shopping'

@Component
export default class DlgEditCinema extends ViewBase {
  showDlg = false
  id = 0
  data: any = []
  dataName = ''
  async init(id: number) {
    this.id = id
    this.showDlg = true
  }

  created() {
    this.seach()
  }

  async seach() {
    try {
      const { data } = await fileList({})
      this.data = data.items || []
      this.dataName = this.data.filter((it: any) => it.key == this.id)[0].text
    } catch (ex) {
      this.handleError(ex)
    }
  }

  open() {

  }

  drop(name: any) {
  }

  cancel() {
    this.showDlg = false
  }

}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
.detail-box {
  font-size: 14px;
  padding: 0 30px;
  /deep/ .ivu-col {
    margin-top: 30px;
  }
}
</style>
