<template>
  <div class="page home-bg">
    <Header v-model="type"/>
    <div>
      <Form :model="form" ref="dataform" label-position="left" :label-width="100" class="edit-input forms">
        <FormItem label="账号类别"  class="item-top form-item-type">
          <CheckboxGroup v-model="form.account" class="item-radio-top">
            <Checkbox class="check-item form-item-first" :label="0">不限</Checkbox>
            <Checkbox  v-for="it in accountList" :key="it.key" :label="it.key"
              class="check-item">{{it.text}}</Checkbox>
          </CheckboxGroup>
        </FormItem>
        <FormItem label="粉丝数量"  class="item-top form-item-type">
          <CheckboxGroup v-model="form.fans" class="item-radio-top">
            <Checkbox class="check-item form-item-first" :label="0">不限</Checkbox>
            <Checkbox  v-for="it in fansList" :key="it.key" :label="it.key"
              class="check-item">{{it.text}}</Checkbox>
          </CheckboxGroup>
        </FormItem>
        <FormItem label="地域分布"  class="item-top form-item-type">
          <CheckboxGroup v-model="form.area" class="item-radio-top">
            <Checkbox class="check-item form-item-first" :label="0">不限</Checkbox>
            <Checkbox class="check-item" :label='1'>指定区域</Checkbox>
          </CheckboxGroup>
        </FormItem>
        <FormItem label="价格区间"  class="item-top form-item-type">
          <CheckboxGroup v-model="form.price" class="item-radio-top">
            <Checkbox class="check-item form-item-first" :label="0">不限</Checkbox>
            <Checkbox  v-for="it in priceList" :key="it.key" :label="it.key"
              class="check-item">{{it.text}}</Checkbox>
          </CheckboxGroup>
        </FormItem>
        <FormItem label="受众性别"  class="item-top form-item-type">
          <CheckboxGroup v-model="form.sex" class="item-radio-top">
            <Checkbox class="check-item form-item-first" :label="0">不限</Checkbox>
            <Checkbox  v-for="it in sexList" :key="it.key" :label="it.key"
              class="check-item">{{it.text}}</Checkbox>
          </CheckboxGroup>
        </FormItem>
      </Form>  
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import Header from './header.vue'
import { queryList } from '@/api/kolList.ts'

// 保持互斥
const keepExclusion = <T>(
  value: T[],
  oldValue: T[],
  aloneValue: T,
  setter: (newValue: T[]) => any
) => {
  if (value.length > 1) {
    const newHas = value.includes(aloneValue)
    const oldHas = oldValue.includes(aloneValue)
    newHas && setter([aloneValue])
    newHas && oldHas && setter(value.filter(it => it != aloneValue))
  }
}
@Component({
  components: {
    Header
  }
})
export default class App extends ViewBase {
  type: number = 0
  form: any = {
    account: [0],
    fans: [0],
    sex: [0],
    price: [0],
    area: [0]
  }
  accountList: any = []
  fansList: any = []
  sexList: any = []
  priceList: any = []

  created() {
    this.init()
  }

  async init() {
    try {
      const { data } = await queryList({})
      this.accountList = data.accountList
      this.fansList = data.fansList
      this.sexList = data.sexList
      this.priceList = data.priceList
    } catch (ex) {
      this.handleError(ex)
    }
  }

  @Watch('form.account', { deep: true })
  watchformAccount(value: number[], oldValue: number[]) {
    // 不限与其他项互斥
    keepExclusion(value, oldValue, 0, newValue => {
      this.form.account = newValue
    })
  }

  @Watch('form.sex', { deep: true })
  watchformSex(value: number[], oldValue: number[]) {
    // 不限与其他项互斥
    keepExclusion(value, oldValue, 0, newValue => {
      this.form.sex = newValue
    })
  }

  @Watch('form.fans', { deep: true })
  watchformFans(value: number[], oldValue: number[]) {
    // 不限与其他项互斥
    keepExclusion(value, oldValue, 0, newValue => {
      this.form.fans = newValue
    })
  }

  @Watch('form.age', { deep: true })
  watchformAge(value: number[], oldValue: number[]) {
    // 不限与其他项互斥
    keepExclusion(value, oldValue, 0, newValue => {
      this.form.age = newValue
    })
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
.title {
  text-align: center;
  font-size: 26px;
  margin-top: 40px;
}
.item-top {
  margin-left: 30px;
}
.audit {
  text-align: center;
  height: 300px;
  line-height: 300px;
}
.audit-btn {
  text-align: center;
}
.check-item {
  position: relative;
  top: 3px;
  min-width: 80px;
  height: 30px;
  line-height: 30px;
  border-radius: 2px;
  text-align: center;
  margin-right: 15px;
  font-size: 14px;
  user-select: none;
  /deep/ .ivu-checkbox {
    display: none;
  }
  /deep/&.ivu-checkbox-wrapper-checked {
    color: #fff;
    border-color: @c-button;
    background-color: @c-button;
  }
}
</style>

