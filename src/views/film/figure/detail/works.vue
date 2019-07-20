<template>
  <div class="page">
    <div class="top-five">
      <h2 class="nav-title">票房TOP5作品</h2>
      <ul>
        <li v-for="item in topList" :key="item.id">
          <p class="item-list">
              <img :src="item.poster" class="img-top" />
              <span v-if="item.boxOfficeRanking">影史票房NO.{{item.boxOfficeRanking}}</span>
              <img v-if="item.status == 3" src="~@/views/film/assets/hotShow.png" width="48px" alt="alias" class="hot"/>
          </p>
          <p class="title-year" :title="item.name">{{spliceName(item.name)}}({{item.release}})</p>
          <p>
            <span v-for="(it, index) in item.types" :key="index" v-if="!!handleMoive(it)">{{handleMoive(it)}}
              <em v-if="item.types.length-1 != index"> / </em>
            </span>
          </p>
          <p class="top-money"><span>{{readableNumber(item.boxOffice)}}</span></p>
        </li>
      </ul>
    </div>
    <div class="flex-box">
      <div class="left-list">
        <h3 class="header-title" >
          <em>已上映作品（{{items.length - noMovie.length}}）</em>
          <span class="flex-box">
            <i v-for="item in selList" :class="{'active-pro': item.key == timeSort}" :key="item.key" @click="handlePro(item.key)">{{item.text}}</i>
          </span>
        </h3>
        <div class="production-list flex-box" v-if="items.length">
          <span class="move-title">职业筛选：</span>
          <div class="move-type">
            <a v-for="(item, index) in filterRelease" :key="index">{{handleProfession(index)}}({{item}})</a>
          </div>
        </div>
        <div class="production-list flex-box" v-if="items.length">
          <span class="move-title">影片类型：</span>
          <div class="move-type">
            <a v-for="(item, index) in filterMovie" :key="index"  v-if="handleMoive(index)">{{handleMoive(index)}}<i>({{item}})</i></a>
          </div>
        </div>
        <div class="per_rele_list">
          <dl>
            <dd v-for="(list, index) in tableList" :key="index">
              <i class="year-tag" v-if="list.year">{{list.year}}</i>
              <i class="year-tag" v-else>{{handleJy(list.jyIndex)}}</i>
              <div class="pic-item flex-box" v-for="it in list.items">
                <a :href="it.videoUrl" class="img" >
                  <i class="nowing" v-if="it.status == 3"><img src="~@/views/film/assets/hotShow.png" width="48px" alt="alias" /></i>
                  <img :src="it.poster" class="img-item" />
                </a>
                <div class="text-right">
                  <h3 class="title-grade"><span>{{it.name}}</span><em>{{handleJy(it.jyIndex)}}</em></h3>
                  <h4 class="person-identity"><span v-for="(item, index) in it.professions" :key="index"> {{handleProfession(item)}} </span></h4>
                  <p class="com-col">导演：<em class="em-actor" v-for="(item, index) in it.directors" :key="index">{{item.name}}&nbsp;&nbsp;</em></p>
                  <p class="com-col">主演：<em class="em-actor" v-for="(item, index) in it.actors" v-if="index < 2" :key="index">{{item.name}}&nbsp;&nbsp;</em></p>
                </div>
              </div>
            </dd>
          </dl>
        </div>
      </div>

      <div class="right-list">
         <h3 class="nav-title">未上映作品({{noMovie.length}})</h3>
         <div class="production-list">作品（{{noMovie.length}}）</div>
         <div class="pic-item flex-box" v-for="it in noMovie">
          <a :href="it.videoUrl" class="img" >
            <img :src="it.poster" class="img-item" />
          </a>
          <div class="text-right">
            <h3 class="title-grade right-item-grade"><span>{{it.name}}({{it.releaseYear}})</span></h3>
            <h4 class="person-identity"><span v-for="(item, index) in it.professions" :key="index"> {{handleProfession(item)}} </span></h4>
            <p class="com-col">导演：<em class="em-actor" v-for="(item, index) in it.directors" v-if="index < 5" :key="index">{{item.name}} </em></p>
            <p class="com-col">类型：<em class="em-actor" v-for="(item, index) in it.types" :key="index">{{handleMoive(item)}}<i v-if="it.types.length-1 != index"> / </i></em></p>
            <p class="com-col">{{intDate(it.release)}} {{it.releaseCountry}}上映</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script lang='ts'>
