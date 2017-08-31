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
      <mt-swipe-item v-for="(item, index) of homepageCarouselFigure.homepageDetails" v-if="homepageCarouselFigure.homepageDetails.length>0" :key="index">
        <div @click="navRoute(item.contentType, item.contentValue)">
          <img v-if="item.imgUrlAndroidBackend" :src="IMG_URL + item.imgUrlAndroidBackend" alt="">
        </div>
      </mt-swipe-item>
    </mt-swipe>
    <!--轮播-->
    <!--菜单-->
    <nav class="menu">
      <router-link to="/categoryFirst" @click.native="toCaterory"><span>Categories</span></router-link>
      <a :href="'http://app.e-cantonfair.com/app_center1/map/map.html#type=0&vol=1&url=http://'+encodeURI(homeUrl.substr(7))"><span>Pavilion</span></a>
      <router-link to="/buyingRequest"><span>Get Quotation</span></router-link>
    </nav>
    <!--菜单-->
    <!-- 文字滚动轮播 -->
    <section class="textSlide" v-if="homepageWordFigure">
      <span class="icon"></span>
      <span class="line"></span>
      <div class="textList">
        <swiper :options="swiperOption" ref="mySwiper">
          <swiper-slide v-for="(item, index) in homepageWordFigure.homepageDetails" :key="index">
            <div><a @click="navRoute(item.contentType, item.contentValue)">{{item.contentName}}</a></div>
          </swiper-slide>
        </swiper>
      </div>
    </section>
    <!-- 文字滚动轮播 -->
    <!-- 两栏广告 -->
    <section class="twoColAd clearfix" v-if="homepageAdvertisementVerticality">
      <div class="fl" @click="navRoute(homepageAdvertisementVerticality.homepageDetails[0].contentType, homepageAdvertisementVerticality.homepageDetails[0].contentValue)">
        <img :src="IMG_URL + homepageAdvertisementVerticality.homepageDetails[0].imgUrlAndroidBackend" v-if="homepageAdvertisementVerticality.homepageDetails[0]" alt="">
      </div>
      <div class="fr" @click="navRoute(homepageAdvertisementVerticality.homepageDetails[1].contentType, homepageAdvertisementVerticality.homepageDetails[1].contentValue)">
        <img :src="IMG_URL + homepageAdvertisementVerticality.homepageDetails[1].imgUrlAndroidBackend" v-if="homepageAdvertisementVerticality.homepageDetails[1]" alt="">
      </div>
    </section>
    <!-- 两栏广告 -->
    <!--热门-->
    <section class="hot-wrap" v-if="homepageWindow">
      <div class="inner">
        <div class="inner-l" @click="navRoute(homepageWindow.homepageDetails[0].contentType, homepageWindow.homepageDetails[0].contentValue)">
          <img :src="IMG_URL + homepageWindow.homepageDetails[0].imgUrlAndroidFront" v-if="homepageWindow.homepageDetails[0]" alt="" class="frontImg">
          <img :src="IMG_URL + homepageWindow.homepageDetails[0].imgUrlAndroidBackend" v-if="homepageWindow.homepageDetails[0]" alt="" class="backImg">
        </div>
        <div class="inner-r ">
          <div class="inner-r-t" @click="navRoute(homepageWindow.homepageDetails[1].contentType, homepageWindow.homepageDetails[1].contentValue)">
            <img :src="IMG_URL + homepageWindow.homepageDetails[1].imgUrlAndroidFront" v-if="homepageWindow.homepageDetails[1]" alt="" class="frontImg">
            <img :src="IMG_URL + homepageWindow.homepageDetails[1].imgUrlAndroidBackend" v-if="homepageWindow.homepageDetails[1]" alt="" class="backImg">
          </div>
          <div class="inner-r-b" @click="navRoute(homepageWindow.homepageDetails[2].contentType, homepageWindow.homepageDetails[2].contentValue)">
            <img :src="IMG_URL + homepageWindow.homepageDetails[2].imgUrlAndroidFront" v-if="homepageWindow.homepageDetails[2]" alt="" class="frontImg">
            <img :src="IMG_URL + homepageWindow.homepageDetails[2].imgUrlAndroidBackend" v-if="homepageWindow.homepageDetails[2]" alt="" class="backImg">
          </div>
        </div>
      </div>
    </section>
    <!--热门-->
    <!--通栏广告-->
    <section class="oneColAd" v-if="homepageAd1">
      <div @click="navRoute(homepageAd1.homepageDetails[0].contentType, homepageAd1.homepageDetails[0].contentValue)">
        <img :src="IMG_URL + homepageAd1.homepageDetails[0].imgUrlAndroidBackend" v-if="homepageAd1.homepageDetails[0]" alt="">
      </div>
    </section>
    <!--通栏广告-->
    <!-- 行业类目 -->
    <section class="category-wrap" v-if="homepageCategory">
      <c-moduleTitle :title="homepageCategory.title" :contentType="homepageCategory.homepageTitle.contentType" :contentValue="homepageCategory.homepageTitle.contentValue" :contentName="homepageCategory.homepageTitle.contentName" :logo="homepageCategory.homepageTitle.imgUrlAndroidBackend"
        v-if="homepageCategory.homepageTitle"></c-moduleTitle>
      <swiper :options="categorySwiperOption" ref="categorySwiper">
        <swiper-slide v-for="(item, index) in homepageCategory.homepageDetails" :key="index">
          <div class="item" @click="navRoute(item.contentType, item.contentValue)">
            <img :src="IMG_URL + item.imgUrlAndroidBackend" alt="">
            <div class="text">
              <div>
                <span>{{item.contentName}}</span>
              </div>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </section>
    <!-- 行业类目 -->
    <!-- 新商品推荐 -->
    <section class="newProduct" v-if="homepageNewProduct">
      <c-moduleTitle :title="homepageNewProduct.title" :contentType="homepageNewProduct.homepageTitle.contentType" :contentValue="homepageNewProduct.homepageTitle.contentValue" :contentName="homepageNewProduct.homepageTitle.contentName" :logo="homepageNewProduct.homepageTitle.imgUrlAndroidBackend"
        v-if="homepageNewProduct.homepageTitle"></c-moduleTitle>
      <div class="newProductContent clearfix">
        <div class="item" v-for="(item, index) in homepageNewProduct.homepageDetails" :key="index" @click="navRoute(item.contentType, item.contentValue)">
          <img :src="IMG_URL + item.imgUrlAndroidBackend" alt="">
          <div class="text">
            <div>
              <span>{{item.contentName}}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- 新商品推荐 -->
    <!-- 新广告页 -->
    <section class="newAdPage" v-if="homepageNewAdvertisement">
      <c-moduleTitle :title="homepageNewAdvertisement.title" :contentType="homepageNewAdvertisement.homepageTitle.contentType" :contentValue="homepageNewAdvertisement.homepageTitle.contentValue" :contentName="homepageNewAdvertisement.homepageTitle.contentName"
        :logo="homepageNewAdvertisement.homepageTitle.imgUrlAndroidBackend" v-if="homepageNewAdvertisement.homepageTitle"></c-moduleTitle>
      <div class="newAdPageContent">
        <div class="topImg" @click="navRoute(homepageNewAdvertisement.homepageDetails[0].contentType,homepageNewAdvertisement.homepageDetails[0].contentValue)">
          <img :src="IMG_URL + homepageNewAdvertisement.homepageDetails[0].imgUrlAndroidBackend" v-if="homepageNewAdvertisement.homepageDetails[0]" alt="">
        </div>
        <div class="bottomContent clearfix">
          <div class="item" v-for="(item, index) in homepageNewAdvertisementList" :key="index" @click="navRoute(item.contentType, item.contentValue)">
            <img :src="IMG_URL + item.imgUrlAndroidBackend" alt="">
            <div class="text">
              <div>
                <span>{{item.contentName}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- 新广告页 -->
    <!-- 推荐商品 -->
    <section class="hotProduct" v-if="homepageRecommendProduct">
      <c-moduleTitle :title="homepageRecommendProduct.title" :contentType="homepageRecommendProduct.homepageTitle.contentType" :contentValue="homepageRecommendProduct.homepageTitle.contentValue" :contentName="homepageRecommendProduct.homepageTitle.contentName"
        :logo="homepageRecommendProduct.homepageTitle.imgUrlAndroidBackend" v-if="homepageRecommendProduct.homepageTitle"></c-moduleTitle>
      <div class="hotProductContent clearfix" v-for="(item1,index1) of homepageRecommendProductList">
        <div class="item fl" v-bind:class="[index2==0 ? 'kItem' : 'pItem']" v-for="(item2,index2) of item1" @click="navRoute(item2.contentType,item2.contentValue)">
          <div class="itemContent" v-if="index2==0">
            <span v-for="(item3,index3) of item2.homepageDetails" @click="navRoute(item3.contentType,item3.contentValue)">{{item3.contentName}}</span>
          </div>
          <div class="itemContent" v-if="index2!=0">
            <img :src="IMG_URL + item2.imgUrlAndroidBackend" alt="">
            <div class="text">
              <div>
                <span>{{item2.contentName}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- 推荐商品 -->
    <!--版权声明-->
    <c-copyright></c-copyright>
    <!--版权声明-->
    <!--底部下载App弹窗-->
    <c-downLayer></c-downLayer>
    <!--底部下载App弹窗-->
  </div>
</template>

<script>
  import {
    IMG_URL,
    appLink
  } from "common/js/common";
  import {
    localStorage,
    CFEC
  } from "common/js/util.js";
  import {
    mapMutations
  } from "vuex";
  import downLayer from "components/down_layer";
  import {
    swiper,
    swiperSlide
  } from 'vue-awesome-swiper';
  import moduleTitle from 'components/moduleTitle';
  import copyRight from 'components/copyRight';
  export default {
    data() {
      return {
        // 轮播图
        homepageCarouselFigure: {
          homepageDetails: []
        },
        // 文字滚动轮播
        homepageWordFigure: {
          homepageDetails: []
        },
        // 两栏广告
        homepageAdvertisementVerticality: {
          homepageDetails: []
        },
        // 橱窗
        homepageWindow: {
          homepageDetails: []
        },
        // 通栏广告
        homepageAd1: {
          homepageDetails: []
        },
        // 行业类目
        homepageCategory: {
          homepageDetails: []
        },
        // 新商品推荐
        homepageNewProduct: {
          homepageDetails: []
        },
        // 新广告页
        homepageNewAdvertisement: {
          homepageDetails: []
        },
        homepageNewAdvertisementList: [],
        // 推荐商品
        homepageRecommendProduct: {
          homepageDetails: []
        },
        // 推荐商品列表
        homepageRecommendProductList: [],
        // 推荐关键词1
        homepageKeywordGroup1: {
          homepageDetails: []
        },
        // 推荐关键词2
        homepageKeywordGroup2: {
          homepageDetails: []
        },
        IMG_URL,
        //  传给地图导航页面的本站链接
        homeUrl: window.location.href,
        // 文字滚动配置
        swiperOption: {
          notNextTick: true,
          autoplay: 4000,
          direction: 'vertical',
          grabCursor: false,
          setWrapperSize: true,
          height: 42,
          autoHeight: true,
          paginationClickable: false,
          mousewheelControl: false,
          observeParents: true,
          debugger: false,
          onlyExternal: true
        },
        // 行业类目滚动配置
        categorySwiperOption: {
          notNextTick: true,
          autoplay: false,
          direction: 'horizontal',
          slidesPerView: 4,
          spaceBetween: 6,
          slidesOffsetBefore: 12,
          slidesOffsetAfter: 12
        },
      };
    },
    components: {
      "c-downLayer": downLayer,
      "c-moduleTitle": moduleTitle,
      "c-copyright": copyRight,
      swiper,
      swiperSlide
    },
    beforeMount() {
      // 做预览功能需要获取的参数
      let urlParams = location.search;
      let params = {};
      if (localStorage.get("localUserInfo")) {
        params.token = JSON.parse(localStorage.get("localUserInfo")).message;
      }
      // 如果首页URL有自带参数，则处理为json格式
      if (urlParams.indexOf("?") > -1) {
        let paramStr = urlParams.split('?')[1];
        // xxx=1&aaa=2
        let paramArr = paramStr.split('&');
        for (let item of paramArr) {
          let key_val = item.split('=');
          params[key_val[0]] = key_val[1];
        }
      }
      params = CFEC.addConfig(params);
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
            method: 'get',
            url: url,
            params: params
          })
          .then((res) => {
            this.distribute(res);
          });
      },
      //  拆分数据
      distribute(_res) {
        let homeInfo = _res.data.data;
        // 推荐商品
        this.homepageRecommendProduct = homeInfo.homepageRecommendProduct;
        // 轮播
        for (let i = 0, len = homeInfo.homepageCarouselFigure.homepageDetails.length; i < len; i++) {
          let item = homeInfo.homepageCarouselFigure.homepageDetails[i];
          if (item.contentType == 7 || item.contentType == 8 || item.contentType == 9) {
            homeInfo.homepageCarouselFigure.homepageDetails.splice(i, 1);
            i--;
            len--;
          }
        }
        this.homepageCarouselFigure = homeInfo.homepageCarouselFigure;
        // 文字滚动轮播
        for (let i = 0, len = homeInfo.homepageWordFigure.homepageDetails.length; i < len; i++) {
          let item = homeInfo.homepageWordFigure.homepageDetails[i];
          if (item.contentType == 7 || item.contentType == 8 || item.contentType == 9) {
            homeInfo.homepageWordFigure.homepageDetails.splice(i, 1);
            i--;
            len--;
          }
        }
        this.homepageWordFigure = homeInfo.homepageWordFigure;
        // 两栏广告
        this.homepageAdvertisementVerticality = homeInfo.homepageAdvertisementVerticality;
        // 橱窗 
        this.homepageWindow = homeInfo.homepageWindow;
        // 通栏广告
        this.homepageAd1 = homeInfo.homepageAd1;
        // 行业类目
        this.homepageCategory = homeInfo.homepageCategory;
        // 新商品推荐
        this.homepageNewProduct = homeInfo.homepageNewProduct;
        // 新广告页
        this.homepageNewAdvertisement = homeInfo.homepageNewAdvertisement;
        for (let i = 0; i < this.homepageNewAdvertisement.homepageDetails.length; i++) {
          if (i > 0) {
            this.homepageNewAdvertisementList.push(this.homepageNewAdvertisement.homepageDetails[i]);
          }
        }
        // 推荐关键词1
        this.homepageKeywordGroup1 = homeInfo.homepageKeywordGroup1;
        // 推荐关键词2
        this.homepageKeywordGroup2 = homeInfo.homepageKeywordGroup2;
        // 推荐商品列表
        let keywordGroupLen = 0;
        if (this.homepageKeywordGroup1) {
          keywordGroupLen += 1;
        }
        if (this.homepageKeywordGroup2) {
          keywordGroupLen += 1;
        }
        if (keywordGroupLen > 0) {
          let tempObj = [];
          let arrLen = this.homepageRecommendProduct.homepageDetails.length / keywordGroupLen;
          for (let i = 0; i < keywordGroupLen; i++) {
            tempObj[i] = [];
            tempObj[i].push(homeInfo['homepageKeywordGroup' + (i + 1)]);
            tempObj[i] = tempObj[i].concat(this.homepageRecommendProduct.homepageDetails.splice(0, arrLen));
            if (tempObj[i].length % 2 == 1) {
              tempObj[i].pop();
            }
          }
          this.homepageRecommendProductList = tempObj;
        }
      },
      //  跳转到应用中心
      toAppCenter() {
        window.location.href = localStorage.get("userAgent") === "ios" ? appLink.ios : appLink.android;
      },
      //  跳转不同页面
      navRoute(contentType, contentValue) {
        switch (contentType) {
          //  跳转商品详情页
          case 1:
            return this.$router.push({
              path: "/product/" + contentValue
            });
            //  跳转店铺详情页 
          case 2:
            return this.$router.push({
              path: "/shop/" + contentValue
            });
            //  跳转类目搜索页
          case 3:
            let params = contentValue.split(";");
            return this.$router.push({
              path: "/categorySearch/" + params[0] + "/" + params[1]
            });
            //  跳转商品关键词搜索
          case 4:
            this.HOME_TO_SEARCH(false);
            return this.$router.push({
              path: "/search/" + contentValue
            });
            //  跳转店铺关键词搜索
          case 5:
            this.HOME_TO_SEARCH(false);
            return this.$router.push({
              path: "/search/" + contentValue
            });
            //  直接跳转链接
          case 6:
            window.location.href = contentValue;
            break;
            // return this.$router.push({
            //   path: contentValue
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
/*nav*/
.menu 
  height: 4.95rem
  background: #fff
  margin-bottom:0.6rem
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
      background:url("images/icon_grid_categories.png") no-repeat center .75rem
      background-size: 2rem
    &:nth-child(2)
      background:url("images/icon_grid_pavilion.png") no-repeat center .75rem
      background-size: 2rem
    &:nth-child(3)
      background:url("images/icon_grid_getquotations.png") no-repeat center .75rem
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



   /*hotProducts*/
.hot-wrap 
  margin-bottom: .6rem
  img 
   display:block
   position:absolute
  .frontImg
   z-index:2
  .backImg
   z-index:1
  .inner
   height: 9rem
   width: 100%
   overflow: hidden
  a
   display: block
  .inner-l 
   width: 40%
   height: 100%
   float:left
   position:relative
   img
    width:100%
   .frontImg
    bottom:0
    left:0
   .backImg
    top:0
    left:0
    height:100%
  .inner-r
   width:60%
   height: 100% 
   float left
   .inner-r-t,
   .inner-r-b
    height: 50%;
    position:relative
    border-left:1px solid rgba(0,0,0,0.12)
   .inner-r-b
    border-top:1px solid rgba(0,0,0,0.12)
   .frontImg
    top:0
    left:0
    width:54%
   .backImg
    top:0
    right:0
    width:100%
    height:100%
 
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

.textSlide
 height:48px;
 background: #fff;
 padding:1% 4%
 position:relative
 margin-bottom:0.6rem
 .icon
  display:block;
  float:left;
  width: 12%;
  height: 100%;
  background:url("images/icon_full_notice.png") no-repeat 0 center
  background-size: 1.6rem
 .line
  display:block
  width:1px
  height:50%
  background-color:rgba(0,0,0,0.12);
  position:absolute
  left:15%
  top:25%
 .textList
  float:right
  padding:3px 0 3px 4%
  height: 100%
  width:84%
  overflow:hidden
  .swiper-slide
   width:100%;
   height: 100%
   overflow:hidden
   div
    display:table
    width:100%;
    height: 100%
    a
     width:100%
     height:42px
     display:table-cell
     line-height:21px
     font-size: 0.7rem
     color:rgba(0,0,0,0.87)
     vertical-align: middle
     word-break: break-word
.twoColAd
 padding:0 3.2%
 margin-bottom:0.6rem
 div
  width:48.3%
  img
   display:block
   width:100%
.oneColAd
 margin-bottom:0.6rem
 img
  width:100%
  display:block
.category-wrap
 margin-bottom:0.6rem;
 .swiper-container
  width:100%;
  .swiper-slide
   width:4rem;
   .item
    img
      display:block;
      width:100%;
    .text
      background-color:#fff;
      display:table;
      width:100%;
      overflow:hidden;
      height:2rem;
      max-height:2rem;
      div
        width:100%;
        vertical-align: middle;
        display: table-cell;
        text-align:center;
        span
          display:inline-block;
          -webkit-line-clamp: 2;
          text-overflow: ellipsis;
          word-break: break-word;
          overflow: hidden;
          line-height:0.7rem;
          font-size:0.5rem;
          max-height:1.4rem;
          padding: 0 0.4rem;
.newProduct
 margin-bottom:0.6rem;
 .newProductContent
  background-color:#fff;
  .item
   width:25%;
   float:left;
   img
    display:block;
    width:100%;
   .text
    background-color:#fff;
    display:table;
    width:100%;
    overflow:hidden;
    height:2rem;
    max-height:2rem;
    div
      width:100%;
      vertical-align: middle;
      display: table-cell;
      text-align:center;
      span
        display:inline-block;
        -webkit-line-clamp: 2;
        text-overflow: ellipsis;
        word-break: break-word;
        overflow: hidden;
        line-height:0.6rem;
        font-size:0.5rem;
        max-height:2rem;
        padding: 0 0.4rem;
.newAdPage
 margin-bottom:0.6rem;
 .newAdPageContent
  background-color:#fff;
  .topImg
   padding:3.2% 3.2% 0;
   img
    width:100%;
    display:block;
  .bottomContent
   background-color:#fff;
   .item
    width:33.33%;
    float:left;
    img
     width:100%;
     display:block;
    .text
     background-color:#fff;
     display:table;
     width:100%;
     overflow:hidden;
     height:2rem;
     max-height:2rem;
     div
      width:100%;
      vertical-align: top;
      display: table-cell;
      text-align:center;
      span
        display:inline-block;
        -webkit-line-clamp: 2;
        text-overflow: ellipsis;
        word-break: break-word;
        overflow: hidden;
        line-height:0.7rem;
        font-size:0.5rem;
        max-height:2rem;
        padding: 0 0.4rem;
.hotProduct
  margin-bottom:0.6rem;
 .hotProductContent
  .item
   width:50%;
   padding: .6rem .6rem .6rem .575rem
   box-sizing border-box
   background:#fff;
   -webkit-box-sizing: border-box;
   -moz-box-sizing: border-box;
   box-sizing: border-box;
   border-bottom:1px solid rgba(0,0,0,0.12);
   &:nth-child(odd){
     border-right:1px solid rgba(0,0,0,0.12);
   }
   .itemContent
    height: 10.2rem
    overflow:hidden;
  .kItem
   background:#E1E2E5;
   span
    display:block;
    background-color:#fff;
    width:90%;
    padding:0 5%;
    height:1.7rem;
    line-height:1.7rem;
    margin-bottom:0.4rem;
    text-align:center;
    font-size:0.7rem;
    color: rgba(0,0,0,0.54);
    border-radius:0.2rem;
    word-wrap: break-word;
    overflow:hidden;
    &:last-child
     margin-bottom:0;
  .pItem
   img
    width: 8.2rem
    height: 8.2rem
    display:block;
   .text
    background-color:#fff;
    display:table;
    width:100%;
    overflow:hidden;
    height:2rem;
    max-height:2rem;
    div
      width:100%;
      vertical-align: middle;
      display: table-cell;
      text-align:center;
      span
       display:inline-block;
       -webkit-line-clamp: 2;
       text-overflow: ellipsis;
       word-break: break-word;
       overflow: hidden;
       line-height:1rem;
       font-size:0.7rem;
       max-height:2rem;
</style>