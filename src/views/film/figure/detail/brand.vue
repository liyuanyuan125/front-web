<template>
  <div class="detail-brand com-modal">
      <div class="com-modal-title brand-list">
        <span>合作品牌({{list.length}})</span>
        <em v-for="item in typeList" :key="item.key" >{{item.text}}({{item.num}})</em>
      </div>
      <div class="video-list">
          <div class="list-col" v-for="item in list" :key ="item.id">
              <h3 class="flex-box"><img :src="item.logo" width="30" height="30" /><span>{{item.name}}</span></h3>
              <img :src="item.logo" class="top-img"/>
              <em class="video-long" v-for="it in categoryList" :key="it.key" v-if="it.key == item.tradeCode">{{it.text}}</em>
              <h4 :title="item.description">{{item.description}}</h4> 
          </div>
      </div>
  </div>
</template>

<script lang='ts'>
import {Component, Prop} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import {personBrands } from '@/api/filmPersonDetail'


@Component
export default class Brand extends ViewBase {
  @Prop({ type: Number, default: 0 }) id!: number
  list: any[] = []
  categoryList = []
  // 品牌类型分组
  typeList: any[] = []

  mounted() {
    this.tableList()
  }

  async tableList() {
    const id = this.id // this.id 107028
    try {
      const { data: {items, trades} } = await personBrands(id)
       this.list = items || []
       this.categoryList = trades

       // 品牌类型统计list
        const obj: any = {}
        const aryList: any[] = []
        const newArray = this.list.filter((item: any) => {
        const catList = trades.filter((code: any) => {
            if (code.key == item.tradeCode) {
              // 假如code.key 在里面已经存在，不需要添加，num需要增加1
              const ant = aryList.findIndex((a: any, b: any) => a.key == code.key)
              if (ant != -1) {
                aryList[ant].num++
                return
              }
              aryList.push({
                key: code.key,
                text: code.text,
                num: 1
              })
            }
          })
        })
      this.typeList = aryList

    } catch (ex) {
      this.handleError(ex)
    }
  }
}

</script>
<style lang='less' scoped>
@import '~@/views/kol/less/common.less';
.brand-list {
  padding-left: 30px;
  em {
    font-size: 12px;
    padding-left: 14px;
  }
}
.video-list {
  display: flex;
  flex-wrap: wrap;
  border-radius: 8px;
  margin-left: -30px;
  margin-right: -30px;
  padding: 50px 50px 100px;
  .list-col {
    width: 33.3%;
    padding: 0 30px;
    margin-bottom: 30px;
    color: #fff;
    position: relative;
    h3 {
      padding-bottom: 20px;
      font-size: 18px;
      font-weight: 0;
      justify-content: center;
      img {
        border-radius: 50%;
        margin-right: 10px;
      }
    }
    h4 {
      padding: 0 10px;
      font-size: 17px;
      line-height: 28px;
      text-align: justify;
      text-justify: inter-word;
      font-weight: 0;
    }
    .video-img {
      position: relative;
    }
    .top-img {
      width: 100%;
      height: 190px;
      border-radius: 8px;
    }
    .video-long {
      position: absolute;
      right: 35px;
      bottom: 10px;
      padding: 0 10px;
      text-align: center;
      height: 26px;
      line-height: 26px;
      background: rgba(0, 32, 45, .6);
      border-radius: 4px;
      border: 1px solid rgba(103, 137, 148, 1);
    }
  }
}
</style>