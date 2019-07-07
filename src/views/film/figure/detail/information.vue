<template>
  <div class="personal-information">
    <h2 class="nav-title">人物简介</h2>
    <ul class="personal-mes">
      <li>
        <span>出生日期：</span>
        <span>{{intDate(item.birthday) || '-'}}</span>
      </li>
      <li>
        <span>身高: {{item.height || '-'}}</span>
      </li>
      <li>
        <span>出生地：</span>
        <span>{{item.country || '-'}},{{item.province || '-'}}</span>
      </li>
      <li>
        <span>体重: {{item.weight || '-'}}</span>
      </li>
    </ul>

    <div class="personal-text">
      <!-- {{handleSub(item.introduction)}} -->
      {{introduction}}
      <span class="text-more" @click="handleMore" v-if="isMore">{{moreText}}</span>
    </div>

    <h2 class="nav-title">人物关系</h2>
    <ul class="personal-relation">
      <li v-for="item in personalList" :key="item.id">
        <p class="per-title font_16">{{item.title}}</p>
        <p class="head-img">
          <a class>
            <img
              :src="item.headImg == '' || item.headImg == null ? $store.state.defaultAvatar : item.headImg"
            />
          </a>
        </p>
        <p class="per-name font_18">{{item.name || '-'}}</p>
        <p class="per-englist font_18">{{item.nameEn || '-'}}</p>
        <p>
          <span v-for="(it, index) in item.professions" :key="index">
            {{handleProfess(it.code)}}
            <em v-if="item.professions.length-1 != index">/</em>
          </span>
        </p>
        <p>代表作品</p>
        <p>
          <span v-for="it in item.movies" :key="it.id">《{{it.name}}》</span>
        </p>
      </li>
    </ul>

    <div class="nav-title img-toggle" v-if="imgList.length">
      图片（{{imgList.length}}）
    </div>

    <div class="photo-list-wrap">
      <ul name="list" tag="ul" class="loading-img" v-if="mapImgList.length">
        <li v-for="(img, index) in mapImgList" :key="index" v-if="img">
          <a class="img-list">
            <img :src="img" alt />
          </a>
        </li>
      </ul>
    </div>

    <div class="show-all" v-if="imgList.length > 15">
      <span @click="handleToggle">
        {{tabShowTitle}}
        <Icon
          :class="{'arrowDown': arrowFlag == 0, 'arrowUp': arrowFlag == 1}"
          type="ios-arrow-down"
          size="25"
        />
      </span>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { personIntro } from '@/api/filmPersonDetail'
import { intDate } from '@/util/dealData'
import { cloneDeep } from 'lodash'
// import { swiper, swiperSlide } from 'vue-awesome-swiper'
// import 'swiper/dist/css/swiper.css'

@Component
export default class Information extends ViewBase {
  @Prop({ type: Number, default: 0 }) id!: number

  tabShowTitle = '展示全部'
  arrowFlag = 0

  // 是否显示更多
  isMore = false
  isTagMore = true
  introduction: any = null
  moreText = '展示更多'

  item: any = {}
  mapImgList: any = []
  imgList: any = []

  personalList: any = []
  professionsList: any[] = []

  get intDate() {
    return intDate
  }
  async mounted() {
    await this.tableList()
    await this.handleSub()
  }

  async tableList() {
    const id = this.id // 107028
    try {
      const {
        data: { item, professions }
      } = await personIntro(id)
      this.item = item || null
      this.imgList = (item && item.images) || []
      this.professionsList = professions
      const list = cloneDeep(this.imgList)
      this.mapImgList = list.length > 15 ? list.slice(0, 15) : list
      // 合并数据
      item
        ? this.personalList.push({
            title: '合作过最多的导演',
            ...item.directorPartner
          })
        : null
      item
        ? this.personalList.push({
            title: '合作过最多的男演员',
            ...item.malePartner
          })
        : null
      item
        ? this.personalList.push({
            title: '合作过最多的女演员',
            ...item.femalePartner
          })
        : null
    } catch (ex) {
      this.handleError(ex)
    }
  }

  handleProfess(code: any) {
    const item = this.professionsList.find((it: any) => code == it.key)
    return item.text
  }

