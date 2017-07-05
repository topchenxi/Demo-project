<template>
    <div class="product-container">
        <v-header title="Detail">
          
            <img slot="right" @click="backHome" 
            class="c-header-right-icon f-vermiddle" 
            src="./images/icon_tab_home_nor.png" alt="">
        
        </v-header>
        
        <mt-swipe :auto="4000">
            <mt-swipe-item v-for="(item, index) of slide"
                           :key="index">
                <img :src="IMG_URL + item"
                     alt="">
            </mt-swipe-item>
        </mt-swipe>

        <section class="product-info">
            <p class="proname f-ellipsis-2"
                 v-if="products.name">{{products.name}}</p>
            <p class="shopname f-ellipsis-2"
                 v-if="shopInfo.companyEnName">{{shopInfo.companyEnName}}</p>
            <div class="fobprice"
                 v-if="products.fobPriceFrom"><span>FOB:US $ {{products.fobPriceFrom}} - {{products.fobPriceTo}} / {{products.fobPriceUnitEnName}}</span></div>
            <div class="moq"
                 v-if="products.minOrder"><span>MOQ:{{products.minOrder}} {{products.minOrderUnitEnName}}</span></div>
            <div>
                <img class="logo"
                     :src="LOGO_URL + item"
                     alt=""
                     v-for="(item, index) of shopInfo.logo"
                     :key="index">
                <img v-if="shopInfo.fairNo==='121'"
                     src="./images/121.png"
                     alt=""
                     class="logo-121">                     
            </div>
        </section>

        <section class="c-booth-wrap" v-if="productBooth.length">
            <div class="border-1px c-booth"
                 v-for="(item, index) of productBooth"
                 :key="index">
                <span>{{item}}</span>
                <a :href="'http://app.e-cantonfair.com/app_center1/map/map.html#type=1&vol='+item.substr(5,1)+'&end='+item.substr(item.indexOf(';')+1)+'&url=http://'+productUrl.substr(7)">Go</a>
            </div>
        </section>
     
        <router-link class="visit-store border-1px"
                     :to="'/shop/' + products.sellerId">
            Visit Store
            <span class="arrow-r f-vermiddle"></span>
        </router-link>
        
        <router-link :to="'/inquiry/' + this.$route.params.productId"
                     class="c-inquiry-footer-btn"
                     tag="section">
            <span>Inquiry</span>
        </router-link>
        <v-productDetail :products-detail="detail"
                         class="detail"
                         ></v-productDetail>

        <c-downLayer :bottom="3"></c-downLayer>
    </div>
</template>

<script>

import { IMG_URL, LOGO_URL } from "common/js/common";
import productDetail from "@/pages/product/children/productDetail";
import header from "components/header";
import downLayer from "components/down_layer";
import { Indicator, Toast } from "mint-ui";

