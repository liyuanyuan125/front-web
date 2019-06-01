<template>
  <section class="basic-pane">
    <div class="basic-in">
      <div class="zone name-zone effect-lightning">
        <h3 class="name">
          <em>吴京</em>
          <Icon
            :type="hasFollowIn ? 'md-heart' : 'md-heart-outline'"
            class="heart"
            :class="{
              'heart-on': hasFollowIn,
              'follow-effect': followEffect
            }"
            @click="follow"
          />
        </h3>
        <sub class="en-name">Jing Wu</sub>
        <div class="title">演员 / 导演 / 制片人</div>
      </div>

      <div class="zone rank-zone effect-lightning">
        <div class="rank-label">鲸娱指数</div>
        <div class="rank-no">92.02</div>
        <div class="rank-title">中国男演员票房：TOP1</div>
      </div>

      <div class="zone opus-zone effect-lightning">
        <h4 class="zone-head flex-box">
          <em class="flex-1">主要作品：</em>
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

      <div class="zone brand-zone">
        <h4 class="brand-head flex-box">
          <em class="flex-1">合作过的品牌：</em>
          <router-link :to="{}">更多 &gt;</router-link>
        </h4>
        <ul class="brand-list">
          <li
            v-for="(it, i) in brandList"
            :key="i"
            class="brand-item">
            <img :src="it.logo" width="55" height="55" class="brand-img">
          </li>
        </ul>
      </div>

      <router-link :to="{}" class="button-more">更多资料</router-link>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

interface Opus {
  title: string
  count: string
}

interface Brand {
  logo: string
}

@Component
export default class BasicPane extends Vue {
  @Prop({ type: Boolean, default: false }) hasFollow!: boolean

  @Prop({ type: Array, default: () => [] }) opusList!: Opus[]

  @Prop({ type: Array, default: () => [] }) brandList!: Brand[]

  hasFollowIn = this.hasFollow

  followEffect = false

  follow() {
    this.hasFollowIn = !this.hasFollowIn
    this.followEffect = true
    setTimeout(() => this.followEffect = false, 500)
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

.effect-lightning {
  background: linear-gradient(to right, rgba(149, 198, 227, 1), rgba(149, 198, 227, 0)) no-repeat left bottom;
  background-size: 100% 1px;
}

.basic-pane {
  position: relative;
  min-width: 348px;
  border-radius: 5px;
  color: #ddd;
  overflow: hidden;
  user-select: none;
  padding-bottom: 50px;
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
  margin: 15px 0 0 128px;
  line-height: 28px;
}

.zone {
  padding: 12px 0 12px 4px;
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

.en-name {
  display: block;
  color: #fff;
  line-height: 28px;
  margin-top: -6px;
}

.title {
  font-size: 14px;
  margin-top: 5px;
}

.rank-label {
  font-size: 14px;
}

.rank-no {
  color: #f3d872;
  font-size: 30px;
  margin-top: 5px;
}

.rank-title {
  color: #f3d872;
  font-size: 14px;
  margin-top: 5px;
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
  margin-top: 5px;
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
</style>
