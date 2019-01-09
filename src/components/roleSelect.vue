<template>
  <div>
    <Option :value="item.id" :key="item.id" v-for="item in list">{{item.name}}</Option>
  </div>
</template>
<script>
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
@Component
export default class Role extends ViewBase {
  @Prop({type: Array}) list
}
</script>
