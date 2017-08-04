
<template>
  <div class="register-out-wrap">
    <header class="border-1px">
      <span @click="cancel" class="c-head-cancel f-vermiddle">Cancel</span>
      <span class="c-head-title f-cenmiddle">Sign Up</span>
      <router-link to="/login" replace slot="next" class="c-head-next" :style="{color:'#FF0030'}">Sign in</router-link>
    </header>
    <ul class="register-wrap margin-b">
      <router-link to="/selectCountry" tag="li" class="country-region-wrap"><span class="country-region">Country / Region</span><span class="country-name" v-if="countryInfo">{{countryInfo.countryEnName}}</span></router-link>
      <li class="border-1px">
        <input type="text" placeholder="Email" v-model.trim="email">
      </li>
      <li class="border-1px">
        <img :src="passwordImg" alt="" @click="changePassWordState" class="passwordimg">
        <input type="password" placeholder="password (6-25 characters)" v-model.trim="password" ref="password">
      </li>
      <li class="border-1px">
        <input type="text" placeholder="Company Name" v-model.trim="companyName">
      </li>
    </ul>
    <ul class="register-wrap">
      <li class="border-1px">
        <input type="text" placeholder="Full Name" v-model.trim="fullName">
      </li>
      <li class="border-1px" style="overflow: hidden">
        <input type="text" class="country-code" pattern="\d*" placeholder="Country Code" v-model.trim="countryCode">
        <span class="border-mid"></span>
        <input type="text" class="mobile-number" pattern="\d*" placeholder="Mobile Number" v-model.trim="mobileNumber">
      </li>
    </ul>
    <div @click="checkInput" class="signin-btn" :style="{background: btnBg}">Sign Up</div>
  </div>
</template>

<script>
  import {
    Indicator
  } from "mint-ui";
  import {
    CFEC
  } from "common/js/util.js";
  export default {
    data() {
      return {
        email: "", //  保存邮件
        password: "", //  保存密码
        companyName: "", //  保存公司名
        fullName: "", //  保存全名
        countryCode: "", //  国家代码
        mobileNumber: "", //  电话号码
        passwordImg: require("./images/icon_input_hidden.png"),
        emailStatus: false,
        passwordStatus: false, //  密码的显隐
        fullNameStatus: false
      };
    },
    computed: {
      //  获取国家信息和设置国家代码
      countryInfo() {
        if (this.$store.state.country) {
          this.countryCode = this.$store.state.country.countryCode;
          return this.$store.state.country;
        }
      },
      //  检查是否可以注册
      isRight() {
        return this.email && this.password && this.fullName && this.mobileNumber && this.countryCode && this.countryInfo && this.companyName;
      },
      //  改变next的颜色
      btnBg() {
        if (this.isRight) {
          return "#ff0030";
        } else {
          return "#ff99ac";
        }
      }
    },
    methods: {
      //  取消清空所有内容
      cancel() {
        this.$router.replace("/login");
        this.email = "";
        this.password = "";
        this.fullName = "";
        this.mobileNumber = "";
        this.countryCode = "";
        this.companyName = "";
        this.$store.commit("RECORD_COUNTRY");
      },
      //  改变密码的显隐
      changePassWordState(ev) {
        if (!this.passwordStatus) {
          this.$refs.password.type = "text";
          this.passwordImg = require("./images/icon_input_show.png");
        } else {
          this.$refs.password.type = "password";
          this.passwordImg = require("./images/icon_input_hidden.png");
        }
        this.passwordStatus = !this.passwordStatus;
      },
      //  检查输入和提交注册
      checkInput() {
        if (this.isRight) {
          Indicator.open("Sending...");
          let params = {
            source: 64,
            isLogin: false,
            companyName: this.companyName,
            countryId: this.countryInfo.countryId,
            userEmail: this.email,
            firstname: this.fullName,
            password: this.password,
            mobile: this.countryInfo.countryCode + "-" + this.mobileNumber
          };
          this.axios({
              method: "post",
              url: "/user/regist.cf",
              params: CFEC.addConfig(params)
            }).then((res) => {
              Indicator.close();
              if (res.data.status === "success") {
                let userId = res.data.data.userId;
                let source = CFEC.getUrlParam('source');
                let gaRequestParams = `Wap_Others_${source}_userId=${userId}`;
                ga('send', 'event', 'BuyerAction', 'BuyerRegistration', gaRequestParams);
                this.email = "";
                this.password = "";
                this.fullName = "";
                this.mobileNumber = "";
                this.countryCode = "";
                this.companyName = "";
                this.$store.commit("RECORD_COUNTRY");
                this.$store.commit("RECORD_USERINFO", res.data);
                this.$router.replace("/me");
              } else {
                setTimeout(() => {
                  alert(res.data.message);
                }, 200);
              }
            })
            .catch(() => {
              Indicator.close();
            });
        }
      }
      //  做前端验证用
      // check(type) {
      //   let regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      //   let regPassword = /(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{6,}/;
      //   let regFullName = /([a-zA-Z0-9]){3,50}/;
      //   switch (type) {
      //     case 1: 
      //     !regEmail.test(this.email) ? alert("Email format is incorrect.") : "";
      //     break;
      //     case 2:
      //     !regPassword.test(this.password) ? alert("Password must be 6-25 characters and containing number and letter.") : "";
      //     break;
      //     case 3:
      //     !regFullName.test(this.fullName) ? alert("Fullname Must be a combination of arabic numerals or letters in 3-50 characters.") : "";
      //   }
      // }
    }
  };
</script>


<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../common/stylus/mixin.styl";

 .register-out-wrap
  padding-top:2.8rem

 .country-code
  width: 6.75rem !important
  float: left

 .mobile-number
  float: left
  width: 12rem !important

 .border-mid
  display: inline-block
  height: 60%
  position: absolute
  top: 50%
  transform: translateY(-50%)
  width: 1px
  background: rgba(0, 0, 0, .12)

.passwordimg
 width: 1.4rem
 height: 1.2rem
 position: absolute
 right: .85rem
 top: 50%
 transform: translateY(-50%)
  

.margin-b
 margin-bottom: .6rem

.country-name
 font-size: .7rem;
 color: rgba(0,0,0,0.54);
 letter-spacing: -0.53px;
 position: absolute
 right: 2.2rem

.country-region-wrap
 background: url("./images/icon_list_arrow.png") no-repeat 16.8rem center
 background-size: .8rem 1.2rem;
 

.signin-btn
 width: 17.55rem
 height: 2.2rem
 line-height: 2.2rem
 color: #fff
 text-align: center
 margin: 0 auto
 border-radius: 4px


.register-wrap
 li
 height: 2.4rem
 line-height: 2.4rem
 background: #fff
 color: rgba(0,0,0,0.26);
 letter-spacing: -0.81px;
 input
  height: 2.4rem
  padding-left: .6rem
  font-size: .8rem
  width: 100%
  box-sizing: border-box
 li+li
  border-1px-t(rgba(0,0,0,0.12))  
  
.country-region
 font-size: .8rem;
 color: rgba(0,0,0,0.87);
 letter-spacing: -0.81px;
 padding-left: .6rem
 

 
.signin-btn
 background: red
 width: 17.55rem
 height: 2.2rem
 line-height: 2.2rem
 color: #fff
 text-align: center
 margin: 1rem auto 0
 border-radius: 4px 


</style>
