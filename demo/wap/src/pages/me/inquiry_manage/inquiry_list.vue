
<template>
    <div>
        
         <!--顶部导航-->
         <c-header title="Inquiries"></c-header>
         <!--顶部导航-->

        <div class="inquiry-manage-noresult"
             v-show="isExits">
            <span>Sorry, you have no inquiries yet</span>
        </div>

        <section class="page-infinite-wrapper" :style="{ height: 100 + '%' }"  v-show="!isExits" >
            <ul class="inquiry-manage-list-wrap page-infinite-list" 
                v-infinite-scroll="loadMore"
                infinite-scroll-disabled="isLoadDone"
                infinite-scroll-distance="50"
                infinite-scroll-immediate-check="false">
                <router-link :to="'/inquiryDetail/'+ item.messageId"
                             v-for="(item, index) of inquiryList"
                             tag="li"
                             :key="index">
                    <p class="f-ellipsis-2 subject"><span v-if="item.unReadNum" class="unread"></span> {{item.subject}}</p>
                    <p class="bottom">
                        <img :src="existAvatar(item)"
                             alt=""
                             class="avatar"><span class="receivername">{{item.receiverName}}</span>
                        <span v-if="item.messageState === -1"
                              class="rejected">Rejected</span>
                        <span v-if="item.messageState === 1"
                              class="pending">Pending</span>
                        <span v-if="item.messageState === 2"
                              class="approved">Approved</span>
                        <span class="time">{{item.createTime | sliceTime}}</span>
                    </p>
                </router-link>
            </ul>
        </section>
    </div>
</template>

<script>
import { localStorage,CFEC } from "common/js/util.js";
import header from "components/header";
import { IMG_URL } from "common/js/common";
import { Indicator, Toast } from "mint-ui";
export default {
    data() {
        return {
            inquiryList: [],  // 询盘列表数据
            isExits: false,   //  是否存在询盘
            IMG_URL,
            isLoading: false,  //  防止多加载
            localToken: null,
            page:1,
            maxPage: "",
            isLoadDone: false  //  是否加载完毕
        };
    },

    components: {
        "c-header": header
    },

    methods: {

        //  头像
        existAvatar(_item) {
            if (_item.receiverPhoto) {
                return IMG_URL + _item.receiverPhoto;
            } else {
                return "http://static.e-cantonfair.com/ec/images/homeIndex/logo-default.png";
            }
        },

        //  加载更多
        loadMore() {
            if (!this.isLoading) {  // 防止多加载
                this.loadMoreHere();
            }
        },

        //  加载更多方法
        loadMoreHere() {
              this.isLoading = true;
            if (this.page < this.maxPage) {
                Indicator.open("Loading...");
                let params = {
                    page:++this.page,
                    token:this.localToken
                }
                this.axios({
                    method:'get',
                    url:'/message/inquirys.cf',
                    params:CFEC.addConfig(params)
                })
                .then((res) => {
                    for (let value of res.data.data) {
                          this.inquiryList.push(value);
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
    // 拉取列表数据
    fetchInquiryList() {
        this.page = 1;
        this.isLoadDone = false;
        Indicator.open("Loading...");
        this.localToken = JSON.parse(localStorage.get("localUserInfo")).message;    // 获取token
        let params = {
            page:1,
            token:this.localToken
        }
        this.axios({
            method:'get',
            url:'/message/inquirys.cf',
            params:CFEC.addConfig(params)
        })
            .then((res) => {
                this.inquiryList = res.data.data;
                this.maxPage = res.data.page.maxPage;
                if (!this.inquiryList) {
                    this.isExits = true;
                } else {
                    this.isExits = false;
                }
                Indicator.close();
            })
            .catch(() => {
                Indicator.close();
                Toast("Network Timeout");
            });
    }
        
    },
    created() {

      !this.$store.state.refreshInquire ? this.fetchInquiryList() : "";
    },
    activated() {
        this.$store.state.refreshInquire ? this.fetchInquiryList() : "";
    },
    filters: {
    // 格式化时间
        sliceTime: (time) => {
            return time.substr(0, time.indexOf(" "));
        }
    }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" >
@import "../../../common/stylus/mixins/index.styl"
.inquiry-manage
 &-noresult
  no-result("../images/img_empty.png")
 &-list-wrap
  padding: 2.8rem .4rem 0 .4rem  
  li
   background: #fff
   height: 4.2rem
   margin-bottom .6rem
   padding-left: .6rem
   .subject
    font-size: .7rem
    padding-top: .6rem
    color: rgba(0,0,0,0.87)
    letter-spacing: -0.61px
    height: 2rem
    line-height: 1rem;
    padding-right: .6rem;
    white-space:pre-wrap
    word-break: break-word
    word-wrap: break-word
   .unread
    display: inline-block
    width: 0.4rem
    height: 0.4rem
    border-radius: 50%
    margin-right: 0.3rem
    background: #ff0034  
   .bottom
    height: 1rem
    font-size: .6rem
    color: rgba(0,0,0,0.26)
    letter-spacing: -0.21px
    line-height: 1rem
    position relative
    .avatar
     height: 1rem
     width: 1rem
     vertical-align: middle
     border-radius: 50%
     -kebkit-border-radius: 50%
    .receivername 
     vertical-align: middle
     margin-left: .6rem
    .time
     float: right
     padding-right: .6rem
    .rejected
     status(#FF0030)   
    .pending 
     status(rgb(243, 194, 16))
    .approved
     status(rgba(0,0,0,0.26))
  
.page-infinite-wrapper
  position absolute
  top: 0
  width: 100%
  overflow: auto;
 
</style>
