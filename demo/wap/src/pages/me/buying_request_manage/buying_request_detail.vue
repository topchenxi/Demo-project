
<template>
  <div v-if="procurementDetail"
       class="procurement-detail-wrap">
    
    <!--顶部导航-->
      <c-header title="Detail" :customBack="back"></c-header>
    <!--顶部导航-->

    <div class="c-rejected-wrap" v-if="procurementDetail.procurementState === 3">
      <p class="rejected-title"><span class="rejected-icon">!</span>Rejected</p>
      <p class="rejected-reason">Reason:</p>
      <p class="rejected-content">
        {{procurementDetail.reason}}
      </p>
    </div>

    <ul>
      <li class="procurement-proname border-1px"><span>{{procurementDetail.productName}}</span></li>
      <li class="procurement-date"><span class="margin-l-6">Posted Date:</span><span class="procurement-date-content">{{procurementDetail.startTime}}</span></li>
    </ul>
    <ul>
      <li class="procurement-category-wrap">
        <p class="procurement-category-title">
          Category:
          <p class="procurement-category-content">
            {{procurementDetail.productCategory}} <span>&gt;</span> {{procurementDetail.productLastCategory}}
          </p>
        </p>
      </li>

      <li class="procurement-pro-quantity border-1px" v-if="!procurementDetail.moq">
        <span class="margin-l-6">Quantity：</span><span class="procurement-quantity-text">{{procurementDetail.expectNum}} {{procurementDetail.expectUnit}}</span>
      </li>

     <li class="procurement-pro-quantity border-1px" v-else>
        <span class="margin-l-6" >Quantity：</span><span class="procurement-quantity-text">MOQ</span>
    </li>
      
      <li class="procurement-valid-date-wrap border-1px">
        <span class="margin-l-6">Valid to:</span><span class="procurement-valid-date">{{procurementDetail.endTime | sliceTime}}</span>
      </li>
      <li class="procurement-description">
        <p class="des-title">Description</p>
        <p class="des-content">
          {{procurementDetail.productDes}}
        </p>
      </li>
    </ul>
    <router-link v-if="attachment"
                 :to="{name:'attachment',params:{'attachment':attachment}}"
                 class="c-attachment">Attachment</router-link>
    <section class="procurement-quotations-num">{{quatoList.length}} Quotations</section>

    <ul v-if="quatoList.length">
      <router-link :to="'/quotationDetail/' + item.inqueryUUID +'/'+ item.companyId +'/'+ item.companyName"
                   v-for="(item, index) of quatoList"
                   tag="li"
                   :key="index">
        <p class="quato-company-name f-ellipsis-2 border-1px">
            <span v-if="!item.read"
                class="unread">
                </span> {{item.companyName}}
                </p>
        <p class="quato-company-price"><span class="quato-title">Unit Price:</span> <span class="quato-price">{{item.trading}} US<sub>$</sub> {{item.price}} / {{item.unit}}</span></p>
      </router-link>
    </ul>

  </div>
</template>

<script>
import { localStorage,CFEC } from "common/js/util.js";
import { Indicator, Toast } from "mint-ui";
import header from "components/header";
export default {
  data() {
    return {
      procurementDetail: null,  //  采购需求详情数据
      quatoList: null,    //  报价列表
      attachment: null    //   附件
    };
  },
  components:{
    "c-header": header
  },
  filters: {
    //  格式化时间
    sliceTime(time) {
      return time.substr(0, time.indexOf(" "));
    }
  },
  created() {
    Indicator.open("Loading");
    let localToken = JSON.parse(localStorage.get("localUserInfo")).message;    // 获取token
    let _this = this;

    // 获取采购需求详情
    let buyingRequestDetail = function () {
      let params = {
        procurementId:_this.$route.params.procurementId,
        token:localToken
      }
      return _this.axios({
        method:'get',
        url:'/buyer/buyingRequest/detail.cf',
        params:CFEC.addConfig(params)
      })
    };

    //  报价列表
    let quotationList = function () {
      let params = {
          procurementId:_this.$route.params.procurementId,
          token:localToken
      }
      return _this.axios({
        method:'get',
        url:'/buyer/buyingRequest/quotation/list.cf',
        params:CFEC.addConfig(params)
      })
    };

    this.axios.all([buyingRequestDetail(), quotationList()])
      .then(_this.axios.spread((requestDetailRes, quotationListRes) => {
        Indicator.close();
        _this.procurementDetail = Object.assign({}, _this.procurementDetail, requestDetailRes.data.data.ProcurementDetail);
        if (requestDetailRes.data.data.ProcurementDetail.attachmentUrl) {
          _this.attachment = requestDetailRes.data.data.ProcurementDetail.attachmentUrl.split(",");
        }
        _this.quatoList = quotationListRes.data.data;
      }))
      .catch(() => {
        Indicator.close();
         Toast("Network Timeout");
      });
  },
  methods: {
    back() {
      this.$store.commit("REFRESH_REQUEST", 2);  //  用来做重新进去列表页是否刷新页面
      this.$router.go(-1);
    }
  }
};
</script>


