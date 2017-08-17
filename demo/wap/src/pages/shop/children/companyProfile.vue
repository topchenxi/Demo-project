
<template>
    <div class="company-profile-wrap">
        <v-header>
            <div slot="title"
                 class="c-head-title f-cenmiddle">
                Company Profile
            </div>
        </v-header>
        <section class="tab border-1px">
            <div :class="{'active': isShow}"
                 @click="showDes">Description</div>
            <div :class="{'active': !isShow}"
                 @click="showInfo">Information</div>
        </section>
    
        <section v-show="isShow"
                 class="company-profile-main">
    
            <mt-swipe :auto="4000"
                      :style="{'height': slideHeight}"
                      class="company-slide">
                <mt-swipe-item v-for="(item, index) of profile.companyImgs"
                               :key="index"
                               v-if="item"
                               >
                    <img class="company-slide-img"
                         :src="IMG_URL + imgUrlFilter(item,200,200,3)"
                         alt="">
                </mt-swipe-item>
                <mt-swipe-item v-for="(item, index) of profile.companyImgs"
                               :key="index"
                               v-if="!item"
                               >
                    <img class="company-slide-img"
                         :src="require('./../images/default-img.png')"
                         alt="">
                </mt-swipe-item>
            </mt-swipe>
            <div class="company-profile-name border-1px">
                <span class="padding-l-6">{{profile.companyName}}</span>
                </div>
            <div v-if="profile.companyCountryEnName"
                 class="company-profile-location border-1px">
                <p>Company Location:</p>
                <span>{{profile.companyCountryEnName}}</span>
            </div>
            <div class="company-profile-mainpro ellipsis-2"
                 v-if="profile.mainProduct">
                <p>Main Products:</p>
                <span>
                 {{profile.mainProduct}}
                </span>
            </div>
            <section class="company-profile-des"
                     v-if="profile.desciption">
                {{profile.desciption}}
            </section>
        </section>
    
        <section v-show="!isShow"
                 class="company-information">
            <ul>
                <li class="company-profile-mainpro1 border-1px ellipsis-2"
                    v-if="profile.mainMarkets">
                    <p>Main Markets:</p>
                    <span> 
                            {{profile.mainMarkets}}
                        </span>
                </li>
                <li class="company-profile-location border-1px"
                    v-if="profile.companyChineseName">
                    <p>Company Chinese Name:</p>
                    <span>
                            {{profile.companyChineseName}}
                        </span>
                </li>
                <li class="company-profile-location border-1px"
                    v-if="profile.companyName">
                    <p>Company Name:</p>
                    <span>
                            {{profile.companyName}}
                        </span>
                </li>
                <li class="company-profile-location border-1px"
                    v-if="profile.companyType">
                    <p>Company Type:</p>
                    <span>
                            {{profile.companyType}}
                        </span>
                </li>
                <li class="company-profile-location border-1px"
                    v-if="profile.businessType">
                    <p>Business Type:</p>
                    <span>
                            {{profile.businessType}}
                        </span>
                </li>
                <li class="company-profile-location border-1px"
                    v-if="profile.companyLocation">
                    <p>Company Location:</p>
                    <span>
                            {{profile.companyLocation}}
                        </span>
                </li>
    
                <li class="company-address border-1px"
                    v-if="profile.companyEnAddress">
                    <p>Chinese Address:</p>
                    <span>
                            {{profile.companyEnAddress}}
                        </span>
                </li>
                <li class="company-profile-location border-1px"
                    v-if="profile.companyPostCode">
                    <p>Post Code:</p>
                    <span>
                                   {{profile.companyPostCode}}
                        </span>
                </li>
                <li class="company-profile-location border-1px"
                    v-if="profile.companyEmpNum">
                    <p>Number of Employees:</p>
                    <span>
                                   {{profile.companyEmpNum}}
                        </span>
                </li>
                <li class="company-profile-location border-1px"
                    v-if="profile.companyRegisteredCapital">
                    <p>Resgistered Capital:</p>
                    <span>
                                  {{profile.companyRegisteredCapital}}  
                        </span>
                </li>
                <li class="company-profile-location border-1px"
                    v-if="profile.companyWebsite">
                    <p>Company Website:</p>
                    <span>
                                    {{profile.companyWebsite}}
                        </span>
                </li>
                <li class="company-profile-location contact-person border-1px"
                    v-if="profile.companyContactPerson">
                    <p>contact Person:</p>
                    <span>
                                  {{profile.companyContactPerson}}
                        </span>
                </li>
            </ul>
        </section>
        <router-link :to="'/shopInquiry/' + profile.companyName + '/' + profile.userId"
                     class="contact">
            <span>Contact</span>
        </router-link>
    </div>
</template>

<script>
// import { IMG_URL } from "common/js/common";
import header from "components/header/header";
import { Indicator, Toast } from "mint-ui";
import { IMG_URL } from "common/js/common";
import {CFEC} from 'common/js/util.js';

