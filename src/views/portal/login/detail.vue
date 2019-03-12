<template>
  <div class="detal-box">
  
    <Row :style="{height: documentClientHeight+'px'}">
      <Row class="detal-msg" :style="{marginTop: (documentClientHeight - 500)/2 + 'px'}">
        <Col :span="10" offset="3">
        <div class="robot">
          <img style="width: 100%" src="./assets/robot.png">
          <img src="./assets/robot1.png">
          <img src="./assets/robot2.png">
        </div>
        </Col>
        <Col :span="10" offset="1">
          <div class="detail-little">
            <h3 class="title">机器算法</h3>
            <div class="detail-p">
              <p>行业领先的个性化推荐算法，</p>
              <p>通过分析影响受众的特征与投放需求进行匹配，</p>
              <p>实现精准化营销，</p>
              <p>我们将您把商业信息精准推荐给真正有需要的人，</p>
              <p>以减少广告浪费。</p>
            </div>
            <Button :to="{name: 'register'}" class="detail-button" type="primary" html-type="submit" >立即注册</Button>
          </div>
        </Col>
      </Row>
    </Row>

    <Row :style="{height: documentClientHeight+'px'}">
      <Row class="detal-msg" :style="{marginTop: (documentClientHeight - 500)/2 + 'px'}">
        <Col :span="7" offset="3">
          <div class="detail-little">
            <h3 class="title">人群画像</h3>
            <div class="detail-p">
              <p>我们拥有观影用户的多维数据，</p>
              <p>真正帮助广告主了解受众特征，</p>
              <p>制定定向投放，</p>
              <p>通过算法预测投放结果，</p>
              <p>为品牌与产品触达最优人群。</p>
            </div>
            <Button :to="{name: 'register'}" class="detail-button1" type="primary" html-type="submit" >立即注册</Button>
          </div>
        </Col>
        <Col :span="10">
        <div class="people">
          <img style="width: 100%" src="./assets/people.png">
          <img src="./assets/people1.png">
          <img src="./assets/people2.png">
        </div>
        </Col>
      </Row>
    </Row>

    <Row :style="{height: documentClientHeight+'px'}">
      <Row class="detal-msg" :style="{marginTop: (documentClientHeight - 500)/2 + 'px'}">
        <Col :span="10" offset="3">
        <div class="monitoring">
          <img style="width: 100%" src="./assets/monitoring.png">
          <img src="./assets/monitoring1.png">
          <img src="./assets/monitoring2.png">
        </div>
        </Col>
        <Col :span="8" offset="1">
          <div class="detail-little">
            <h3 class="title">透明监控</h3>
            <div class="detail-p">
              <p>打破传统映前广告投放形式，</p>
              <p>按观影人次计费，</p>
              <p>全面监控广告投放，</p>
              <p>广告效果清晰可见。</p>
            </div>
            <Button :to="{name: 'register'}" class="detail-button" type="primary" html-type="submit" >立即注册</Button>
          </div>
        </Col>
      </Row>
    </Row>

    <Row :style="{height: documentClientHeight+'px'}">
      <Row class="detal-msg" :style="{marginTop: (documentClientHeight - 500)/2 + 'px'}">
        <Col :span="8" offset="3">
          <div class="detail-little">
            <h3 class="title">精细报表</h3>
            <div class="detail-p">
              <p>多维度展示投放效果数据，</p>
              <p>包括影院、影厅、场次、观影人次、人群画像等,</p>
              <p>打造一站式服务。</p>
            </div>
            <Button :to="{name: 'register'}" class="detail-button1" type="primary" html-type="submit" >立即注册</Button>
          </div>
        </Col>
        <Col :span="10">
          <div class="report">
            <img style="width: 100%" src="./assets/report.png">
            <img src="./assets/report1.png">
            <img src="./assets/report2.png">
          </div>
        </Col>
      </Row>
    </Row>

    <Row class="blue" :style="{height: documentClientHeight+'px'}">
      <Row :style="{marginTop: (documentClientHeight - 500)/2 + 'px'}">
        <Col :span="10" offset="7">
          <div class="platform" ref="platform">
            <h3 class="title1">免费加入平台</h3>
            <Form :model="form" :rules="rules" ref="form" class="form"
                @submit.native.prevent="submit" novalidate :label-width="120">
                <FormItem label="联系人姓名" prop="email">
                  <Input type="email" v-model="form.email" placeholder="">
                  </Input>
                </FormItem>
                <FormItem label="公司名称" prop="password">
                  <Input type="text" v-model="form.password" placeholder="" :maxlength="16">
                  </Input>
                </FormItem>
                <FormItem label="公司所在地" prop="password">
                  <Input type="text" v-model="form.password" placeholder="" :maxlength="16">
                  </Input>
                </FormItem>
                <FormItem label="手机号码" prop="password">
                  <Input type="text" v-model="form.password" placeholder="" :maxlength="16">
                  </Input>
                </FormItem>
                <Button class="detail-button" type="primary" html-type="submit" long >立即提交</Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Row>

    <Row class="detail-footer" :style="{height: documentClientHeight+'px'}">
      <Row :style="{marginTop: (documentClientHeight - 400)/2 + 'px'}">
        <Col :span="16" offset="4">
          <div class="foot-box" ref="prentes">
            <h3>合作伙伴</h3>
            <div class="partner">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <div class="detail-brand">
              <div>
                <span>copyright&#169️2018 aiad</span>
                <span>北京智能广宣科技有限公司</span>
                <span>北京朝阳区亿利生态广场17层</span>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Row>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { animation } from '@/fn/self.ts'

