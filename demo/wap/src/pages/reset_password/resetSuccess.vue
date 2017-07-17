
<template>
    <div>
        <header class="border-1px">
            <span class="c-head-title f-cenmiddle">
                    Password Reset
                </span>
            <span class="c-head-next" @click="backLogin" :style="{'color':'#FF0030'}">  
                      Done
                </span>
        </header>
         <section class="reset-success-mian">
           <img src="./images/img_successfully.png" alt="">
           <div v-if="type===1">
             <p>
             Submitted successfully!
             </p>
             <p>
               Please check your mail box to
             </p>
             <p>
             reset password
             </p>
            </div>
         <p v-if="type===2">Password reset successfully!</p>
           <div class="reset-success-btn">        
             <button @click="backLogin" type="button" v-if="type===2">
               Sign In Now
             </button>
           </div>
         </section>
    </div>
</template>

<script>

export default {
  data() {
    return {
      type: this.$route.params.type   //  用来切换邮箱或者电话重置密码的成功页
    };
  },
  methods:{
    backLogin() {
      this.$router.replace("/login");
      this.$store.commit("BACK_LOGIN", true); 
    }    
  }

};
</script>

<style lang="stylus" rel="stylesheet/stylus" >
.reset-success
 &-mian 
  padding-top: 4rem
  img
   display block
   height: (174/40)rem
   width: (204/40)rem
   margin: 0 auto .6rem
  p
   font-size: .7rem
   text-align: center
   color: rgba(0,0,0,0.87)
   letter-spacing: -0.61px
   line-height: 1rem
   margin-bottom: .6rem;
 &-btn
  p
   margin-bottom: 3rem
  button
   display: block
   width: 17.55rem
   height: 2.2rem
   line-height: 2.2rem
   color: #fff
   text-align: center
   margin: 0 auto
   border-radius: 4px
   -webkit-border-radius: 4px   
   background: #ff0030
</style>
