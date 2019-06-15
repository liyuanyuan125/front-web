<template>
  <div class="page">
    <div class='t-title'>订单状态：<span v-for='(item,index) in itemlist.statusList' :key='index' v-if='itemlist.status == item.key' >{{item.text}}</span></div>
    <div class='box'>
      <Row style='margin-bottom: 10px;' class='tits'>订单信息</Row>
      <div class='title-tip'>
      	<Row>
         <Col :span='12'><span>项目名称：</span>{{itemlist.projectName}}</Col>
         <Col :span='12'><span>订单编号：</span>{{itemlist.id}}</Col>
        </Row>
        <Row>
         <Col :span='12'><span>推广品牌：</span>{{itemlist.brandName}}</Col>
         <Col :span='12'><span>下单时间：</span>{{fonttime}}</Col>
        </Row>
        <Row>
         <Col :span='24'><span>推广内容：</span>{{itemlist.projectDescription == null ? '暂无' : itemlist.projectDescription}}</Col>
        </Row>
      </div>
      <div class='body'>
        <Row class='tits'>片方提供资源</Row>
        <div style='margin-top: 15px;border-bottom: 0px'>
          <Row style='padding: 20px;height:200px;background:rgba(255,255,255,0.3);border-radius:5px;'>
            <Col span='3'>
              <div class='div-img'>
                <img :src='itemlist.movieMainPic' alt="">
              </div>
            </Col>
            <Col span='9' class='row-x'>
              <Row style='font-size: 20px;margin-top: 15px;'>{{itemlist.movieName}}</Row>
              <Row><!-- <span v-for='(its,index) in type' :key='index'>
                      <em v-for='(items,index) in it.movieTypes' v-if='items == its.key'>{{its.text}}</em>
                    </span>{{type}} -->{{itemlist.movieTypes}}</Row>
              <Row>{{itemlist.movieReleaseDate}} 上映</Row>
            </Col>
            <Col :span='10'>
              <Row class='bus' style='margin-top: 18px;'> 电影海报   <br><span class='hui'>后台配置的使用说明，暂无使用说明</span> <a class='okbut' :href="itemlist.movieMainPic" :download='itemlist.movieMainPic'>立即下载</a></Row>
              <Row class='bus' > 电影票券  &nbsp;  {{itemlist.movieResource.coupon.count}}张   <br><span class='hui'>后台配置的使用说明，暂无使用说明</span> <a class='okbut' :download='itemlist.id'>立即下载</a></Row>
              <Row></Row>
            </Col>
          </Row>
        </div>
      </div>
      <Row class='tits' style='margin-top: 20px;'>品牌方提供资源</Row>
      <div class='body' style='margin-top: 20px;height:120px;background:rgba(255,255,255,0.3);border-radius:5px;'>
        <Row class='row-ul'>
          <span class='hui'>品牌方提供资源：</span><span v-for='(it,index) in itemlist.channelCodeList'>
            <em v-for='(its,index) in itemlist.brandResource.onlines' :key='index' v-if='it.key == its.channelCode'>{{it.text}}</em>
          </span>
          <span v-if='itemlist.brandResource.onlines == null'>暂无资源</span>
        </Row>
        <Row class='row-ul'>
          <span class='hui'>线下门店资源：</span><span v-for='(it,index) in itemlist.offlineResourceTypeList'>
            <em v-for='(its,index) in itemlist.brandResource.offlines' :key='index' v-if='it.key == its.channelCode'>{{it.text}}</em>
          </span>
          <span v-if='itemlist.brandResource.offlines == null'>暂无资源</span>
        </Row>
      </div>
      <div class='body'>
        <Row class='tits'>留言</Row>
        <Row class='liuyan'>
          {{itemlist.message}}
        </Row>
      </div>
      <div class='body'>
        <Row class='tits'>订单跟踪</Row>
        <div style='margin-top: 15px;background:rgba(255,255,255,0.3);border-radius:5px;padding : 30px;'>
          <ul>
            <li>
              <row class='itemss itemss-w'>暂无订单跟踪信息</row>
            </li>
            <!-- <li>
              <row class='itemss itemss-w'>
                <Col :span='3' class='ss-left'>ewqeqweqw<span></span></Col>
                <Col :span='18' class='ss-right'>qweqweqweqw</Col>
              </row>
            </li>
            <li  >
              <row class='itemss'>
                <Col :span='3' class='ss-left'>   qeqeqw<span></span></Col>
                <Col :span='18' class='ss-right'>qweqweqwe</Col>
              </row>
            </li> -->
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component , Watch} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import moment from 'moment'
import { itemlist  } from '@/api/filmorder'
import { toMap } from '@/fn/array'
import { formatTimestamp } from '@/util/validateRules'
import { confirm , toast } from '@/ui/modal'
const timeFormat = 'YYYY-MM-DD HH:mm:ss'


@Component({
  components: {
  }
})
export default class Main extends ViewBase {



