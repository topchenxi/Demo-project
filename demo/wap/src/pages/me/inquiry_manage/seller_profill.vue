
<template>
    <div class="seller-profile-wrap" v-if="sellerProfile">

      <!--顶部导航-->
      <c-header title="Profile"></c-header>
      <!--顶部导航-->
      
      <section class="seller-profile-nickname">
          <img :src="existAvatar" alt="" class="seller-profile-avatar">
          <span class="ellipsis">{{sellerProfile.sellerName}}</span>
      </section>
      <router-link :to="'/shop/' + sellerProfile.sellerId" class="company-profile">
        Company
        <span>{{sellerProfile.companyEnName}}</span>
      </router-link>

        <ul class="profile-info">
            <li>
                <p class="profile-info-title">Company Type:</p>
                <p class="profile-info-content">{{sellerProfile.companyType}}</p>
            </li>
              <li v-if="sellerProfile.mainProducts" class="border-1px">
                <p class="profile-info-title">Main Products:</p>
                <p class="profile-info-content">{{sellerProfile.mainProducts}}</p>
            </li>
              <li v-if="sellerProfile.companyEnAddress" class="border-1px">
                <p class="profile-info-title">Address:</p>
                <p class="profile-info-content">{{sellerProfile.companyEnAddress}}</p>
            </li>
        </ul>

    </div>
</template>

<script>
import header from "components/header";
import {IMG_URL} from "common/js/common";
import {CFEC} from "common/js/util.js";
export default {
    data() {
        return {
            sellerProfile: null,  //  卖家信息
            IMG_URL
        };
    },

     components: {
        "c-header": header
    },

    computed: {
        // 头像
        existAvatar() {
            if (this.sellerProfile.photo) {
                return IMG_URL + this.sellerProfile.photo;
            } else {
                 return "http://static.e-cantonfair.com/ec/images/homeIndex/logo-default.png";
            }
        }
    },
    
    created() {
        // 获取数据
        let params = {
            userId:this.$route.params.userId
        }
        this.axios({
            method:'get',
            url:'/personProfile/seller/show.cf',
            params:CFEC.addConfig(params)
        })
            .then((res) => {
                this.sellerProfile = Object.assign({}, this.sellerProfile, res.data.data);
            });
    }
};

</script>


<style lang="stylus" rel="stylesheet/stylus">
@import "../../../common/stylus/mixin.styl";

.profile-info
 background: #fff
 li+li
  border-1px-t(rgba(0, 0, 0, .12))
  
  

.profile-info-content
 font-size: .7rem;
 color: rgba(0,0,0,0.87);
 letter-spacing: -0.61px;
 line-height: 1rem;
 padding: .2rem .6rem .8rem .6rem


.profile-info-title
 font-size: .7rem;
 color: rgba(0,0,0,0.26);
 letter-spacing: -0.61px;
 line-height: 1rem;
 padding-top: .6rem
 padding-left: .6rem

.company-profile
  font-size: .8rem
  display: block
  height: 2.4rem  
  background-size: 1.2rem 1.2rem
  font-size: .8rem;
  color: rgba(0,0,0,0.87);
  letter-spacing: -0.81px;
  line-height: 2.4rem;
  text-indent: .6rem;
  background:#fff url("../images/icon_list_arrow.png") no-repeat 16.8rem center
  background-size: .8rem 1.2rem
  margin-bottom: .6rem
  span
   display: inline-block
   vertical-align: middle
   font-size: .7rem
   color: rgba(0,0,0,0.54);
   width: 9rem
   overflow: hidden;
   text-overflow:ellipsis;
   white-space: nowrap; 
   padding-left: 3rem

.seller-profile-wrap    
  padding-top: 2.8rem

.seller-profile-nickname  
  height: 3.2rem
  line-height: 3.2rem
  font-size: .8rem
  color: rgba(0,0,0,0.87);
  letter-spacing: -0.81px;
  background: #fff
  margin-bottom: .6rem
  
.seller-profile-avatar
  width: 2.4rem
  height: 2.4rem
  border-radius: 50%
  margin: 0 .6rem
  vertical-align: middle


</style>
