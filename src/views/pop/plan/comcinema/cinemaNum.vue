<template>
  <div class="page-cinema">
    <div>
      <Form ref="formInline" inline>

        <FormItem class="city" style="margin-left: 0px" v-if="type == 1" :label-width="0">
          <Select v-model="form.adverId" filterable clearable>
            <Option v-for="(item, index) in adverList" :value="item.id" :key="index">{{ item.name }}</Option>
          </Select>
          <Button class="search" style="height: 40px" type="primary" @click="handleSubmit('formInline')">搜索</Button>
        </FormItem>

        <FormItem class="city" style="margin-left: 0px" v-if="type == 2">
          <Select v-model="form.adverId" filterable clearable>
            <Option v-for="(item, index) in adverList" :value="item.id" :key="index">{{ item.name }}</Option>
          </Select>
          <Button class="search" style="height: 40px" type="primary" @click="handleSubmit('formInline')">搜索</Button>
        </FormItem>

        <FormItem class="cinema-num" style="margin-left: 0px" v-if="type == 3">
          <Select class="first" v-model="model1" style="width:150px">
            <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <Select style="width: 50%" v-model="form.adverId" filterable clearable>
            <Option v-for="(item, index) in adverList" :value="item.id" :key="index">{{ item.name }}</Option>
          </Select>
          <Button class="search" style="height: 40px" type="primary" @click="handleSubmit('formInline')">搜索</Button>
        </FormItem>

        <FormItem class="cinema-num" style="margin-left: 0px" v-if="type == 4">
          <Select class="first" v-model="model1" style="width:150px">
            <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <Select style="width: 50%" v-model="form.adverId" filterable clearable>
            <Option v-for="(item, index) in adverList" :value="item.id" :key="index">{{ item.name }}</Option>
          </Select>
          <Button class="search" style="height: 40px" type="primary" @click="handleSubmit('formInline')">搜索</Button>
        </FormItem>

      </Form>
    </div>
    {{type}}
    <div class="flex">
      <div class="cinema-left">
        <div v-if="type == 0">
          <CinemaSave />
        </div>
        <div v-else-if="type == 1">
          <Area :data="data.categorizedByAreaCode" />
        </div>
        <div v-else-if="type == 2">
          <Privince :data="data.categorizedByAreaCode" />
        </div>
        <div v-else-if="type == 3">
          <City :data="data.categorizedByAreaCode" />
        </div>
        <div v-else-if="type == 4">
          <Cinema :data="data.categorizedByAreaCode" />
        </div>
      </div>
      <div class="cinema-right">
        <dl>
          <dt><img src="../assets/check.png" alt=""><span>覆盖区域</span></dt>
          <dd>个</dd>
        </dl>
        <dl>
          <dt><img src="../assets/check.png" alt=""><span>覆盖省份</span></dt>
          <dd>个</dd>
        </dl>
        <dl>
          <dt><img src="../assets/check.png" alt=""><span>覆盖城市</span></dt>
          <dd>个</dd>
        </dl>
        <dl>
          <dt><img src="../assets/check.png" alt=""><span>覆盖影院</span></dt>
          <dd>个</dd>
        </dl>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import CinemaSave from './cinemaSave.vue'
import Area from './area.vue'
import Privince from './province.vue'
import City from './city.vue'
import Cinema from './cinema.vue'
@Component({
  components: {
    CinemaSave,
    Area,
    Privince,
    City,
    Cinema
  }
})
export default class Main extends ViewBase {
  @Prop({default: () => 0}) type!: number
  @Prop() data!: any

  form: any = {

  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
/deep/ .ivu-btn {
  border-radius: 0;
  height: 40px;
}
.page-cinema {
  /deep/ .ivu-form-item {
    width: 500px;
  }
  .city {
    /deep/ .ivu-form-item-content {
      width: 400px;
    }
    /deep/ .ivu-select-dropdown {
      width: 400px;
    }
  }
  .cinema-num {
    .first {
      /deep/ .ivu-select-selection {
        width: 150px;
      }
    }
    /deep/ .ivu-select-selection {
      width: 250px;
    }
  }
  .search {
    position: absolute;
  }
}

.flex {
  position: relative;
  display: flex;
  background: @c-head-bg;
  height: 440px;
  .cinema-right {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 40%;
    height: 400px;
    background: #fff;
    dl {
      display: flex;
      &:first-child {
        margin-top: 40px;
      }
      margin-bottom: 22px;
      dt {
        margin-left: 30px;
        margin-right: 20px;
        img {
          vertical-align: middle;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
