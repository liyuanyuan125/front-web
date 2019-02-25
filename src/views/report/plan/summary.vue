<template>
    <div>
        <p>汇总</p>
        <p>{{value.beginDate}}</p>
         <p>{{value.id}}</p>
    </div>
</template>
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class Main extends ViewBase {
    @Prop({type: Object}) value: any

    mounted() {
        // console.log(this.value)
    }
}
</script>