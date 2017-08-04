<template>
    <div class="company-container">

       <!--顶部导航-->
        <c-header title="Company">
          <img slot="right" @click="backHome" 
            class="c-header-right-icon f-vermiddle" 
            src="./images/icon_tab_home_nor.png" alt="">
        </c-header>
       <!--顶部导航-->

        <section class="company-main">
        
                <img  class="company-logo" v-if="sellerShopInfo.companyLogo" :src="IMG_URL + sellerShopInfo.companyLogo"
                     alt="">

                <img  class="company-logo" v-else :src="require('./images/default-img.png')" alt="">
            
    
            <p class="company-name"
               v-if="sellerShopInfo.companyName">{{sellerShopInfo.companyName}}</p>
            <p class="company-address f-ellipsis-1"
               v-if="sellerShopInfo.companyAddress">
                <span>Conpany Location:</span> {{sellerShopInfo.companyAddress}}
            </p>
            <div class="company-common-wrap"
                 v-if="sellerShopInfo.mainProducts">
                <span class="company-info-title">Main Products:</span>
                <span class="company-main-products"> 
                     {{sellerShopInfo.mainProducts.toLowerCase()}}
                </span>
            </div>
            <p class="company-common-wrap f-ellipsis-1"
               v-if="sellerShopInfo.businessType"><span class="company-info-title">Business Type:</span> <span class="company-info">{{sellerShopInfo.businessType}}</span></p>
            <p class="company-common-wrap f-ellipsis-1"
               v-if="sellerShopInfo.companyType"><span class="company-info-title">Company Type:</span> <span class="company-info">{{sellerShopInfo.companyType}}</span></p>
            <div class="company-logo-wrap"
                 v-if="sellerShopInfo.certIconInfos">
                <img :src="SHOP_LOGO_URL + item.url"
                     alt=""
                     v-for="item of sellerShopInfo.certIconInfos">
                <img v-if="shopBooth.length"
                     src="./images/121.png"
                     alt=""
                     class="logo-121">
            </div>
        </section>
    
        <section v-if="shopBooth.length"
                 class="c-booth-wrap">
            <div class="border-1px c-booth"
                 href=""
                 v-for="(item, index) of shopBooth"
                 :key="index">
                <span>{{item}}</span>
                <a :href="'http://app.e-cantonfair.com/app_center1/map/map.html#type=1&vol='+item.substr(5,1)+'&end='+item.substr(item.indexOf(';')+1)+'&url=http://'+shopUrl.substr(7)">Go</a>
            </div>
        </section>

        <router-link class="company-common-link border-1px"
                     :to="'/companyProfile/' + sellerShopInfo.companyId">
            Company Profile
            <span class="arrow-r"></span>
        </router-link>
        <section>
            <ul class="company-product-list-wrap">
                <router-link class="border-1px"
                             :to="'/product/' + item.productId"
                             tag="li"
                             v-for="(item, index) of productInfos"
                             :key="index">
                    <img :src="IMG_URL + item.img"
                         alt="">
                    <div class="product-info-wrap">
                        <span class="f-ellipsis-2">{{item.name}}</span>
                        <p>MOQ: {{item.order}} {{item.moq}}</p>
                    </div>
                </router-link>
            </ul>
        </section>
    
        <router-link :to="'/shopInquiry/' + sellerShopInfo.companyName + '/' + sellerShopInfo.userId"
                     class="c-inquiry-footer-btn">
            <span>Contact</span>
        </router-link>
        <router-link :to="'/allProducts/'+sellerId"
                     class="company-common-link border-1px">
            All Products
            <span class="arrow-r"></span>
        </router-link>
        
        <c-downLayer :bottom="3"></c-downLayer>
    </div>
</template>
   
<script>
// 图片要做判断

import header from "components/header";
import downLayer from "components/down_layer";
import { Indicator, Toast } from "mint-ui";
import { IMG_URL } from "common/js/common";
import {CFEC} from 'common/js/util.js';

