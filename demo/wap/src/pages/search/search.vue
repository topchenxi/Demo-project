<template>
    <div>
        <section class="search-top">
            <div class="header border-1px">
                <span class="back-arrow"
                      v-show="showArrow"
                      @click="backArrow"></span>
                <form action=""
                      @submit.prevent="checkInput">
                    <div class="input-wrap"
                         :class="{'change-left': isChangeLeft}">
                        <img v-show="searchText"
                             class="clear-all"
                             src="./images/icon_clean.png"
                             alt=""
                             @click="clearKeyWord">
                        <input type="search"
                               ref="focus"
                               v-model.lazy="searchText"
                               placeholder="Search products or suppliers">
                    </div>
                </form>
                <span class="cancel"
                      @click="cancel"
                      v-show="!showArrow">Cancel</span>
            </div>
            <div class="tabs border-1px">
                <div class="tabs-item"
                     @click="toProducts"
                     :class="{active:searchType===1}">Products</div>
                <div class="tabs-item"
                     @click="toSuppliers"
                     :class="{active:searchType===2}">Suppliers</div>
            </div>
            <v-products v-on:searchKeyWord="fetchData"
                        :search-type="searchType"
                        v-show="showToggle"></v-products>
            <div v-show="noResult"
                 class="no-result">
                Sorry!
                <br> No matches found for {{searchText}}
            </div>
        </section>
        <!--products view-->
        <section class="page-infinite-wrapper"
                 ref="productScroll"
                 v-show="!showToggle && searchType===1 && productsData.total"
                 :style="{ height: 100 + '%' }">
            <div class="page-infinite-list"
                 v-infinite-scroll="loadMore"
                 ref="dd"
                 infinite-scroll-disabled="isProDone"
                 infinite-scroll-distance="50"
                 infinite-scroll-immediate-check="false">
                <router-link @click.native="recordScroll"
                             :to="'/product/' + item.productId"
                             tag="div"
                             class="product-item border-1px"
                             v-for="item in productsData.productsList"
                             :key="item.productId">
                    <div>
                        <img :src="getImg(item.imgs)"
                             alt=""
                             class="pro-img">
                    </div>
                    <div class="pro-brief">
                        <p class="pro-name ellipsis-2"><span v-html="item.name"></span></p>
                        <p class="pro-moq "
                           v-show="item.minOrder">MOQ:{{item.minOrder}} {{item.minOrderUnitEnName}}</p>
                        <p class="pro-moq"
                           v-show="item.fobPriceFrom">US $:{{item.fobPriceFrom}} - {{item.fobPriceTo}} / {{item.minOrderUnitEnName}}</p>
                        <img class="logo"
                             :src="LOGO_URL + logoItem"
                             alt=""
                             v-for="logoItem of getLogos(item.logo)">
                        <img class="logo-121"
                             src="./images/121.png"
                             alt=""
                             v-if="item.fairNo==='121'">
                    </div>
                </router-link>
                <div class="bottom-loading" v-show="isBtnLoading">Loading...</div>
            </div>
        </section>
        <!--Suppliers view-->
        <section class="page-infinite-wrapper"
                 ref="supScroll"
                 v-show="!showToggle && searchType===2 && suppliersData.total"
                 :style="{ height: 100 + '%' }">
            <div class="page-infinite-list"
                 v-infinite-scroll="loadMore"
                 infinite-scroll-disabled="isSupDone"
                 infinite-scroll-distance="100"
                 infinite-scroll-immediate-check="false">
                <router-link @click.native="recordSupScroll"
                             :to="'/shop/' + item.sellerId"
                             class="suppliers-item border-1px"
                             v-for="item in suppliersData.suppliersList"
                             :key="item.sellerId"
                             tag="div">
                    <p class="company-name ellipsis-2"><span v-html="item.companyEnName"></span></p>
                    <div>
                        <img :src="commonUrl + item"
                             alt=""
                             v-for="(item, index) of productMapImg(item.sellerId)"
                             class="s-img">
                    </div>
                    <p v-show="item.mainProducts"
                       class="ellipsis"><span class="main-product">Main Products: </span> <span v-html="item.mainProducts"
                              class="product-contnet "></span></p>
                    <p v-show="item.companyTypeEnName"
                       class="ellipsis"><span class="main-product ">Company Type: </span> <span class="product-contnet"
                              v-html="item.companyTypeEnName"></span></p>
                    <img class="logo"
                         :src="LOGO_URL + logoItem"
                         alt=""
                         v-for="logoItem of getLogos(item.logo)">
                    <img class="logo-121"
                         src="./images/121.png"
                         alt=""
                         v-if="item.fairNo==='121'">
    
                </router-link>
                <div class="bottom-loading" v-show="isBtnLoading">Loading...</div>
            </div>
        </section>
    </div>
