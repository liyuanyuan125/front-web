<template>
  <div class='page'>
     <Row style='padding-left: 30px;'>
       <Col :span="7">
          <Col style='margin-left: 12px;' span="18">
            <Input v-model='query.filmName' enter-button placeholder="合作影片" @on-change="seachs"/>
          </Col>
        </Col>
        <Col :span="7">
          <Col style='margin-left: 12px;' span="18">
            <Select v-model='query.status'  clearable placeholder="计划状态" @on-change="seachs">
              <Option
                v-for="item in []"
                :key="item.key"
                :value="item.key"
                v-if='item.key!=0'
              >{{item.text}}</Option>
            </Select>
          </Col>
        </Col>
        <Col :span="7">
          <Col style='margin-left: 12px;' span="18">
            <Input v-model='query.videoName' enter-button placeholder="订单编号" @on-change="seachs"/>
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
        <Col :span='8'>资源</Col>
        <Col :span='4'>计划状态</Col>
        <Col :span='5'>操作</Col>
      </Row>
          <li>
            <Row class='li-title'>
              <Col span='19'>订单号:20151654165165</Col>
              <Col span='5'><span class='hui'>下单时间:</span> 2019-02-02 08: 00</Col>
            </Row>
            <Row class='li-item'>
              <Col span='7'>
                <Row>
                  <Col span='8'>
                    <div class='div-img'>
                      <img src="./assets/wait.jpg" alt="">
                    </div>
                  </Col>
                  <Col span='14' class='row-x'>
                    <Row style='font-size: 16px;font-weight: 500;line-height: 25px;'>攀登者</Row>
                    <Row>剧情/冒险 (中国大陆)</Row>
                    <Row>2018-05-05 上映</Row>
                  </Col>
                </Row>
              </Col>
              <Col span='8' style='line-height: 25px'>
                <Row><span class='hui'>申请资源:</span>海报授权</Row>
                <Row>
                  <Col span='10' style='color: #00B6CC;margin-left: 53px;'>《攀登者》首款海报</Col>
                  <Col span='8'><span class='okbut'>立即下载</span></Col>
                </Row>
                <Row><span class='hui'>提供资源:</span>微信官方宣传</Row>
              </Col>
              <Col span='4' style='text-align: center;font-weight: 500;margin-top: 29px'>待片方上传资源</Col>
              <Col span='5' style='text-align: center; line-height: 25px'>
                <Row>查看上传图片</Row>
                <Row>取消</Row>
                <Row><UploadButton @success="onUploadSuccess($event, )">上传推广图片</UploadButton></Row>
                <Row>详情</Row>
              </Col>
            </Row>
          </li>
          <li>
            <Row class='li-title'>
              <Col span='19'>订单号:20151654165165</Col>
              <Col span='5'><span class='hui'>下单时间:</span> 2019-02-02 08: 00</Col>
            </Row>
            <Row class='li-item'>
              <Col span='7'>
                <Row>
                  <Col span='8'>
                    <div class='div-img'>
                      <img src="./assets/wait.jpg" alt="">
                    </div>
                  </Col>
                  <Col span='14' class='row-x'>
                    <Row style='font-size: 16px;font-weight: 500;line-height: 25px;'>攀登者</Row>
                    <Row>剧情/冒险 (中国大陆)</Row>
                    <Row>2018-05-05 上映</Row>
                  </Col>
                </Row>
              </Col>
              <Col span='8' style='line-height: 25px'>
                <Row><span class='hui'>申请资源:</span>海报授权</Row>
                <Row>
                  <Col span='10' style='color: #00B6CC;margin-left: 53px;'>《攀登者》首款海报</Col>
                  <Col span='8'><span class='okbut'>立即下载</span></Col>
                </Row>
                <Row><span class='hui'>提供资源:</span>微信官方宣传</Row>
              </Col>
              <Col span='4' style='text-align: center;font-weight: 500;margin-top: 29px'>待片方上传资源</Col>
              <Col span='5' style='text-align: center; line-height: 25px'>
                <Row>查看上传图片</Row>
                <Row>取消</Row>
                <Row><UploadButton @success="onUploadSuccess($event, )">上传推广图片</UploadButton></Row>
                <Row>详情</Row>
              </Col>
            </Row>
          </li>
          <li>
            <Row class='li-title'>
              <Col span='19'>订单号:20151654165165</Col>
              <Col span='5'><span class='hui'>下单时间:</span> 2019-02-02 08: 00</Col>
            </Row>
            <Row class='li-item'>
              <Col span='7'>
                <Row>
                  <Col span='8'>
                    <div class='div-img'>
                      <img src="./assets/wait.jpg" alt="">
                    </div>
                  </Col>
                  <Col span='14' class='row-x'>
                    <Row style='font-size: 16px;font-weight: 500;line-height: 25px;'>攀登者</Row>
                    <Row>剧情/冒险 (中国大陆)</Row>
                    <Row>2018-05-05 上映</Row>
                  </Col>
                </Row>
              </Col>
              <Col span='8' style='line-height: 25px'>
                <Row><span class='hui'>申请资源:</span>海报授权</Row>
                <Row>
                  <Col span='10' style='color: #00B6CC;margin-left: 53px;'>《攀登者》首款海报</Col>
                  <Col span='8'><span class='okbut'>立即下载</span></Col>
                </Row>
                <Row><span class='hui'>提供资源:</span>微信官方宣传</Row>
              </Col>
              <Col span='4' style='text-align: center;font-weight: 500;margin-top: 29px'>待片方上传资源</Col>
              <Col span='5' style='text-align: center; line-height: 25px'>
                <Row>查看上传图片</Row>
                <Row>取消</Row>
                <Row><UploadButton @success="onUploadSuccess($event, )">上传推广图片</UploadButton></Row>
                <Row>详情</Row>
              </Col>
            </Row>
          </li>
          <!-- <li class='li-item' v-if='itemlist.length == 0' style='text-align: center;'>暂无数据</li> -->
        </ul>
        <Page
      :total="totalCount"
      v-if="totalCount>0"
      class="btnCenter plan-pages"
      :current="query.pageIndex"
      :page-size="query.pageSize"
      show-total
      show-elevator
      @on-change="handlepageChange"
      @on-page-size-change="handlePageSize"
    />
  </div>
