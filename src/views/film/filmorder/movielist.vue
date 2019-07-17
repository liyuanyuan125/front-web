<template>
  <div class='page'>
     <Row style='padding-left: 30px;'>
       <Col :span="7">
          <Col style='margin-left: 12px;' span="23">
            <Input v-model='query.name' enter-button placeholder="项目名称" @on-change="seachs"/>
          </Col>
        </Col>
        <Col :span="7">
          <Col style='margin-left: 8px;' span="23">
            <Select 
             v-model='query.brandId'  
             clearable
             filterable
             placeholder="全部品牌"
             remote
             :loading="loading"
             :remote-method="remoteMethod"
             @on-clear="brandList = []"
             @on-change="seachs">
              <Option
                v-for="item in brandList"
                :key="item.id"
                :value="item.id"
              >{{item.name}}</Option>
            </Select>
          </Col>
        </Col>
        <Col :span="7">
          <Col style='margin-left: 5px;' span="23">
            <Select v-model='query.status'  clearable placeholder="全部订单" @on-change="seachs">
              <Option
                v-for="item in statusList"
                :key="item.key"
                :value="item.key"
                v-if='item.key!=0'
              >{{item.text}}</Option>
            </Select>
          </Col>
        </Col>
        <Col :span="3">
          <span class='searchs'>查询</span>
        </Col>
     </Row>
     <!-- 列表 -->
     <ul class='itemul'>
      <Row class='mu-li'>
        <Col :span='7'>合作影片</Col>
        <Col :span='8' style='text-align: left;'>资源</Col>
        <Col :span='4'>计划状态</Col>
        <Col :span='5'>操作</Col>
      </Row>
          <li class='lis' v-for='(it,index) in itemlist'>
            <Row class='li-title'>
              <Col span='19'>订单号:{{it.id}}</Col>
              <Col span='5'><span class='hui'>下单时间:</span> {{it.frontCreateTime}}</Col>
            </Row>
            <Row class='li-item'>
              <Col span='7'>
                <Row>
                  <Col span='8'>
                    <div class='div-img'>
                      <img @click='jump(it.movieId)' :src='it.movieMainPic' alt="">
                    </div>
                  </Col>
                  <Col span='14' class='row-x'>
                    <Row style='font-size: 16px;font-weight: 500;line-height: 25px;'>{{it.movieName}}</Row>
                    <Row> <span v-for='(its,index) in type' :key='index'>
                      <em v-for='(items,index) in it.movieTypes' v-if='items == its.key'>{{its.text + '  '}}</em>
                    </span><!-- {{it.movieTypes}} --></Row>
                    <div>{{it.movieReleaseDate}} 上映</div>
                  </Col>
                </Row>
              </Col>
              <Col v-if='it.status != 6 || it.status != 7' span='8' style='line-height: 38px'>
                <Row style='margin-top: 13px;'><span class='hui'>申请资源:&nbsp;&nbsp;</span><em v-if='it.movieResource.material.need == true'>海报授权</em> <em style='margin-left: 2px;' v-if='it.movieResource.coupon.need == true'>电影票券</em>&nbsp;&nbsp;<em v-if='it.movieResource.coupon.need == false && it.movieResource.material.need == false '>暂无资源</em></Row>
                <Row><span class='hui'>提供资源:</span>&nbsp;&nbsp;<em v-if='it.brandResource.onlines == null'>暂无资源</em><em v-else v-for='(its,index) in channelCodeList' :key='index'>
                  <i v-for='(items,index) in it.brandResource.onlines' :key='index' v-if='its.key == items.channelCode'>{{its.text}}宣传&nbsp;</i>
                </em></Row>
              </Col>
              <Col v-if='it.status == 6 || it.status == 7' span='8' style='line-height: 25px'>
                <Row><span class='hui'>申请资源:&nbsp;&nbsp;</span><em v-if='it.movieResource.material.need == true'>海报授权</em> <em  style='margin-left: 2px;' v-if='it.movieResource.coupon.need == true'>电影票券</em>&nbsp;&nbsp;<em v-if='it.movieResource.coupon.need == false && it.movieResource.material.need == false '>暂无资源</em></Row>
                <Row>
                  <Col span='10' style='color: #00B6CC;margin-left: 53px;'>《攀登者》首款海报</Col>
                  <Col span='8'><a class='okbut' :href="it.movieMainPic" :download='it.movieMainPic'>立即下载</a></Col>
                </Row>
                <Row><span class='hui'>提供资源:</span> &nbsp;&nbsp;<em v-if='it.brandResource.onlines == null'>暂无资源</em><em v-else v-for='(its,index) in channelCodeList' :key='index'>
                  <i v-for='(items,index) in it.brandResource.onlines' :key='index' v-if='its.key == items.channelCode'>{{its.text}}宣传&nbsp;</i>
                </em></Row>
              </Col>

              <Col span='4' style='text-align: center;font-weight: 500;margin-top: 29px'><span class='sta' v-for='(item,index) in statusList' :key='index' v-if='it.status == item.key'>{{item.text}}</span></Col>
              <Col span='5' style='text-align: center; line-height: 25px;cursor: pointer;padding-top: 23px;'>
                <div v-if='it.status == 7' @click='onView(it.movieMainPic)'>查看上传图片</div>
                <Row v-if='it.status == 1 || it.status == 5'>取消</Row>
                <Row v-if='it.status == 6 || it.status == 7'><UploadButton @success="onUploadSuccess($event, it.id)">上传推广图片</UploadButton></Row>
                <div style='margin-top: 6px;' @click='view(it.id)' >详情</div>
              </Col>
            </Row>
          </li>
          <li v-if='itemlist.length == 0' style='height:50px;text-align: center;line-height: 50px;'>暂无数据</li>
        </ul>
        <Page
      :total="totalCount"
      v-if="totalCount>0"
      class="btnCenter plan-pages"
      :current="query.pageIndex"
      :page-size="query.pageSize"
      show-total
      @on-change="handlepageChange"
      @on-page-size-change="handlePageSize"/>
    
    <Modal v-model="viewerShow" title="查看图片" width="500" height="500">
      <img style="width: 100%;" :src="viewerImage" alt sizes srcset>
    </Modal>  </div>