@Component
export default class Main extends ViewBase {

  documentClientHeight: number = 0

  form: any = {
    name: '',
    companyName: '',
    adress: '',
    phone: '',
  }

  get rules() {
    return {}
  }

  mounted() {
    this.resetDocumentClientHeight()
    window.addEventListener('scroll', this.debounce(this.handleScroll, 100))
  }

  debounce(func: any, delay: any) {
      let prev: any = Date.now()
      return () => {
          const now = Date.now()
          if (now - prev >= delay) {
              func()
              prev = Date.now()
          }
      }
  }

  handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
    const title = document.querySelectorAll('.title')
    const detailP = document.querySelectorAll('.platform')
    const robot = Array.from(document.querySelectorAll('.robot img'))
    const report = Array.from(document.querySelectorAll('.report img'))
    const people = Array.from(document.querySelectorAll('.people img'))
    const monitoring = Array.from(document.querySelectorAll('.monitoring img'))
    /* tslint:disable */
    Array.from(title).forEach((it: any, index: number, data: any) => {
      const top = it.getBoundingClientRect().top
      const tops: any = []
      tops[index] = (data[index].getBoundingClientRect().top)
      if (index == 0) {
        if (tops[0] < this.documentClientHeight - 60 && tops[0] > -60) {
          animation(robot[1], { 'bottom': '340px' }, 2000, 'easeBothStrong')
          animation(robot[2], { 'bottom': '320px' }, 2000, 'easeBothStrong')
        } else {
          animation(robot[1], { 'bottom': '430px' }, 2000, 'easeBothStrong')
          animation(robot[2], { 'bottom': '430px' }, 2000, 'easeBothStrong')
        }
      }
      if (index == 1) {
        if (tops[1] < this.documentClientHeight - 60 && tops[1] > -60) {
          animation(people[1], { 'bottom': '110px' }, 2000, 'easeBothStrong')
          animation(people[2], { 'bottom': '290px' }, 2000, 'easeBothStrong')
        } else {
          animation(people[1], { 'bottom': '400px' }, 2000, 'easeBothStrong')
          animation(people[2], { 'bottom': '400px' }, 2000, 'easeBothStrong')
        }
      }
      if (index == 2) {
        if (tops[2] < this.documentClientHeight - 60 && tops[2] > -60) {
          animation(monitoring[1], { 'bottom': '110px' }, 2000, 'easeBothStrong')
          animation(monitoring[2], { 'bottom': '280px' }, 2000, 'easeBothStrong')
        } else {
          animation(monitoring[1], { 'bottom': '350px' }, 2000, 'easeBothStrong')
          animation(monitoring[2], { 'bottom': '440px' }, 2000, 'easeBothStrong')
        }
      }
      if (index == 3) {
        if (tops[3] < this.documentClientHeight - 60 && tops[3] > -60) {
          animation(report[1], { 'bottom': '290px' }, 2000, 'easeBothStrong')
          animation(report[2], { 'bottom': '165px' }, 2000, 'easeBothStrong')
        } else {
          animation(report[1], { 'bottom': '400px' }, 2000, 'easeBothStrong')
          animation(report[2], { 'bottom': '400px' }, 2000, 'easeBothStrong')
        }
      }
      if (top < this.documentClientHeight - 60 && top > -60) {
        animation(it, { 'opacity': '1', 'margin-bottom': '40px' }, 1000, 'easeBothStrong')
      } else {
        animation(it, { 'opacity': '1', 'margin-bottom': '0' }, 1000, 'easeBothStrong')
      }
    })
    if (this.getTop('prentes') < this.documentClientHeight + 10) {
      animation(this.$refs.prentes, { 'opacity': '1'}, 1000, 'easeBothStrong')
    } else {
      animation(this.$refs.prentes, { 'opacity': '.3'}, 1000, 'easeBothStrong')
    }
    if (this.getTop('platform') < this.documentClientHeight - 20 && this.getTop('prentes') > -20) {
      animation(this.$refs.platform, { 'opacity': '1'}, 1000, 'easeBothStrong')
    } else {
      animation(this.$refs.platform, { 'opacity': '.3'}, 1000, 'easeBothStrong')
    }
    /* tslint:disable */
  }

  getTop(dom: any) {
      return (this.$refs[dom] as any).getBoundingClientRect().top
  }

  destroyed() {// 离开该页面需要移除这个监听的事件
    window.removeEventListener('scroll', this.handleScroll)
  }

  resetDocumentClientHeight() {
    let heights = document.documentElement.clientHeight
    if (heights <= 600) {
      heights = 600
    }
    this.documentClientHeight = heights
    window.onresize = () => {
      let height = document.documentElement.clientHeight
      if (height <= 600) {
        height = 600
      }
      this.documentClientHeight = height
    }
  }
}
</script>

