<template>
  <div class="plan-box">
    <Row>
      <Col >
        <Form :model="form" ref="dataform" label-position="left" :rules="rule" :label-width="100" class="edit-input forms">
          <PreceptHead />
          <h3 class="layout-titles">投放影片
              <span class="item-detail">优先投放 3 部</span>
              <span class="custom">自定义投放电影</span>
          </h3>
          <div class="item-top">
            <ul class="film-list" v-if="filmList.length > 0">
              <li v-for="(it) in filmList" :key="it.id"
                :class="['film-item']">
                <div class="film-top">
                  <img :src="it.mainPicUrl" class="film-cover">
                  <div style="position: relative">
                    <p class="film-title">{{it.name}}</p>
                    <p class="film-title" style="margin-bottom: 20px">{{it.name}}</p>
                    <p><span>上映时间：</span>{{formatDate(it.openTime)}}</p>
                    <p><span>影片类型：</span>{{it.type.join('/')}}</p>
                    <p><span>想看人数：</span>{{it.viewNumber}}</p>
                    <i-circle class="circle-per" :size="73" :percent="80">
                      <p class="demo-Circle-inner" style="font-size:14px;height:16px;margin-top: 4px">匹配度</p>
                      <p class="demo-Circle-inner" style="font-size:22px">80%</p>
                    </i-circle>
                  </div>
                </div>

                <div class="film-center">
                  <p style="opacity: .7">受众性别</p>
                  <div class="file-sex-box">
                    <div>
                      <div class="file-sex-man" :style="{width: `${it.matching * 0.8 + 30}px`, height: `${it.matching * 0.8 + 30}px`}">
                        <img width="30px" height="30" src="./assets/man.png" alt="">
                      </div>
                    </div>
                    <span>男性：{{it.matching}}%</span>
                  </div>
                  <div class="file-sex-box">
                    <div>
                      <div class="file-sex-woman" :style="{width: `${it.matching * 0.8 + 30}px`, height: `${it.matching * 0.8 + 30}px`}">
                        <img width="30px" height="30" src="./assets/man.png" alt="">
                      </div>
                    </div>
                    <span>女性：{{it.matching}}%</span>
                  </div>
                </div>

                <div class="film-buttom">
                  <dl style="margin-bottom: 15px">
                    <dd>受众年龄：</dd>
                    <dt>{{it.matching}}%</dt>
                  </dl>
                  <dl>
                    <dd>投放周期：</dd>
                    <dt>{{it.week}}</dt>
                  </dl>
                </div>
              </li>
            </ul>
            <div>效果不足时允许系统投放更多影片确保曝光效果</div>
          </div>

          <h3 class="layout-titles">覆盖影院
            <span class="item-detail">影院总数</span>
            <span class="custom">下载列表</span>
            <span class="custom" style="margin-right: 160px">自定义投放影院</span>
          </h3>
          <div class="item-top">
           
          </div>
          <div class="item-top">
            <div class="cinema-box">
              <div class="cinema-right">
                <div>
                  <dl @click="tags(1)" :class="tag=='1' ? 'dl-active' : ''">
                    <dd>1234</dd>
                    <dt>覆盖影院</dt>
                  </dl>
                  <dl @click="tags(2)" :class="tag=='2' ? 'dl-active' : ''">
                    <dd>234</dd>
                    <dt>覆盖影线</dt>
                  </dl>
                  <dl @click="tags(3)" :class="tag=='3' ? 'dl-active' : ''">
                    <dd>23</dd>
                    <dt>覆盖城市</dt>
                  </dl>
                  <dl @click="tags(4)" :class="tag=='4' ? 'dl-active' : ''">
                    <dd>3</dd>
                    <dt>覆盖省份</dt>
                  </dl>
                </div>

                <div class="cinema-find">
                  <div style="position: relative">
                    <div :class="'border-top' + tag"></div>
                    <div :class="'border-bottom' + tag"></div>
                  </div>
                  <div class="cineme-input" v-if="tag == 1">
                    <Input placeholder="影院名称" style="width: 275px">
                        <Icon type="ios-search" slot="suffix" />
                    </Input>
                  </div>
                  <div class="cineme-input" v-if="tag == 2">
                    <Input placeholder="院线名称" style="width: 275px">
                        <Icon type="ios-search" slot="suffix" />
                    </Input>
                  </div>
                  <div class="cineme-input" v-if="tag == 3">
                    <Input placeholder="城市名称" style="width: 275px">
                        <Icon type="ios-search" slot="suffix" />
                    </Input>
                  </div>
                  <div class="cineme-input" v-if="tag == 4">
                    <Input placeholder="省份名称" style="width: 275px">
                        <Icon type="ios-search" slot="suffix" />
                    </Input>
                  </div>
                  <Table height="320" :loading="loading"  stripe :columns="columns" :data="tableDate">
                    <template slot-scope="{ row }" slot="citys">
                      {{row.name}}
                    </template>

                    <template slot-scope="{ row }" slot="code">
                      {{row.start}}
                    </template>
                  </Table>

                  <Page :total="total" v-if="total>0" class="btnCenter"
                    :current="pageIndex"
                    :page-size="pageSize"
                    :page-size-opts="[6, 20, 50, 100]"
                    show-total
                    show-sizer
                    show-elevator
                    :transfer = "true"
                    @on-change="sizeChangeHandle"
                    @on-page-size-change="currentChangeHandle"/>
                </div>
              </div>
            </div>
          </div>

          <div class="btn-center">
            <Button type="default" class="button-ok btn-next" @click="back('dataform')"><img width="16px" src="./assets/next.png" /> 返回上一步</Button>
            <Button type="primary" class="button-ok btn-save" @click="next('dataform')">保存导出方案</Button>
            <Button type="default" class="button-ok btn-export" @click="back('dataform')"><img width="16px" src="./assets/export.png" /> 导出投放方案</Button>
            <Button type="default" class="button-ok btn-collect" @click="back('dataform')">联系商务</Button>
          </div>
        </Form>  
      </Col>
    </Row>
  </div>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import PreceptHead from './precepthead.vue'
