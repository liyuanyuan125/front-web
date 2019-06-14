<template>
  <div class='page'>
    <!-- 导演 -->
  	<div class='director '>
  		<Row class='title'>导演&nbsp;Director</Row>
  		<Row class='bai-w'>
  			<Row  class='col-img'><img src="./assets/wait.jpg" alt=""></Row>
  			<Row class='r-h'>
  				<Row class='de-ro'>李任港<br>Daniel Lee</Row>
  				<Row class='de-ro-two'>导演 Director</Row>
  				<Row class='de-ro-thr'>代表作品:<br> 盗墓笔记 / 锦衣卫 / 老男孩猛龙过江</Row>
  			</Row>
  		</Row>
  	</div>
    <!-- 演员 -->
  	<div class='cast'>
  		<Row  class='title'>演员&nbsp;Cast</Row>
  		<Row class='bai-w'>
  			<Row :span='2' class='col-img'><img src="./assets/wait.jpg" alt=""><span>90.5</span></Row>
  			<Row class='r-h'>
  				<Row class='de-ro'>李任港&nbsp;Daniel Lee</Row>
  				<Row class='de-ro-two'>导演 Director</Row>
  				<Row class='de-ro-thr'>代表作品:<br> 盗墓笔记 / 锦衣卫 / 老男孩猛龙过江</Row>
  			</Row>
  		</Row>
      <Row class='bai-w'>
        <Row :span='2' class='col-img'><img src="./assets/wait.jpg" alt=""><span>90.5</span></Row>
        <Row class='r-h'>
          <Row class='de-ro'>李任港&nbsp;Daniel Lee</Row>
          <Row class='de-ro-two'>导演 Director</Row>
          <Row class='de-ro-thr'>代表作品:<br> 盗墓笔记 / 锦衣卫 / 老男孩猛龙过江</Row>
        </Row>
      </Row>
      <Row class='bai-w'>
        <Row :span='2' class='col-img'><img src="./assets/wait.jpg" alt=""><span>90.5</span></Row>
        <Row class='r-h'>
          <Row class='de-ro'>李任港&nbsp;Daniel Lee</Row>
          <Row class='de-ro-two'>导演 Director</Row>
          <Row class='de-ro-thr'>代表作品:<br> 盗墓笔记 / 锦衣卫 / 老男孩猛龙过江</Row>
        </Row>
      </Row>
  		<Row class='bai-w'>
  			<Row :span='2' class='col-img'><img src="./assets/wait.jpg" alt=""><span>90.5</span></Row>
  			<Row class='r-h'>
  				<Row class='de-ro'>李任港&nbsp;Daniel Lee</Row>
  				<Row class='de-ro-two'>导演 Director</Row>
  				<Row class='de-ro-thr'>代表作品:<br> 盗墓笔记 / 锦衣卫 / 老男孩猛龙过江</Row>
  			</Row>
  		</Row>
  		<Row class='bai-w'>
  			<Row :span='2' class='col-img'><img src="./assets/wait.jpg" alt=""><span>90.5</span></Row>
  			<Row class='r-h'>
  				<Row class='de-ro'>李任港&nbsp;Daniel Lee</Row>
  				<Row class='de-ro-two'>导演 Director</Row>
  				<Row class='de-ro-thr'>代表作品:<br> 盗墓笔记 / 锦衣卫 / 老男孩猛龙过江</Row>
  			</Row>
  		</Row>
      <div class='mores'>展开全部<span></span></div>
  	</div>
    <!-- 编剧 -->
    <div class='director'>
      <Row  class='title'>编剧&nbsp;Writer</Row>
      <Row class='bai-w'>
        <Row :span='2' class='col-img'><img src="./assets/wait.jpg" alt=""></Row>
        <Row class='r-h'>
          <Row class='de-ro'>李任港&nbsp;Daniel Lee</Row>
          <Row class='de-ro-two'>导演 Writer</Row>
          <Row class='de-ro-thr'>代表作品:<br> 盗墓笔记 / 锦衣卫 / 老男孩猛龙过江</Row>
        </Row>
      </Row>
    </div>
    <!-- 制片人 -->
    <div class='zhipian'>
      <Row  class='title'>制片人&nbsp;Producer</Row>
      <Row class='bai-w'>
        <Row :span='2' class='col-img'><img src="./assets/wait.jpg" alt=""></Row>
        <Row class='r-h'>
          <Row class='de-ro'>李任港&nbsp;Daniel Lee</Row>
          <Row class='de-ro-two'>导演 Director</Row>
          <Row class='de-ro-thr'>代表作品:<br> 盗墓笔记 / 锦衣卫 / 老男孩猛龙过江</Row>
        </Row>
      </Row>
      <Row class='bai-w'>
        <Row :span='2' class='col-img'><img src="./assets/wait.jpg" alt=""></Row>
        <Row class='r-h'>
          <Row class='de-ro'>李任港&nbsp;Daniel Lee</Row>
          <Row class='de-ro-two'>导演 Director</Row>
          <Row class='de-ro-thr'>代表作品:<br> 盗墓笔记 / 锦衣卫 / 老男孩猛龙过江</Row>
        </Row>
      </Row>
      <Row class='bai-w'>
        <Row :span='2' class='col-img'><img src="./assets/wait.jpg" alt=""></Row>
        <Row class='r-h'>
          <Row class='de-ro'>李任港&nbsp;Daniel Lee</Row>
          <Row class='de-ro-two'>导演 Director</Row>
          <Row class='de-ro-thr'>代表作品:<br> 盗墓笔记 / 锦衣卫 / 老男孩猛龙过江</Row>
        </Row>
      </Row>
    </div>
  </div>
