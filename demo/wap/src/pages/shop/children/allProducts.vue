
<template>
    <div>
        <v-header>
            <span slot="title"
                  class="c-head-title f-cenmiddle">
            Products
           </span>
        </v-header>
        <section class="page-infinite-wrapper"
                 :style="{ height: 100 + '%' }">
            <ul class="page-infinite-list"
                v-infinite-scroll="loadMore"
                infinite-scroll-disabled="isLoadDone"
                infinite-scroll-distance="50"
                infinite-scroll-immediate-check="false">
                <router-link :to="'/product/'+ item.productId"
                             class=""
                             v-for="(item, index) of productsList"
                             tag="li"
                             :key="index">
                    <img :src="getImg(item.imgs)"
                         alt="">
                    <p class="ellipsis-2">{{item.name}}</p>
                </router-link>
            </ul>
        </section>
    </div>
</template>

<script>
import header from "components/header/header";
import {
    Indicator,
    Toast
} from "mint-ui";
import {
    IMG_URL
} from "common/js/common";
import {CFEC} from 'common/js/util.js';

export default {
    components: {
        "v-header": header
    },
    data() {
        return {
            sellerId: this.$route.params.sellerId,  //  卖家Id
            IMG_URL,
            page: 1,
            maxPage: "",
            isLoadDone: false,  //  是否加载完
            productsList: []  //  保存所有商品数据
        };
    },
    methods: {
        //  获取图片路径
        getImg(value) {
            return `${IMG_URL}${value.split(",")[0]}`;
        },
        // 加载更多判断
        loadMore() {
            if (!this.isLoading) { // 防止多加载
                this.loadMoreHere();
            }

        },
        //  加载更多方法
        loadMoreHere() {
            this.isLoading = true;
            if (this.page < this.maxPage) {
                Indicator.open("Loading...");
                let params = {
                    sellerId:this.sellerId,
                    page:++this.page
                }
                this.axios({
                    method:'get',
                    url:'/search/products.cf',
                    params:CFEC.addConfig(params)
                })
                    .then((res) => {
                        for (let value of res.data.data.productList) {
                            this.productsList.push(value);
                        }
                        Indicator.close();
                        this.isLoading = false;
                    })
                    .catch(() => {
                        Indicator.close();
                    });

            } else {
                Toast("No more data");
                this.isLoadDone = true;
                this.isLoading = false;
            }
        },
        // 拉取所有商品数据
        fetchProductsList() {
            this.page = 1;
            this.isLoadDone = false;
            Indicator.open("Loading...");
            let params = {
                page:1,
                sellerId:this.sellerId
            }
            this.axios({
                method:'get',
                url:'/search/products.cf',
                params:CFEC.addConfig(params)
            })
                .then((res) => {
                    this.productsList = res.data.data.productList;
                    this.maxPage = res.data.page.maxPage;
                    Indicator.close();
                })
                .catch(() => {
                    Indicator.close();
                    Toast("Network Timeout");
                });
        }

    },
    created() {
        this.fetchProductsList(this.$route.params.sellerId);
    },
    activated() {
        this.sellerId = this.$route.params.sellerId;
    },
    watch: {
        // 监测卖家id变化
        sellerId(newId) {
            console.log("fs");
            this.fetchProductsList(newId);
        }
    }
};
</script>


<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../../common/stylus/mixin.styl";

.page-infinite-wrapper
  position absolute
  top: 0
  width: 100%
  overflow: auto;

.page-infinite-list
 overflow:hidden
 padding-top: 2.2rem
 padding-bottom: .6rem
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
   bottom: 0
   border-bottom: 1px solid rgba(0, 0, 0, .12)
   content: "" 
   -webkit-transform: scaleY(.5)
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
    -webkit-transform: scaleX(.5)
    transform: scaleX(.5)  
</style>
