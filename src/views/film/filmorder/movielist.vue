<template>
  <div class='page'>
     <Row>
       <Col :span="8">
          <div class='guanggao'>合作影片</div>
          <Col style='margin-left: 12px;' span="15">
            <Input v-model='query.filmName' enter-button placeholder="合作影片" @on-change="seachs"/>
          </Col>
        </Col>
        <Col :span="8">
          <div class='guanggao'>计划状态</div>
          <Col style='margin-left: 12px;' span="7">
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
        <Col :span="8">
          <div class='guanggao'>订单号</div>
          <Col style='margin-left: 12px;' span="15">
            <Input v-model='query.videoName' search enter-button placeholder="订单编号" @on-change="seachs"/>
          </Col>
        </Col>
     </Row>
     <!-- 列表 -->
     <ul class='itemul'>
          <li>
            <Row class='li-title'>
              <Col span='5'>订单号:20151654165165</Col>
              <Col span='16'>下单时间: 2019-02-02 08: 00</Col>
              <Col span='3'>待片方确认</Col>
            </Row>
            <Row class='li-item'>
              <Col span='7'>
                <Row style='line-height: 40px;'>合作影片:</Row>
                <Row>
                  <Col span='8'>
                    <div class='div-img'>
                      <img src="./assets/wait.jpg" alt="">
                    </div>
                  </Col>
                  <Col span='14' class='row-x'>
                    <Row>攀登者</Row>
                    <Row>剧情/冒险 (中国大陆)</Row>
                    <Row>2018-05-05 上映</Row>
                  </Col>
                </Row>
              </Col>
              <Col span='12' style=' padding: 50px 0 0 0;line-height: 25px'>
                <Row>申请资源:海报授权</Row>
                <Row>
                  <Col span='10'>《攀登者》首款海报</Col>
                  <Col span='8'>立即下载</Col>
                </Row>
                <Row>提供资源:微信官方宣传</Row>
              </Col>
              <Col span='4' style=' padding: 50px 0 0 0;line-height: 25px'>
                <Row>查看上传图片</Row>
                <Row>取消</Row>
                <Row><UploadButton @success="onUploadSuccess($event, )">请上传实际使用照片</UploadButton></Row>
                <Row>详情</Row>
              </Col>
            </Row>
          </li>
          <li>
            <Row class='li-title'>
              <Col span='5'>订单号:20151654165165</Col>
              <Col span='16'>下单时间: 2019-02-02 08: 00</Col>
              <Col span='3'>待片方确认</Col>
            </Row>
            <Row class='li-item'>
              <Col span='7'>
                <Row style='line-height: 40px;'>合作影片:</Row>
                <Row>
                  <Col span='8'>
                    <div class='div-img'>
                      <img src="./assets/wait.jpg" alt="">
                    </div>
                  </Col>
                  <Col span='14' class='row-x'>
                    <Row>攀登者</Row>
                    <Row>剧情/冒险 (中国大陆)</Row>
                    <Row>2018-05-05 上映</Row>
                  </Col>
                </Row>
              </Col>
              <Col span='12' style=' padding: 50px 0 0 0;line-height: 25px'>
                <Row>申请资源:海报授权</Row>
                <Row>
                  <Col span='10'>《攀登者》首款海报</Col>
                  <Col span='8'>立即下载</Col>
                </Row>
                <Row>提供资源:微信官方宣传</Row>
              </Col>
              <Col span='4' style=' padding: 50px 0 0 0;line-height: 25px'>
                <Row>查看上传图片</Row>
                <Row>取消</Row>
                <Row><UploadButton @success="onUploadSuccess($event, )">请上传实际使用照片</UploadButton></Row>
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
@Component
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
.guanggao {
  width: 15%;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  text-align: center;
  float: left;
}
.itemul {
  padding: 16px;
  font-size: 14px;
  li {
    border: 1px solid #ccc;
    margin-top: 15px;
    .li-title {
      padding: 0 10px 0 10px;
      height: 50px;
      background: #ccc;
      line-height: 50px;
    }
    .li-item {
      padding: 20px 10px 20px 30px;
    }
  }
}
.div-img {
  width: 90px;
  height: 130px;
  img {
    width: 100%;
    height: 100%;
  }
}
.row-x {
  line-height: 25px;
}
</style>