<template>
  <div class="page">
    <section class="summary-bar">
      <div class="summary-name">
        <h3 class="summary-title">{{item.name}}</h3>
        <Button type="primary" :to="{}" class="button-manage">品牌管理</Button>
      </div>

      <div class="summary-hot">
        <h3 class="summary-title">昨日综合热度</h3>
        <div class="hot-node">
          <em class="hot-value">{{hot.value}}</em>
          <i :class="`hot-${hot.inc > 0 ? 'inc' : 'dec'}`" v-if="hot.inc != 0">{{Math.abs(hot.inc)}}</i>
        </div>
      </div>

      <div class="summary-count">
        <h3 class="summary-title">进行的推广计划</h3>
        <div class="pop-count">{{popCount}}</div>
      </div>
    </section>

    <section class="content-box">
      <div class="content-left">
        <Pane title="百度搜索用户画像" :more="{}" class="baidu-pane">
          <ul class="baidu-list">
            <li class="baidu-item">
              <em>{{baidu.man}}</em>%
            </li>
            <li class="baidu-item">
              <em>{{baidu.woman}}</em>%
            </li>
          </ul>
        </Pane>

        <Pane title="评论分析" :more="{}" class="analyze-pane">
          <div
            class="analyze-summary"
            v-if="baidu.negativeInc != 0"
          >负面占比{{baidu.negativeInc > 0 ? '上升' : '下降'}} {{Math.abs(baidu.negativeInc)}}%</div>

          <ul class="analyze-list">
            <li class="analyze-item">
              <em>{{baidu.positive}}%</em>正面
            </li>
            <li class="analyze-item">
              <em>{{baidu.negative}}%</em>负面
            </li>
            <li class="analyze-item">
              <em>{{baidu.neutral}}%</em>中立
            </li>
          </ul>
        </Pane>
      </div>

      <div class="content-main">
        <figure class="item-figure">
          <img :src="item.figure || item.logo" class="item-img">
        </figure>

        <nav class="sub-bar" v-if="type == 'brand'">
          <label class="sub-name">{{subData.name}}</label>
          <ul class="sub-list">
            <Tabs class="sub-list">
              <TabPane v-for="it in subData.list" :key="it.id">
                <router-link
                  :to="{
                    name: 'brand-item',
                    params: { brandId: id, id: it.id }
                  }"
                >{{it.name}}</router-link>
              </TabPane>
            </Tabs>
          </ul>
        </nav>

        <Pane title="映前广告投放" class="putting-pane">

        </Pane>
      </div>

      <div class="content-right">
        <Pane title="KOL推广" :more="{}" class="kol-pane">
          <div class="count-stats" v-if="kol.pendCount > 0 || kol.runningCount > 0">
            <label>{{kol.pendCount}}个待处理</label>
            <label>{{kol.runningCount}}个执行中</label>
          </div>
          <div class="count-stats" v-else>
            <label>暂无推广计划</label>
            <router-link :to="{}">去创建 &gt;</router-link>
          </div>

          <ul class="kol-list">
            <li
              v-for="it in kol.recommendList"
              :key="it.id"
              class="kol-item"
              :class="{
                [`kol-item-${it.type}`]: true,
                'kol-item-recommended': it.recommended
              }"
            >
              <figure class="kol-figure">
                <img :src="it.avatar" class="kol-img">
              </figure>
              <a class="kol-add">加入投放</a>
              <div class="kol-name">{{it.name}}</div>
              <div class="kol-title" v-if="it.title">{{it.title}}</div>
              <div class="kol-fans" v-if="it.fans">关注数：<em>{{it.fans}}</em></div>
            </li>
          </ul>
        </Pane>

        <Pane title="映前广告投放" :more="{}" class="film-pane">
          <div class="count-stats" v-if="film.pendCount > 0 || film.runningCount > 0">
            <label>{{film.pendCount}}个待处理</label>
            <label>{{film.runningCount}}个执行中</label>
          </div>
          <div class="count-stats" v-else>
            <label>暂无合作计划</label>
            <router-link :to="{}">去申请 &gt;</router-link>
          </div>

          <div class="film-recommend">
            <figure class="film-figure">
              <img :src="film.recommend.cover" class="film-img">
            </figure>
            <div class="film-main">
              <div class="film-name">{{film.name}}</div>
              <div class="film-date">{{film.date}}</div>
              <div class="film-type">{{film.type}}</div>
              <div class="film-rate">用户匹配度：<em>{{film.rate}}</em></div>
            </div>
          </div>

          <div class="film-acts">
            <Button type="primary" class="film-apply">申请合作</Button>
          </div>
        </Pane>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import Pane from './pane.vue'

