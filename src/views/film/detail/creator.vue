<template>
  <div class='page'>
    <!-- 导演 -->
  	<div class='director '>
  		<Row class='title'>导演&nbsp;Director</Row>
  		<Row class='bai-w' v-for='(it,index) in person.Director' :key='index'>
  			<Row  class='col-img'><img @click='jump(it.id)' :src="it.headImg == null  || it.headImg == '' ? 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2766636815,3165673923&fm=26&gp=0.jpg' : it.headImg" alt=""></Row>
  			<Row class='r-h'>
  				<Row class='de-ro' @click='jump(it.id)'>{{it.name}}<br>{{it.nameEn}}</Row>
  				<Row class='de-ro-two'>导演</Row>
  				<Row class='de-ro-thr'>代表作品:<br> <span  v-if='it.movies == null'>暂无</span>
           <div style='    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;'>
           <span v-if='it.movies != null' v-for='(its,index) in it.movies'><em>《{{its.name + ' '}}》</em></span></div></Row>
  			</Row>
  		</Row>
      <div v-if='person.Director.length == 0'>暂无导演</div>
  	</div>
    <!-- 演员 -->
  	<div class='cast'>
  		<Row  class='title'>演员&nbsp;Actor</Row>
  		<Row class='bai-w' v-for='(it,index) in actors' :key='index'>
  			<Row :span='2' class='col-img'>
          <img @click='jump(it.id)' :src="it.headImg == null  || it.headImg == '' ? 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2766636815,3165673923&fm=26&gp=0.jpg' : it.headImg" alt="">
          <span v-if='it.jyIndex'>{{it.jyIndex / 100}}</span></Row>
  			<Row class='r-h'>
  				<Row class='de-ro' @click='jump(it.id)'>{{it.name}}&nbsp;{{it.nameEn}}</Row>
  				<Row class='de-ro-two'>演员</Row>
  				<Row class='de-ro-thr'>代表作品:<br> 
           <span  v-if='it.movies == null'>暂无</span>
           <div style='    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;'>
           <span v-if='it.movies != null' v-for='(its,index) in it.movies'><em>《{{its.name + ' '}}》</em></span></div>
            </Row>
  			</Row>
  		</Row>
      <div v-if='person.Actor.length == 0'>暂无演员</div>
      <div class="show-all" v-if="person.Actor.length > 0">
        <span @click="sumToggle">{{sumTitle}}<Icon :class="{'sumDown': sumFlag == 0, 'sumUp': sumFlag == 1}" type="ios-arrow-down" size="25" /></span>
      </div>
  	</div>
    <!-- 编剧 -->
    <div class='director'>
      <Row  class='title'>编剧&nbsp;Writer</Row>
      <Row class='bai-w' v-for='(it,index) in person.Writer' :key='index'>
        <Row :span='2' class='col-img'><img @click='jump(it.id)' :src="it.headImg == null || it.headImg == '' ? 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2766636815,3165673923&fm=26&gp=0.jpg' : it.headImg" alt=""></Row>
        <Row class='r-h'>
          <Row class='de-ro' @click='jump(it.id)'>{{it.name}}&nbsp;{{it.nameEn}}</Row>
          <Row class='de-ro-two'>编剧</Row>
          <Row class='de-ro-thr'>代表作品:<br> <span  v-if='it.movies == null'>暂无</span>
           <div style='    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;'>
           <span v-if='it.movies != null' v-for='(its,index) in it.movies'><em>《{{its.name + ' '}}》</em></span></div></Row>
        </Row>
      </Row>
      <div v-if='person.Writer.length == 0'>暂无编剧</div>
    </div>
    <!-- 制片人 -->
    <div class='zhipian'>
      <Row  class='title'>制片人&nbsp;Producer</Row>
      <Row class='bai-w' v-for='(it,index) in produced' :key='index'>
        <Row :span='2' class='col-img'><img @click='jump(it.id)' :src="it.headImg == null  || it.headImg == '' ? 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2766636815,3165673923&fm=26&gp=0.jpg' : it.headImg" alt=""></Row>
        <Row class='r-h'>
          <Row class='de-ro' @click='jump(it.id)'>{{it.name}}&nbsp;{{it.nameEn}}</Row>
          <Row class='de-ro-two'>制片人</Row>
          <Row class='de-ro-thr'>代表作品:<br> <span  v-if='it.movies == null'>暂无</span>
           <div style='    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;'>
           <span v-if='it.movies != null' v-for='(its,index) in it.movies'><em>《{{its.name + ' '}}》</em></span></div></Row>
        </Row>
      </Row>
      <div v-if='produced.length == 0'>暂无制片人</div>
    </div>
  </div>
