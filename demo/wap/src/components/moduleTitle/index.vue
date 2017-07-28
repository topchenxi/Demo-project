
<template>
    <div :class="['moduleTitle',!this.contentValue?'moduleTitle_mt':'']">
        <div class="defaultTitle" v-if="!this.contentValue">{{this.title}}</div>
        <div class="linkTitle" v-if="this.contentValue" @click="toNavRoute();">
            <img :src="IMG_URL + this.logo" alt="" class="logo" v-if="this.logo">
            <span class="title">{{this.title}}</span>
            <span class="icon"></span>
        </div>
    </div>
</template>

<script>
import { IMG_URL } from "common/js/common"; 

export default {
    props: {
        title:String,
        contentType:Number,
        contentValue:String,
        contentName:String,
        logo:String
    },
    data(){
        return {
            IMG_URL
        }
    },
    methods: {
        // 调用父级方法跳转
        toNavRoute(){
            this.$parent.navRoute(this.contentType, this.contentValue);
        }
    }
};
</script>


<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixins/index.styl"

.moduleTitle_mt
 margin-top:-0.6rem;
.moduleTitle
 height:2rem;
 overflow:hidden;
 .defaultTitle
  height:100%;
  font-size:0.7rem;
  line-height:2.8;
  color:rgba(0,0,0,0.54);
  text-align:center;
 .linkTitle
  text-align:center;
  background-color:#fff;
  border-bottom:1px solid rgba(0,0,0,0.12);
  .logo
   width:1.5rem;
   vertical-align: middle;
   display: inline-block;
  .title
   height:100%;
   font-size:0.7rem;
   line-height:2.8;
   color:rgba(0,0,0,0.54);
  .icon
   display:inline-block;
   width:1rem;
   height:1rem;
   background:url(images/icon_arrow.png) no-repeat center center;
   background-size: 1.2rem;
   vertical-align: middle;
</style>
