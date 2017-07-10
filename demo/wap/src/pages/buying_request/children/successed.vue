
<template>
    <div>
      <!--顶部导航-->
       <c-header title="Result" :isLeftIcon="false">
       <router-link to="/home" replace slot="right" class="c-header-right-text" style="color:#FF0030">
         Done
       </router-link>
       </c-header>
      <!--顶部导航 -->
       <section class="request-result-top">
         <span>
           Buying request posted successfully!
         </span>
       </section>
       <section class="request-manage" @click="manageRequest">
          Manage Buying Requests
       </section>
       <section class="post-more" @click="postMore">
         Post a New Buying Request
       </section>
    </div>
</template>

<script>
import header from "components/header";
export default {
  components:{
    "c-header" : header
  },

  methods: {
    // 跳转发布更多
    postMore() {
      this.$router.replace("/buyingRequest");
    },
    //  跳转管理采购需求
    manageRequest() {
      this.$router.replace("/manageBuyingRequestList");
      this.$store.commit("REFRESH_REQUEST");
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
 @import "../../../common/stylus/mixins/index.styl"

 .post-more
  width: 17.55rem
  color #fff
  text-align center
  height 2.2rem
  line-height: 2.2rem
  margin: 0 auto
  font-size: .8rem
  letter-spacing: -0.81px
  border-radius: 4px
  background: #ff0030


.request-result-top
  height: 13.05rem
  background: url("../images/img_successfully.png") no-repeat center 3rem
  background-size: 5.05rem 3.1rem
  span
   font-size: .7rem;
   color: rgba(0,0,0,0.87);
   letter-spacing: -0.61px;
   line-height: 1rem;
   position relative
   display:block
   padding-top: 8.075rem
   text-align center
 
   
// .request-result-header
//  height: 2.2rem
//  line-height: 2.2rem
//  background: #fff
//  text-align: center
//  padding-right: .6rem
//  border-1px-b(rgba(0, 0, 0, .12))
//  &:first-child
//   font-size: .9rem;
//   color: rgba(0,0,0,0.87);
//   letter-spacing: -0.9px;

// .done
//  color:#ff0030 
//  position absolute
//  right: .6rem 

.request-manage
 display: block
 width: 17.55rem
 border: 1px solid #ff0030
 color #ff0030
 text-align center
 height 2.2rem
 line-height: 2.2rem
 margin: 0 auto
 font-size: .8rem
 letter-spacing: -0.81px
 border-radius: 4px
 margin-bottom: 1rem


</style>
