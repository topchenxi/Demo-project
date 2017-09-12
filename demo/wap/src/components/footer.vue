<template>
  <div>
    <div class="footer-wrap">
      <footer class="border-1px">
        <router-link to="/home" tag="div" @touchend.native="toHome" :class="{'active': isActive,'foot-home': !isActive}">
          Home
        </router-link>
        <div @touchend="changeMessage" class="message">
          Inquiries
        </div>
        <router-link to="/me" tag="div" @touchend.native="changeTab" :class="{'me-active': isMe, 'me':!isMe}">
          Me
        </router-link>
      </footer>
    </div>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
  import {
    localStorage
  } from "common/js/util.js";
  export default {
    name: "footer",
    data() {
      return {
        isActive: false,
        isMe: false,
        isMessage: false
      };
    },
    methods: {
      changeTab() {
        this.isActive = false;
        this.isMessage = false;
        this.isMe = true;
      },
      toHome() {
        this.isActive = true;
        this.isMe = false;
        this.isMessage = false;
      },
      changeMessage() {
        if (localStorage.get("localUserInfo")) {
          this.$router.push("/manageInquiryList");
          this.$store.commit("REFRESH_INQUIRE");
        } else {
          this.$store.commit("CHANGE_INQUIRY_HOME");
          this.$router.push("/login/2");
        }
      },
      fetchData() {
        const currentPathName = this.$router.history.current.name.toLowerCase();
        switch (currentPathName) {
          case 'me':
            this.isMe = true;
            break;
          case 'home':
            this.isActive = true;
            break;
          case 'manageinquirylist':
            this.isMessage = true;
            break;
          default:
           this.isActive = true;
            break;
        }
      }
    },
    watch: {
      '$route': 'fetchData'
    },
    mounted() {
      this.fetchData();
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../common/stylus/mixin.styl";
.footer-wrap
  position: fixed
  bottom:0
  left: 0
  width: 100%
  z-index: 100


  footer 
   height: 2.425rem
   position: relative  
   bottom: 0
   width: 100%
   line-height: 2.75rem
   background: #FAFAFA
   z-index: 100 
   border-top: .5px solid rgba(0, 0, 0, .12)


  footer  
   div
    float: left
    height: 100%
    width: 33.3%
    text-align: center
    font-size: .55rem;
    color: rgba(0,0,0,0.54);
    letter-spacing: -0.21px;
    padding-top: .4rem
    box-sizing border-box


  .active
    color: #ff0030
    background: url("./icon_tab_home_pre.png") no-repeat center .425rem 
    background-size: 1rem 1rem

  .foot-home
   background: url("./icon_tab_home_nor.png") no-repeat center .425rem 
   background-size: 1rem 1rem

  .me
   background: url("./icon_tab_me_nor.png") no-repeat center .425rem 
   background-size: 1rem 1rem

  .me-active  
   background: url("./icon_tab_me_pre.png") no-repeat center .425rem 
   background-size: 1rem 1rem
   color: #ff0030

  .message
   background: url("./icon_tab_chat_nor.png") no-repeat center .425rem 
   background-size: 1rem 1rem

  .message-active  
   background: url("./icon_tab_chat_pre.png") no-repeat center .425rem 
   background-size: 1rem 1rem
   color: #ff0030   
</style>