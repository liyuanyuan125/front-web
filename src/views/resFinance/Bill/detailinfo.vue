<template>
	<div class='page'>
		<div  class='items-title'>
			<img  src="./assets/info2.png" alt="">
		</div>
		<Row class='title'>
			<Col class='title-col' :span='4'>
				<img src="./assets/out.png" alt="">
			</Col>
		</Row>
		<div  class='items'>
			<img  src="./assets/list2.png" alt="">
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
    // this.$router.push({ name : 'resFinance-Bill-detail' })
  }
}



</script>


<style lang="less" scoped>
  .title {
    height: 46px;
    margin-top: 15px;
    .title-col {
      height: 46px;
      float: right;
      img {
        width: 86%;
        height: 89%;
      }
    }
  }
  .items {
    height: 860px;
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



