<template>
  <section class="basic-pane" v-if="item">
    <div class="basic-in">
      <div class="zone name-zone effect-lightning">
        <h3 class="name">
          <em>{{item.name}}</em>
          <Icon
            :type="followedIn ? 'md-heart' : 'md-heart-outline'"
            class="heart"
            :class="{
              'heart-on': followedIn,
              'follow-effect': followEffect
            }"
            @click="follow"
          />
        </h3>
        <sub class="sub-name" v-if="item.subName">{{item.subName}}</sub>
        <div class="title" v-if="item.title">{{item.title}}</div>
      </div>

      <div class="zone rank-zone effect-lightning">
        <div class="rank-label">鲸娱指数</div>
        <div class="rank-no">{{item.rankNo}}</div>
        <div class="rank-title" v-html="item.rankTitle">{{item.rankTitle}}</div>
      </div>

      <div
        class="zone opus-zone effect-lightning"
        v-if="opusData"
      >
        <h4 class="zone-head flex-box">
          <em class="flex-1">主要作品</em>
          <router-link :to="opusData.more" v-if="opusData.more">更多 &gt;</router-link>
        </h4>
        <ul class="opus-list">
          <li
            v-for="(it, i) in opusData.list"
            :key="i"
            class="opus-item flex-box">
            <label class="flex-1">{{it.title}}</label>
            <em>{{it.count}}</em>
          </li>
        </ul>
      </div>

      <div
        class="zone fans-zone effect-lightning"
        v-if="fansList && fansList.length > 0"
      >
        <h4 class="zone-head flex-box">
          <em class="flex-1">粉丝平台分布（人）</em>
          <!-- <router-link :to="{}">更多 &gt;</router-link> -->
        </h4>
        <ul class="fans-list">
          <li
            v-for="(it, i) in fansList"
            :key="i"
            class="fans-item flex-mid"
          >
            <i :class="`platform-icon-${it.icon}`"></i>
            <label class="fans-name">{{it.name}}</label>
            <Progress
              :percent="it.percent"
              class="fans-percent"
              stroke-color="rgba(255, 255, 255, .4)"
              hide-info
            />
            <em class="fans-count">{{it.count}}</em>
          </li>
        </ul>
      </div>

      <div
        class="zone movie-zone effect-lightning"
        v-if="movie != null && movie.preview && movieList.length > 0"
      >
        <VideoPreviewer
          :url="movie.preview"
          v-if="movie.preview"
        >
          <span class="movie-preview">预告片播放</span>
        </VideoPreviewer>
        <ul class="movie-list">
          <li
            v-for="(it, i) in movieList"
            :key="i"
            class="movie-item"
          >{{it.name}}：{{it.value}}</li>
        </ul>
      </div>

      <div
        class="zone actor-zone"
        v-if="actorData"
      >
        <h4 class="zone-head flex-box">
          <em class="flex-1">
            演员阵容：<Star :value="actorData.star" readonly v-if="actorData.star > 0"/>
          </em>
          <router-link :to="actorData.more">更多 &gt;</router-link>
        </h4>
        <ul class="actor-list">
          <li
            v-for="(it, i) in actorData.list"
            :key="i"
            class="actor-item"
          >
            <router-link
              :to="{ name: 'film-figure', params: { id: it.id } }"
              class="actor-item-in"
            >
              <figure
                class="actor-img"
                :style="{ backgroundImage: `url(${it.avatar})` }"
                :title="it.name"
              ></figure>
            </router-link>
          </li>
        </ul>
      </div>

      <div
        class="zone brand-zone"
        v-if="brandData"
      >
        <h4 class="brand-head flex-box">
          <em class="flex-1">合作过的品牌</em>
          <router-link :to="brandData.more" v-if="brandData.more">更多 &gt;</router-link>
        </h4>
        <ul class="brand-list">
          <li
            v-for="(it, i) in brandData.list"
            :key="i"
            class="brand-item"
          >
            <router-link
              :to="{ name: 'brand-home', params: { id: it.id } }"
              class="brand-item-in"
            >
              <img :src="it.logo" width="55" height="55" class="brand-img">
            </router-link>
          </li>
        </ul>
      </div>

      <router-link :to="more" class="button-more" v-if="more">更多资料</router-link>
    </div>

    <img :src="item.figure" class="figure" v-if="item.figure">

    <slot></slot>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { RawLocation } from 'vue-router'
import VideoPreviewer from '@/components/videoPreviewer'
import Star from '@/components/star'

export interface Opus {
  title: string
  count: string
}

export interface Brand {
  id: number
  name: string
  logo: string
}

export interface Platform {
  icon: string
  name: string
  percent: number
  count: string
}

export interface Movie {
  preview?: string
  director?: string
  type?: string
  date?: string
  address?: string
}

export interface Actor {
  id?: number
  name?: string
  avatar?: string
}

export interface ActorData {
  star?: number
  list?: Actor[]
  more?: RawLocation
}

export interface BrandData {
  list?: Brand[]
  more?: RawLocation
}

