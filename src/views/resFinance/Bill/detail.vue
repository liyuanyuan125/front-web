<template>
	<div class='page'>
		<div  class='items-title'>
			<img   src="./assets/info.png" alt="">
		</div>
		<Row class='title'>
			<Col class='title-col' :span='8'>
				<img src="./assets/order.png" alt="">
			</Col>
		</Row>
		<div  class='items'>
			<img @click='jump()' src="./assets/list.png" alt="">
		</div>
	</div>
</template>

<script lang="ts">
import { Component , Watch} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import moment from 'moment'
import { toMap } from '@/fn/array'
import { confirm , toast , info} from '@/ui/modal'



export default class Main extends ViewBase {
  async jump() {
    this.$router.push({ name : 'resFinance-Bill-info' })
  }
}



</script>


<style lang="less" scoped>
  .title {
    height: 46px;
    margin-top: 15px;
    .title-col {
      height: 46px;
      img {
        width: 73%;
        height: 83%;
      }
    }
  }
  .items {
    height: 653px;
    margin-top: 10px;
    cursor: pointer;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .items-title {
    height: 81px;
    margin-top: 10px;
    cursor: pointer;
    img {
      width: 100%;
      height: 100%;
    }
  }
</style>



