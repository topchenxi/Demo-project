<template>
    <div>
        <section class="search-top">
            <div class="header border-1px">
                <span class="back-arrow"
                      @click="backArrow"></span>
                <span class="categoryTitle">{{categoryTitle}}</span>
                <div class="back-home"
                     @click="backHome"></div>
            </div>
            <div class="tabs border-1px">
                <div class="tabs-item"
                     @click="toProducts"
                     :class="{active:searchType===1}">Products</div>
                <div class="tabs-item"
                     @click="toSuppliers"
                     :class="{active:searchType===2}">Suppliers</div>
            </div>
            <div v-show="noResult"
                 class="no-result">
                Sorry!
                <br> No matches found for {{categoryTitle}}
            </div>
        </section>
        <!--products view-->
        <section class="page-infinite-wrapper"
                 v-show="searchType===1"
                 ref="proWrapper"
                 :style="{ height: 100 + '%' }">
            <div class="page-infinite-list"
                 v-infinite-scroll="loadMore"
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
                 v-show="searchType===2"
                 ref="supWrapper"
                 :style="{ height: 100 + '%' }">
            <div class="page-infinite-list"
                 v-infinite-scroll="loadMore"
                 infinite-scroll-disabled="isSubDone"
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
import { Indicator, Toast } from "mint-ui";

export default {
    data() {
        return {
            searchType: 1,     // 搜索类型    1：商品  2：店铺
            searchText: "",    // 搜索文字
            proPage: 1,         // 返回商品页数
            supPage: 1,         // 返回店铺页数
            proMaxPage: "",     // 最大商品页数  停止上拉
            supMaxPage: "",     // 最大店铺页数  停止上拉
            showToggle: true,   // 切换商品店铺视图
            featchData: null,
            disTop: 0,
            showArrow: false,    // 切换箭头和cancel
            isChangeLeft: true,
            wrapperHeight: "",
            isLoading: false,
            categoryId: this.$route.params.categoryId,
            categoryTitle: "",
            isProDone: false,
            isSubDone: false,
            isDone: false,
            isBtnLoading: false,
            productsData: {        //  商品数据
                productsList: [],
                total: 1         // 判断是否有查询结果
            },
            suppliersData: {     //  供应商数据
                suppliersList: [],
                total: 1
            },
            productMap: {},    //  商品图片数据
            commonUrl: IMG_URL,
            LOGO_URL,
            proScroll: 0,
            supScroll: 0

        };
    },
    computed: {
        noResult() {
            switch (this.searchType) {
                case 1:
                    return !this.productsData.total || false;
                case 2:
                    return !this.suppliersData.total || false;
            }
        }
    },
    mounted() {
        this.$refs.proWrapper.addEventListener("scroll", () => {
            this.proScroll = this.$refs.proWrapper.scrollTop;
        });
        this.$refs.supWrapper.addEventListener("scroll", () => {
            this.supScroll = this.$refs.supWrapper.scrollTop;
        });
    },
    methods: {
        //  记录供应商滚动位置
        recordSupScroll() {

            this.$store.commit("RECORD_SUP_SCROLL", this.supScroll);
        },
        //  记录商品滚动记录
        recordScroll() {

            this.$store.commit("RECORD_SCROLL", this.proScroll);
        },
        //  返货首页
        backHome() {
            this.$router.replace("/home");
        },
        //  获取图片
        getImg(value) {
            return `${IMG_URL}${value.split(",")[0]}`;
        },
        //  获取logo
        getLogos(value) {
            return value.split(",");
        },
        //  切换到商品列表
        toProducts() {
            this.searchType = 1;
        },
        // 切换到供应商列表
        toSuppliers() {
            this.searchType = 2;
        },
        //  检查输入
        checkInput() {
            this.searchText ? this.changeSearchText() : "";
        },
        cancel() {
            this.$router.go(-1);
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
            this.$router.go(-1);
            this.productsData.total = 1;   // 隐藏没有结果的提示
            this.suppliersData.total = 1;
        },
        //  加载更多判断
        loadMore() {
            if (!this.isLoading) {  // 防止多加载
                this.loadMoreHere();
            }
        },
        //  加载更多方法
        loadMoreHere() {
            this.isLoading = true;
            switch (this.searchType) {
                case 1:
                    if (this.proPage <= this.proMaxPage) {
                       this.isBtnLoading = true;
                        this.axios({
                            method:'get',
                            url:'/search/products.cf',
                            params:{
                                catId:this.$route.params.categoryId,
                                page:++this.proPage,
                                appFlag:2
                            }
                        })
                            .then((res) => {
                                this.$nextTick(() => {
                                      this.isBtnLoading = false;
                                    for (let value of res.data.data.productList) {
                                        this.productsData.productsList.push(value);
                                    }
                                    this.isLoading = false;
                                });

                            })
                            .catch(() => {
                            this.isBtnLoading = false;
                            Toast("Network Timeout");  
                          });
                    } else {
                        this.isProDone = true;
                        this.isLoading = false;
                        Toast("No more data");
                    }
                    break;
                case 2:
                    if (this.supPage <= this.supMaxPage) {
                         this.isBtnLoading = true;
                        this.axios({
                            method:'get',
                            url:'/search/shopCategories.cf',
                            params:{
                                categoryIds:this.$route.params.categoryId,
                                page:++this.supPage,
                                appFlag:2
                            }

                        })
                            .then((res) => {
                                this.$nextTick(() => {
                                   this.isBtnLoading = false;
                                    for (let value of res.data.data.shopList) {
                                        this.suppliersData.suppliersList.push(value);
                                    }
                                    this.productMap = Object.assign(this.productMap, res.data.data.productMap);
                                    this.isLoading = false;
                                });

                            })
                            .catch(() => { console.log(err); });
                    } else {
                        this.isSubDone = true;
                        this.isLoading = false;
                        Toast("No more data");
                    }
            }
        },
        //  拉取搜索数据
        fetchCategorySearch(categoryId) {
            this.proPage = 1;
            this.supPage = 1;
            Indicator.open("Loading...");
            this.isDone = false;
            let _this = this;
            this.categoryTitle = this.$route.params.categoryEname;
            let getProducts = function () {

                return _this.axios({
                    method:'get',
                    url:'/search/products.cf',
                    params:{
                        catId:categoryId,
                        page:1,
                        appFlag:2
                    }
                })
            };
            let getSuppliers = function () {

                return _this.axios({
                    method:'get',
                    url:'/search/shopCategories.cf',
                    params:{
                        categoryIds:categoryId,
                        page:1,
                        appFlag:2
                    }
                })
            };

            this.axios.all([getProducts(), getSuppliers()])
                .then(_this.axios.spread((productsRes, suppliersRes) => {
                    Indicator.close();
                    this.productsData.productsList = productsRes.data.data.productList;
                    this.proMaxPage = productsRes.data.page.maxPage;
                    this.productsData.total = productsRes.data.page.total;

                    this.suppliersData.suppliersList = suppliersRes.data.data.shopList;
                    this.supMaxPage = suppliersRes.data.page.maxPage;
                    this.suppliersData.total = suppliersRes.data.page.total;

                    this.productMap = suppliersRes.data.data.productMap;
                }))
                .catch(() => {
                    Indicator.close();
                    Toast("Network Timeout");
                });
        }
    },
    // directives: {
    //     focus: {
    //         update(el, binding) {
    //           if (!binding.value) {
    //             el.focus();
    //           }

    //         }
    //     }
    // },
    watch: {
        //  检测类目Id
        categoryId(newId) {
            this.fetchCategorySearch(newId);
            this.isSubDone = false;
            this.isProDone = false;
            this.$refs.proWrapper.scrollTop = 0;
            this.$refs.supWrapper.scrollTop = 0;

        }
    },
    activated() {
        this.categoryId = this.$route.params.categoryId;
        if (this.$store.state.recordProScroll && (this.searchType === 1)) {
            this.$nextTick(() => {
                this.$refs.proWrapper.scrollTop = this.$store.state.recordProScroll;
            });
        }
        if (this.$store.state.recordSupScroll && (this.searchType === 2)) {
            this.$nextTick(() => {
                this.$refs.supWrapper.scrollTop = this.$store.state.recordSupScroll;
            });
        }
    },
    created() {
        this.fetchCategorySearch(this.$route.params.categoryId);
    }
};
     // 返回保存滚动条位置
