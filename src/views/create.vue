<template>
    <div>
        <com-header></com-header>
        <router-view />
        <com-footer></com-footer>
    </div>
</template>
<script lang="ts">
 import { Component } from 'vue-property-decorator'
 import ViewBase from '@/util/ViewBase'
 import ComHeader from '@/views/header/head.vue'
 import ComFooter from '@/views/header/footer.vue'
 
 @Component({
     components: {
         ComHeader,
         ComFooter
     }
 })
 export default class Home extends ViewBase {
 }
</script>
<style lang="less" scoped>
</style>

