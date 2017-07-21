<template>

<header class="c-header border-1px" :class="{'c-header-fixed': isFixed, 'c-header-relative': !isFixed}">
    <i class="c-header-left-icon" @click="customBack?customBack():back()" v-if="isLeftIcon"></i>
    <slot name="left"></slot>
    <h1 class="c-header-title f-ellipsis-1" v-text="title"></h1>
    <slot name="right"></slot>
</header>

</template>

<script>

/**
 * c-header
 * @module components/header
 * @desc 顶部导航
 * @param {Function} [customBack] - 自定义返回 
 * @param {Boolean} [isFixed] - 固定定位  默认
 * @param {Boolean} [isLeftIcon] - 左侧显示图标 默认
 * @param {slot} [left] - 左侧按钮
 * @param {slot} [right] - 右侧按钮
 *
 * @example
 */

export default {
    name: "c-header",

    props: {
        customBack:{
            type: Function
        },
        isFixed: {
            type: Boolean,
            default: true
        },
        title: String,
        isLeftIcon: {
            type: Boolean,
            default: true
        }
    },

    methods: {
        back() {
            this.$router.go(-1);
        }
    }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixins/index.styl"

.c-header
 grid-size($head-h, $head-w)
 background: #fff 
 z-index: 1000
 border-1px-b(rgba(0,0,0,0.12))
 &-fixed
  position fixed
  left: 0
  top: 0
 &-relative
  position: relative
  left: 0
  top: 0
 &-title
  height: 100%
  width 12rem
  line-height: (88/40)rem
  font-size: .9rem
  text-align center   
  position: absolute
  top: 0
  left: 50%
  transform: translateX(-50%)
 &-left-icon
  display: block
  height: 100%
  float: left
  padding: 0 1.6rem 
  background: url("./icon_back_light.png") no-repeat $left-24 center
  background-size: (20/40)rem (38/40)rem
 &-left-text 
  display: block
  height: 100%
  padding: 0 .6rem
  float: left
  font-size: .8rem
  line-height 2.2rem
  color: $fs-color-active
  letter-spacing: -0.81px
 &-right-text
  height: 100%
  padding: 0 .6rem 0 1.2rem
  float: right
  font-size: .8rem
  color: rgba(0,0,0,0.20)
  line-height: 2.2rem
  letter-spacing: -0.81px
 &-right-icon
  height: 100%
  height: 1.2rem
  padding:.4rem .6rem .4rem 1.2rem
  width: 1.2rem
  position: absolute
  right: 0
 &-active
  color: #FF0030
</style>   