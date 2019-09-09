<template>
  <div class="info-content">
    <ul>
      <li>
        <label>姓名</label>
        <em>{{items.name}}</em>
      </li>
      <li>
        <label>邮箱</label>
        <em>{{items.email ? items.email : '暂无绑定邮箱'}}</em>
        <ChangeEmail @uploadEmail="list">
          <Button class="btn-item">{{items.email ? '更换邮箱' : '绑定邮箱'}}</Button>
        </ChangeEmail>
      </li>
      <li>
        <label>手机号</label>
        <em>{{items.mobile ? items.mobile : '暂无绑定手机号'}}</em>
        <ChangeMobile @uploadMobile="list ">
          <Button class="btn-item">{{items.mobile ? '更换手机' : '绑定手机'}}</Button>
        </ChangeMobile>
      </li>
    </ul>
  </div>
</template>

<script lang='ts'>
import {Component} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { accountDetail } from '@/api/account'
import ChangeEmail from './changeEmailDlg.vue'
import ChangeMobile from './changeMobileDlg.vue'


@Component({
  components: {
    ChangeEmail,
    ChangeMobile
  }
})
export default class Main extends ViewBase {
  items = {}

  async mounted() {
    this.list()
  }
  async list() {
    const { data } = await accountDetail()
    this.items = data.account || {}
  }
}

</script>
<style lang='less' scoped>
.info-content {
  background: rgba(255, 255, 255, 0.3);
  padding: 100px 0 40px 90px;
  margin: 54px 58px;
  border-radius: 5px;
  color: #00202d;
  min-height: 600px;
  li {
    font-size: 14px;
    display: flex;
    align-items: center;
    padding-bottom: 45px;
    label {
      font-size: 16px;
      width: 108px;
    }
    .btn-item {
      width: 120px;
      height: 40px;
      background: rgba(0, 32, 45, 1);
      border-radius: 25px;
      color: #fff;
      border: none;
      font-size: 14px;
    }
    em {
      width: 160px;
    }
  }
}
</style>