export default {
    data() {
        return {
            slide: [],           // 轮播路径
            productId: this.$route.params.productId,     // 商品ID
            detail: "",       //  传给子组件的详情数据
            products: {       //  保存商品信息
            },
            shopInfo: {       //  保存店铺信息
            },
            IMG_URL,
            LOGO_URL,
            productBooth: [],    //  展位信息
            productUrl: window.location.href  //  传个地图导航的链接
        };
    },
    components: {
        "v-productDetail": productDetail,  //  详情组价  有点多余
        "v-header": header,           //  头部组件
        "c-downLayer": downLayer     //  下载弹框组件
    },
    created() {
        
        //  拉取商品详情数据
        this.fetchProductDetial(this.$route.params.productId);
        
    },
    mounted() {
        
    },
    activated() {
        // 获取商品Id
        this.productId = this.$route.params.productId;
        
    },
    watch: {
        //  监测Id变化
        productId(newId) {
            this.fetchProductDetial(newId);
        }
    },

    methods: {

        //  顶部的直接返回HOME页面
        backHome() {
            this.$router.replace("/home");
        },

        //  拉取商品详情数据
        fetchProductDetial(productId) {
            Indicator.open("Loading...");
            this.axios.get(`/search/toProductDetail.cf?productId=${productId}`)
                .then((res) => {
                    this.$nextTick(() => {
                        this.detail = Object.assign({}, this.detail, res.data.data);
                        let product = res.data.data.product;
                        let shopInfo = res.data.data.shopInfo;

                        this.$set(this.products, "name", product.name);
                        this.$set(this.products, "fobPriceFrom", product.fobPriceFrom);
                        this.$set(this.products, "fobPriceTo", product.fobPriceTo);
                        this.$set(this.products, "fobPriceUnitEnName", product.fobPriceUnitEnName);
                        this.$set(this.products, "minOrder", product.minOrder);
                        this.$set(this.products, "minOrderUnitEnName", product.minOrderUnitEnName);
                        this.$set(this.products, "sellerId", product.sellerId);

                        this.$set(this.shopInfo, "companyEnName", shopInfo.companyEnName);
                        this.$set(this.shopInfo, "fairNo", shopInfo.fairNo);

                        try {
                            this.slide = product.imgs.split(",");

                            this.$set(this.shopInfo, "logo", shopInfo.logo.split(","));
                        } catch (err) { }


                        this.axios.get(`/shop/getBoothInfo.cf?searchType=1&sellerId=${product.sellerId}&fairNo=121&productId=${productId}`)
                            .then((res) => {
                                Indicator.close();
                                this.productBooth = res.data.data;
                            });
                    });

                })
                .catch(() => { Indicator.close(); Toast("Network Timeout"); });
        }
    }
};

</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../common/stylus/mixins/index.styl"

.mint-swipe 
 height: 10rem
 background: #F3F4F6; 
 img 
  width: 10rem
  height: 100%
  display: block
  margin: 0 auto

.product
 &-container
  padding-top 2.2rem
  padding-bottom: 3.6rem
 &-info
  padding-top: 1.2rem
  text-align: center
  background: #fff 
  .proname
   padding:0 .4rem
   font-size: .8rem
   color: rgba(0,0,0,0.87)
   letter-spacing: -0.81px
   line-height: 1rem  
  .shopname
   padding: 0 .6rem 
   margin: .4rem 0
   font-size: .7rem
   color: rgba(0,0,0,0.26)
   letter-spacing: -0.61px
   line-height: 1rem 
  .fobprice
   font-size: .7rem
   color: rgba(0,0,0,0.54)
   letter-spacing: -0.61px
   line-height: 1rem
  .moq
   font-size: .7rem;
   color: rgba(0,0,0,0.54);
   letter-spacing: -0.61px;
   line-height: 1rem;
   border-bottom: .4rem solid transparent
  .logo 
   width: .8rem
   height: .8rem
   border-bottom: .8rem solid transparent
   & + .logo
    margin-left: .4rem
   &-121 
    width: 2rem
    height: .8rem
    border-bottom: .8rem solid transparent
    
   
.visit-store
  display: block
  height: $cell-height 
  padding-left: 2.4rem
  background:#fff url("./images/icon_store.png") no-repeat .6rem center
  background-size: 1.2rem 1.2rem
  border-1px-tb(rgba(0, 0, 0, .12), false)
  font-size: .8rem
  color: rgba(0,0,0,0.87)
  letter-spacing: -0.81px
  line-height: 2.4rem
  .arrow-r
    width: .8rem
    height: 1.2rem
    display: block
    background: url("./images/icon_list_arrow.png") no-repeat
    background-size: .8rem 1.2rem
    left: 16.8rem

.pull-up-warpper
 height: 10rem
 .icon
  height: .8rem  
  margin-bottom: .2rem
  background: url("./images/icon_pullup.png") no-repeat center center
  background-size: 1rem 1rem
  border-top: .775rem solid transparent  
 .text
  height: 1rem
  font-size: .7rem
  color: rgba(0,0,0,0.26)
  letter-spacing: -0.61px
  line-height: 1rem
  text-align: center
  border-bottom: .95rem solid transparent

</style>