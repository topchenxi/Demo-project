<template>
  <div class="topic-wrap">
    <!--类目菜单 浮动-->
    <section class="menuGroup menuGroupFixed" v-if="isFixed">
      <!--滑动菜单-->
      <div class="menuSwiper">
        <swiper :options="menuSwiperOption" ref="menuSwiperFix">
          <swiper-slide>
            <div :class="['item',menuCurIndex==index?'cur':'']" @click="selectTab(index,item.floorId)" v-for="(item, index) in floor" :key="index">
              <div>&nbsp;&nbsp;&nbsp;&nbsp;{{item.name}}&nbsp;&nbsp;&nbsp;&nbsp;</div>
              <span></span>
            </div>
          </swiper-slide>
        </swiper>
      </div>
      <!--下拉按钮-->
      <div class="slideBtn" @click="selectBoxDisplayAction()"></div>
      <!--下拉菜单-->
      <div class="selectMain clearfix" v-if="selectBoxDisplay">
        <div class="selectItem" @click="selectSlide(index,item.floorId)" v-for="(item, index) in floor" :key="index" ref="selectItem">
          <div>&nbsp;&nbsp;{{item.name}}&nbsp;&nbsp;</div>
        </div>
      </div>
    </section>
    <scroller ref="cScroller">
    
    <!--公共头部-->
    <div
      v-docTitle
      :data-docTitle="topicTitle"
    ></div>
    <v-header 
      :title="topicTitle"
      :isFixed="false"
      v-if="appId==null"
    >
        <img slot="right" @click="backHome" 
        class="c-header-right-icon f-vermiddle" 
        src="./images/icon_tab_home_nor.png" alt="">
    </v-header>

    <!--banner-->
    <section class="banner" v-if="topicData.topicBannerWap">
      <img :src="IMG_URL + topicData.topicBannerWap" alt="">
    </section>
    <!--类目菜单 不浮动-->
    <section class="menuGroup" ref="menuGroup">
      <!--滑动菜单-->
      <div class="menuSwiper">
        <swiper :options="menuSwiperOption" ref="menuSwiper">
          <swiper-slide>
            <div :class="['item',menuCurIndex==index?'cur':'']" @click="selectTab(index,item.floorId)" v-for="(item, index) in floor" :key="index">
              <div>&nbsp;&nbsp;&nbsp;&nbsp;{{item.name}}&nbsp;&nbsp;&nbsp;&nbsp;</div>
              <span></span>
            </div>
          </swiper-slide>
        </swiper>
      </div>
      <!--下拉按钮-->
      <div :class="['slideBtn',selectBoxDisplay==true?'slideDownStyle':'']" @click="selectBoxDisplayAction()"></div>
      <!--下拉菜单-->
      <div class="selectMain clearfix" v-if="selectBoxDisplay">
        <div class="selectItem" @click="selectSlide(index,item.floorId)" v-for="(item, index) in floor" :key="index" ref="selectItem">
          <div>&nbsp;&nbsp;{{item.name}}&nbsp;&nbsp;</div>
        </div>
      </div>
    </section>

    <!--产品列表 WAP-->
    <section class="productList clearfix" v-if="appId==null">
      <router-link class="item fl" v-for="(item, index) in topicData.floors" :key="index" v-if="item.floorId==currentFloor" :to="'/product/' + getProductId(item.productLink)">
          <div class="itemContent">
            <img :src="IMG_URL + imgUrlFilter(item.productImg,600,600,3)" alt="">
            <div class="text">
              <div>
                <span>{{item.productTitle}}</span>
              </div>
            </div>
          </div>
      </router-link>
    </section>
    <!--产品列表 APP-->
    <section class="productList clearfix" v-if="appId!=null">
      <a class="item fl" v-for="(item, index) in topicData.floors" :key="index" v-if="item.floorId==currentFloor" :href="item.productLink">
          <div class="itemContent">
            <img :src="IMG_URL + imgUrlFilter(item.productImg,600,600,3)" alt="">
            <div class="text">
              <div>
                <span>{{item.productTitle}}</span>
              </div>
            </div>
          </div>
      </a>
    </section>

    <!--版权声明-->
    <c-copyright v-if="appId==null"></c-copyright>
    <!--版权声明-->
    </scroller>
  </div>
</template>