</template>

<script lang='ts'>
import {Component, Vue} from 'vue-property-decorator'
import UploadButton, { SuccessEvent } from '@/views/order/components/UploadButton.vue'
@Component({
  components: {
    UploadButton,
  }
})
export default class Main extends Vue {
  value1 = 0
  query: any = {
    filmName: '',
    status: 1,
    pageIndex: 1,
    pageSize: 4,
  }

  totalCount = 0

  seachs() {
    this.query.pageIndex = 1
    this.seach()
  }

  async seach() {

  }

  handlepageChange(size: any) {
    this.query.pageIndex = size
    this.seach()
  }
  handlePageSize(size: any) {
    this.query.pageIndex = size
    this.seach()
  }

}

</script>
<style lang='less' scoped>
.itemul {
  padding: 16px;
  font-size: 14px;
  li {
    height: 210px;
    background: rgba(245, 249, 252, 0.6);
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
.div-img {
  width: 90px;
  height: 120px;
  img {
    width: 100%;
    height: 100%;
  }
}
.row-x {
  line-height: 30px;
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
}
/deep/ .ivu-select-single .ivu-select-selection .ivu-select-placeholder, .ivu-select-single .ivu-select-selection .ivu-select-selected-value {
  margin-top: 3px;
  color: #00202d;
}
/deep/ .ivu-input {
  height: 40px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 1);
}
/deep/ .ivu-input-placeholder {
  color: #00202d;
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
  background: rgba(32, 67, 80, 1);
  margin: 0 20px 0 20px;
  line-height: 100px;
  color: #fff;
}
/deep/ .ivu-page-prev {
  border: 0;
  background: rgba(32, 67, 80, 1);
}
/deep/ .ivu-page-next {
  border: 0;
  background: rgba(32, 67, 80, 1);
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
  background: rgba(32, 67, 80, 1);
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
</style>