</template>

<script>
import { IMG_URL } from "common/js/common";
import products from "@/pages/search/children/searchDefault";
import { Indicator, Toast } from "mint-ui";
import {CFEC} from 'common/js/util.js';

export default {
    data() {
        return {
            searchType: 1,     // 搜索类型    1：商品  2：店铺
            searchText: "",    // 搜索文字
            proPage: 1,         // 返回商品页数
            supPage: 1,         // 返回店铺页数
            proMaxPage: "",     // 最大商品页数  停止上拉
            supMaxPage: "",     // 最大店铺页数  停止上拉
            showToggle: true,  // 切换商品店铺视图
            featchData: null,
            disTop: 0,
            isResult: true,
            showArrow: false,    // 切换箭头和cancel
            isChangeLeft: false,
            isLoading: true,
            wrapperHeight: "",
            categoryId: "",
            categoryTitle: "",
            isSupDone: false,
            isProDone: false,
            isBtnLoading: false,
            productsData: {        //  保存商品数据
                productsList: [],
                total: 1         // 判断是否有查询结果
            },
            suppliersData: {       //  保存供应商数据
                suppliersList: [],
                total: 1
            },
            productMap: {},
            commonUrl: IMG_URL,
            LOGO_URL,
            proScroll: 0,        
            supScroll: 0

        };
    },
    components: {
        "v-products": products
    },
    mounted() {
        this.$refs.productScroll.addEventListener("scroll", () => {
            this.proScroll = this.$refs.productScroll.scrollTop;
        });
        this.$refs.supScroll.addEventListener("scroll", () => {
            this.supScroll = this.$refs.supScroll.scrollTop;
        });
    },
    computed: {
        noResult() {
            switch (this.searchType) {
                case 1:
                    return !this.productsData.total || false;
                case 2:
                    return !this.suppliersData.total || false;
            }
        },
        getSearchText() {
            return this.$store.state.keyword;
        }
    },

    activated() {
        //  首页的直接跳转关键字搜索

        if (this.$route.params.productKeyWord && !this.$store.state.flag_HomeToSearch) {     
            this.$store.commit("CHANGE_KEYWORD", this.$route.params.productKeyWord);
            this.searchText = this.$route.params.productKeyWord;
            this.fetchData();
            this.$store.commit("HOME_TO_SEARCH");
        }

        if (this.$store.state.recordProScroll && (this.searchType === 1)) {
            this.$nextTick(() => {
                this.$refs.productScroll.scrollTop = this.$store.state.recordProScroll;
            });
        }
        
        if (this.$store.state.recordSupScroll && (this.searchType === 2)) {
            this.$nextTick(() => {
                this.$refs.supScroll.scrollTop = this.$store.state.recordSupScroll;
            });
        }
    },

    methods: {
        //  记录供应商滚动位置
        recordSupScroll() {
            let scrollTop = this.supScroll;
            this.$store.commit("RECORD_SUP_SCROLL", scrollTop);
        },
        //  记录商品滚动位置
        recordScroll() {
            let scrollTop = this.proScroll;
            this.$store.commit("RECORD_SCROLL", scrollTop);
        },
        // 获取图片
        getImg(value) {
            return `${IMG_URL}${value.split(",")[0]}`;
        },
        // 获取logo
        getLogos(value) {
            return value.split(",");
        },
        //  切换商品列表
        toProducts() {
            this.searchType = 1;
        },
        //  切换供应商列表
        toSuppliers() {
            this.searchType = 2;
        },
        //  检查输入
        checkInput() {
            this.searchText ? this.changeSearchText() : "";
        },
        cancel() {
            this.$router.replace("/home");
        },
        //  清空搜索文字
        clearKeyWord() {
            this.searchText = "";
        },
        //  获取商品图片
        productMapImg(sellerId) {
            let sImg = [];
            for (let item of (this.productMap)[sellerId]) {
                sImg.push(item.imgs.split(",")[0]);
            }
            return sImg;
        },
        backArrow() {
            if (this.$route.params.productKeyWord) {           // 首页进，返回首页
                this.$router.go(-1);
            }
            this.productsData.total = 1;
            this.suppliersData.total = 1;
            this.showToggle = true;
            this.isResult = true;
            this.showArrow = false;
            this.searchText = "";
            this.isChangeLeft = false;
        },
        changeSearchText() {
            this.$store.commit("CHANGE_KEYWORD", this.searchText);
            this.fetchData();
        },
        //  拉取数据
        fetchData() {
            this.$refs.supScroll.scrollTop = 0;
            this.$refs.productScroll.scrollTop = 0;
            this.isResult = false;
            this.proPage = 1;
            this.supPage = 1;
            this.showArrow = true;
            this.showToggle = false;
            this.isProDone = false;
            this.isSupDone = false;
            this.isChangeLeft = true;
            this.categoryId = null;
            Indicator.open("Loading...");
            let _this = this;
            let getProducts = function () {
                let params = {
                    keyword:_this.$store.state.keyword,
                    page:1
                }
                return _this.axios({
                    method:'get',
                    url:'/search/products.cf',
                    params:CFEC.addConfig(params)
                })
            };
            let getSuppliers = function () {
                let params = {
                    keyword:_this.$store.state.keyword,
                    page:1
                }
                return _this.axios({
                    method:'get',
                    url:'/search/shops.cf',
                    params:CFEC.addConfig(params)
                })
            };

            this.$refs.focus.blur();

            this.axios.all([getProducts(), getSuppliers()])
                .then(_this.axios.spread((productsRes, suppliersRes) => {
                    this.$nextTick(() => {
                        Indicator.close();
                        this.productsData.productsList = productsRes.data.data.productList;
                        this.proMaxPage = productsRes.data.page.maxPage;
                        this.productsData.total = productsRes.data.page.total;

                        this.suppliersData.suppliersList = suppliersRes.data.data.shopList;
                        this.supMaxPage = suppliersRes.data.page.maxPage;
                        this.suppliersData.total = suppliersRes.data.page.total;

                        this.productMap = suppliersRes.data.data.productMap;
                    });

                }))
                .catch(() => {
                    Indicator.close();
                    Toast("Network Timeout");
                });
        },
        //  加载更多判断
        loadMore() {
            if (this.isLoading) {
                this.loadMoreHere();
            }
        },
        //  加载更多方法
        loadMoreHere() {
            this.isLoading = false;
            switch (this.searchType) {
                case 1:
                    if (this.proPage <= this.proMaxPage) {
                        this.isBtnLoading = true;
                        let params = {
                            keyword:this.$store.state.keyword,
                            page:++this.proPage
                        }
                        this.axios({
                            method:'get',
                            url:'/search/products.cf',
                            params:CFEC.addConfig(params)
                        })
                            .then((res) => {
                                this.$nextTick(() => {
                                   this.isBtnLoading = false;
                                    for (let value of res.data.data.productList) {
                                        this.productsData.productsList.push(value);
                                    }
                                    this.isLoading = true;
                                });

                            })
                            .catch(() => { 
                               this.isBtnLoading = false;
                             Toast("Network Timeout");    
                         });
                    } else {
                        this.isLoading = true;
                        this.isProDone = true;
                        Toast("No more data");
                    }
                    break;
                case 2:
                    if (this.supPage <= this.supMaxPage) {
                        this.isBtnLoading = true;
                        let params = {
                            keyword:this.$store.state.keyword,
                            page:++this.supPage
                        }
                        this.axios({
                            method:'get',
                            url:'/search/shops.cf',
                            params:CFEC.addConfig(params)
                        })
                            .then((res) => {
                                this.$nextTick(() => {
                                   this.isBtnLoading = false;
                                    for (let value of res.data.data.shopList) {
                                        this.suppliersData.suppliersList.push(value);
                                    }
                                    this.productMap = Object.assign(this.productMap, res.data.data.productMap);
                                    this.isLoading = true;
                                });

                            })
                            .catch(() => { 
                             this.isBtnLoading = false;
                             Toast("Network Timeout");  
                            });
                    } else {
                        this.isLoading = true;
                        this.isSupDone = true;
                        Toast("No more data");
                    }
            }
        }
    }
    // directives: {
    //     focus: {
    //         inserted(el) {
    //             el.focus();
    //         }
    //     }
    // }
};

