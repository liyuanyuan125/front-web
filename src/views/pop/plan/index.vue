<template>
  <div class="page home-bg">
    <h2 class="layout-nav-title">创建广告计划</h2>
    <Form :model="form" label-position="left" :label-width="100" class="edit-input forms">
      <h3 class="layout-title">基本信息</h3>
      <FormItem label="投放类型" class="item-top select-adv-type">
        <span
          :class="{active: form.putType == 'refBefore'}"
          @click="form.putType = 'refBefore'"
        >映前广告</span>
        <span :class="{active: form.putType == 'refafter'}" @click="form.putType = 'refafter'">线下场馆</span>
      </FormItem>
      <FormItem label="广告计划">
        <Input v-model="form.advMes" placeholder="如：2019款全新奔驰G级影院广告"></Input>
        <Select
          v-model="form.advType"
          class="select-adv-list"
          style="width:200px"
          @on-change="handleSelect"
        >
          <Option :value="item.id" :key="item.id" v-for="item in advTypeList">{{item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem label="投放排期">
        <div class="flex-box">
          <div class="put-tab">
            <p :class="{active: tabs == 1}" @click="tabs = 1">自定义时间段</p>
            <span></span>
            <p :class="{active: tabs == 2}" @click="tabs = 2">热门档期</p>
            <span></span>
          </div>
          <div class="tabs-active">
            <div v-if="tabs == 1">
              <DatePicker
                v-model="form.date"
                format="yyyy/MM/dd"
                type="daterange"
                placement="bottom-end"
                placeholder="请输入开始日期和结束日期"
              ></DatePicker>
            </div>
            <div v-else>
              <RadioGroup v-model="form.vacation">
                <Radio label="春节档"></Radio>
                <Radio label="情人节档"></Radio>
                <Radio label="五一档"></Radio>
                <Radio label="暑假档"></Radio>
              </RadioGroup>
            </div>
          </div>
        </div>
      </FormItem>
      <h3 class="layout-title">投放定向</h3>
      <FormItem label="广告版位" class="item-top">
        <div class="flex-box">
          <div class="adv-position">
            <span v-for="item in advList" :key="item.key" @click="handleTabs(item.id)">{{item.name}}</span>
          </div>
          <div class="select-tabs" :class="selectTab"></div>
        </div>
      </FormItem>
      <h3 class="layout-title">预算与计费</h3>
      <FormItem label="总预算/￥" class="item-top">
        <RadioGroup v-model="form.totalMonery">
          <Radio :label="item.label" :key="item.key" v-for="item in amountList"></Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="计算方式">
        <RadioGroup v-model="form.bill">
          <Radio label="按人次计费"></Radio>
        </RadioGroup>
      </FormItem>
    </Form>
    <div class="btnCenter">
      <button class="button-ok">生成投放方案</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class Main extends ViewBase {
  tabs = 1
  selectTab = 'tabs1'
  form = {
    putType: 'refBefore',
    advMes: '',
    advType: '',
    date: '',
    vacation: '春节档',
    totalMonery: '50万以下',
    bill: '按人次计费'
  }
  advTypeList = [
    { id: 1, name: '奔驰' },
    { id: 2, name: '西贝餐饮' },
    { id: 3, name: '阿玛尼' }
  ]
  amountList = [
    { key: 1, label: '50万以下' },
    { key: 2, label: '50~100万以下' },
    { key: 3, label: '50~100万以下' },
    { key: 4, label: '100~300万以下' },
    { key: 5, label: '300~500万以下' },
    { key: 6, label: '500~800万以下' },
    { key: 7, label: '800~1000万以下' },
    { key: 8, label: '指定金额' }
  ]
  advList = [
    { id: 1, name: '海报灯箱' },
    { id: 2, name: '墙体灯箱' },
    { id: 3, name: '冠名厅' },
    { id: 4, name: 'LCD拼接屏' },
    { id: 5, name: 'LED' },
    { id: 6, name: '卖品柜台屏幕' },
    { id: 7, name: '门贴' }
  ]
  handleSelect() {}
  handleTabs(val: any) {
    this.selectTab = `tabs${val}`
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
.select-tabs {
  margin: 30px 0 0 50px;
  width: 536px;
  height: 260px;
}
.tabs1 {
  background: url('./assets/tabs1.png') no-repeat;
  background-size: cover;
}
.tabs2 {
  background: url('./assets/tabs2.png') no-repeat;
  background-size: cover;
}
.tabs3 {
  background: url('./assets/tabs3.png') no-repeat;
  background-size: cover;
}
.tabs4 {
  background: url('./assets/tabs4.png') no-repeat;
  background-size: cover;
}
.tabs5 {
  background: url('./assets/tabs5.png') no-repeat;
  background-size: cover;
}
.tabs6 {
  background: url('./assets/tabs6.png') no-repeat;
  background-size: cover;
}
.tabs7 {
  background: url('./assets/tabs7.png') no-repeat;
  background-size: cover;
}

.btnCenter {
  margin: 40px 0 30px;
}
.forms {
  font-size: 14px;
  .select-adv-type {
    span {
      display: inline-block;
      width: 120px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      color: #444;
      margin-right: 20px;
      font-size: 14px;
      border: solid 1px #fff;
      cursor: pointer;
      background: fade(@c-sub-text, 10%);
      &.active {
        border: solid 1px @c-button;
      }
    }
  }
  /deep/ .ivu-form-item {
    margin-left: 100px;
    font-size: 14px;
  }
  /deep/ .ivu-select-selection {
    margin-left: 50px;
    width: 200px;
  }
  .put-tab {
    font-size: 14px;
    position: relative;
    span {
      position: absolute;
      top: 5px;
      right: -6px;
      display: inline-block;
      width: 2px;
      height: 30px;
      background: #ededed;
      &:nth-child(2) {
        right: -6px;
        top: 45px;
      }
    }

    p {
      width: 120px;
      padding: 4px 15px;
      border-bottom: solid 1px #ededed;
      cursor: pointer;
      &.active {
        color: @c-button;
      }
      &.active::before {
        display: block;
        content: '';
        position: absolute;
        left: 0;
        top: 5px;
        width: 10px;
        font-size: 14px;
        color: @c-button;
      }
    }
  }
  .tabs-active {
    margin-left: 30px;
    padding-top: 5px;
  }
  /deep/ .ivu-radio-wrapper {
    font-size: 14px;
    margin-right: 25px;
  }
  .adv-position {
    font-size: 14px;
    color: #444;
    width: 120px;
    margin-top: 30px;
    span {
      display: block;
      cursor: pointer;
      margin-bottom: 10px;
    }
  }
  /deep/ .ivu-radio-inner {
    // background-color: @c-button;
    // &::after {
    //   background-color: @c-button;
    // }
  }
}
</style>
