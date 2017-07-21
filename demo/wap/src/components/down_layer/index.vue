
<template>
    <div class="get-app-wrap" v-show="flag_showGetApp" :style="{bottom: bottom+'rem'}">
        <img class="close-icon" @click="closeDownLayer" src="./images/icon_close.png" alt="">
        <img class="app-icon" src="./images/icon_app.png" alt="">
        <div class="app-text-wrap">
          <p class="app-text1">
            e-Cantonfair.com APP
          </p>
          <p class="app-text2">
          Canton Fair's Official E-commerce Platform
          </p>
        </div>
        <div @click="toAppCenter" class="app-link">Get App</div>
    </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import { localStorage } from "common/js/util.js";
import { appLink } from "common/js/common.js";

export default {
    props: ["bottom"],

    computed: 
        mapState(["flag_showGetApp"]),
    
    methods: {
        ...mapMutations(["TOGGLE_DOWN_LAYER"]),
        
        //  关闭下载弹窗
        closeDownLayer() {
            this.TOGGLE_DOWN_LAYER();
        },
        //  链接到应用中心
        toAppCenter() {
        window.location.href = localStorage.get("userAgent")==="ios" ? appLink.ios : appLink.android;
        }
    },

    created() {
       //  判断客户端设备
       let u = navigator.userAgent;
       let isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //  android终端
       let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //  ios终端

       if (isAndroid) localStorage.set("userAgent", "android");
       if (isiOS) localStorage.set("userAgent", "ios");
    }
};
</script>


<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixins/index.styl"

.get-app-wrap   
 height: (128/40)rem
 background: rgba(0, 0, 0, .87)
 position: fixed
 width 100%
 bottom: 2.425rem 
 z-index 3000
 .close-icon
  grid-size((48/40)rem)
  position: absolute 
  top: 50%
  left: .6rem
  transform translateY(-50%)
 .app-icon
  grid-size((96/40)rem) 
  position: absolute 
  top: 50%
  left: (88/40)rem
  transform translateY(-50%)
 .app-text-wrap
  position absolute
  left: 5rem
  top: (36/40)rem
 .app-text1
  font-size: .7rem;
  color: #FFFFFF;
  letter-spacing: -0.61px;
  line-height: 1rem; 
 .app-text2
  font-size: (16/40)rem;
  color: rgba(255,255,255,0.70)
 .app-link
  grid-size(2rem, 4rem)
  border-radius: 4px
  line-height 2rem
  text-align center
  background: #FFF
  color: #FF0030
  font-size: .8rem
  letter-spacing: -0.81px
  position absolute 
  right: .6rem
  top: 50%
  transform: translateY(-50%)
</style>
