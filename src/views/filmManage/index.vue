<template>
  <div class="film-page">
      <div class="count-title">已关联{{list.length}}部影片</div>
      <ul class="list">
        <li class="items-list" v-for="item in list" :key="item.movieId">
          <router-link :to="{name: 'film-movie', params: {id: item.movieId}}" target="_blank">
          <div class="inner-items flex-box">
            <div><img  v-real-img="item.logoUrl" width="104" height="156" /></div>
            <div class="inner-right">
              <h2>{{item.movieTitle}}</h2>
              <div class="rows"><em v-for="(it, index) in (item.typeList || [])" :key="index">{{it}}<i v-if="index < (item.typeList || []).length-1">/</i></em></div>
              <div class="rows">{{item.releaseDate}}上映</div>
              <div class="rows">
                <em class="item-label">导演：</em>
                <span>{{item.directorNames}}</span>
              </div>
              <div class="rows">
                <em class="item-label">演员：</em>
                  <span>{{item.actorNames}}</span>
              </div>
            </div>
          </div>
          </router-link>
        </li>
      </ul>
      <ul v-if="list.length == 0" class="no-list-data">暂无关联影片，可联系鲸娱添加</ul>
  </div>
</template>

<script lang='ts'>
import {Component} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import {managementList} from './type'
import { intDate } from '@/util/dealData'

@Component
export default class Main extends ViewBase {
  list = []

  async mounted() {
    const { data } = await managementList()
    this.list = (data.items || []).map((it: any) => {
      const transStr = it.directorList && it.directorList.join(' ')
      const directorNames = transStr && transStr.length > 12 ? transStr.substr(0, 12) + '...' : transStr

      const str = it.actorList && it.actorList.join(' ')
      const actorNames = str && str.length > 12 ? str.substr(0, 12) + '...' : str
      return {
        ...it,
        releaseDate: intDate(it.releaseDate),
        actorNames,
        directorNames
      }
    })
  }
}

</script>
<style lang='less' scoped>
.item-label {
  color: rgba(0, 32, 45, .7);
}
.span-offset {
  padding-right: 8px;
}
.rows {
  padding-bottom: 7px;
}
.no-list-data {
  text-align: center;
  font-size: 18px;
  color: #fff;
  padding-top: 40px;
}
.film-page {
  padding: 40px 0;
  .count-title {
    font-size: 24px;
    color: #fff;
    padding-bottom: 30px;
    padding-left: 10px;
  }
  .list {
    display: flex;
    flex-wrap: wrap;
    .items-list {
      width: 33.3%;
      .inner-items {
        margin: 0 10px 20px;
        background: rgba(255, 255, 255, .3);
        border-radius: 5px;
        border: solid 1px #fff;
        padding: 30px;
        .inner-right {
          padding-left: 20px;
          color: #00202d;
          font-size: 14px;
          h2 {
            font-size: 18px;
            height: 50px;
          }
        }
      }
    }
  }
}
</style>