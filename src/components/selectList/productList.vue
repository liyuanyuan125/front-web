<template>
    <!-- 产品列表 -->
    <Select v-model="inner" clearable filterable placeholder="产品名称" class="select-wid" >
        <Option v-for="item in productsListSel" :key="item.id" :value="item.id">{{item.name}}</Option>
    </Select>
</template>

<script lang='ts'>
import {Component, Prop, Watch} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { productsList } from '@/api/popFilm'

@Component
export default class Main extends ViewBase {
    @Prop({type: Number, default: 0}) value?: number
    @Prop({type: Number, default: 0 }) brandld?: any

    inner = this.value
    productsListSel = []

    mounted() {
        this.productList()
    }

    queryProductName() {
        const ary: any = this.productsListSel.filter( (item: any) => item.id == this.inner) || []
        const brandname = ary.length > 0 ? ary[0].name : ''
        return brandname
    }

    async productList() {
        try {
            const { data: {items}} = await productsList({
                brandId: this.brandld,
                pageIndex: 1,
                pageSize: 400
            })
            this.productsListSel = items
        } catch (ex) {
            this.handleError(ex)
        }
    }

    @Watch('value')
    watchValue(value: number) {
        this.inner = value
    }
    @Watch('inner')
    watchInner(value: number) {
       this.$emit('input', value)
    }
}

</script>
<style lang='less' scoped>
</style>