  movieList: any = []


  itemlist: any = {}
  fonttime: any = ''

  type: any = []

  mounted() {
    this.seach()
  }




  async seach() {
    this.itemlist = []
    try {
      // 获取列表
      const datalist = await itemlist(this.$route.params.id)
      this.itemlist = datalist.data
      this.type = [
        {controlStatus: 1, text: '儿童', key: 'Kids'},
        {controlStatus: 1, text: '历史', key: 'History'},
        {controlStatus: 1, text: '纪录片', key: 'Documentary'},
        {controlStatus: 1, text: '战争', key: 'War'},
        {controlStatus: 1, text: '戏曲', key: 'Opera'},
        {controlStatus: 1, text: '音乐', key: 'Music'},
        {controlStatus: 1, text: '歌舞', key: 'Musical'},
        {controlStatus: 1, text: '犯罪', key: 'Crime'},
        {controlStatus: 1, text: '传记', key: 'Biography'},
        {controlStatus: 1, text: '青春', key: 'Youth'},
        {controlStatus: 1, text: '奇幻', key: 'Fantasy'},
        {controlStatus: 1, text: '短片', key: 'Short'},
        {controlStatus: 1, text: '惊悚', key: 'Thriller'},
        {controlStatus: 1, text: '冒险', key: 'Adventure'},
        {controlStatus: 1, text: '科幻', key: 'Sci-Fi'},
        {controlStatus: 1, text: '动作', key: 'Action'},
        {controlStatus: 1, text: '家庭', key: 'Family'},
        {controlStatus: 1, text: '动画', key: 'Animation'},
        {controlStatus: 1, text: '励志', key: 'Encouragement'},
        {controlStatus: 1, text: '喜剧', key: 'Comedy'},
        {controlStatus: 1, text: '悬疑', key: 'Mystery'},
        {controlStatus: 1, text: '爱情', key: 'Romance'},
        {controlStatus: 1, text: '剧情', key: 'Drama'}
      ]
      this.fonttime = moment(this.itemlist.frontCreateTime).format(timeFormat)
    } catch (ex) {
      this.handleError(ex)
    } finally {
    }
  }

}
</script>

<style lang="less" scoped>
.page {
  font-size: 14px;
  padding-left: 30px;
  padding-right: 40px;
}
.t-title {
  height: 98px;
  background: rgba(0, 32, 45, 1);
  border-radius: 5px;
  opacity: 0.9;
  font-size: 24px;
  font-weight: 500;
  color: rgba(249, 216, 94, 1);
  line-height: 98px;
  text-align: center;
}
.box {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 1);
  padding: 50px;
  margin-top: 10px;
}
.title-tip {
  margin-top: 10px;
  width: 100%;
  line-height: 40px;
  font-size: 14px;
  font-weight: 400;
  height: 160px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  padding: 10px 30px 10px 30px;
  span {
    color: rgba(0, 32, 45, 0.5);
  }
}
.hui {
  color: rgba(0, 32, 45, 0.5);
}
.body {
  margin-top: 10px;
  padding-top: 10px;
  // padding-left: 30px;
}
.li-title {
  padding: 0 10px 0 10px;
  height: 40px;
  background: rgba(249, 249, 249, 1);
  line-height: 40px;
  font-size: 13px;
  .li-ti-col {
    text-align: center;
  }
}
.div-img {
  width: 120px;
  height: 160px;
  img {
    width: 100%;
    height: 100%;
  }
}
.row-x {
  line-height: 35px;
  font-weight: 500;
  margin-left: 10px;
}
.row-ul {
  line-height: 50px;
  padding-left: 30px;
}
.okbut {
  display: inline-block;
  text-align: center;
  line-height: 24px;
  width: 100px;
  height: 24px;
  background: rgba(0, 32, 45, 1);
  border-radius: 12px;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  position: absolute;
  top: 0;
  right: 45%;
}
.tits {
  font-weight: bold;
}
.itemss {
  line-height: 50px;
  font-size: 14px;
  .ss-left {
    border-right: 1px dashed rgba(179, 188, 192, 1);
    span {
      width: 11px;
      height: 11px;
      background: url('./assets/hui.png');
      background-size: cover;
      position: absolute;
      top: 37%;
      right: -4.5%;
    }
  }
  .ss-right {
    padding-left: 40px;
  }
}
.itemss-w {
  line-height: 50px;
  font-size: 14px;
  .ss-left {
    border-right: 1px dashed rgba(179, 188, 192, 1);
    span {
      width: 17px;
      height: 17px;
      background: url('./assets/blok.png');
      background-size: cover;
      position: absolute;
      top: 37%;
      right: -6%;
    }
  }
  .ss-right {
    padding-left: 40px;
  }
}
.bus {
  height: 75px;
  line-height: 25px;
}
.liuyan {
  margin-top: 15px;
  height: 50px;
  line-height: 50px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  padding-left: 30px;
}
</style>