export default {
    data() {
        return {
            sellerId: this.$route.params.sellerId,  //  保存店铺Id
            sellerShopInfo: {},  //  保存店铺ID信息
            productInfos: [], //  商品照片加详情,
            shopBooth: [],   //  保存摊位信息
            shopUrl: window.location.href,  //  传给地图导航的网址
            IMG_URL,
            SHOP_LOGO_URL
        };
    },

    components: {
        "c-header": header,
        "c-downLayer": downLayer
    },
    created() {
        this.fetchShopDetial(this.$route.params.sellerId);
    },
    activated() {
        this.sellerId = this.$route.params.sellerId;
    },
    watch: {
        // 监测Id变化
        sellerId(newId) {
            this.fetchShopDetial(newId);
        }
    },
    // `/shop/detail.cf?sellerId=${sellerId}`
    methods: {
        //  顶部返回首页
        backHome() {
            this.$router.push("/home");
        },
        //  拉取店铺详情数据
        fetchShopDetial(sellerId) {
            Indicator.open("Loading");

            let shopDetail = function () {
                let params = {
                    sellerId:sellerId
                }
                return _this.axios({
                    method:'get',
                    url:'/shop/detail.cf',
                    params:CFEC.addConfig(params)
                })
            };

            // 拉取摊位数据
            let shopBooth = function () {
                let params = {
                    searchType:1,
                    sellerId:sellerId,
                    fairNo:121
                }
                return _this.axios({
                    method:'get',
                    url:'/shop/getBoothInfo.cf',
                    params:CFEC.addConfig(params)
                })
            };

            let _this = this;
            this.axios.all([shopDetail(), shopBooth()])
                .then(_this.axios.spread((shopDetailRes, shopBoothRes) => {
                    this.$nextTick(() => {
                        Indicator.close();
                        let _sellerShopInfo = shopDetailRes.data.data.sellerShopInfo;
                        this.$set(this.sellerShopInfo, "companyLogo", _sellerShopInfo.companyLogo);
                        this.$set(this.sellerShopInfo, "companyName", _sellerShopInfo.companyName);
                        this.$set(this.sellerShopInfo, "businessType", _sellerShopInfo.businessType);
                        this.$set(this.sellerShopInfo, "companyType", _sellerShopInfo.companyType);
                        this.$set(this.sellerShopInfo, "mainProducts", _sellerShopInfo.mainProducts);
                        this.$set(this.sellerShopInfo, "certIconInfos", _sellerShopInfo.certIconInfos);
                        this.$set(this.sellerShopInfo, "companyAddress", _sellerShopInfo.companyAddress);
                        this.$set(this.sellerShopInfo, "companyId", _sellerShopInfo.companyId);
                        this.$set(this.sellerShopInfo, "userId", _sellerShopInfo.userId);
                        this.productInfos = shopDetailRes.data.data.productInfos;

                        this.shopBooth = shopBoothRes.data.data;

                    });

                }))
                .catch(() => {
                    Indicator.close();
                    Toast("Network Timeout");
                });
        }
    }
};
</script>


<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../common/stylus/mixins/index.styl"

.company
 &-container
  padding-top: 2.2rem
  padding-bottom: 3rem
 &-main
  background: #fff 
  .company-logo
   width: 7.5rem
   height: 7.5rem
   display: block
   margin: 0 auto
  .company-name 
   width:12rem
   padding-top: .6rem
   margin: 0 auto
   font-size: .8rem;
   color: rgba(0,0,0,0.87)
   letter-spacing: -0.81px
   line-height: .8rem
   text-align: center
  .company-address
   padding: .6rem .6rem
   text-align: center
   font-size: .7rem;
   color: rgba(0,0,0,0.54)
   letter-spacing: -0.81px
   line-height: .7rem
 &-common-wrap
  font-size: .7rem;
  color: rgba(0,0,0,0.54);
  letter-spacing: -0.61px;
  line-height: 1rem;
  text-align: left
  padding: 0 .6rem
  word-break: break-word
 &-main-products
  color: #000
  text-align: left
  word-break: break-word
  display: inline-block
  vertical-align: top
  padding-left: .6rem
  width: 12rem
 &-info-title 
  display: inline-block
  width: 4.4rem
 &-info
  color: #000
  padding-left: .6rem
 &-logo-wrap
  text-align: center
  font-size: 0
  padding: .6rem 0 .8rem 0
  position:relative
  img
   width: .8rem
   height: .8rem
  .logo-121
   width: 2rem
   height: .8rem 
   position: absolute
   top: .6rem
  img + img
   margin-left: .475rem  
 &-common-link
  display: block
  height: $cell-height  
  margin: 0 0 .6rem
  font-size: .8rem
  color: rgba(0,0,0,0.87)
  letter-spacing: -0.81px
  line-height: 2.4rem
  text-indent: .6rem
  background: #fff
  border-1px-tb(rgba(0, 0, 0, .12), false)
  .arrow-r
    width: .8rem
    height: 1.2rem
    display: block
    background: url("./images/icon_list_arrow.png") no-repeat
    background-size: .8rem 1.2rem
    position: absolute
    left: 16.8rem
    top: 50%
    transform: translateY(-50%)
 &-product-list-wrap
  padding: 0 0 0 .6rem
  background: #fff   
  li
   overflow: hidden
   padding: .6rem 0 .6rem 0
   & + li
    border-1px-t(rgba(0, 0, 0, .12), false)
   img
    float: left
    width: 5rem
    height: 5rem 
  .product-info-wrap  
   float:left
   padding-left: .6rem   
   span
    float: left 
    width: 12rem 
    font-size: .8rem 
    line-height: 1rem
   p 
    font-size: .7rem;
    color: rgba(0,0,0,0.54)
    letter-spacing: -0.81px
    line-height: 1rem
    padding-top: 2.5rem

</style>