</template>

<script lang='ts'>
import {Component, Watch} from 'vue-property-decorator'
import UploadButton, { SuccessEvent } from '@/views/order/components/UploadButton.vue'
import ViewBase from '@/util/ViewBase'
import moment from 'moment'
import { queryList , imgs } from '@/api/filmorder'
import { brandsList } from '@/api/shopping'
import { toMap } from '@/fn/array'
import { formatTimestamp } from '@/util/validateRules'
import WeekDatePicker from '@/components/weekDatePicker'
import { confirm , toast } from '@/ui/modal'
const timeFormat = 'YYYY-MM-DD HH:mm:ss'
@Component({
  components: {
    UploadButton,
  }
})
export default class Main extends ViewBase {
  value1 = 0
  query: any = {
    name: '',
    brandId: null,
    status: null,
    pageIndex: 1,
    pageSize: 10,
  }
  loading = false

  totalCount = 0
  brandList: any = []

  itemlist: any = []
  statusList: any = []
  typeList: any = []
  offlineResourceTypeList: any = []
  channelCodeList: any = []

  type: any = [
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

  // 查看图片
  viewerShow = false
  viewerImage = ''

  mounted() {
    this.seach()
  }

  seachs() {
    this.query.pageIndex = 1
    this.seach()
  }

  async seach() {
    try {
      const { data } = await queryList(this.query)
      this.totalCount = data.totalCount
      this.itemlist = (data.items || []).map((it: any) => {
        return {
          ...it,
          frontCreateTime : moment(it.frontCreateTime).format(timeFormat)
        }
      })
      this.statusList = data.statusList
      this.typeList = data.typeList
      this.offlineResourceTypeList = data.offlineResourceTypeList
      this.channelCodeList = data.channelCodeList
      // // 品牌列表
      // const brand = await brandsList({})
      // this.brandList = brand.data.items
    } catch (ex) {
    }
  }

  async remoteMethod(query: any) {
    try {
      if (query) {
        this.loading = true
        const {
          data: { items }
        } = await brandsList({
          name: query,
        })
        this.brandList = items || []
      }
      this.loading = false
    } catch (ex) {
      this.handleError(ex)
      this.loading = false
    }
  }

  async onUploadSuccess({ files }: SuccessEvent, id: number) {
      try {
        await imgs ( id ,  {reportImages: [files[0].fileId]}  )
        toast('操作成功')
        this.seach()
      } catch (ex) {
        this.handleError(ex)
      }
  }

  view(id: any) {
    this.$router.push({ path : '/film/filmorder/movielist/detail/' + id})
  }

  jump(id: any) {
    this.$router.push({ path : '/film/movie/' + id})
  }

  handlepageChange(size: any) {
    this.query.pageIndex = size
    this.seach()
  }
  handlePageSize(size: any) {
    this.query.pageIndex = size
    this.seach()
  }

  // 查看图片
  onView(url: string) {
    this.viewerImage = url
    this.viewerShow = true
  }

  // @Watch('query', {deep: true})
  // watchQuery() {
  //   this.seach()
  // }

}

</script>
<style lang='less' scoped>
.itemul {
  padding: 16px;
  font-size: 14px;
  li {
    height: 210px;
    background: rgba(255, 255, 255, 0.7);
    .li-title {
      padding: 0 30px 0 30px;
      height: 60px;
      line-height: 60px;
    }
    .li-item {
      padding: 0 0 0 30px;
    }
  }
}
.lis {
  &:nth-child(2n) {
    background: rgba(255, 255, 255, .5);
  }
}
.sta {
  display: block;
  margin-top: 10px;
}
.div-img {
  width: 90px;
  height: 120px;
  cursor: pointer;
  img {
    width: 100%;
    height: 100%;
  }
}
.row-x {
  line-height: 30px;
  margin-top: 10px;
}
.searchs {
  display: inline-block;
  width: 120px;
  height: 40px;
  background: rgba(249, 216, 94, 1);
  border-radius: 20px;
  text-align: center;
  line-height: 40px;
  font-weight: 400;
  cursor: pointer;
  margin-left: 3.2%;
}
/deep/ .ivu-select-selection {
  height: 40px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 1);
}
/deep/ .ivu-select-input {
  margin-top: 3px;
  color: #00202d;
  &::-webkit-input-placeholder {
    color: #00202d;
  }
}
/deep/ .ivu-input {
  height: 40px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 1);
  &::-webkit-input-placeholder {
    color: #00202d;
  }
}
.mu-li {
  height: 50px;
  background: rgba(0, 32, 45, 1);
  border-radius: 5px 5px 0 0;
  opacity: 0.9;
  line-height: 50px;
  text-align: center;
  color: #fff;
}
.hui {
  color: rgba(0, 32, 45, 0.5);
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
}
/deep/ .button-text {
  margin: 0 3px;
  display: inline-block;
  text-align: center;
  line-height: 24px;
  width: 100px;
  height: 24px;
  background: rgba(0, 32, 45, 1);
  border-radius: 12px;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
}
/deep/ .btnCenter {
  text-align: center;
  height: 100px;
  // background: rgba(32, 67, 80, 1);
  margin: 0 20px 0 20px;
  line-height: 100px;
  color: #fff;
}
/deep/ .ivu-page-prev {
  border: 0;
  background: rgba(255, 255, 255, 0);
}
/deep/ .ivu-page-next {
  border: 0;
  background: rgba(255, 255, 255, 0);
}
/deep/ .ivu-page-item-active {
  border-color: #eee;
  background: #eee !important;
  border-radius: 50%;
  color: #fff;
  width: 30px;
  height: 30px;
}
/deep/ .ivu-page-item {
  border: 0;
  display: inline-block;
  vertical-align: middle;
  // background: rgba(32, 67, 80, 1);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  line-height: 30px;
  margin-right: 4px;
  text-align: center;
  list-style: none;
  user-select: none;
  cursor: pointer;
  font-weight: 500;
  transition: border 0.2s ease-in-out, color 0.2s ease-in-out;
}
/deep/ .ivu-select-single .ivu-select-selection .ivu-select-placeholder {
  display: block;
  height: 40px;
  line-height: 40px;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-left: 8px;
  padding-right: 24px;
  color: #00202d;
}
/deep/ .ivu-select-single .ivu-select-selection .ivu-select-selected-value {
  display: block;
  height: 40px;
  line-height: 40px;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-left: 8px;
  padding-right: 24px;
  color: #00202d;
}
/deep/ .ivu-form .ivu-form-item-label, /deep/ .ivu-icon-ios-arrow-forward::before, /deep/ .ivu-icon-ios-arrow-back::before {
  color: #00202d;
}
</style>