<style lang="stylus" rel="stylesheet/stylus" >
@import "../../../common/stylus/mixins/index.styl"

.procurement
 &-detail-wrap
  padding-top: 2.8rem
  padding-bottom: .6rem
 &-proname
  height: 2.4rem
  line-height: 2.4rem
  background: #fff
  font-size: .7rem
  color: rgba(0,0,0,0.87)
  letter-spacing: -0.61px
  border-1px-b(rgba(0, 0, 0, .12), false)
  span
   padding-left: .6rem
 &-date
  height: 2.4rem
  margin-bottom: .6rem
  line-height: 2.4rem
  font-size: .7rem;
  color: rgba(0,0,0,0.26)
  letter-spacing: -0.61px
  background: #fff
  &-content
   padding-left: 1rem  
   color: rgba(0,0,0,0.87)
 &-category-wrap
  background: #fff  
  padding: .6rem
 &-category-title
  font-size: .7rem
  color: rgba(0,0,0,0.26)
  letter-spacing: -0.61px
  line-height: 1rem
 &-category-content
  padding-top: .2rem
  font-size: .7rem
  color: rgba(0,0,0,0.87)
  letter-spacing: -0.61px
  line-height: 1rem
 &-pro-quantity
  font-size: .7rem
  color: rgba(0,0,0,0.26)
  letter-spacing: -0.61px
  height: 2.4rem
  line-height: 2.4rem
  background: #fff
  border-1px-t(rgba(0, 0, 0, .12), false)
 &-quantity-text
  font-size: .7rem;
  color: rgba(0,0,0,0.87)
  letter-spacing: -0.61px
  margin-left: 1.4rem
 &-valid-date-wrap 
  height: 2.4rem
  margin-bottom: .6rem
  font-size: .7rem;
  color: rgba(0,0,0,0.26)
  letter-spacing: -0.61px
  line-height: 2.4rem
  background: #fff
  border-1px-tb(rgba(0, 0, 0, .12), false)
  .procurement-valid-date
   margin-left: 1.2rem
   font-size: .7rem;
   color: rgba(0,0,0,0.87)
   letter-spacing: -0.61px
 &-quotations-num
  height: .6rem
  padding: .2rem .4rem
  font-size: .6rem
  color: #FFFFFF
  line-height: .6rem
  border-radius: 4px
  background: rgba(0,0,0,0.12)
  display table
  margin: 1.2rem auto
  text-align center 
 &-description
  padding: .6rem .6rem .6rem 0
  background: #fff
  word-wrap: break-word
  word-break break-word
  .des-title
   padding-left: .6rem
   font-size: .7rem;
   color: rgba(0,0,0,0.26)
   letter-spacing: -0.61px
   line-height: 1rem
   margin-bottom: .2rem
  .des-content 
   padding-left: .6rem
   font-size: .7  rem
   color: rgba(0,0,0,0.87)
   letter-spacing: -0.61px
   line-height: 1rem
   white-space: pre-wrap;
   word-wrap: break-word;
   word-break: break-word;


.quato-company
 &-name
  line-height: 1.2rem
  padding: .6rem
  font-size: .7rem
  color: rgba(0,0,0,0.87)
  letter-spacing: -0.61px
  line-height: 1rem
  background: #fff
  border-1px-b(rgba(0, 0, 0, .12), false)
  .unread
   display: inline-block
   width: 0.4rem
   height: 0.4rem
   border-radius: 50%
   -webkit-border-radius: 50%
   margin-right: 0.3rem
   background: #ff0034
 &-price
  height: 2.4rem
  line-height: 2.4rem
  background: #fff
  margin-bottom: .6rem
  .quato-title
   font-size: .7rem
   color: rgba(0,0,0,0.26)
   letter-spacing: -0.61px
   padding-left: .6rem
  .quato-price
   font-size: .7rem
   color: rgba(0,0,0,0.87)
   letter-spacing: -0.61px

.margin-l-6
  margin-left: .6rem

</style>