</template>

<script lang='ts'>
import {Component, Vue} from 'vue-property-decorator'
@Component
export default class Main extends Vue {

}

</script>
<style lang='less' scoped>
.page {
  background: rgba(0, 32, 45, 0.8);
  border-radius: 5px;
}
.director {
  width: 100%;
  padding: 15px;
  border-bottom: 2px solid rgba(79, 166, 187, 0.56);
  padding-bottom: 40px;
}
.title {
  font-weight: 500;
  color: #fff;
  line-height: 50px;
  font-size: 24px;
}
.cast {
  padding: 15px;
  border-bottom: 2px solid rgba(79, 166, 187, 0.56);
  padding-bottom: 0;
}
.zhipian {
  padding: 15px;
  padding-bottom: 0;
}
.col-img {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  margin: 0 auto;
  margin-bottom: 15px;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
  span {
    width: 36px;
    height: 30px;
    text-align: center;
    font-size: 12px;
    font-weight: 500;
    color: #fff;
    line-height: 35px;
    position: absolute;
    bottom: 2%;
    left: 39%;
    background: url('./assets/hot.png');
    background-size: cover;
  }
}
.de-ro {
  text-align: center;
  line-height: 20px;
  font-size: 18px;
  font-weight: 500;
  color: #fff;
}
.de-ro-two {
  text-align: center;
  line-height: 40px;
  font-size: 14px;
  font-weight: 400;
  color: #fff;
}
.de-ro-thr {
  text-align: center;
  line-height: 20px;
  height: 14px;
  font-size: 14px;
  font-weight: 400;
  color: #57b4c9;
}
.mores {
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  color: #fff;
  line-height: 70px;
  position: relative;
  span {
    position: absolute;
    top: 27px;
    display: inline-block;
    width: 11px;
    height: 11px;
    margin-left: 10px;
    border-left: 2px solid #ccc;
    border-bottom: 2px solid #ccc;
    transform-origin: 50% 50%;
    transform: rotate(-45deg);
  }
}
.bai-w {
  width: 25%;
  display: inline-block;
  margin-bottom: 40px;
}
.shadow {
  width: 28%;
  border-radius: 10px;
  height: 30px;
  margin: 5px 0 0 8px;
  background: #ccc;
  color: #fff;
  font-weight: bold;
  span {
    display: inline-block;
    border: 1px solid red;
    width: 30px;
    height: 30px;
  }
  b {
    position: absolute;
    left: 40px;
    font-size: 17px;
  }
}
.r-h {
  height: 110px;
}
</style>