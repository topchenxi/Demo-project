
<template>
    <div class="quote-detail-wrap" v-if="quoteDetail">
    
        <!--顶部导航-->
            <c-header title="Quotation Detail"></c-header>
        <!--顶部导航-->

        <section class="quote-company">
            <span class="quote-company-from">From:</span>
            <router-link :to="'/companyProfile/'+ quoteDetail.sellerCompanyId" class="quote-company-to ellipsis">
                {{this.$route.params.companyName}}
            </router-link>
        </section>
        <ul class="quote-detail-list">
            <li class="border-1px"><span class="quote-same">Unit Price:</span> <span class="quote-same-text">{{quoteDetail.shipmentTerms}} {{quoteDetail.fobPrice}}</span></li>
            <li class="border-1px" v-if="quoteDetail.qtyMoq"><span class="quote-same">MOQ:</span> <span class="quote-same-text">{{quoteDetail.qtyMoq}} / {{quoteDetail.moqUnit}}</span></li>
            <li v-if="quoteDetail.shippingPort" class="border-1px"><span class="quote-same">Shipping port:</span> <span class="quote-same-text">{{quoteDetail.shippingPort}}</span></li>
            <li v-if="quoteDetail.quoteDate" class="border-1px"><span class="quote-same">Quote Date:</span> <span class="quote-same-text">{{quoteDetail.quoteDate}}</span></li>
            <li class="border-1px"><span class="quote-same">Valid to:</span> <span class="quote-same-text">{{quoteDetail.validTo | formatTime}}</span></li>
        </ul>
        <section class="quote-des">
            <p class="quote-des-title">Description</p>
            <p class="quote-des-text f-breakword">
                {{quoteDetail.description}}
            </p>
        </section>
        <section  v-if="quoteDetail.product">
        <div class="quote-pro-des">
           Product Description
        </div>
        <div class="quote-pro-warp">
            <p class="quote-pro-name">
             {{quoteDetail.product.name}}
            </p>
            <img :src="IMG_URL + productImg" alt="" class="quote-pro-img">
            <p class="quote-pro-text">
                {{quoteDetail.product.productDetail.detailDescription}}
            </p>
        </div>

        </section>
         <router-link :to="'/reply/' + quoteDetail.procurementId + '/' + quoteDetail.sellerUserId + '/1/' + 'Reply to quotation for ' + quoteDetail.procurementSubject + ' from ' + quoteDetail.sellerCompanyEnName"
                      class="contact">
            <span>Reply</span>
         </router-link>
        
    </div>
</template>

<script>
import header from "components/header";
import {IMG_URL} from "common/js/common";
import {CFEC} from "common/js/util.js";
export default {
    data() {
        return {
            quoteDetail: null,  //  报价详情数据
            IMG_URL
        };
    },
    components: {
        "c-header": header
    },
    created() {
            let params = {
                quoteId:this.$route.params.quotedId
            }
           this.axios({
               method:'get',
               url:'/buyer/quotation/detail.cf',
               params:CFEC.addConfig(params)
           })
            .then((res) => {  
              this.quoteDetail = Object.assign({}, this.quoteDetail, res.data.data.quoteDetail);
        }); 
    },
    filters: {
    //  格式化时间
     formatTime(value) {
        return value.substr(0, value.indexOf(" "));
     }
     
    },
    computed: {
        // 获取商品图片
      productImg() {
          return this.quoteDetail.product.imgs.split(",")[0];
      }
    }

};
</script>


<style lang="stylus" rel="stylesheet/stylus" >
@import "../../../common/stylus/mixin.styl";
.contact
  display:block
  background: #fff
  width 100%
  height 3rem
  position: fixed
  bottom: 0
  span
   display block
   height:2rem
   background: #ff0030
   width 17.55rem
   color: #fff
   text-align center
   line-height 2rem
   font-size .8rem
   position absolute
   left:.6rem
   top: .6rem
   border-radius 4px




.quote-company
 height: 2.4rem
 line-height: 2.4rem
 background: #fff
 margin-bottom: .6rem

.quote-company-to
 font-size: .7rem;
 width: 12.8rem
 display inline-block
 padding-right: 1.4rem
 color: rgba(0,0,0,0.54);
 float:right
 letter-spacing: -0.53px;
 background: url("../images/icon_list_arrow.png") no-repeat 12.8rem center
 background-size: 0.8rem 1.2rem;
 

.quote-company-from
 font-size: .8rem;
 color: rgba(0,0,0,0.87);
 letter-spacing: -0.81px;
 padding-left: .6rem

.quote-pro-text
 background: #fff
 font-size: .7rem;
 color: rgba(0,0,0,0.87);
 letter-spacing: -0.61px; 
 padding:.6rem
 margin-bottom: .6rem

.quote-pro-name
 height: 2.4rem
 background: #fff
 line-height: 2.4rem
 font-size: .7rem;
 color: rgba(0,0,0,0.87);
 letter-spacing: -0.61px; 
 padding-left: .6rem

.quote-pro-img
 width: 4rem
 height: 4rem
 padding: .6rem

.quote-pro-des 
 padding: .6rem
 color: rgba(0,0,0,0.26);
 font-size: .7rem

.quote-detail-wrap
 padding-top:2.2rem
 padding-bottom: 3.6rem

.quote-detail-list
 li
  height: 3rem
  line-height: 2.8rem
  background: #fff
  position relative
  border-1px-b(rgba(0, 0, 0, .12)) 
 
   
.quote-same  
 margin-left: .6rem
 display: inline-block
 width: 4rem
 font-size: .7rem;
 color: rgba(0,0,0,0.26);
 letter-spacing: -0.61px;
 line-height: .7rem;
 position: absolute
 top: 50%
 transform translateY(-50%) 


 

.quote-same-text
 font-size: .7rem
 color: rgba(0,0,0,0.87)
 margin-left: 5rem
 letter-spacing: -0.61px;
 display inline-block

.quote-des
 padding: .6rem 
 background: #fff

.quote-des-title 
 font-size: .7rem;
 color: rgba(0,0,0,0.26);
 letter-spacing: -0.61px;
 line-height: 1rem

.quote-des-text
 font-size: .7rem
 color: rgba(0,0,0,0.87);
 letter-spacing: -0.61px;
 line-height: 1rem
 word-break break-word
 word-wrap break-word
</style>
