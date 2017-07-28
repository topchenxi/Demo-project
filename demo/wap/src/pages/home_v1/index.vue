<template>
  <div class="home-wrap">

    <!--顶部引导下载App-->
      <section class="home-top-app">
        <img src="./images/logo.png" alt="">
        <span @click="toAppCenter">Get App</span>
      </section>
    <!--顶部引导下载App-->

    <!--搜索框-->
      <router-link to="/search" class="home-search-box">
        <span>Search products or suppliers</span>
      </router-link>
    <!--搜索框-->
   
    <!--轮播-->
    <mt-swipe :auto="4000">
      <mt-swipe-item v-for="(item, index) of slide"
                     v-if="slide"
                     :key="index">
        <div @click="navRoute(index, 1)">
          <img :src="IMG_URL + item.imgUrlAndroidBackend"
               alt="">
        </div>
      </mt-swipe-item>
    </mt-swipe>
   <!--轮播-->

   <!--菜单-->
    <nav class="menu">
      <router-link to="/categoryFirst"
                   @click.native="toCaterory"><span>Categories</span></router-link>
      <a :href="'http://app.e-cantonfair.com/app_center1/map/map.html#type=0&vol=1&url=http://'+encodeURI(homeUrl.substr(7))"><span>Pavilion</span></a>
      <router-link to="/buyingRequest"><span>Get Quotation</span></router-link>
    </nav>
   <!--菜单-->

   <!--热门-->
    <section class="hot-wrap">
      <div class="inner border-1px">
        <div class="inner-l border-1px-r"
             @click="navRoute(0, 2)">
          <img :src="hotProducts.hotPro.img1_0"
               alt="" class="img_front">
          <img :src="hotProducts.hotPro.img1"
               alt="" class="img_back">
        </div>
        <div class="inner-r ">
          <div class="inner-r-t"
               @click="navRoute(1, 2)">
            <img :src="hotProducts.hotPro.img2_0"
               alt="" class="img_front">
            <img :src="hotProducts.hotPro.img2"
                 alt="" class="img_back">
          </div>
          <div class="inner-r-b border-1px"
               @click="navRoute(2, 2)">
            <img :src="hotProducts.hotPro.img3_0"
               alt="" class="img_front">
            <img :src="hotProducts.hotPro.img3"
                 alt="" class="img_back">
          </div>
        </div>
      </div>
    </section>
    <!--热门-->

   <!--广告-->
    <section class="adment-wrap">
      <div v-for="(item, index) of advertisement.list"
           class="ad-item"
           :key="index">
        <img :src="IMG_URL + item.imgUrlAndroidBackend"
             alt=""
             @click="navRoute(index, 3)">
      </div>
    </section>
   <!--广告 -->

   <!--推荐-->
    <ul class="recommend">
      <router-link tag="li"
                   :to="'/product/' + item.contentValue"
                   v-for="(item, index) of recommend"
                   :key="index">
        <img :src="IMG_URL + item.imgUrlAndroidBackend"
             alt="">
        <p class="ellipsis-2">{{item.contentName}}</p>
      </router-link>
    </ul>
    <!--推荐-->

    <!--版权声明-->
      <section class="home-copy-right">
        2012-2017 CantonFair E-commerce Co,.Ltd All Rights Reserved.
      </section>
    <!--版权声明-->

    <!--底部下载App弹窗-->
    <c-downLayer></c-downLayer>
    <!--底部下载App弹窗-->
  </div>
</template>

<script>
import { IMG_URL, appLink } from "common/js/common"; 
import {localStorage} from "common/js/util.js";
import { mapMutations } from "vuex";
import downLayer from "components/down_layer";

