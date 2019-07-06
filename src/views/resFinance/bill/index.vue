<template>
	<div class='page'>
		<Row class='title'>
			<Col class='title-col' :span='8'>
				<img src="./assets/year.png" alt="">
			</Col>
			<Col class='title-col' :span='8'>
				<img src="./assets/month.png" alt="">
			</Col>
		</Row>
		<div  class='items'>
			<img @click='jump()' src="./assets/2019-03.png" alt="">
		</div>
		<div class='items'>
			<img  @click='jump()' src="./assets/2019-04.png" alt="">
		</div>
		<div  class='items'>
			<img @click='jump()' src="./assets/2019-05.png" alt="">
		</div>
		<div  class='items'>
			<img @click='jump()' src="./assets/2019-06.png" alt="">
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
    this.$router.push({ name : 'resFinance-Bill-detail' })
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
    height: 185px;
    margin-top: 10px;
    cursor: pointer;
    img {
      width: 100%;
      height: 100%;
    }
  }
</style>



