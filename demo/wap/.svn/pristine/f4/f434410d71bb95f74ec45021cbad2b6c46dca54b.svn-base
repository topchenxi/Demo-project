
<template>
    <div class="attachment-wrap">
        <section class="attachment-title">
          <div class="attach-back-arrow" @click="back"></div>
            <span class="attachment-title-text">
            {{attachmentIndex}} / {{attachment.length}}
            </span>
        </section>
       <mt-swipe @change="handleChange" :auto="0" :show-indicators="false" class="attachment-slide" :style="{'height': slideHeight+'px'}">
      <mt-swipe-item v-for="(item, index) of attachment" :key="index">
          <div :style="{height:'100%',background: 'url('+IMG_URL+ item+') no-repeat center center', 'background-size': 'contain'}"></div>
      </mt-swipe-item>
    </mt-swipe>
    </div>
</template>

<script>
import header from "components/header/header";
import { IMG_URL } from "common/js/common";

export default {
  data() {
    return {
      attachment: this.$route.params.attachment,  // 从url获取附件数据
      attachmentIndex: 1,  //  显示的附件索引
      IMG_URL
    };
  },

  computed: {
    //  图片的高度等于浏览器宽度
    slideHeight() {
      return document.documentElement.clientWidth || document.body.clientWidth;
    }
  },

  components:{
    "v-header":header
  },

  methods: {
    back() {
      this.$router.go(-1);
    },

    // 改变显示附件的索引
    handleChange(index) {
      this.attachmentIndex = index+1;
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

.attachment-title-text
 position absolute
 left: 50%
 transform translateX(-50%)  
 font-size .8rem

.attach-back-arrow
 background: url("../images/icon_back_light.png") no-repeat .6rem center
 background-size: .5rem .95rem
 width: .5rem
 height: 100%
 display: inline-block
 padding-left: 2rem
 padding-right: 1rem
 float: left


.attachment-title
  height: 2.2rem
  line-height: 2.2rem
  text-align center

.attachment-wrap
 position absolute
 background: #fff
 width 100%
 height: 100%




.attachment-slide
 position: absolute
 left: 50%
 top: 50%
 transform: translate(-50%, -50%)
 width: 100%
 img 
  width: 100%
  height: 100%    

.aa{
  background-size 10px 10px
}
</style>