</script>
    
<style lang="stylus" rel="stylesheet/stylus" scoped>
   @import "../../common/stylus/mixin.styl";
       .back-home
        position: absolute
        right: 1rem
        top: 50%
        transform: translateY(-50%)
        height: 1.2rem
        width: 1.2rem
        background: url("./images/icon_tab_home_nor.png") no-repeat
        background-size: contain
        text-align center 
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;    

   

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
        padding-left: 2rem
        padding-right: 1rem
        height: 100%
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
       left: 1.825rem
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
        left: .6rem 
       input 
        display: block
        font-size: .8rem
        width: 100%
        height: 100%
        padding-left: 1.3rem
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
       width: 100%
       overflow: auto
       -webkit-overflow-scrolling:touch

    .page-loadmore-listitem 
      height: 6.2rem
      border-bottom: solid 1px #eee
      text-align: center

    .pro-img 
      width: 5rem
      height: 5rem
      float:left
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

      .suppliers-item 
        border-1px-b(rgba(0, 0, 0, .12))


     .company-name
       color: rgba(0,0,0,0.87);

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
  width: 12rem
  transform: translateX(-50%)
  white-space: nowrap
  font-size: .8rem
  text-align: center

     
.logo-121
  width:2rem
  height: .8rem
  position absolute
  right: .6rem
  bottom: .6rem  

.suppliers-item 
 position relative
</style>