export default {
  data() {
    return {
      slide: [], // 轮播图片路径
      hotDetail: [],
      recommend: [],
      hotProducts: { // 热门产品
        hotPro: {}
      },
      advertisement: { // 广告
        list: []
      },
      routerFlag: null,  
      IMG_URL,
      homeUrl: window.location.href //  传给地图导航页面的本站链接
    };
  },
  
  components:{
    "c-downLayer": downLayer
  },

created() {
    // 做预览功能需要获取的参数
    let urlParams = location.search;
    let params = {
      appFlag:2
    };
    // 如果首页URL有自带参数，则处理为json格式
    if (urlParams.indexOf("?") > -1) {
      let paramStr = urlParams.split('?')[1];
      // xxx=1&aaa=2
      let paramArr = paramStr.split('&');
      for(let item of paramArr){
        let key_val = item.split('=');
        params[key_val[0]] = key_val[1];
      }
    }
    this.fetchData(params);
  },
  methods: {
  ...mapMutations([
    "CHANGE_CATEGORY_ENTRY", "HOME_TO_SEARCH"
  ]),

   //  获取首页数据
    fetchData(params) { 

      let url = "/home/getHomepage.cf";

      this.axios({
        method:'get',
        url:url,
        params:params
      })
      .then((res) => {
        this.distribute(res);
      });
    },

    //  拆分数据
    distribute(_res) { 

      let homeInfo = _res.data.data;

      // 轮播
      this.slide = homeInfo.homepageCarouselFigure.homepageDetails;

      // 热门 
      this.hotDetail = homeInfo.homepageWindow.homepageDetails;
      for (let [key, value] of this.hotDetail.entries()) {
        this.hotProducts.hotPro["img" + (key + 1)+"_0"] = IMG_URL + value.imgUrlIosFront;
        this.hotProducts.hotPro["img" + (key + 1)] = IMG_URL + value.imgUrlIosBackend;
      }

      // 广告 
      let advertisementInfo = homeInfo.homepageAdvertisement;
      this.advertisement.list = advertisementInfo.homepageDetails;

      // 推荐
      this.recommend = homeInfo.homepageRecommendProduct.homepageDetails;
    },

    //  跳转到应用中心
    toAppCenter() {
      window.location.href = localStorage.get("userAgent") === "ios" ? appLink.ios : appLink.android;
    },
  
    //  跳转不同页面
    navRoute(index, flag) {

      switch (flag) {
        // 轮播
        case 1:
          this.routerFlag = this.slide[index];
          break;

        // 热门
        case 2:
          this.routerFlag = this.hotDetail[index];
          break;

        // 广告
        case 3:
          this.routerFlag = this.advertisement.list[index];
      }

      switch (this.routerFlag.contentType) {
        //  跳转商品详情页
        case 1:
          return this.$router.push({
            path: "/product/" + this.routerFlag.contentValue
          });

       //  跳转店铺详情页 
        case 2:
          return this.$router.push({
            path: "/shop/" + this.routerFlag.contentValue
          });

       //  跳转类目搜索页
        case 3:
          let params = this.routerFlag.contentValue.split(";");
          return this.$router.push({
            path: "/categorySearch/" + params[0] + "/" + params[1]
          });

      //  跳转商品关键词搜索
        case 4:
          this.HOME_TO_SEARCH(false);
          return this.$router.push({
            path: "/search/" + this.routerFlag.contentValue
          });

      //  跳转店铺关键词搜索
        case 5:
          this.HOME_TO_SEARCH(false);
          return this.$router.push({
            path: "/search/" + this.routerFlag.contentValue
          });

      //  直接跳转链接
        // case 6:
        // return this.$router.push({
        //   path: this.routerFlag.contentValue
        // });
      }
    },

    //  从首页进类目
    toCaterory() {
      this.CHANGE_CATEGORY_ENTRY(false);
    }
  }

};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../common/stylus/mixins/index.styl"


   /*slide*/
    .mint-swipe 
      height: 8rem
      img 
        width: 100%
        height: 8rem
        display: block

  

     /*nav   */
    .menu 
      height: 4.95rem
      background: #fff
      a
        text-align center
        float: left
        display: inline-block
        width: 33.3%
        height: 100%
        text-align: center
        display: block
        color: rgba(0, 0, 0, 0.87)
        font-size: .7rem
        line-height: .7rem
        white-space: nowrap
        position: relative
        span
          display block
          width 100%
          position: absolute
          bottom:.75rem
          left: 0
        &:nth-child(1)
         background:url("images/icon_home_categories@3x.png") no-repeat center .75rem
         background-size: 2rem
        &:nth-child(2)
         background:url("images/icon_home_pavilion@3x.png") no-repeat center .75rem
         background-size: 2rem
        &:nth-child(3)
         background:url("images/icon_home_getquotations@3x.png") no-repeat center .75rem
         background-size: 2rem

.ad-title-warp
  height: 3.035rem
  text-align: center
  background: #fff

.main-title 
 font-size: .8rem;
 color: rgba(0,0,0,0.87);
 letter-spacing: -0.81px;
 line-height: .8rem;
 padding-top: .875rem

.sub-title
  font-size: .55rem
  color: rgba(0,0,0,0.54)
  letter-spacing: -0.21px

sup 
  vertical-align: super
  font-size: smaller

