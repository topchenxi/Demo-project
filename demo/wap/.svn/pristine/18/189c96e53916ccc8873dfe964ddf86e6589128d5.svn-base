<template>
    <div class="me-container">
        <section v-if="userInfo.isLogin"
                 class="me-top">
            <img class="avatar"
                 :src="existAvatar"
                 alt="">
            <div class="me-fullname">{{userInfo.data.fullname}}</div>
            <div class="me-companyname">{{userInfo.data.companyName}}</div>
        </section>
        <section class="me-top"
                 v-else>
            <div class="wel-text">Welcome to e-Cantonfair</div>
            <router-link to="/login/1"
                         class="sign-text">Sign In or Join Free</router-link>
        </section>
        <ul>
            <li class="me-cell-inquiry border-1px"
                @click="ifLogin(1)">
                Inquiries
                <span class="arrow-r"></span>
            </li>
            <li class="me-cell-request border-1px"
                @click="ifLogin(2)">
                Buying Requests
                <span class="arrow-r"></span>
            </li>
        </ul>

        <div v-if="userInfo.isLogin"
             class="signout-btn border-1px"
             @click="showSignOut">Sign Out</div>

        <mt-popup v-model="popupVisible"
                  popup-transition="popup-in"
                  position="bottom">
        <div class="sign-out-comfirm" @click="signOut">Sign Out</div>
        <div class="mid"></div>
        <div class="sign-out-cancel" @click="cancel">Cancel</div>
        </mt-popup>
    </div>
</template>

<script>
import { localStorage } from "common/js/util.js";
import { IMG_URL } from "common/js/common";
export default {
    data() {
        return {
            IMG_URL,
            popupVisible: false   //  显隐退出弹框
        };
    },
    created() {

        if (localStorage.get("localUserInfo")) {      // 刷新判断，数据存store
            this.$store.commit("RECORD_USERINFO", JSON.parse(localStorage.get("localUserInfo")));
        }
    },

    computed: {

        // 头像
        existAvatar() {
            if (this.userInfo.data.buyerPhoto) {
                return IMG_URL + this.userInfo.data.buyerPhoto;
            } else {
                return "http://static.e-cantonfair.com/ec/images/homeIndex/logo-default.png";
            }
        },

        // 获取用户信息
        userInfo() {
            return this.$store.state.userInfo;
        }
    },

    methods: {
        
        //  判断登录才能进行的后续操作
        ifLogin(type) {
            let self = this;

            let toMangeInquiry = function() {
                self.$router.push("/manageInquiryList");
                self.$store.commit("REFRESH_INQUIRE");  //  刷新询盘页面
            };

            let toManageBuyingRequest = function () {   
                self.$router.push("/manageBuyingRequestList");
                self.$store.commit("REFRESH_REQUEST"); //  刷新采需页面
            };

            if (this.userInfo.isLogin) {
                type === 1 ? toMangeInquiry() : "";
                type === 2 ? toManageBuyingRequest() : "";
            } else {
                this.$router.push("/login");
            }
        },
        // 显示退出弹框
        showSignOut() {
            this.popupVisible = true;
           
        },
        // 退出
        signOut() {
            this.$store.commit("RECORD_USERINFO"); 
            this.popupVisible = false;
        },
        cancel() {
            this.popupVisible = false;
        }
    }
};

</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../common/stylus/mixins/index.styl"
.me
 &-container
  padding-bottom: 5rem
 &-top
  height: 11.5rem
  margin-bottom: .6rem
  background-image:url("./images/img_me_bg.jpg")
  background-size: 100% 12.5rem  
  .avatar
   width: 2.4rem
   height: 2.4rem
   border-radius: 50%
   position: absolute
   top: 2.85rem
   left: 50%
   transform: translateX(-50%)
  .wel-text
   font-size: .9rem
   color: #FFFFFF;
   letter-spacing: -0.9px
   line-height: .9rem
   position: absolute
   top: 3.8rem
   left: 50%
   transform: translateX(-50%)
   -webkit-transform: translateX(-50%)
   white-space: nowrap
  .sign-text
   width: 7.5rem
   height: 1.4rem
   display: block
   border: 1px solid #FFFFFF
   border-radius: 4px
   font-size: .8rem
   color: #FFFFFF;
   letter-spacing: -0.81px
   line-height: 1.4rem
   text-align: center
   position: absolute
   top: 5.3rem
   left: 50%
   background: rgba(255,255,255,0.25)
   transform: translateX(-50%)
   -webkit-transform: translateX(-50%)
 &-fullname
  font-size: .9rem
  color: #FFFFFF
  letter-spacing: -0.9px
  line-height: .9rem
  position: absolute
  top: 5.55rem
  left: 50%
  transform: translateX(-50%)
  white-space nowrap 
 &-companyname
  font-size: .8rem;
  color: rgba(255,255,255,0.70)
  letter-spacing: -0.81px
  line-height: .8rem
  position: absolute
  top: 6.85rem
  left: 50%
  transform: translateX(-50%)
  white-space nowrap
 &-cell-inquiry
  mecell("./images/icon_me_inquiry.png")
 &-cell-request
  mecell("./images/icon_me_buyingrequest.png", false)

.signout-btn
 height: 2.4rem
 line-height: 2.4rem
 color: rgba(0,0,0,0.87)
 text-align: center
 font-size: .8rem
 background: #fff
 margin-top: .6rem
 border-1px-tb(rgba(0, 0, 0, .12), false)

.sign-out-comfirm
 height: 2.4rem
 font-size: .7rem
 color: #ff0034
 line-height 2.4rem
 width: 100%
 text-align center
 border-1px-t(rgba(0, 0, 0, .46), false)

.sign-out-cancel
 height: 2.4rem
 font-size: .7rem
 color: rgba(0,0,0,0.87)
 line-height 2.4rem
 text-align center
 width: 100%

.mid
 height: .3rem
 background: #f3f4f6

</style>