</template>

<script lang='ts'>
import {Component, Watch, Prop} from 'vue-property-decorator'
import UploadButton, { SuccessEvent } from '@/views/order/components/UploadButton.vue'
import ViewBase from '@/util/ViewBase'
import moment from 'moment'
import { queryList , mains } from '@/api/filmorder'
import { toMap } from '@/fn/array'
import { formatTimestamp } from '@/util/validateRules'
import WeekDatePicker from '@/components/weekDatePicker'
import { confirm , toast } from '@/ui/modal'
const timeFormat = 'YYYY-MM-DD HH:mm:ss'
@Component
export default class Main extends ViewBase {
  @Prop({ type: Number, default: 0 }) id!: number
  sumTitle = '展示全部'
  sumFlag = 0
  actors: any = []
  itemlist: any = {}
  person: any = {}
  produced: any = []

  mounted() {
    this.search()
  }

  sumToggle() {
    if (!this.sumFlag) {
      this.sumFlag = 1
      this.sumTitle = '向上隐藏'
      this.actors = this.person.Actor
    } else {
      this.sumFlag = 0
      this.sumTitle = '展示全部'
      this.actors = this.person.Actor.slice(0, 4)
    }
  }

  jump(id: any) {
    this.$router.push({ path : '/film/figure/' + id})
  }

  async search() {
    try {
      const { data } =  await mains(this.$route.params.id)
      this.itemlist = data
      this.person = data.personMap
      this.actors = this.person.Actor.slice(0, 4)
      this.produced = this.person['Produced by']
    } catch {

    } finally {

    }
  }
}

</script>
<style lang='less' scoped>
.page {
  background: rgba(0, 32, 45, 0.8);
  border-radius: 5px;
}
.director {
  width: 100%;
  padding: 15px;
  border-bottom: 2px solid rgba(79, 166, 187, 0.56);
  padding-bottom: 40px;
}
.title {
  font-weight: 500;
  color: #fff;
  line-height: 50px;
  font-size: 24px;
}
.cast {
  padding: 15px;
  border-bottom: 2px solid rgba(79, 166, 187, 0.56);
  padding-bottom: 0;
}
.zhipian {
  padding: 15px;
  padding-bottom: 0;
}
.col-img {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  margin: 0 auto;
  margin-bottom: 15px;
  overflow: hidden;
  img {
    max-width: 130px;
    width: 100%;
  }
  span {
    width: 50px;
    height: 24px;
    text-align: center;
    font-size: 12px;
    font-weight: 500;
    color: #fff;
    line-height: 25px;
    position: absolute;
    bottom: 2%;
    left: 31%;
    background: rgba(87, 180, 201, 1);
    border-radius: 19px;
  }
}
.de-ro {
  text-align: center;
  line-height: 20px;
  font-size: 18px;
  font-weight: 500;
  color: #fff;
}
.de-ro-two {
  text-align: center;
  line-height: 40px;
  font-size: 14px;
  font-weight: 400;
  color: #fff;
}
.de-ro-thr {
  text-align: center;
  line-height: 20px;
  height: 14px;
  font-size: 14px;
  font-weight: 400;
  color: #57b4c9;
}
.mores {
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  color: #fff;
  line-height: 70px;
  position: relative;
  span {
    position: absolute;
    top: 27px;
    display: inline-block;
    width: 11px;
    height: 11px;
    margin-left: 10px;
    border-left: 2px solid #ccc;
    border-bottom: 2px solid #ccc;
    transform-origin: 50% 50%;
    transform: rotate(-45deg);
  }
}
.bai-w {
  width: 25%;
  display: inline-block;
  margin-bottom: 40px;
}
.shadow {
  width: 28%;
  border-radius: 10px;
  height: 30px;
  margin: 5px 0 0 8px;
  background: #ccc;
  color: #fff;
  font-weight: bold;
  span {
    display: inline-block;
    border: 1px solid red;
    width: 30px;
    height: 30px;
  }
  b {
    position: absolute;
    left: 40px;
    font-size: 17px;
  }
}
.r-h {
  height: 110px;
}
.show-all {
  text-align: center;
  font-size: 14px;
  color: #b3bcc0;
  span {
    cursor: pointer;
  }
}
.sumDown {
  animation: sumDown .5s both;
}
@keyframes sumDown {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(180deg);
  }
}
.sumUp {
  animation: sumUp .5s both;
}
@keyframes sumUp {
  0% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(0);
  }
}
</style>