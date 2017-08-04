
<template>
    <div class="inquiry-detail-container">

        <!--顶部导航-->
        <c-header title="Inquiry Detail" :customBack="back"></c-header>
        <!--顶部导航-->
     
        <section class="inquiry-detail-top">
            <div class="c-rejected-wrap"
                 v-if="messageDTO.messageState===-1 && (messageDTO.messageTypeId===1 || messageDTO.messageTypeId===5)">
                <p class="rejected-title"><span class="rejected-icon">!</span>Rejected</p>
                <p class="rejected-reason">Reason:</p>
                <p class="rejected-content">
                    {{messageDTO.reasonEnName}}
                </p>
            </div>
            <router-link :to="'/sellerProfill/' + messageDTO.receiverId"
                         class="inquiry-detail-receiver"
                         tag="div">
                To :
                <span>
                        {{messageDTO.receiverName}}
                    </span>
            </router-link>

            <div class="inquiry-detail-top-bottom">
                <p class="inquiry-detail-subject border-1px">
                    {{messageDTO.subject}}
                </p>
                <p class="inquiry-detail-posted-date">
                    Posted Time:
                    <span>{{messageDTO.createTime}}</span>
                </p>
            </div>
        </section>
    
        <section class="inquiry-detail-product-wrap"
                 v-if="productInfo">
            <img v-if="productInfo.productPhoto"
                 :src="IMG_URL + productInfo.productPhoto.split(',')[0]"
                 alt=""
                 >
            <div class="product-main">
                <p class="product-name f-ellipsis-2">{{productInfo.productName}}</p>
                <p v-if="productInfo.minOrder"
                   class="product-moq"><span>MOQ: {{productInfo.minOrder}} {{productInfo.unit}}</span></p>
            </div>
        </section>
        <section class="inquiry-detail-quantity"
                 v-if="productInfo">
            Quantity:
            <span>{{productInfo.totalNum}} {{productInfo.unit}}</span>
        </section>
    
        <!--采购需求询盘-->
        <router-link v-if="procurement"
                     :to="'/buyingRequestDetail/' + procurement.procurementId"
                     class="inquiry-detail-receiver"
                     tag="div">
            Buying Request:
            <span>
                        {{procurement.productName}}
                    </span>
        </router-link>
    
        <section v-if="messageDTO.content && messageDTO.content.replace(/(^\s*)|(\s*$)/g, '')" class="inquiry-detail-description border-1px">
            <p class="des-title">
                Description :
            </p>
            <p class="des-content">
                {{messageDTO.content}}
            </p>
        </section>
             <router-link v-if="messageDTO.filePath"
                 :to="{name:'attachment',params:{'attachment':messageDTO.filePath.split(',')}}"
                 class="c-attachment">Attachment</router-link>

        <section>
            <div v-for="(item, index) of replys"
                 :key="index"
                 class="reply-list">
                <span class="reply-date">{{item.createTime | formaTtime1}}</span>
                <div :class="messageDTO.createById===item.userId? 'reply-me-wrap' : 'reply-seller-wrap'">
                    <img :src="axistAvatar(item)"
                         alt=""
                         :class="messageDTO.createById===item.userId ? 'reply-me-avatar' : 'reply-seller-avatar'">
                    <p :class="messageDTO.createById===item.userId ? 'reply-me-content' : 'reply-seller-content'">
                        <span class="reply-nickname"
                              v-if="!messageDTO.createById===item.userId">{{item.userName}}</span>
                        <span>
                                {{item.content}}
                            </span>
                    </p>
                    <span :class="messageDTO.createById===item.userId ? 'reply-me-time' :'reply-seller-time'">
                            {{item.createTime | formaTtime}}
                        </span>
                </div>
            </div>
        </section>
   
        <router-link :to="'/reply/' + this.$route.params.messageId + '/' + messageDTO.receiverId"
                     class="c-inquiry-footer-btn">
            <span>Reply</span>
        </router-link>
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
            messageDTO: {},
            productInfo: null,
            replys: [],
            procurement: null,
            IMG_URL
        };
    },
    components: {
        "c-header": header
    },
    filters: {
        formaTtime: (value) => {
            return value.substr(value.indexOf(" "));
        },
        formaTtime1: (value) => {
            let d = new Date();
            let time = value.substr(0, value.indexOf(" "));
            let month = d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1;
            let date = d.getDate() < 10 ? "0" + (d.getDate()) : d.getDate();
            let nowTime = (d.getFullYear()) + "-" + month + "-" + date;

            if (time === nowTime) {
                time = "Today";
            }
            return time;

        }
    },
    methods: {
        axistAvatar(_item) {
            if (_item.userPhoto) {
                return IMG_URL + _item.userPhoto;
            } else {
                return "http://static.e-cantonfair.com/ec/images/homeIndex/logo-default.png";
            }
        },
        back() {
            this.$store.commit("REFRESH_INQUIRE", 2);   // 返回不刷新询盘列表
            this.$router.go(-1);
        }
    },
    created() {
        Indicator.open("Loading...");
        let localToken = JSON.parse(localStorage.get("localUserInfo")).message;    // 获取token
        let params = {
            token:localToken,
            messageId:this.$route.params.messageId
        }
        this.axios({
            method:'get',
            url:'/message/getInquiryDetail.cf',
            params:CFEC.addConfig(params)
        })
            .then((res) => {
                let d = res.data.data;
                this.messageDTO = Object.assign({}, this.messageDTO, d.messageDTO);
                if (d.productInfo) {
                    this.productInfo = Object.assign({}, this.productInfo, d.productInfo);
                }
                if (d.replys) {
                    this.replys = d.replys;
                }
                if (d.procurement) {
                    this.procurement = d.procurement;
                }
                Indicator.close();
            })
            .catch(() => {
                Indicator.close();
                Toast("Network Timeout");
            });
    }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../../common/stylus/mixins/index.styl"

