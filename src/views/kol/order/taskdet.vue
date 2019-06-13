<template>
  <div class="page">
    <Row class='title-box'>
      <Col :span='6'>
        <div class='img-box'>
          <img src="./assets/over.jpg" alt="">
        </div>
      </Col>
      <Col :span='8'  >
        <div class='tops'>
          硬朗有型的外观设计，宽敞灵活的全新7座格局，在#2019上海车展#梅赛德斯-奔驰GLB概念车昭示着新生代家族的最新成员即将到来。这不仅是…
        </div>
        <div class='bottoms'>
          <div class='t-im'><img src="./assets/over.jpg" alt=""></div>
          <div class='t-in'>papi酱</div>
          <div class='t-it'> 发布时间： 2019-05-25 18：00 </div>
        </div>
      </Col>
      <Col :span='9' style='margin-left: 1%;'>
        <div class='xnu'>
          <p class='small'>点赞</p>
          <p class='nus'>1.32万</p>
        </div>
        <div class='xnu'>
          <p class='small'>评论</p>
          <p class='nus'>1.32万</p>
        </div>
        <div class='xnu'>
          <p class='small'>转发</p>
          <p class='nus'>1.32万</p>
        </div>
      </Col>
    </Row>
    <div style='margin-top: 10px;'>
      <Row class='time'>
        <Col :span='8'>数据更新时间 ： 2019-02-02 25：20</Col>
      </Row>
      <Row class='cas' style='height: 500px;background: rgba(13, 53, 72, 1);color: #fff;'>
        <Row style='text-align: center;color: #fff; line-height: 60px; font-size: 16px; height: 60px;cursor: pointer;'>
          <Col :span='24'><span v-for='(it,index) in clicklist' :key='index' @click='change(it.key)'>{{it.text}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></Col>
          <div class='ti1' v-if='key == 1'></div>
          <div class='ti2' v-if='key == 2'></div>
          <div class='ti3' v-if='key == 3'></div>
        </Row>
        <div ref="container" style='height: 400px;'></div>
      </Row>
    </div>
    <Row style='margin-top: 10px;'>
      <Col :span='12' style='float: left;border-radius: 5px;height: 400px;padding: 20px 0 0 20px;background: rgba(13, 53, 72, 1);'>
        <div ref="containerc" style='height: 400px;'></div>
      </Col>
      <Col :span='11' style='float: right;border-radius: 5px;height: 400px;padding: 0 30px 30px 30px;background: rgba(13, 53, 72, 1);'>
      <!-- <Row class='recis'>评论热词</Row>
      <Row class='cis'>
        <span v-for='(it,index) in con' :key='index' class='fon' :style="{ color:'#A3D5E6', fontSize: fontSize() + 'px',top:top()+'px', transformOrigin: 'center center', webkitTransform : 'rotate('+Math.round(Math.random()*180) +'deg)'}">{{it + ' '}}</span>
      </Row> -->
      <!-- {{con}} -->
        <div class="chart-wp borderRadius">
          <WordCloud
            :initDone="true"
            :title="'评论热词'"
            :color="['rgba(0,32,45,0)']"
            :dataList="cons"
            :currentTypeIndex="10"
          />
        </div>
      </Col>
    </Row>
  </div>
</template>

<script lang="ts">
import { Component , Prop , Watch} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import moment from 'moment'
import { itemlist  } from '@/api/lastissue'
import { toMap } from '@/fn/array'
import { formatTimestamp } from '@/util/validateRules'
import WordCloud from './wordCloud/index.vue'
import echarts from 'echarts'
const timeFormat = 'YYYY-MM-DD HH:mm:ss'


@Component({
  components: {
    WordCloud
  }
})
export default class Main extends ViewBase {

  option: any = null
  optionc: any = null
  key: any = 1

  clicklist: any = [
    {
      key : 1,
      text: '转发数'
    },
    {
      key : 2,
      text: '评论数'
    },
    {
      key : 3,
      text: '点赞数'
    }
  ]

  cons: any = [
    {
      value : Math.floor(Math.random() * 100 + 1),
      name: '转发数'
    },
    {
      value : Math.floor(Math.random() * 100 + 1),
      name: '评论数'
    },
    {
      value : Math.floor(Math.random() * 100 + 1),
      name: '点赞数'
    }
  ]

  con: any = ['哈哈哈', '12132', '阿升大三', '大声地撒', 'dadasd', 'wqqw请我' ]


  activeColor() {
    const r = Math.floor(Math.random() * 256)
    const g = Math.floor(Math.random() * 256)
    const b = Math.floor(Math.random() * 256)
    const color = '#' + r.toString(16) + g.toString(16) + b.toString(16)
    return color
  }

  fontSize() {
      return 16 + Math.random() * 10
  }
  // 高频词汇动态文字位置
  top() {
    return Math.random() * 25
  }


  mounted() {
    this.seach()
  }

  change(key: any) {
    this.key = key
    this.seach()
  }




  async seach() {
    try {
      // 获取列表
      const datalist = await itemlist({id: 2})
      if (this.key == 1) {
        // alert(1)
      } else if (this.key == 2) {
        // alert(2)
      } else if (this.key == 3) {
        // alert(3)
      }
      this.option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#DA6C70'
                }
            }
        },
        // legend: {
        //     data: ['转发数'],
        //     x: '85%',
        //     y: 'top',
        // },
        data: [
          {
            itemStyle: {
              normal: {
                  color: '#fff',
                  label: {textStyle: {color: '#DA6C70'}}
              }
            }
          }
        ],
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0, color: '#DA6C70' // 0% 处的颜色
              }, {
                  offset: 0.4, color: '#5A4C59' // 100% 处的颜色
              }, {
                  offset: 1, color: '#414855' // 100% 处的颜色
              }]
          ), // 背景渐变色
        lineStyle: {
            width: 3,
            type: 'solid',
            color: '#DA6C70' // 折线的颜色
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          }
        },
        xAxis: [
            {
              type : 'category',
              boundaryGap : false,
              data: [ 1 , 2 , 3],
              axisLine: {
              lineStyle: {
                  color: 'white',
              }
            }
          }
        ],
        yAxis: [
            {
              type: 'value',
              axisLine: {
              lineStyle: {
                color: 'white',
              }
            }
          }
        ],
        series: [
            {
                name: '转发数',
                type: 'line',
                stack: '总量',
                areaStyle: {},
                data: [ 1 , 2 , 3],
            }
        ]
      }
      if (this.option && typeof this.option === 'object') {
          echarts.init(this.$refs.container as any).setOption(this.option, true)
      }

      this.optionc = {
        title : {
          text: '正负面情感',
          x: 'left',
          textStyle: {
            fontWeight: 'normal', // 标题颜色
            color: '#fff'
          },
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        color: ['#FF8B92' , '#F5D44E' , '#29CFE4'],
        tooltip : {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series : [
            {
                name: '情感来源',
                type: 'pie',
                radius: ['30%', '40%'],
                center: ['50%', '50%'],
                data: [
                    {value: 335, name: '正面'},
                    {value: 310, name: '中性'},
                    {value: 234, name: '负面'}
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
      }
      if (this.optionc && typeof this.optionc === 'object') {
          echarts.init(this.$refs.containerc as any).setOption(this.optionc, true)
      }
    } catch (ex) {
      this.handleError(ex)
    } finally {
    }
  }

}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
@import '~@/site/detailmore.less';
.page {
  padding-left: 30px;
  padding-right: 40px;
  color: #00202d;
}
.title-box {
  padding: 20px;
  border-radius: 5px;
  background: rgba(0, 32, 45, 0.9);
  height: 200px;
  .img-box {
    margin-top: 10px;
    padding-left: 10px;
    height: 140px;
    width: 90%;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .tops {
    font-size: 13px;
    color: #fff;
    line-height: 30px;
    height: 116px;
  }
  .bottoms {
    .t-im {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      float: left;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .t-in {
      float: left;
      line-height: 40px;
      color: #fff;
      margin-left: 14px;
      font-size: 14px;
    }
    .t-it {
      float: right;
      line-height: 40px;
      color: #fff;
      margin-right: 14px;
      font-size: 10px;
    }
  }
  .xnu {
    width: 32%;
    float: left;
    margin-left: 1%;
    text-align: center;
    color: #fff;
    .nus {
      font-size: 30px;
      line-height: 90px;
    }
    .small {
      font-size: 14px;
      padding-left: 20%;
      margin-top: 37px;
      text-align: left;
    }
  }
}
.time {
  color: #fff;
  line-height: 60px;
  font-size: 16px;
  height: 60px;
  background: rgba(4, 39, 54, 1);
  border-radius: 5px 5px 0 0;
  padding-left: 30px;
}
.fon {
  display: block;
  float: left;
  width: 20%;
  margin: 10px;
}
.recis {
  height: 65px;
  line-height: 65px;
  font-size: 17px;
  font-weight: 500;
  color: #fff;
}
.cis {
  width: 300px;
  height: 300px;
  margin: auto auto;
}
.ti1 {
  width: 50px;
  height: 2px;
  background: #fff;
  position: absolute;
  left: 42.1%;
  top: 80%;
}
.ti2 {
  width: 50px;
  height: 2px;
  background: #fff;
  position: absolute;
  left: 47.3%;
  top: 80%;
}
.ti3 {
  width: 50px;
  height: 2px;
  background: #fff;
  position: absolute;
  left: 52.6%;
  top: 80%;
}
</style>