<style lang="less" scoped>
@h-color: #222;
@p-color: #444;

.detal-box {
  position: absolute;
  width: 100%;
  min-width: 1200px;
  .detal-msg {
    height: 500px;
    .detail-little {
      h3 {
        color: @h-color;
        font-size: 40px;
        margin-top: 40px;
      }
      p {
        color: @p-color;
        font-size: 18px;
        line-height: 2.5em;
      }
      .detail-button {
        margin-top: 20px;
        width: 200px;
        line-height: 40px;
        height: 50px;
      }
      .detail-button1 {
        margin-top: 20px;
        width: 200px;
        line-height: 40px;
        height: 50px;
        background: rgba(59, 152, 255, 1);
        border: 1px solid #3b98ff;
      }
    }
  }
}

.blue {
  background: rgba(34, 91, 239, 1);
  .title1 {
    color: #fff;
    text-align: center;
    font-weight: 500;
    font-size: 34px;
    margin-bottom: 40px;
  }
  /deep/ .ivu-form-item-label {
    font-size: 18px;
    color: #fff;
    text-align: left;
  }
  /deep/ form .ivu-form-item {
    margin-bottom: 34px;
    &:last-child {
      margin-bottom: 40px;
    }
  }
  /deep/ form input {
    outline: none;
    height: 40px;
    font-size: 15px;
    color: #fff;
    background: rgba(34, 91, 239, 1);
    border: 1px solid #fff;
    &:last-child {
      padding-left: 16px;
    }
  }
  .detail-button {
    color: rgba(34, 91, 239, 1);
    height: 48px;
    border: 1px solid #fff;
    background: #fff;
  }
}
.detail-footer {
  h3 {
    text-align: center;
    font-size: 40px;
    font-weight: 500;
    margin-bottom: 60px;
    color: #222;
  }
  .partner {
    display: flex;
    height: 200px;
    div {
      margin-right: 30px;
      width: 200px;
      background: rgba(239, 239, 239, 1);
      &:last-child {
        margin-right: 0;
      }
    }
  }
  .detail-brand {
    position: absolute;
    left: 0;
    right: 0;
    bottom: -130px;
    div {
      display: inherit;
      text-align: center;
      span {
        font-size: 14px;
        font-weight: 400;
        margin-right: 20px;
        color: rgba(136, 136, 136, 1);
      }
    }
  }
}
.platform {
  opacity: 0.1;
}
.title {
  opacity: 0.3;
  margin-bottom: 80px;
}
.detail-p {
  margin-bottom: 20px;
}
.robot {
  img:nth-child(1) {
    margin-top: 0;
  }
  img:nth-child(2) {
    position: absolute;
    left: 0;
    bottom: 430px;
  }
  img:nth-child(3) {
    position: absolute;
    right: 70px;
    bottom: 430px;
  }
}
.people {
  img:nth-child(1) {
    opacity: 1;
  }
  img:nth-child(2) {
    position: absolute;
    right: 110px;
    bottom: 400px;
  }
  img:nth-child(3) {
    position: absolute;
    left: 110px;
    bottom: 400px;
    z-index: 9;
  }
}
.report {
  img:nth-child(1) {
    opacity: 1;
  }
  img:nth-child(2) {
    position: absolute;
    left: 312px;
    bottom: 400px;
  }
  img:nth-child(3) {
    position: absolute;
    left: 14px;
    bottom: 400px;
    z-index: 9;
  }
}
.monitoring {
  img:nth-child(1) {
    opacity: 1;
  }
  img:nth-child(2) {
    position: absolute;
    left: 211px;
    bottom: 350px;
  }
  img:nth-child(3) {
    position: absolute;
    left: 230px;
    bottom: 440px;
    z-index: 9;
  }
}
.foot-box {
  opacity: 0.3;
}
</style>
