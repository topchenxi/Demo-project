<template>
    <div class="login-container">
        <!--顶部导航-->
        <c-header title="Sign in" :isLeftIcon="false">
            <span slot="left" class="c-header-left-text" @click="cancel">Cancel</span>
            <router-link to="/register" slot="right" replace class="c-header-right-text c-header-active">Join Free</router-link>
        </c-header>
        <!--顶部导航-->
        <section class="login-input-wrap border-1px">
            <input type="text" v-model.trim="userEmail" placeholder="Email / Username">
            <div class="login-password">
                <img :src="passwordImg" alt="" @click="changePassWordState">
                <input type="password" v-model.trim="password" placeholder="Password" ref="password">
            </div>
        </section>
        <div @click="checkInput" class="login-btn" :style="{background: btnBg}">Sign In</div>
        <router-link to="/getAccount" replace class="login-forgot-password">   
                Forgot Your Password?
        </router-link>
    </div>
</template>

<script>
    import { Indicator, Toast } from "mint-ui";
    import header from "components/header";
    export default {
        data() {
            return {
                userEmail: "",  //  用户邮箱
                password: "",   //  用户密码
                passwordImg: require("./images/icon_input_hidden.png"), 
                passwordStatus: false   //  做密码的显隐
            };
        },
        components: {
            "c-header": header
        },
        computed: {
            //  改变按钮背景
            btnBg() {
                if (this.userEmail && this.password) {
                 return "#ff0030";
                } else {
                  return "#ff99ac";
                }
            }
        },
        methods: {
            //  改变密码的显隐
            changePassWordState(ev) {
                if (!this.passwordStatus) {
                 this.$refs.password.type="text";
                 this.passwordImg = require("./images/icon_input_show.png");
                } else {
                  this.$refs.password.type="password";
                 this.passwordImg = require("./images/icon_input_hidden.png");   
                }
              this.passwordStatus = !this.passwordStatus;
            },
            //  检查输入
            checkInput() {
                if (this.userEmail && this.password) {
                    this.singIn();
                }
            },
            //  登录
            singIn() {
                Indicator.open("Sending...");
                 
                    let params = {
                         userEmail:  this.userEmail,
                         password: this.password,
                         appFlag: 2
                    };
                    
                    this.axios({
                        method: "post",
                        url: "/user/login.cf",
                        params: params
                    })
                    .then(res => {                        
                        if (res.data.status === "success") {
                            Indicator.close();   
                            this.$store.commit("RECORD_USERINFO", res.data);

                           if (this.$store.state.inquireHome) {
                                 this.$router.replace("/me");
                                 this.$store.commit("CHANGE_INQUIRY_HOME", false);
                            } else if (this.$store.state.backLogin) {
                                 this.$router.replace("/me");
                                 this.$store.commit("BACK_LOGIN", false);
                            } else {
                                 this.$router.go(-1);
                            }
                           
                        } else {
                            alert(res.data.message);
                            Indicator.close();
                        }
                    })
                    .catch(() => {
                        Indicator.close();
                        Toast("Network Timeout");
                    });
            },
            //  取消
            cancel() {  
                if (this.$store.state.backLogin) {
                    this.$router.replace("/me");
                    this.$store.commit("BACK_LOGIN", false);
                } else {
                    this.$router.go(-1);
                }
                
            }
        }
    };

</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.login
 &-container
  padding-top: 2.8rem
 &-input-wrap
  position: relative
  margin-bottom: 1.5rem
  &::after
   width: 100%
   position: absolute;
   left: 0
   top: 50%
   border-top: 1px solid rgba(0,0,0,0.12)
   content: ""
   transform: scaleY(.5) 
  input
   height: 2.4rem
   width: 100%
   background: #fff
   font-size: .8rem
   letter-spacing: -0.81px
   padding-left: .6rem
   box-sizing: border-box 
   -webkit-box-sizing: border-box 
 &-password
   position relative
   img
    width: 1.4rem
    height: 1.2rem
    position: absolute
    right: .85rem
    top: 50%
    transform: translateY(-50%)
 &-btn
  width: 17.55rem
  height: 2.2rem
  line-height: 2.2rem
  color: #fff
  text-align: center
  margin: 0 auto
  border-radius: 4px
  -webkit-border-radius: 4px
 &-forgot-password
  display table
  margin: (60/40)rem auto 0
  padding: .6rem
  font-size: .7rem
  color: #FF0030
</style>