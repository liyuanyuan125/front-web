<template>
  <div class="page home-bg">
    <Form :model="form" ref="dataform" label-position="left" :rules="rule" :label-width="100" class="edit-input forms">
      <PreceptHead />
      <h3 class="layout-title">投放影片</h3>
      <div class="item-top">
        优先投放 3 部
      </div>
      <!-- <div class="item-top" v-show="movieType == 1">
        <ul class="film-list" v-if="cinemaDetail.length > 0">
          <li v-for="(it, index) in cinemaDetail" :key="it.id"
            :class="['film-item']">
            <div :class="['film-cover-box']">
              <b :class="`img-rank${index + 1}`"></b>
              <img :src="it.mainPicUrl" class="film-cover">
              <div class="film-date">上映时间：{{formatDate(it.openTime)}}</div>
            </div>
            <h4 class="film-name">{{it.name}}</h4>
            <div class="film-tags"><p class="cinema-type">
              <span>{{it.type.join('/')}}</span></p>
            </div>
          </li>
        </ul>
      </div> -->
      

      <h3 class="layout-title">覆盖影院</h3>
      <div class="item-top">
        影院总数
      </div>
      <div>
        <div class="cinema-left"></div>
        <div class="cinema-right"></div>
      </div>
      <div class="btn-center">
        <Button type="primary" class="button-ok" @click="next('dataform')">确认导出方案</Button>
        <Button type="default" class="button-ok default-but" @click="back('dataform')">导出投放方案</Button>
        <Button type="default" class="button-ok default-but" @click="back('dataform')">联系商务</Button>
        <Button type="default" class="button-ok default-but" @click="back('dataform')">返回上一步</Button>
      </div>
    </Form>  
  </div>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import PreceptHead from './precepthead.vue'

@Component({
  components: {
    PreceptHead
  }
})
export default class App extends ViewBase {
  form: any = {
    name: ''
  }
  get rule() {
    return {}
  }

  async next(dataform: any) {
    this.$emit('input', 3)
    try {
      const volid = await (this.$refs[dataform] as any).validate()
      if (volid) {
        this.$emit('input', 1)
      }
    } catch (ex) {
      this.handleError(ex)
    }
  }

  back(dataform: any) {
    this.$emit('input', 1)
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
.item-top {
  margin-left: 30px;
  font-size: 14px;
  color: #26344b;
}
.hint {
  position: absolute;
  left: 105px;
  top: 14px;
}
.button-ok {
  width: 200px;
  margin-right: 16px;
}
.btn-center {
  margin: 40px 0 30px;
  text-align: center;
}
.default-but {
  border: 1px solid #dcdee2;
  .button-style(#515a6e, rgba(236, 245, 255, 1));
}
.form-item-first:first-child {
  margin-bottom: 20px;
}

</style>