import {Component, Prop} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import {personMovies, topList } from '@/api/filmPersonDetail'
import { getTodayDate, formatConversion } from '@/util/validateRules'
import { intDate } from '@/util/dealData'
import { readableNumber } from '@/util/dealData'
import { cloneDeep, union, difference } from 'lodash'


@Component
export default class Master extends ViewBase {
  @Prop({ type: Number, default: 0 }) id!: number
  // 时间排序0，鲸娱排序1
  timeSort = 0
  tableList: any = []

  // top-5
  topList = []
  // 电影类型
  movieTypes = []
  // 职业身份
  professions = []
  // 上映状态
  status: any = []
  items: any[] = []
  // 未上映
  noMovie: any[] = []
  // 职业筛选
  filterRelease = []
  // 影片类型筛选
  filterMovie = []
  // 影片类型
  selList = [
    {key: 0, text: '按时间排序'},
    {key: 1, text: '按鲸娱指数排序'}
  ]
  // 影片类型筛选
  filmListSelect = [
    {key: 1, name: '动作', num: 4},
    {key: 2, name: '冒险', num: 4},
    {key: 3, name: '战争', num: 4},
  ]
  // 上映时间排序
  filmList: any = []
  // 鲸娱指数排序
  jyList: any = []

  get intDate() {
    return intDate
  }

  get readableNumber() {
    return readableNumber
  }

  async mounted() {
    this.topCountList()
    this.list()
  }