type Type = 'brand' | 'item'

@Component({
  components: {
    Pane
  }
})
export default class BrandHomeLayout extends ViewBase {
  @Prop({ type: String, default: 'brand' }) type!: Type

  @Prop({ type: Number, default: 0 }) id!: number

  item = {
    name: '奥迪Q3',
    logo: 'https://picsum.photos/id/259/350/220',
    figure: 'https://picsum.photos/id/435/1920/1080'
    // figure: 'https://picsum.photos/id/260/640/480',
    // figure: 'https://picsum.photos/id/261/320/220',
    // figure: 'https://picsum.photos/id/235/1080/1920',
    // figure: 'https://picsum.photos/id/268/320/640',
  }

  // 综合热度
  hot = {
    value: '6,789',
    inc: 158,
    list: [10, 18, 28, 16, 19, 32, 38]
  }

  // 进行的推广计划
  popCount = 1

  baidu = {
    man: 58.8,
    woman: 41.2,
    negativeInc: 1.1,
    positive: 66.6,
    negative: 30,
    neutral: 20
  }

  // 产品数据
  subData = {
    name: '车　型',
    list: [
      { id: 1, name: 'Audi A3' },
      { id: 2, name: 'Audi A4' },
      { id: 3, name: 'Audi A6' },
      { id: 4, name: 'Audi Q3' },
      { id: 5, name: 'Audi Q5' },
      { id: 6, name: 'Audi Q7' },
      { id: 7, name: '奥迪 777999' },
      { id: 8, name: '奥迪 888888' },
      { id: 9, name: '奥迪 66669999' }
    ]
  }

  // 广告投放数据
  putting = [
    { name: '1月', cost: 200000, exposure: 300000 },
    { name: '2月', cost: 300000, exposure: 380000 },
    { name: '4月', cost: 180000, exposure: 420000 },
    { name: '5月', cost: 280000, exposure: 320000 },
    { name: '8月', cost: 100000, exposure: 520000 },
    { name: '10月', cost: 380000, exposure: 260000 },
    { name: '12月', cost: 680000, exposure: 880000 }
  ]

  kol = {
    pendCount: 2,
    runningCount: 2,
    recommendList: [
      {
        id: 1,
        type: 'weibo',
        name: '莫言清风不识字',
        avatar: 'https://randomuser.me/api/portraits/women/66.jpg',
        title: '中国非著名骑车评论员、鲁迅文学院卫生管理员',
        fans: '94,869',
        recommended: true,
      },

      {
        id: 2,
        type: 'wechat',
        name: '西门吹雪',
        avatar: 'https://randomuser.me/api/portraits/women/60.jpg',
        title: '汽车达人',
        fans: '85,869'
      }
    ]
  }

  film = {
    pendCount: 2,
    runningCount: 2,
    recommend: {
      id: 1,
      name: '莫言清风不识字',
      cover: 'https://picsum.photos/id/268/320/480',
      date: '2019-09-30上映',
      type: '剧情/冒险',
      rate: '88.88%'
    }
  }
}
</script>

<style lang="less" scoped>
.page {
  position: relative;
  padding: 20px 0 40px;
}
</style>
