<template>
    <div>
        <header-com></header-com>
        <div class="flex">
            <p><Icon type="ios-checkmark-circle-outline" size="48" />&nbsp;注册完成</p>
            <p><font>3s</font>后将自动返回首页</p>
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Watch} from 'vue-property-decorator'
import View from '@/util/View'
import headerCom from '../../components/header/head.vue'

@Component({
    components: {
        headerCom
    }
})
export default class Main extends View {
}
</script>
<style lang="less" scoped>
.flex{
    color: #222222;
    font-size:24px;
    text-align: center;
    width: 100%;
    position:absolute;
    top:40%;
    &>p:last-child{
        font-size:14px;
        margin-top:40px;
    }

}
</style>


