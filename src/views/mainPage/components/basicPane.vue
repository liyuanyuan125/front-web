<template>
  <section class="basic-pane">
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
        <div class="rank-no" v-if="item.rankNo">{{item.rankNo}}</div>
        <div class="rank-title" v-html="item.rankTitle" v-if="item.rankTitle">{{item.rankTitle}}</div>
      </div>

      <div
        class="zone opus-zone effect-lightning"
        v-if="opusList && opusList.length > 0"
      >
        <h4 class="zone-head flex-box">
          <em class="flex-1">主要作品</em>
          <router-link :to="{}">更多 &gt;</router-link>
        </h4>
        <ul class="opus-list">
          <li
            v-for="(it, i) in opusList"
            :key="i"
            class="opus-item flex-box">
            <label class="flex-1">{{it.title}}</label>
            <em>{{it.count}}</em>
          </li>
        </ul>
      </div>

      <div
        class="zone platform-zone effect-lightning"
        v-if="platformList && platformList.length > 0"
      >
        <h4 class="zone-head flex-box">
          <em class="flex-1">粉丝平台分布（人）</em>
          <!-- <router-link :to="{}">更多 &gt;</router-link> -->
        </h4>
        <ul class="platform-list">
          <li
            v-for="(it, i) in platformList"
            :key="i"
            class="platform-item flex-mid"
          >
            <i :class="`platform-icon-${it.icon}`"></i>
            <label class="platform-name">{{it.name}}</label>
            <Progress
              :percent="it.percent"
              class="platform-percent"
              stroke-color="rgba(255, 255, 255, .4)"
              hide-info
            />
            <em class="platform-count">{{it.count}}</em>
          </li>
        </ul>
      </div>

      <div
        class="zone brand-zone"
        v-if="brandList && brandList.length > 0"
      >
        <h4 class="brand-head flex-box">
          <em class="flex-1">合作过的品牌</em>
          <router-link :to="{}">更多 &gt;</router-link>
        </h4>
        <ul class="brand-list">
          <li
            v-for="(it, i) in brandList"
            :key="i"
            class="brand-item"
          >
            <img :src="it.logo" width="55" height="55" class="brand-img">
          </li>
        </ul>
      </div>

      <router-link :to="more" class="button-more" v-if="more">更多资料</router-link>
    </div>

    <img :src="item.figure" class="figure" v-if="item.figure">
  </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { RawLocation } from 'vue-router'

export interface Opus {
  title: string
  count: string
}

export interface Brand {
  logo: string
}

export interface Platform {
  icon: string
  name: string
  percent: number
  count: string
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

@Component
export default class BasicPane extends Vue {
  @Prop({ type: Object, default: () => ({}) }) item!: Item

  @Prop({ type: Boolean, default: false }) followed!: boolean

  @Prop({ type: [ Object, String ], default: null }) more!: RawLocation

  @Prop({ type: Array, default: () => [] }) opusList!: Opus[]

  @Prop({ type: Array, default: () => [] }) brandList!: Brand[]

  @Prop({ type: Array, default: () => [] }) platformList!: Platform[]

  followedIn = this.followed

  followEffect = false

  follow() {
    this.followedIn = !this.followedIn
    this.followEffect = true
    setTimeout(() => this.followEffect = false, 500)
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

@import '../style.less';

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
  padding: 28px 0 13px 4px;
}

.name {
  color: #fff;
}

.heart {
  position: relative;
  top: 6px;
  left: 10px;
  font-size: 18px;
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

.platform-list {
  padding-right: 12px;
}

// .platform-item {
// }

.platform-icon {
  width: 36px;
}

.platform-name {
  width: 44px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: 5px;
}

.platform-percent {
  width: 88px;
  /deep/ .ivu-progress-inner {
    top: -1px;
    background-color: transparent;
  }
}

.platform-count {
  flex: 1;
  white-space: nowrap;
  text-align: right;
}
</style>