</script>
    
    
<style lang="stylus" rel="stylesheet/stylus" scoped>
   @import "../../common/stylus/mixin.styl";

       .logo-121
        width: 2rem
        height: .8rem
        position absolute
        right: .6rem
        bottom: .6rem

    .tsf
     position: relative;

    

    .suppliers-item
      border-1px-b(rgba(0, 0, 0, .12))  

    .result-title
      position: absolute
      left: 50%
      transform: translateX(-50%)

   .search-top
    position: fixed;
    top:0
    width:100%
    z-index: 500

   .s-img 
     width: 3.2rem
     height: 3.2rem
     & + .s-img
      margin-left: .6rem

    .back-arrow 
        color: #FF0030
        font-size: 1rem
        display: inline-block
        width: .5rem
        height: 100%
        padding-left: 2rem
        padding-right: 1rem
        background: url("./images/icon_back_light.png") no-repeat .6rem center
        background-size: .5rem .95rem

    .header 
      background: #FAFAFA 
      height:2.2rem
      line-height: 2.2rem
      position: relative
      border-1px-b(rgba(0, 0, 0, .12))
      .input-wrap
       height 1.4rem 
       width: 14.5rem
       position: absolute
       top: 50%
       left: .6rem
       transform: translateY(-50%)
       border-radius: 6px;
       &:before
        z-index: -1;
        content:"";
        display: block;
        position: absolute;
        top: -.6px;
        left: -1px;
        width: 201%;
        height: 201%;
        transform-origin: 0 0;  
        transform: scale(.5, .5);
        border: 1px solid rgba(0, 0, 0, 0.54);
        border-radius: 4px;
       &.change-left
        left: 2.2rem 
       input 
        display: block
        font-size: .8rem
        width: 100%
        height: 100%
        padding-left: 1.3rem
        background: transparent url("./images/icon_search_light.png") no-repeat .3rem center
        background-size: .7rem .7rem
        font-size: .7rem
        box-sizing: border-box
        -webkit-box-sizing:border-box        

    .tabs 
      background: #fff
      height: 2.2rem 
      text-align: center 
      line-height: 2.2rem 
      font-size: .8rem 
      border-1px-b(rgba(0, 0, 0, .12))
      .tabs-item 
       float: left
       width 50%
  
             
     .cancel
       font-size: .8rem;
       color: rgba(0,0,0,0.54);
       letter-spacing: -0.61px;
       position: absolute
       right: .6rem

