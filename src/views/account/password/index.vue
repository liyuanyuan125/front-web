<template>
  <div class="page home-bg">
    <Form :model="from" class="edit-input from" :label-width="100">
      <FormItem label="账号类型">
        <Input v-model="from.input"></Input>
      </FormItem>
      <FormItem label="公司名称">
        <Input v-model="from.input"></Input>
      </FormItem>
      <FormItem label="资质图片">
        <Input v-model="from.input"></Input>
      </FormItem>
    </Form>
    <div class="btnCenter sumbit-button">
      <button class="button-ok">修改</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class Main extends ViewBase {
  from = {
    input: 'xxxxxxx'
  }
  async mounted() {}
}
</script>

<style lang="less" scoped>
.from {
  padding: 30px 0 0 30px;
}
</style>
