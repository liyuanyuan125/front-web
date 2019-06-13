<template>
  <div class="info-panel">
    <div class="wp">
      <div class="in">
        <Row type="flex" justify="space-between" class="t">
          <Col>城市</Col>
          <Col class="other"><i :style="{backgroundColor:citys.dColor}"></i>不同城市</Col>
        </Row>
        <Row type="flex" justify="space-between" class="c">
          <Col :span='9'>
            <div class="padding central">
              <div class="name-box">Papi酱</div>
              <ul type="flex" justify="space-between">
                <li v-for=" (item,index) in citys.kol" :key="index">
                  <xLine :itemName="item.cityName"
                  :itemValue="item.value"
                  :itemColor="citys.sColor"
                  ></xLine>
                </li>
              </ul>
            </div>
          </Col>
          <Col :span='15'>
            <div class="container">
                <div class='row'>
                    <div class="cell">
                        <div class="padding ">
                          <div class="name-box">Papi酱</div>
                          <ul type="flex" justify="space-between">
                            <li v-for=" (item,index) in citys.compare1" :key="index">
                              <xLine :itemName="item.cityName"
                              :itemValue="item.value"
                              :itemColor="` ${ isDifferent(item.cityName) ? citys.sColor : citys.dColor } `"
                              ></xLine>
                            </li>
                          </ul>
                        </div>
                    </div>
                    <div class="cell">
                        <div class="padding ">
                          <div class="name-box">Papi酱</div>
                          <ul type="flex" justify="space-between">
                            <li v-for=" (item,index) in citys.compare1" :key="index">
                              <xLine :itemName="item.cityName"
                              :itemValue="item.value"
                              :itemColor="` ${ isDifferent(item.cityName) ? citys.sColor : citys.dColor } `"
                              ></xLine>
                            </li>
                          </ul>
                        </div>
                    </div>
                </div>
                <div class='row'>
                    <div class="cell">
                        <div class="padding ">
                          <div class="name-box">Papi酱</div>
                          <ul type="flex" justify="space-between">
                            <li v-for=" (item,index) in citys.compare1" :key="index">
                              <xLine :itemName="item.cityName"
                              :itemValue="item.value"
                              :itemColor="` ${ isDifferent(item.cityName) ? citys.sColor : citys.dColor } `"
                              ></xLine>
                            </li>
                          </ul>
                        </div>
                    </div>
                    <div class="cell">
                      <div class="padding ">
                        <div class="name-box">Papi酱</div>
                        <ul type="flex" justify="space-between">
                          <li v-for=" (item,index) in citys.compare1" :key="index">
                            <xLine :itemName="item.cityName"
                            :itemValue="item.value"
                            :itemColor="` ${ isDifferent(item.cityName) ? citys.sColor : citys.dColor } `"
                            ></xLine>
                          </li>
                        </ul>
                      </div>
                    </div>
                </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import xLine from './line.vue'
@Component({
  components: {
    xLine
  }
})
export default class Citys extends ViewBase {
  @Prop({ type: Object, default: () => {} }) citys!: any
  get kolNames() {
    if ( !(this.citys.kol.length > 0 ) ) { return [] }
    return this.citys.kol.map((item: any) => {
      return item.cityName
    })
  }
  isDifferent(name: string) {
    if ( !(this.citys.kol.length > 0 ) ) { return }
    return this.kolNames.indexOf(name) > -1
  }
}
</script>
<style lang="less" scoped>
@import '~@/site/lib.less';
@import '../kolcompare.less';
</style>