export interface OpusData {
  list?: Opus[]
  more?: RawLocation
}

export interface Item {
  id: number
  name: string
  subName: string
  title: string
  figure: string
  rankNo: string
  rankTitle: string
}

@Component({
  components: {
    VideoPreviewer,
    Star
  }
})
export default class BasicPane extends Vue {
  @Prop({ type: Object, default: () => ({}) }) item!: Item

  @Prop({ type: Boolean, default: false }) followed!: boolean

  @Prop({ type: [ Object, String ], default: null }) more!: RawLocation

  @Prop({ type: Object, default: null }) opusData!: OpusData

  @Prop({ type: Object, default: null }) brandData!: BrandData

  @Prop({ type: Array, default: () => [] }) fansList!: Platform[]

  @Prop({ type: Object, default: null }) movie!: Movie

  @Prop({ type: Object, default: null }) actorData!: ActorData

  followedIn = this.followed

  followEffect = false

  get movieList() {
    const movie = this.movie || {}
    const list = [
      { name: '导演', value: movie.director },
      { name: '类型', value: movie.type },
      { name: '上映日期', value: movie.date },
      { name: '制片地', value: movie.address },
    ]
    return list.filter(it => !!it.value)
  }

  follow() {
    this.followedIn = !this.followedIn
    this.followEffect = true
    setTimeout(() => this.followEffect = false, 500)
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
@import '~@/style/platform/index.less';

.effect-lightning {
  background: linear-gradient(to right, rgba(149, 198, 227, 1), rgba(149, 198, 227, 0)) no-repeat left bottom;
  background-size: 100% 1px;
}

.basic-pane {
  position: relative;
  min-width: 295px;
  border-radius: 5px;
  color: #ddd;
  user-select: none;
  padding: 14px 0 50px;
  box-shadow: 0 -3px #53c5df;
  background-color: rgba(0, 31, 44, .6);

  a {
    color: #ddd;
    &:hover {
      color: #f3d872;
    }
  }
}

.basic-in {
  width: 195px;
  margin-left: 34px;
  line-height: 28px;
}

.figure {
  position: absolute;
  top: 34px;
  right: -91px;
  width: 156px;
  height: 220px;
  border: 1px solid #53c5df;
  box-shadow: -8px 8px 8px rgba(0, 0, 0, .38);
  border-radius: 2px;
}

.zone {
  padding: 12px 9px 14px 4px;
}

.name-zone {
  font-size: 24px;
  line-height: 1.2;
  padding: 28px 0 13px 4px;
  margin-right: 46px;
}

.name {
  color: #fff;
}

.heart {
  position: relative;
  top: 7px;
  left: 3px;
  font-size: 22px;
  vertical-align: top;
  cursor: pointer;
  transition: transform ease 200ms;
  &:hover {
    transform: scale(1.5);
  }
}

.heart-on {
  color: #ca7273;
}

@keyframes dongdong {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.8);
  }

  100% {
    transform: scale(1);
  }
}

.follow-effect {
  animation: dongdong 300ms ease-in-out;
}

.sub-name {
  display: block;
  color: #fff;
  line-height: 28px;
  margin-top: -4px;
}

.title {
  font-size: 14px;
  margin-top: 7px;
}

.rank-label {
  font-size: 14px;
  margin-top: 1px;
}

.rank-no {
  color: #f3d872;
  font-size: 34px;
  margin-top: 8px;
}

.rank-title {
  color: #f3d872;
  font-size: 14px;
  margin-top: 8px;
}

.opus-item {
  label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.brand-list {
  display: flex;
  justify-content: space-between;
  margin: 5px 0 10px;
  line-height: 1;
}

.brand-img {
  vertical-align: top;
}

.button-more {
  display: block;
  width: 146px;
  height: 32px;
  line-height: 32px;
  background-color: #001f2c;
  border-radius: 88px;
  text-align: center;
  margin: 8px auto 0;
}

.fans-list {
  padding-right: 12px;
}

// .fans-item {
// }

.fans-icon {
  width: 36px;
}

.fans-name {
  width: 44px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: 5px;
}

.fans-percent {
  width: 88px;
  /deep/ .ivu-progress-inner {
    top: -1px;
    background-color: transparent;
  }
}

.fans-count {
  flex: 1;
  white-space: nowrap;
  text-align: right;
}

.movie-preview {
  display: block;
  padding: 4px 0 4px 26px;
  color: #fff;
  background: url(../assets/preview.png) no-repeat left center;
  &:hover {
    opacity: .88;
  }
}

.movie-list {
  margin-top: 2px;
}

.actor-zone {
  padding-top: 16px;
  /deep/ .star-list {
    position: relative;
    top: 2px;
  }
}

.actor-list {
  display: flex;
  margin-top: 10px;
}

.actor-item {
  display: flex;
  justify-content: center;
  margin-right: 13px;
}

.actor-item-in {
  height: 68px;
}

.actor-img {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  background: no-repeat center top;
  background-size: cover;
}
</style>