<script>
  import { IMG_URL} from "common/js/common";
  import {CFEC} from "common/js/util.js";
  import header from "components/header";
  import copyRight from 'components/copyRight';
  import { swiper, swiperSlide } from 'vue-awesome-swiper';

  export default {
    data() {
      return {
        IMG_URL,
        topicTitle:'',
        topicId: this.$route.params.topicId,
        topicData:{},
        floor:[],
        currentFloor:null,
        // 菜单滚动配置
        menuCurIndex:0,
        menuSwiperOption:{
          notNextTick: true,
          autoplay: false,
          slidesPerView: 'auto',
          slidesOffsetBefore:12,
          slidesOffsetAfter:48,
          freeMode:true,
          freeModeMomentum:true,
          slideToClickedSlide:true
        },
        selectBoxDisplay:false,
        timer:0,
        scrollY:0,
        isFixed:false,
        appId:null
      };
    },
    
    components:{
      "v-header": header,
      "c-copyright":copyRight,
      swiperSlide,
      swiper
    },
    beforeMount(){
      if(String(window.location).toLowerCase().indexOf('?appid=') != -1 || String(window.location).toLowerCase().indexOf('&appid=') != -1){
        let appIdStr = String(window.location).toLowerCase().match(/appid\=(.*)/g)[0];
        if(String(appIdStr).indexOf('=') != -1){
          this.appId = String(appIdStr).split('=')[1];
        }
      }
      this.fetchData(this.$route.params.topicId);
    },
    created() {
        
    },
    computed: {
      swiper() {
        return this.$refs.menuSwiper.swiper
      },
      swiperFixed(){
        return this.$refs.menuSwiperFix.swiper
      }
    },
    methods: {
      //  获取首页数据
      fetchData(id) { 

        let url = "/specialtopic/detail.cf";
        let params = {
          id:id
        }
        this.axios({
          method:'get',
          url:url,
          params:CFEC.addConfig(params)
        })
        .then((res) => {
          if(res.data.status == 'success'){
            this.distribute(res.data.data);
          }
        });
      },
      distribute(data){
        this.topicData = data;
        this.topicTitle = data.topicName;
        this.getFloorData(data);
      },
      //  顶部的直接返回HOME页面
      backHome() {
          this.$router.replace("/home");
      },
      // 获取floorName
      getFloorData(data){
        this.currentFloor = data.floors[0].floorId;
        let productList = data.floors;
        
        if(productList.length>0){
          for(let i=0;i<productList.length;i++){
            let obj = {};
            // 存分类名
            obj.name = productList[i].floorName;
            obj.floorId = productList[i].floorId;
            let isHas = false;
            for(let r=0;r<this.floor.length;r++){
              if(this.floor[r].floorId == obj.floorId){
                isHas = true;
              }else{
                isHas = false;
              }
            }
            if(!isHas){
              this.floor.push(obj);
            }
          }
        }

      },
      // 选择tab
      selectTab(index,floorId){
        // 设置索引
        this.menuCurIndex = index;
        this.currentFloor = floorId;
        let menuGroup = this.$refs.menuGroup;
        if(this.scrollY > menuGroup.offsetTop){
          this.$refs.cScroller.scrollTo(0,menuGroup.offsetTop,true);
        }
      },
      // 选择下拉菜单
      selectSlide(index,floorId){
        let curItem = this.$refs.selectItem[index];
        
        let contentWid = 0;
        for(let i=0;i<index;i++){
          contentWid += this.$refs.selectItem[i].offsetWidth;
        }
        let moveX = contentWid * -1;

        this.selectTab(index,floorId);
        // 设置位移
        this.swiper.setWrapperTranslate(moveX);
        this.selectBoxDisplay = false;
      },
      // 显示选择框
      selectBoxDisplayAction(){
        this.selectBoxDisplay = !this.selectBoxDisplay;
      },
      // 图片过滤器，生成符合WAP端的图片
      imgUrlFilter(src,w,h,type){
        return CFEC.imgUrlFilter(src,w,h,type);
      },
      // 设置菜单浮动
      setMenuFixed(top){
        let menuGroup = this.$refs.menuGroup;
        if(top > menuGroup.offsetTop){
          this.isFixed = true;
        }else{
          this.isFixed = false;
        }
      },
      getProductId(url){
        let productId = url.match(/-(\d+)\.html$/)[0].replace(/-/g,'').replace(/\.html/g,'');
        return productId;
      }
    },
    mounted() {
      this.timer = setInterval(() => {
        let {left,top} = this.$refs.cScroller.getPosition();
        // 设置菜单浮动
        this.setMenuFixed(top);
        this.scrollY = top;
      }, 50)
    },
    beforeDestroy() {
      clearInterval(this.timer)
    }

  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
#app{
  height:100%;
}
.topic-wrap{
  height:100%;
}
.banner
  img
    display:block;
    width:100%;
.menuGroup
  width:100%;
  background-color:#fff;
  border-bottom:1px solid #d5d6d8;
  position:relative;
  z-index:99;
  margin-bottom:0.5rem;
.menuSwiper
  height:2rem;
  .swiper-slide
    width:auto;
    .item
      float:left;
      font-size:0.7rem;
      line-height:2rem;
      position:relative;
      span
        position:absolute;
        width:1.8rem;
        height:2px;
        background-color:#ff0030;
        display:none;
        left:50%;
        margin-left:-0.9rem;
        bottom:0;
    .item.cur
      color:#ff0030;
      span
        display:block;
.slideBtn
  position:absolute;
  right:0;
  top:0;
  z-index:2;
  width:2rem;
  height:2rem;
  border-left:1px solid #d5d6d8;
  background:url(./images/icon_slide_downArrow.png) no-repeat center center #ffffff;
  background-size:40%;
.slideDownStyle{
  background:url(./images/icon_slide_upArrow.png) no-repeat center center #ffffff;
  background-size:40%;
}
.selectMain
  background-color:#fff;
  height:auto;
  padding:0.6rem 0.6rem 0;
  position:absolute;
  left:0;
  top:2rem;
  z-index:3;
  box-shadow:0px 10px 20px rgba(0,0,0,0.1);
  border-top:1px solid #d5d6d8;
  .selectItem
    padding:0.5rem 0.4rem;
    border:1px solid #d5d6d8;
    border-radius:0.3rem;
    float:left;
    font-size:0.7rem;
    margin:0 0.5rem 0.6rem 0;
.productList
  border-top:1px solid rgba(0,0,0,0.12);
  .item
   width:50%;
   padding: .6rem .6rem .6rem .575rem
   box-sizing border-box
   background:#fff;
   -webkit-box-sizing: border-box;
   -moz-box-sizing: border-box;
   box-sizing: border-box;
   border-bottom:1px solid rgba(0,0,0,0.12);
   color:#000;
   &:nth-child(odd){
     border-right:1px solid rgba(0,0,0,0.12);
   }
   .itemContent
    height: 10.4rem
    overflow:hidden;
    img
      width: 8.2rem
      height: 8.2rem
      display:block;
      margin-bottom: 0.2rem;
    .text
      background-color:#fff;
      display:table;
      width:100%;
      overflow:hidden;
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
.menuGroupFixed
  position:fixed;
  left:0;
  top:0;
</style>