import PrecepFilm from './preceptfile.vue'
import { orienteering, cinemaFilm } from '@/api/popPlan.ts'
import moment from 'moment'

const timeFormat = 'YYYY-MM-DD'
@Component({
  components: {
    PreceptHead,
    PrecepFilm
  }
})
export default class App extends ViewBase {
  form: any = {
    name: ''
  }
  tag = 1
  pageIndex = 1
  pageSize = 6
  tableDate: any = []
  total = 0
  filmList: any = []
  loading = false
  columns = [
    {
      title: '影院名称',
      slot: 'citys',
      align: 'center'
    },
    {
      title: '转资编号',
      slot: 'code',
      align: 'center'
    },
    {
      title: '影院星级',
      slot: 'code',
      align: 'center'
    }
  ]

  get rule() {
    return {}
  }

  formatDate(data: any) {
    return data ? moment(data).format(timeFormat) : '暂无'
  }

  created() {
    this.init()
    this.seach()
  }

  // 每页数
  sizeChangeHandle(val: any) {
    this.pageIndex = val
    this.seach()
  }

  // 当前页
  currentChangeHandle(val: any) {
    this.pageSize = val
    this.seach()
  }

  async init() {
    const { data } = await orienteering({})
    this.filmList = data.items || []
  }

  async seach() {
    const { data: { items }} = await cinemaFilm({})
    this.tableDate = items || []
    this.total = this.tableDate.length
  }

  async next(dataform: any) {
    this.$emit('input', 3)
    try {
      const volid = await (this.$refs[dataform] as any).validate()
      if (volid) {
        this.$emit('input', 1)
      }
    } catch (ex) {
      this.handleError(ex)
    }
  }

  tags(id: any) {
    this.tag = id
  }