.ad-item 
  height: 4.6rem
  display: block
  width: 100%
     
.search-enter
   height: 1.4rem
   display: block
   position: absolute
   top: 1.4rem
   left:50%
   transform: translateX(-50%)
   font-size: .7rem
   padding: 0 1rem 0 1.8rem
   color: rgba(0,0,0,0.26)
   letter-spacing: -0.61px
   z-index: 200
   background: #FFFFFF url("./images/icon_search_light.png") no-repeat .8rem center
   background-size: .7rem .7rem
   border-radius: 4px
   -webkit-border-radius: 4px
   white-space: nowrap
   box-sizing border-box
   span
    position: relative;
    top: .4rem

.adment-wrap
 padding-bottom: .6rem
 img
  width: 100%
  height: 100%

.recommend
 overflow hidden
 li
  background: #fff
  width: 50%
  float: left
  padding: .6rem .6rem .6rem .575rem
  box-sizing border-box
  position relative
  img
   width: 8.2rem
   height: 8.2rem
  p
   height 2rem
   line-height:1rem;
   font-size: .7rem;
   color: rgba(0,0,0,0.87);
   letter-spacing: -0.61px; 
  &:before
   display: block
   position: absolute
   width: 100%
   right:0
   top: 0
   border-top: 1px solid rgba(0, 0, 0, .12)
   content: "" 
   transform: scaleY(.5)
  &:nth-child(odd)
   &:after
    display: block
    position: absolute
    height: 100%
    right:0
    top: 0
    border-right: 1px solid rgba(0, 0, 0, .12)
    content: "" 
    transform: scaleX(.5)
    // border-1px-r(rgba(0, 0, 0, .12))


   /*hotProducts*/
.hot-wrap 
  border-top: .6rem solid #f3f4f6
  border-bottom: .6rem solid #f3f4f6
  img 
   width: 100%
   height: 100%
  .img_front
   z-index:2
  .img_back
   z-index:1
  .inner
   height: 9rem
   width: 100%
   overflow: hidden
   border-1px-t(rgba(0, 0, 0, .12))
  a
   display: block
  .inner-l 
   width: 40.5%
   height: 100%
   float:left
   border-1px-r(rgba(0, 0, 0, .12), false)
   position:relative;
   .img_front
    position:absolute;
    left:0;
    bottom:0;
    height:auto;
  .inner-r
   width:59.5%
   height: 100% 
   float left
   .inner-r-t,
   .inner-r-b
    height: 50%;
    position:relative;
    .img_front
     position:absolute;
     left:0;
     top:0;
     width: 54%;
     height: auto;
   .inner-r-b
    border-1px-t(rgba(0, 0, 0, .12), false)
 
.home-top-app
 height: (96/40)rem
 position: relative
 background: #FaFaFa
 img
  width: (364/40)rem
  position: absolute
  left: .6rem
  top: .6rem 
 span 
  font-size: (32/40)rem
  color: rgba(0,0,0,0.54)
  letter-spacing: -0.81px
  position: absolute 
  bottom: .6rem
  right: .6rem

.home-search-box
 background: #FAFAFA
 height: (88/40)rem
 padding: (16/40)rem .6rem
 box-sizing border-box
 display: block
 position: relative
 span
  padding-left: (48/40)rem
  line-height 1rem
  font-size: .7rem
  white-space: nowrap
  color: rgba(0,0,0,0.26);
  letter-spacing: -0.61px;
  background: url("./images/icon_search_light.png") no-repeat 0 .05rem
  background-size: (34/40)rem (34/40)rem 
  position: absolute
  top: 50%
  left: 50%
  transform: translate(-50%,-50%)
  z-index 2000

.home-search-box::after 
    content: ''
    width: 187%
    height: (56/40)*2rem
    font-size: 1.2rem
    color: rgba(0,0,0,0.26)
    letter-spacing: -0.61px
    line-height: @height
    border: 1px solid rgba(0,0,0,0.12)
    position: absolute
    background: #FFF
    border-radius: 8px
    -webkit-transform: scale(0.5,0.5)
    transform: scale(0.5,0.5)
    -webkit-transform-origin: top left

.home-copy-right  
  margin-top: (48/40)rem
  padding-bottom: (40/40)rem
  font-size: (20/40)rem
  color: rgba(0,0,0,0.54)
  letter-spacing: -0.41px
  text-align: center

.home-bottom-app
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

.home-wrap
 padding-bottom:2.425rem 
</style>