.inquiry-detail
 &-container
  padding-top: 2.2rem
  padding-bottom: 3.6rem
 &-top
  margin-bottom: .6rem
 &-receiver  
  font-size: 20px
  height: $cell-height
  padding-left: $left-24
  margin-bottom: .6rem
  line-height: 2.4rem
  font-size: .8rem
  color: rgba(0, 0, 0, .87)
  letter-spacing: -0.61px
  background: #fff url("../images/icon_list_arrow.png") no-repeat 17.4rem center
  background-size: 0.8rem 1.2rem     
  span
   float: right
   margin-right: 1.6rem
   font-size: .7rem
   color: rgba(0, 0, 0, .54)
 &-top-bottom
  background: #fff
 &-subject   
   padding: .6rem
   font-size: .7rem
   color: rgba(0,0,0,0.87)
   letter-spacing: -0.61px
   line-height 1.2rem
   word-break break-word
   word-wrap break-word
   border-1px-b(rgba(0, 0, 0, .12),false)
 &-posted-date
  padding-left: .6rem
  height: 2.4rem
  line-height: 2.4rem
  font-size: .7rem
  color: rgba(0,0,0,0.26)
  letter-spacing: -0.61px
  background: #fff
  span
   color: rgba(0,0,0,0.87)
   margin-left: .6rem
 &-product-wrap
  height: 5.3rem
  padding: .6rem
  margin-bottom: .6rem
  display: flex
  background: #fff
  img
   width: 5rem
   height: 5rem
  .product-main
   padding-left: .6rem 
  .product-name 
   font-size: .7rem
   color: rgba(0,0,0,0.87)
   letter-spacing: -0.61px
   line-height: 1rem;
  .product-moq
   font-size: .7rem
   color: rgba(0,0,0,0.54)
   letter-spacing: -0.61px
   line-height: 1rem
 &-quantity
  padding-left: .6rem
  height: 2.4rem
  line-height: 2.4rem
  font-size: .7rem
  color: rgba(0,0,0,0.26)
  letter-spacing: -0.61px
  background: #fff
  span
   color: rgba(0,0,0,0.87)
   padding-left: .6rem
 &-description
   padding: .6rem .6rem .6rem 0
   background: #fff
   word-wrap: break-word
   word-break break-word
   border-1px-t(rgba(0, 0, 0, .12),false)
   .des-title
    padding-left: .6rem
    font-size: .7rem;
    color: rgba(0,0,0,0.26)
    letter-spacing: -0.61px
    line-height: 1rem
    margin-bottom: .2rem
   .des-content 
    padding-left: .6rem
    font-size: .7rem
    color: rgba(0,0,0,0.87)
    letter-spacing: -0.61px
    line-height: 1rem
    
.reply
 &-date
  display: block
  padding: .2rem .4rem
  font-size: .6rem
  color: #FFFFFF
  line-height: .6rem
  background: rgba(0,0,0,0.12)
  border-radius: 4px
  -webkit-border-radius: 4px
  display table
  margin: 0 auto 1rem
 &-list
  padding-top: 1rem
 &-nickname
  display: block
  font-size: .8rem
  color: rgba(0,0,0,0.87)
  letter-spacing: -0.61px
  line-height: 1rem
 &-seller-avatar
  width: 2rem
  height: 2rem
  border-radius: 50%
  -webkit-border-radius: 50%
  float: left
 &-me-avatar
  width: 2rem
  height: 2rem
  border-radius: 50%
  -webkit-border-radius: 50%
  float: right
 &-seller-content
  float: left
  width: 11.6rem
  padding-left: .6rem
  font-size: .7rem
  color: rgba(0,0,0,0.54)
  letter-spacing: -0.61px
  line-height: 1rem
  border-radius: 4px
  -webkit-border-radius: 4px
  word-break break-word
  word-wrap break-word
 &-me-content
  float: left
  width: 14.2rem
  font-size: .7rem
  color: rgba(0,0,0,0.54)
  letter-spacing: -0.61px
  line-height: 1rem
  padding-top: .8rem
  border-radius: 4px
  -webkit-border-radius: 4px
  word-break break-word
  word-wrap break-word
 &-seller-time
  position: absolute
  right: .6rem
  font-size: .6rem;
  color: rgba(0,0,0,0.26)
  letter-spacing: -0.21px
  line-height: .6rem
 &-me-time
  position: absolute
  left: .6rem
  font-size: .6rem
  color: rgba(0,0,0,0.26)
  letter-spacing: -0.21px
  line-height: .6rem
  top: .6rem
 &-seller-wrap
  padding: .6rem
  margin: 0 auto
  background: #fff
  position relative
  overflow hidden
  width: 17rem
 &-me-wrap
  padding: .6rem
  margin: 0 auto
  background: #eee
  position relative
  overflow hidden
  width: 16.6rem
 
</style>