export default {
    data() {
        return {
            companyId: this.$route.params.companyId,     // 公司Id
            isShow: true,    //  tab 切换
            isHeight: true,
            slideHeight: "",  //  轮播高度，没图片的话设为0
            profile: {        //  存放各种信息数据
                isImgs: false
            },
            IMG_URL
        };
    },
    computed: {
    },
    components: {
        "v-header": header
    },
    created() {
        // 拉取公司简介信息
        this.fetchCompanyProFile(this.$route.params.companyId);
    },

    activated() {
        this.companyId = this.$route.params.companyId;
    },

    watch: {
        // 监测公司ID变化
        companyId(newId) {
            this.fetchCompanyProFile(newId);
        }
    },
    methods: {
        // 拉取公司简介方法
        fetchCompanyProFile(companyId) {
            Indicator.open("Loading");
            let params = {
                companyId:companyId
            }
            this.axios({
                method:'get',
                url:'/sellerCompany/viewCompanyInfo.cf',
                params:CFEC.addConfig(params)
            })
                .then((res) => {
                    Indicator.close();  
                    let _profile = res.data.data;
                    try {
                        this.$set(this.profile, "companyImgs", _profile.companyImgs.split(","));
                        this.slideHeight = "10rem";
                        Indicator.close();
                    } catch (err) {
                        this.slideHeight = "0";
                    }

                    this.$set(this.profile, "companyName", _profile.companyName);
                    this.$set(this.profile, "companyCountryEnName", _profile.companyCountryEnName);
                    this.$set(this.profile, "mainProduct", _profile.mainProduct);
                    this.$set(this.profile, "desciption", _profile.desciption);
                    this.$set(this.profile, "mainMarkets", _profile.mainMarkets);
                    this.$set(this.profile, "companyChineseName", _profile.companyChineseName);
                    this.$set(this.profile, "companyType", _profile.companyType);
                    this.$set(this.profile, "businessType", _profile.businessType);
                    this.$set(this.profile, "companyLocation", _profile.companyLocation);
                    this.$set(this.profile, "companyEnAddress", _profile.companyEnAddress);
                    this.$set(this.profile, "companyPostCode", _profile.companyPostCode);
                    this.$set(this.profile, "companyEmpNum", _profile.companyEmpNum);
                    this.$set(this.profile, "companyRegisteredCapital", _profile.companyRegisteredCapital);
                    this.$set(this.profile, "companyWebsite", _profile.companyWebsite);
                    this.$set(this.profile, "companyContactPerson", _profile.companyContactPerson);
                    this.$set(this.profile, "userId", _profile.sellerUserId);

                })
                .catch(() => { 
                  Indicator.close();     
                 Toast("Network Timeout"); 
                 });
        },
        showInfo() {
            this.isShow = false;
        },
        showDes() {
            this.isShow = true;
        },
        imgUrlFilter(src,w,h,type){
            return CFEC.imgUrlFilter(src,w,h,type);
        }
    }
};
</script>


<style lang="stylus" rel="stylesheet/stylus" scoped >
@import "../../../common/stylus/mixin.styl";
  .padding-l-6
   padding-left: .6rem

  .company-profile-mainpro1  
      background: #fff
      line-height: 1.2rem;
      height 4.4rem
      padding-left: .6rem
      border-1px-b(rgba(0, 0, 0, .12))
      p
       font-size: .7rem;
       color: rgba(0,0,0,0.26);
       letter-spacing: -0.61px;
       padding-top: .6rem
      span
       display: block
       font-size: .7rem;
       color: rgba(0,0,0,0.87);

     .company-profile-des
       background: #fff
       padding:.6rem
       font-size: .7rem;
       color: rgba(0,0,0,0.54);
       letter-spacing: -0.61px;
       line-height: 1rem;
       word-break:break-word

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

    
    .company-profile-mainpro
      background: #fff
      line-height: 1.4rem;
      padding: .6rem
      margin-bottom: .6rem
      p
       font-size: .7rem;
       color: rgba(0,0,0,0.26);
       letter-spacing: -0.61px;
      span
       display: block
       font-size: .7rem;
       color: rgba(0,0,0,0.87);
       overflow: hidden;

    .company-profile-location
      background: #fff    
      height: 3.6rem
      padding-left: .6rem
      line-height: 1rem;
      border-1px-b(rgba(0, 0, 0, .12))
      p
       font-size: .7rem;
       color: rgba(0,0,0,0.26);
       letter-spacing: -0.61px;
       padding-top:.6rem
      span
       display: block
       padding-top: .2rem
       font-size: .7rem;
       color: rgba(0,0,0,0.87);

    .company-profile-main
      padding-bottom: 3.6rem  


    .company-profile-name
     background: #fff
     height: 2.4rem
     line-height: 2.4rem
     font-family: SFUIText-Regular;
     font-size: .7rem;
     color: rgba(0,0,0,0.87);
     letter-spacing: -0.61px;
     border-1px-b(rgba(0, 0, 0, .12))



    .company-slide-img
     width: 14rem
     height: 10rem
     display block
     margin: 0 auto


    .tab
      height: 2rem
      line-height: 2rem
      background: #fff
      border-1px-b(rgba(0, 0, 0, .12))
      position: fixed
      top:2.2rem
      width: 100%
      z-index: 900
      div
        float: left
        width: 50%
        font-size: .8rem;
        color: rgba(0,0,0,0.87);
        letter-spacing: -0.81px;
        text-align: center
        &.active 
         color: #ff0030   

   .company-information
    background: #fff
    &:after
     display: block
     content: ""
     height: 3.6rem
     background: #f3f4f6;
     

   .company-address  
      background: #fff    
      padding-left: .6rem
      line-height: 1rem;
      border-1px-b(rgba(0, 0, 0, .12))
      p
       font-size: .7rem;
       color: rgba(0,0,0,0.26);
       letter-spacing: -0.61px;
       padding-top:.6rem
      span
       display: block
       padding: .2rem .6rem .6rem 0
       font-size: .7rem;
       color: rgba(0,0,0,0.87);
      

.company-profile-wrap
 padding-top: 4.2rem
</style>


