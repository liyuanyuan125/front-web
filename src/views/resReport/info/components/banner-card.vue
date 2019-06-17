<template>
  <div class="banner-wp">
    <div class="banner-box"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class BannerCard extends Vue {
  @Prop({ type: Object, default: () => ({}) }) data!: any

  selectPlan() {
    this.$emit('selectPlan')
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
.banner-wp {
  background: url('../assets/banner.jpg') #0d113e top left no-repeat;
  min-height: 140px;
  border-radius: 4px;
}
</style>