.page-infinite-list
  padding-top: 4.4rem
     
 .page-infinite-wrapper
       background: #fff
       position absolute
       top: 0
       width 100%
       overflow: auto
       -webkit-overflow-scrolling:touch

    .page-loadmore-listitem 
      height: 6.2rem
      border-bottom: solid 1px #eee
      text-align: center

    .pro-img 
      width: 5rem
      height: 5rem
      float: left
      padding-left: .6rem

    .product-item 
      height: 5rem 
      padding: .6rem 0 .6rem 0
      overflow:hidden
      border-1px-b(rgba(0, 0, 0, .12))

     
    .pro-brief 
      margin-left: .6rem
      line-height: 1rem
      float: left
      width: 11.95rem
      
    
    .pro-name
      font-size: .7rem;
      color: rgba(0,0,0,0.87);
      letter-spacing: -0.61px;
      
    
     .pro-moq
        font-size: .7rem;
        color: rgba(0,0,0,0.54);
        letter-spacing: -0.21px;
      
      .logo 
        width: .8rem
        height: .8rem
       
      .logo + .logo
        margin-left: .4rem 

      
      .active
        color: #FF0030

      .suppliers-item
        height: 8.4rem
        padding: .6rem
        font-size: .7rem;
        letter-spacing: -0.61px;
        line-height: 1rem
        &::after
         left: 0 
         
         
     .company-name
       color: rgba(0,0,0,0.87);
       line-height 1rem
       padding-bottom: .4rem

    .main-product
      color: rgba(0,0,0,0.26);

    .product-contnet 
      color: rgba(0,0,0,0.54);


    .no-result
      font-size: .7rem;
      color: rgba(0,0,0,0.54);
      letter-spacing: -0.61px;
      line-height: 1rem;
      padding: 1rem 0 0 1.8rem
   
   .loading 
     text-align: center
     font-size: .8rem
     padding-bottom: 1rem
     color: rgba(0,0,0,0.54);

    .up-arrow
      color: rgba(0,0,0,0.54);

    .clear-all
      position: absolute
      top: 50%
      transform: translateY(-50%)
      right: .5rem
      width: 1rem
      height: 1rem

      img
       width: 100%
       height: 100%

.categoryTitle
  position: absolute
  left: 50%
  transform: translateX(-50%)


 .suppliers-item
  position:relative

</style>
