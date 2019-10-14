<template>
  <div class="detail-brand com-modal">
    <div class="com-modal-title brand-list">
        <span>合作品牌({{list.length}})</span>
        <em v-for="item in typeList" :key="item.key" >{{item.text}}({{item.num}})</em>
      </div>
      <div class="video-list">
          <div class="list-col" v-for="item in list" :key ="item.id">
              <h3 class="flex-box"><img :src="item.logo" width="30" height="30" /><span>{{item.name}}</span></h3>
              <div class="base-img">
                <img :src="item.logo" class="top-img"/>
              </div>
              <em class="video-long" v-for="it in trades" :key="it.key" v-if="it.key == item.tradeCode">{{it.text}}</em>
              <h4 :title="item.description">{{item.description}}</h4> 
          </div>
      </div>
      <div class="no-data-list" v-if="list.length == 0">暂无数据</div>
  </div>
</template>

<script lang='ts'>
import {Component, Prop} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { forEach } from 'lodash'

@Component
export default class Main extends ViewBase {
  @Prop({ type: Function, required: true }) fetch!: any
  @Prop({ type: Number, required: true}) id!: number

  list: any = [] // items
  typeList: any[] = [] // 集合
  trades: any = [] // code枚举

  async mounted() {
    const {items, trades} = await this.fetch(this.id)
    this.list = items || []
    this.trades = trades || []

     // 合并出现次数
    const typeList: any[] = []
    forEach((items || []), (it: any) => {
      forEach((trades || []), (code: any) => {
        if (it.tradeCode == code.key) {
          // 假如typeList中的key已经存在， num则需要++
          const ant = typeList.findIndex((a: any) => a.key == code.key)
          if (ant != -1) {
            typeList[ant].num++
            return
          }
          typeList.push({
            text: code.text,
            key: code.key,
            num: 1
          })
        }
      })
    })

    this.typeList = typeList
  }
}

</script>
<style lang='less' scoped>
@import '~@/views/kol/less/common.less';

.base-img {
  width: 100%;
  background: #fff;
  text-align: center;
}
.no-data-list {
  font-size: 15px;
  color: #fff;
  text-align: center;
}
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
      max-width: 100%;
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