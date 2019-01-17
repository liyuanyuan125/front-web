<template>
  <div class="home-bg">
    <h2 class="layout-nav-title">收益账单</h2>
    <Form :model="form" :label-width="100" class="edit-input form">
      <Row class="item-top">
        <Col :span="10">
          <FormItem label="收益日期">
            <DatePicker
              type="daterange"
              v-model="form.dataTime"
              placement="bottom-end"
              placeholder="请选择开始日期和结束日期"
              style="width: 200px"
            ></DatePicker>
          </FormItem>
        </Col>
        <Col :span="10">
          <FormItem label="影院查询">
            <Select v-model="form.list" style="width:200px">
              <Option
                v-for="item in cityList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col :span="4">查询</Col>
      </Row>
    </Form>
  </div>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class Main extends ViewBase {
  form = {
    dataTime: [],
    list: ''
  }
  cityList = [
    {
      value: 'New York',
      label: 'New York'
    }
  ]
}
</script>
<style lang="less" scoped>
/deep/ .edit-input .ivu-form-item-content .ivu-select-selection {
  width: 200px;
}
/deep/ .ivu-input {
  width: 300px;
}
</style>

