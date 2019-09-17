<template>
    <div class="create-title-text" >
        <p class="text-content">平台映前广告计费标准最小时长单位为15s，为节省您的广告投放成本，请准确设置广告片时长规格；时长规格不得低于广告片实际时长 广告片通过审核后，
            平台会统一为您进行转码为影院可播放的格式；<a @click="visible = true">点击查看数字转制费收费标准</a></p>
        <slot name="detailStatus"> </slot>
        <Modal v-model="visible" title="数字转制费收取标准" width="500px">
            <Table :columns="column" :data="dataList" disabled-hover>
                <template slot="begin" slot-scope="{row}">
                    <span>{{row.begin || 0}}s ~ {{row.end || 0}}s</span>
                </template>

                <template slot="price" slot-scope="{row: {promotionPrice, price}}">
                    <div v-if="promotionPrice">
                        <span>{{promotionPrice}}</span>&nbsp;&nbsp;&nbsp;
                        <del v-if="price" class="col_58">{{price}}</del>
                    </div>
                    <span v-else>{{price}}</span>
                </template>
            </Table>
            <footer slot="footer" class="modal-footer">
                <Button @click="visible = false">关闭</Button>
            </footer>
        </Modal>
    </div>
</template>

<script lang='ts'>
import {Component} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { transFeeList } from '@/api/popFilm'
import {formatNumber} from '@/util/validateRules'

@Component
export default class Main extends ViewBase {
    visible = false

    column = [
      { title: '规格时长（秒）', slot: 'begin', align: 'center' },
      { title: '收取费用（元）', slot: 'price', align: 'center' },
    ]

    dataList = []

    async mounted() {
        const { data: {items} } = await transFeeList()
        this.dataList = (items || []).map((it: any) => {
            return {
                ...it,
                price: formatNumber(it.price),
                promotionPrice: formatNumber(it.promotionPrice)
            }
        })
    }

}

</script>
<style lang='less' scoped>
@import url('../com.less');
.col_58 {
  color: #a8a8a8;
}
/deep/ .ivu-modal-footer {
  text-align: center;
  .ivu-btn {
    border-radius: 5px;
  }
}
</style>