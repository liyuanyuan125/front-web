<template>
  <div class="personal-information">
    <h2 class="nav-title">人物简介</h2>
    <ul class="personal-mes">
      <li><span>出生日期：</span><span>{{formatConversion(item.birthday) || '-'}}</span></li>
      <li> <span>身高: {{item.height || '-'}}</span> </li>
      <li><span>出生地：</span><span>{{item.country || '-'}},{{item.province || '-'}}</span></li>
      <li><span>体重: {{item.weight || '-'}}</span></li>
    </ul>
    <div class="personal-text">{{item.introduction}}</div>
    <h2 class="nav-title">人物关系</h2>
    <ul class="personal-relation">
      <li v-for="item in personalList" :key="item.id">
        <p class="per-title font_16">{{item.title}}</p>
        <p class="head-img">
          <a class=""><img :src="item.headImg == '' || item.headImg == null ? $store.state.defaultAvatar : item.headImg" /></a>
        </p>
        <p class="per-name font_18">{{item.name || '-'}}</p>
        <p class="per-englist font_18">{{item.nameEn || '-'}}</p>
        <p><span v-for="(it, index) in item.professions" :key="index">{{handleProfess(it.code)}}<em v-if="item.professions.length-1 != index"> / </em></span></p>
        <p>代表作品</p>
        <p><span v-for="it in item.movies" :key="it.id">《{{it.name}}》</span></p>
      </li>
    </ul>
    <h2 class="nav-title" v-if="imgList.length">图片（{{imgList.length}}）</h2>
    <ul name="list" v-if="imgList.length" tag="ul" class="loading-img">
      <li v-for="(img, index) in imgList" :key="index">
        <a class="img-list"><img :src="img" alt=""/></a>
      </li>
    </ul>

    <!-- <div class="show-all" v-if="imgUrl.length > 5">
      <span @click="handleToggle">{{tabShowTitle}}<Icon :class="{'arrowDown': arrowFlag == 0, 'arrowUp': arrowFlag == 1}" type="ios-arrow-down" size="25" /></span>
    </div> -->
  </div>
</template>

<script lang='ts'>
import {Component, Prop} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { personIntro } from '@/api/filmPersonDetail'
import {formatConversion} from '@/util/validateRules'
// import { swiper, swiperSlide } from 'vue-awesome-swiper'
// import 'swiper/dist/css/swiper.css'

@Component
export default class Information extends ViewBase {
  @Prop({ type: Number, default: 0 }) id!: number

  tabShowTitle = '展示全部'
  arrowFlag = 0

  item = {}
  imgUrl = []
  imgList: any = []
  personalList: any = []
  professionsList: any[] = []

  get formatConversion() {
    return formatConversion
  }
  mounted() {
    this.tableList()
  }

  async tableList() {
    const id = this.id // 107028
    try {
      const { data: { item, professions} } = await personIntro(id)
      this.item = item || null
      this.imgList = item && item.images || []
      this.professionsList = professions
      // 合并数据
      item ?  this.personalList.push({
          title: '合作过最多的导演',
          ...item.directorPartner
        }) : null
      item ? this.personalList.push({
          title: '合作过最多的男演员',
          ...item.malePartner
        }) : null
      item ? this.personalList.push({
          title: '合作过最多的女演员',
          ...item.femalePartner
        }) : null
    } catch (ex) {
      this.handleError(ex)
    }
  }
  handleProfess(code: any) {
    const item = this.professionsList.find((it: any) => code == it.key)
    return item.text
  }
  handleToggle() {
    if (!this.arrowFlag) {
      this.arrowFlag = 1
      this.tabShowTitle = '向上隐藏'
      this.imgList = this.imgUrl
    } else {
      this.arrowFlag = 0
      this.tabShowTitle = '展示全部'
      this.imgList = this.imgUrl.slice(0, 5)
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
}
.personal-information {
  background: rgba(0, 32, 45, .9);
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
    border-bottom: solid 1px rgba(79, 166, 187, .5);
    margin-bottom: 30px;
  }
  .personal-relation {
    display: flex;
    flex-wrap: wrap;
    border-bottom: solid 1px rgba(79, 166, 187, .5);
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
  .show-all {
    text-align: center;
    font-size: 14px;
    color: #b3bcc0;
    span {
      cursor: pointer;
    }
  }
}
.arrowDown {
  animation: arrowDown .5s both;
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
  animation: arrowUp .5s both;
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

.list-enter, .list-leave-to {
  opacity: 0;
}
</style>