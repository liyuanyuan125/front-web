<template>
  <div class="detail-brand" v-if="list">
      <h3>{{list.title}}（{{list.total}}）</h3>
      <p class="tab-list"><span v-for="(item, index) in list.tab" :key="index">{{item.text}}（{{item.num}}）</span></p>
      <div class="video-list">
          <div class="list-col" v-for="item in list.items" :key ="item.id">
              <a :href="item.videoUrl" target="_blank"><img :src="item.imgUrl" class="top-img" /></a>
              <h3><em>{{item.tag}}</em><span>{{item.title}}</span></h3>
              <h4 :title="item.description">{{item.description}}</h4> 
          </div>
          <!-- <Row type="flex" justify="space-between">
              <Col span="7" class="list-col" v-for="item in list.items" :key ="item.id">
                <a :href="item.videoUrl" target="_blank"><img :src="item.imgUrl" class="top-img" /></a>
                <h3><em>{{item.tag}}</em><span>{{item.title}}</span></h3>
                <h4 :title="item.description">{{item.description}}</h4>
              </Col>
          </Row> -->
      </div>
  </div>
</template>

<script lang='ts'>
import {Component, Prop} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
@Component
export default class Main extends ViewBase {
    @Prop({ type: Object}) value!: object
    list: any = null
    mounted() {
        this.list = this.value
    }
}

</script>
<style lang='less' scoped>
@import '~@/site/lib.less';
h2,h3,h4 {
  font-weight: normal;
}
.detail-brand {
  padding: 30px 30px 40px;
  .tab-list {
    padding: 15px 0;
  }
}
.video-list {
  margin-left: -10px;
  margin-right: -10px;
  .list-col {
    width: 33.3%;
    padding: 0 10px;
    float: left;
    margin-bottom: 20px;
    h3 {
      padding: 0 10px;
      font-size: 14px;
      em {
        color: @c-res-btn;
        padding-right: 10px;
      }
      span {
        font-size: 15px;
        color: @c-button;
      }
    }
    h4 {
      padding: 0 10px;
      font-size: 15px;
      line-height: 26px;
    }
    .top-img {
      width: 100%;
      height: 270px;
      border: solid 1px #ededed;
    }
  }
}
</style>