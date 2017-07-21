
<template>
    <div>
     
        <!--顶部部导航-->
        <c-header title="All Buying Requests">
            <router-link class="c-header-right-text c-header-active" slot="right" to="/buyingRequest/1">
            Post
            </router-link>
        </c-header>
        <!--顶部导航-->

        <div class="request-manage-noresult" v-show="isExits">
            <span>Sorry， you have no buying requests yet.</span>
        </div>
        <section class="page-infinite-wrapper" :style="{ height: 100 + '%' }" v-show="!isExits">
            <ul class="request-manage-list-wrap page-infinite-list" v-infinite-scroll="loadMore" infinite-scroll-disabled="isLoadDone" infinite-scroll-distance="50" infinite-scroll-immediate-check="false">
                <router-link :to="'/buyingRequestDetail/' + item.procurementId" v-for="(item, index) of buyingRequestList" tag="li" :key="index">
                    <p class="f-ellipsis-2 subject">{{item.productName}}</p>
                    <div class="bottom">
                        <p class="procurementState-wrap"><span class="procurementState" :style="{'background': statusDot(item.procurementState)}"></span><span class="procurementStateText">{{procurementStateText(item.procurementState)}}</span></p>
                        <p class="quote-num"><span>{{item.quoteNum}} Quotes</span>&nbsp;&nbsp;<span v-if="item.unReadQuoteNum > 0" :class="String(item.unReadQuoteNum).length > 1 ? 'doubleUnReadQuoteNum' : 'unReadQuoteNum'">{{item.unReadQuoteNum}}</span> </p>
                        <span class="time">{{item.startTime | sliceTime}}</span>
                    </div>
                </router-link>
            </ul>
        </section>
    </div>
</template>

<script>
import { localStorage } from "common/js/util.js";
// import header from "components/header/header";
import { IMG_URL } from "common/js/common";
import { Indicator, Toast } from "mint-ui";
import header from "components/header";

export default {
    data() {
        return {
            buyingRequestList: [],   //  采购需求列表
            IMG_URL,    
            isExits: false,   //  该账户有没有采购需求
            localToken: null,  //  token
            page: 1,
            maxPage: "",    
            isLoading: false,  //  防止加载多次
            isLoadDone: false  //  加载完成判断
        };
    },
    components: {
        "c-header": header
    },
    methods: {
        // 加载更多判断
        loadMore() {
            if (!this.isLoading) {  // 防止多加载
                this.loadMoreHere();
            }
        },
        //  加载更多方法
        loadMoreHere() {
            this.isLoading = true;
            Indicator.open("Loading...");
            this.axios({
                method:'get',
                url:'/buyer/buyingRequest/list.cf',
                params:{
                    page:++this.page,
                    token:this.localToken,
                    appFlag:2
                }
            })
                .then((res) => {

                    if (!res.data.data.length) {
                        Indicator.close();
                        Toast("No more data");
                        this.isLoadDone = true;
                        this.isLoading = false;
                    } else {
                        for (let value of res.data.data) {
                            this.buyingRequestList.push(value);
                        }
                        Indicator.close();
                        this.isLoading = false;
                    }
                })
                .catch(() => {
                    Indicator.close();
                });
        },

        // 获取采购需求列表
        fetchRequestList() {
            this.page = 1;
            this.isLoadDone = false;
            Indicator.open("Loading...");
            this.localToken = JSON.parse(localStorage.get("localUserInfo")).message;    // 获取token
            this.axios({
                method:'get',
                url:'/buyer/buyingRequest/list.cf',
                params:{
                    token:this.localToken,
                    appFlag:2
                }
            })
                .then((res) => {
                    Indicator.close();
                    this.buyingRequestList = res.data.data;
                    this.maxPage = res.data.page.maxPage;
                    if (!this.buyingRequestList.length) {
                        this.isExits = true;
                    } else {
                        this.isExits = false;
                    }                    
                })
                .catch(() => {
                    Indicator.close();
                    Toast("Network Timeout");
                });
                
        },
        //  采购需求状态标识
        statusDot(status) {
            switch (status) {
                case 1:
                    return "#f3c210";
                case 2:
                    return "#23BA69";
                case 3:
                    return "#FF0030";
                case 4:
                    return "#666 ";
                case 5:
                    return "#bdbdbd";
                case 8:
                    return "#23BA69";
            }
        },
        //  头像
        existAvatar(_item) {
            let avatar = _item.receiverPhoto || "http://static.e-cantonfair.com/ec/images/homeIndex/logo-default.png";
            return avatar;
        },
        //  采购需求状态文字
        procurementStateText(status) {
            switch (status) {
                case 1:
                    return "Pending";
                case 2:
                    return "Approved";
                case 3:
                    return "Rejected";
                case 4:
                    return "Invalid ";
                case 5:
                    return "Expired";
                case 8:
                    return "Approved";
            }
        }
    },
    created() {        
        !this.$store.state.refreshRequest ? this.fetchRequestList() : "";
    },
    activated() {
        this.$store.state.refreshRequest ? this.fetchRequestList() : "";
    },
    filters: {
        //  格式化时间
        sliceTime: (time) => {
            return time.substr(0, time.indexOf(" "));
        }
    }
};
</script>


<style lang="stylus" rel="stylesheet/stylus" >
@import "../../../common/stylus/mixins/index.styl"

.request-manage
 &-noresult
  no-result("../images/img_empty.png")
 &-list-wrap 
  padding: 2.8rem .4rem 0 .4rem
  li
   background: #fff
   margin-bottom:.6rem
   height: 4.2rem
   padding-left: .6rem
   .subject
    font-size: .7rem
    padding-top: .6rem
    color: rgba(0,0,0,0.87)
    letter-spacing: -0.61px
    height: 2rem
    line-height: 1rem;
   .bottom
    height: 1rem
    font-size: .6rem
    color: rgba(0,0,0,0.26)
    letter-spacing: -0.21px
    line-height: 1rem
    position relative
    .time
     float: right
     padding-right: .6rem
    .quote-num
     font-size: .7rem
     color: rgba(0,0,0,0.54)
     letter-spacing: -0.61px
     position:absolute
     top: 0
     left: 50%
     transform: translateX(-50%) 
    .procurementState-wrap
     display inline-block
     margin-left: .6rem
     .procurementState
      display inline-block
      width: .4rem
      height: .4rem
      border-radius: 50%
      -webkit-border-radius: 50%
      margin-right: .3rem
     .procurementStateText 
      font-size: .7rem
      color: rgba(0,0,0,0.54)
      letter-spacing: -0.61px
      line-height: 1rem

.doubleUnReadQuoteNum
 width: 1.2rem
 height: .9rem
 display inline-block
 border-radius: 50px
 -webkit-border-radius: 50px
 color: #fff
 background #ff0030
 font-size: .65rem
 text-align: center
 line-height: .9rem

.unReadQuoteNum 
 width: .9rem
 height: .9rem
 display inline-block
 border-radius: 50%
 -webkit-border-radius: 50%
 color: #fff
 background #ff0030
 font-size: .65rem
 text-align: center
 line-height: .9rem


 


 













</style>