  async topCountList() {
    const id = this.id // 370093
    try {
      const { data: {items, movieTypes} } = await topList(id, 5)
      this.topList = items
      this.movieTypes = movieTypes || []
      this.status = status || []
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async list() {
    const id = this.id// 370093  366995
    try {
      const { data: {items, movieTypes, professions} } = await personMovies(id)
      this.professions = professions
      this.items = items || []

      // status > 2 上映状态
      this.noMovie = this.items.filter((item: any) => item.status < 3)

      // 上映作品 - 职业筛选
      const filterRelease: any = {}
      this.items.map((item: any) => {
        if (item.status > 2) {
          item.professions.map((pro: any) => {
            if (filterRelease[pro]) {
              filterRelease[pro] = filterRelease[pro] + 1
            } else {
              filterRelease[pro] = 1
            }
          })
        }
      })
      this.filterRelease = filterRelease

      // 上映作品 - 影片类型(未匹配到类型不展示)
      const filterMovie: any = {}
      this.items.map((item: any) => {
        if (item.status > 2) {
          item.types.map((pro: any) => {
            if (filterMovie[pro]) {
              filterMovie[pro] = filterMovie[pro] + 1
            } else {
              filterMovie[pro] = 1
            }
          })
        }
      })
      this.filterMovie = filterMovie

      // 后台list 深层拷贝
      const item1 = cloneDeep(this.items)
      const item2 = cloneDeep(this.items)
      item1.sort((a: any, b: any) => {
        return b.release - a.release
      })
      item2.sort((a: any, b: any) => {
        return b.jyIndex - a.jyIndex
      })

      // 把后台的一维数组 根据年份 变成二位数组
      const filmList: any[] = []
      item1.map((item: any) => {
        const findIndex = filmList.findIndex((film: any) => film.year == item.releaseYear)
        if (item.status > 2) { // 上映
          if (findIndex == -1) {
            // let childItems: any = []
            filmList.push({
              year: item.releaseYear,
              items: [{...item}]
            })
          } else {
            filmList[findIndex].items.push(item)
          }
        }
      })
      this.filmList = filmList
      this.tableList = this.filmList

      // 根据鲸娱指数排成二维数组
      const jyList: any[] = []
      item2.map((item: any) => {
        const findIndex = jyList.findIndex((jy: any) => Math.floor(jy.jyIndex) == Math.floor(item.jyIndex))
        if (item.status > 2) { // 上映
          if (findIndex == -1) {
            const childItems: any = []
            jyList.push({
              jyIndex: Math.floor(item.jyIndex),
              items: [{...item}]
            })
          } else {
            jyList[findIndex].items.push(item)
          }
        }
      })
      this.jyList = jyList
    } catch (ex) {
      this.handleError(ex)
    }
  }

  handleProfession(id: string) {
    const profess: any = this.professions.filter((item: any) => item.key == id )
    return profess[0].text
  }

  handleJy(jy: number) {
    return (jy / 100).toFixed(2)
  }

  handleMoive(it: any) {
    let item: any = null
    for (item of this.movieTypes) {
      if (item.key == it) {
        return item.text
      }
    }
  }
  handlePro(id: any) {
    this.timeSort = id
    this.tableList = this.timeSort == 0 ? this.filmList : this.jyList
  }
  spliceName(name: string) {
    return name && name.length > 5 ? name.substr(0, 4) + '...' : name
  }
}

</script>
<style lang='less' scoped>
.move-title {
  display: block;
  padding-right: 5px;
}
h2, h3, h4 {
  font-weight: normal;
}
// .page {
//   padding: 30px 20px 30px 40px;
// }
.nav-title {
  font-size: 24px;
  margin-bottom: 30px;
  color: #fff;
}
.top-five {
  background: rgba(0, 32, 45, .9);
  border-radius: 5px;
  padding: 40px 30px 30px;
  margin-bottom: 20px;
  ul {
    display: flex;
    margin-left: -10px;
    margin-right: -10px;
    li {
      width: 20%;
      padding: 0 10px;
      text-align: center;
      color: #fff;
      position: relative;
      font-size: 14px;
      .hot {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 9;
      }
      .item-list {
        position: relative;
        width: 160px;
        height: 240px;
        overflow: hidden;
        margin: 0 auto;
        background: #fff;
        span {
          position: absolute;
          bottom: 5px;
          left: 0;
          height: 40px;
          line-height: 40px;
          color: #fff;
          text-align: center;
          background: #4fa6bb;
          width: 100%;
        }
      }
      .img-top {
        width: 160px;
      }
      .title-year {
        font-size: 16px;
        padding: 10px 0;
      }
      .top-money {
        color: #4fa6bb;
        padding: 10px 0 5px;
      }
    }
  }
}
.active-pro {
  background: #4fa6bb;
}
.left-list {
  width: 53%;
  background: rgba(0, 32, 45, .9);
  padding: 30px 20px 40px 30px;
  border-radius: 5px;
  .header-title {
    padding-bottom: 10px;
    font-size: 15px;
    display: flex;
    justify-content: space-between;
    em {
      display: inline-block;
      font-size: 24px;
      color: #fff;
    }
    span {
      display: flex;
      border: solid 1px rgba(79, 166, 187, 1);
      border-radius: 5px;
      overflow: hidden;
      i {
        display: block;
        width: 118px;
        line-height: 32px;
        text-align: center;
        color: #fff;
        cursor: pointer;
      }
    }
  }
  .per_rele_list {
    dl {
      border-left: solid 1px rgba(255, 255, 255, .5);
      margin-left: 40px;
      dd {
        position: relative;
        font-size: 14px;
        .year-tag {
          width: 60px;
          height: 26px;
          line-height: 26px;
          position: absolute;
          left: -30px;
          background: #da6c70;
          font-size: 20px;
          color: #fff;
          text-align: center;
          border-radius: 2px;
        }
      }
    }
  }
}
.right-list {
  font-size: 14px;
  width: 47%;
  background: rgba(0, 32, 45, .9);
  margin-left: 20px;
  padding: 30px 30px 40px;
  border-radius: 5px;
  .pic-item {
    margin-left: 0;
  }
  .nav-title {
    margin-bottom: 15px;
  }
}
.pic-item {
  margin-bottom: 40px;
  margin-left: 47px;
  position: relative;
  .img {
    position: relative;
    display: block;
    width: 140px;
    height: 190px;
    overflow: hidden;
    .img-item {
      width: 140px;
    }
    .nowing {
      width: 48px;
      position: absolute;
      left: 0;
      top: 0;
    }
  }
  .text-right {
    color: #fff;
    padding-left: 15px;
    .title-grade {
      padding-top: 10px;
      height: 85px;
      span {
        padding-right: 25px;
      }
      em {
        display: inline-block;
        width: 48px;
        height: 22px;
        line-height: 22px;
        background: #da6c70;
        color: #fff;
        text-align: center;
        border-radius: 2px;
      }
    }
    .right-item-grade {
      height: 65px;
    }
    .person-identity {
      padding-top: 17px;
      padding-bottom: 4px;
      color: #b3bcc0;
    }
    .com-col {
      padding: 4px 0;
      color: #b3bcc0;
      em {
        color: #4fa6bb;
      }
    }
  }
}
.production-list {
  font-size: 14px;
  color: #fff;
  margin: 10px 0 16px;
  .move-type {
    display: flex;
    flex-wrap: wrap;
    flex: 5;
    a {
      margin-right: 17px;
      margin-bottom: 5px;
      color: #fff;
      display: inline-block;
    }
  }
  .col_222 {
    color: #fff;
  }
}
</style>