  back(dataform: any) {
    this.$emit('input', 1)
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
.plan-box {
  margin: 0 40px;
}
.layout-titles {
  font-size: 24px;
  font-weight: 500;
  color: rgba(0, 32, 46, 1);
  margin-left: 30px;
  margin-top: 46px;
  .item-detail {
    display: inline-block;
    width: 100px;
    font-size: 14px;
    margin-left: 20px;
  }
  .custom {
    position: absolute;
    font-size: 14px;
    right: 20px;
    width: 152px;
    height: 37px;
    line-height: 37px;
    text-align: center;
    background: rgba(240, 245, 248, 1);
    border-radius: 19px;
    opacity: 0.6181;
  }
}
.item-top {
  margin-left: 30px;
  font-size: 14px;
  color: #26344b;
}
.hint {
  position: absolute;
  left: 105px;
  top: 14px;
}
.button-ok {
  width: 200px;
  margin-right: 16px;
}
.btn-center {
  margin: 40px 0 30px;
  text-align: center;
}
.default-but {
  border: 1px solid #dcdee2;
  .button-style(#515a6e, rgba(236, 245, 255, 1));
}
.form-item-first:first-child {
  margin-bottom: 20px;
}
.film-list {
  display: flex;
  flex-wrap: wrap;
  margin-top: 15px;
  margin-bottom: 10px;
  .film-item {
    width: 32%;
    border-radius: 5px;
    position: relative;
    box-sizing: border-box;
    background: rgba(255, 255, 255, 0.3);
    padding: 28px;
    &:not(:nth-child(3n)) {
      margin-right: 1.5%;
    }
    .film-top {
      display: flex;
      img {
        width: 104px;
        height: 146px;
      }
      div {
        margin-left: 20px;
        height: 30px;
        line-height: 30px;
        flex: 1;
      }
      p {
        height: 24px;
        color: #00202d;
        span {
          opacity: .8;
        }
      }
      .film-title {
        font-size: 18px;
        width: 160px;
        color: #00202d;
        overflow: hidden;
        height: 24px;
        font-weight: 400;
      }
      .circle-per {
        position: absolute;
        top: -20px;
        right: -20px;
        z-index: 5;
      }
    }
    .film-center {
      margin: 15px 0;
      padding: 10px 0;
      display: flex;
      p {
        height: 30px;
        line-height: 30px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        span {
          margin-left: 10px;
        }
      }
      .file-sex-box {
        margin-left: 10px;
        width: 130px;
        text-align: center;
        span {
          text-align: center;
          color: rgba(87, 180, 201, 1);
          font-size: 14px;
        }
        > div {
          width: 110px;
          height: 110px;
          margin-left: 10px;
          display: flex;
          margin-bottom: 16px;
          justify-content: center;
          align-items: center;
          .file-sex-man {
            background: #00b6cc;
            border: 1px solid #00b6cc;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .file-sex-woman {
            background: #d96b6f;
            color: #da6c70;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }
    }
    .film-buttom {
      margin-top: 15px;
      margin-bottom: 15px;
      dl {
        display: flex;
        dd {
          color: rgba(0, 32, 45);
          opacity: .7;
        }
        dt {
          margin-left: 10px;
          color: rgba(0, 32, 45);
        }
      }
    }
  }
}
.cinema-box {
  display: flex;
  margin-right: 20px;
  overflow: auto;
  max-height: 498px;
  .cinema-right {
    display: flex;
    width: 100%;
    dl {
      width: 156px;
      height: 118px;
      margin-right: 10px;
      background: rgba(255, 255, 255, 0.3);
      border: 1px solid #fff;
      position: relative;
      &:not(:first-child) {
        margin-top: 8px;
      }
      dd {
        font-weight: 500;
        font-size: 30px;
        width: 100%;
        text-align: center;
        color: rgba(0, 32, 45, 1);
        line-height: 30px;
        margin-top: 30px;
        margin-bottom: 10px;
      }
      dt {
        text-align: center;
        font-size: 16px;
        color: #00202d;
      }
    }
    .dl-active {
      border-right: 0;
    }
    .dl-active::after {
      content: '';
      display: block;
      width: 10px;
      height: 118px;
      position: absolute;
      border-top: 1px solid #fff;
      border-bottom: 1px solid #fff;
      background: rgba(255, 255, 255, 0.3);
      right: -10px;
      top: -1px;
    }
    .cinema-find {
      flex: 1;
      padding-right: 20px;
      background: rgba(255, 255, 255, 0.3);
      border: 1px solid #fff;
      border-left: 0;
      .cineme-input {
        display: flex;
        justify-content: flex-end;
        margin-top: 26px;
        margin-bottom: 37px;
        /deep/ .ivu-input {
          border-radius: 5px;
          background: rgba(255, 255, 255, 0.3);
          border: 1px solid #fff;
          color: #fff;
        }
        /deep/ .ivu-input-suffix {
          background: #00202d;
          border-radius: 0 5px 5px 0;
        }
        /deep/ .ivu-icon-ios-search {
          color: #fff;
        }
      }
      .border-top1 {
        display: none;
      }
      .border-bottom1 {
        .tags;
        top: 118px;
        height: 376px;
      }
      .border-top2 {
        .tags;
        top: 0;
        height: 126px;
      }
      .border-bottom2 {
        .tags;
        top: 243px;
        height: 251px;
      }
      .border-top3 {
        .tags;
        top: 0;
        height: 252px;
      }
      .border-bottom3 {
        .tags;
        top: 369px;
        height: 126px;
      }
      .border-top4 {
        .tags;
        top: 0;
        height: 378px;
      }
      .border-bottom4 {
        display: none;
      }
      /deep/ .ivu-table-wrapper {
        margin: 14px 0 20px 14px;
      }
    }
  }
}
.btn-save {
  width: 200px;
  .button-style(#fff, #00202d);
  border-radius: 25px;
}
.btn-next {
  width: 200px;
  .button-style(#00202d, rgba(0, 0, 0, 0));
  vertical-align: middle;
  border-radius: 25px;
  img {
    vertical-align: middle;
  }
}
.btn-export {
  width: 200px;
  .button-style(#00202d, rgba(255, 255, 255, .6));
  border-radius: 25px;
  img {
    vertical-align: middle;
  }
}
.btn-collect {
  width: 200px;
  .button-style(#00202d, rgba(255, 255, 255, .6));
  border-radius: 25px;
}
.tags {
  position: absolute;
  left: -1px;
  background: #fff;
  width: 1px;
}
</style>