  handleSub() {
    const text = this.item.introduction
    if (text) {
      if (text.length > 720) {
        this.isMore = true
        this.introduction = text.substr(0, 720) + '.......'
      } else {
        this.isMore = false
        this.introduction = text
      }
    }
  }

  handleMore() {
    if (this.isTagMore) {
      this.introduction = this.item.introduction
      this.moreText = '收起'
      this.isTagMore = false
    } else {
      this.introduction = this.item.introduction.substr(0, 720) + '.......'
      this.moreText = '展示更多'
      this.isTagMore = true
    }
  }

  handleToggle() {
    const list = cloneDeep(this.imgList)
    if (!this.arrowFlag) {
      this.arrowFlag = 1
      this.tabShowTitle = '向上隐藏'
      this.mapImgList = list
    } else {
      this.arrowFlag = 0
      this.tabShowTitle = '展示全部'
      this.mapImgList = list.slice(0, 15)
    }
  }
}
</script>

<style lang='less' scoped>
.font_16 {
  font-size: 16px;
}
.font_17 {
  font-size: 17px;
}
.font_18 {
  font-size: 18px;
}

.nav-title {
  font-size: 24px;
  font-weight: normal;
  margin-bottom: 30px;
  color: #fff;
  position: relative;
}

.personal-information {
  background: rgba(0, 32, 45, 0.9);
  border-radius: 0 0 5px 5px;
  padding: 35px 40px;
  color: #fff;
  .personal-mes {
    display: flex;
    margin-left: -15px;
    margin-right: -15px;
    font-size: 18px;
    li {
      height: 140px;
      width: 25%;
      border-radius: 5px;
      margin: 0 15px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-left: 20px;
      &:nth-child(1) {
        background: #00202d url('../../assets/age.png') no-repeat right center;
        background-size: 80px;
      }
      &:nth-child(2) {
        background: #00202d url('../../assets/height.png') no-repeat right center;
        background-size: 80px;
      }
      &:nth-child(3) {
        background: #00202d url('../../assets/adress.png') no-repeat right center;
        background-size: 80px;
      }
      &:nth-child(4) {
        background: #00202d url('../../assets/weight.png') no-repeat right center;
        background-size: 80px;
      }
    }
  }

  .personal-text {
    text-indent: 2rem;
    font-size: 14px;
    line-height: 26px;
    text-align: justify;
    padding: 15px 0 25px;
    border-bottom: solid 1px rgba(79, 166, 187, 0.5);
    margin-bottom: 30px;
    .text-more {
      cursor: pointer;
      color: #57b4c9;
      padding-left: 20px;
    }
  }
  .personal-relation {
    display: flex;
    flex-wrap: wrap;
    border-bottom: solid 1px rgba(79, 166, 187, 0.5);
    margin-bottom: 30px;
    li {
      width: 33.3%;
      text-align: center;
      padding-bottom: 20px;
      .head-img {
        a {
          width: 140px;
          height: 140px;
          display: block;
          overflow: hidden;
          border-radius: 100%;
          margin: 18px auto;
          img {
            width: 140px;
          }
        }
      }
      .per-englist {
        text-transform: capitalize;
        padding-bottom: 18px;
      }
    }
  }
  .loading-img {
    display: flex;
    flex-wrap: wrap;
    margin-left: -10px;
    margin-right: -10px;
    transition: all 2s;
    li {
      width: 20%;
      margin-bottom: 25px;
      padding: 0 10px;
      .img-list {
        display: block;
        width: 180px;
        height: 180px;
        overflow: hidden;
      }
      img {
        width: 180px;
      }
    }
  }
}

.show-all {
  text-align: center;
  font-size: 14px;
  color: #b3bcc0;
  span {
    cursor: pointer;
  }
}

.arrowDown {
  animation: arrowDown 0.5s both;
}

@keyframes arrowDown {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(180deg);
  }
}

.arrowUp {
  animation: arrowUp 0.5s both;
}

@keyframes arrowUp {
  0% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(0);
  }
}

// 进入过度transition
.list-enter-active {
  transition: all 1s;
}

.list-enter,
.list-leave-to {
  opacity: 0;
}
</style>
