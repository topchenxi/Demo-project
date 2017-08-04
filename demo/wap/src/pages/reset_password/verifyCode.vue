<template>
    <div>
     <header class="border-1px">
            <span class="c-head-cancel f-vermiddle" @click="cancel"> 
                     Cancel
                </span>
            <span class="c-head-title f-cenmiddle">
                    Password Reset
                </span>
            <span class="c-head-next" @click="next" :style="{'color':nextActive}">  
                      Next
                </span>
        </header>
      <section class="passmob-tip">
        <p>A password reset code has been sent to</p>
        <p>{{accountData.mobile}}, please check!</p> 
      </section>
      <section class="passmob-code">
        <input type="text" pattern="\d*" v-model.trim="code" placehold="Password reset code">
        <div class="passmob-send-btn f-vermiddle" @click="checkSented"><span v-if="!showTime">{{time+ " S"}}</span> <span v-if="showTime">Sent Again</span></div>
      </section>
      
    </div>
</template>

<script>
export default {
  data() {
    return {
      accountData: this.$route.params.accountData,  //   保存账户信息
      code: null,   //  验证码
      time: 60,   //  限制时间
      showTime:false  //  是否显示时间
    };
  },
  created() {
    this.intervalTime();
  },
  computed: {
    //  改变next颜色
    nextActive() {
     return this.code && "#ff0030";
    }
  },
  methods:{
    //  时间倒计时
    intervalTime() {
      this.showTime = false;
      this.time = 60;
   let interval = setInterval(() => {
        this.time--;
        if (this.time===0) {
          clearInterval(interval);
          this.showTime = true;
        }
      }, 1000);
    },
    //  重新拉取验证码
    checkSented() {
      this.showTime && this.sentAgain();
    },
    sentAgain() {
         let params = {
          selectType: 1,
          sign: this.accountData.sign,
          userId: this.accountData.userId
        };
        this.axios({
          method: "post",
          url: " /user/sendMobileCode.cf",
          params: CFEC.addConfig(params)
        })
        .then((res) => {
          res.data.status==="success"? this.intervalTime() : alert(res.data.message);
        });
    },


    cancel() {
      this.$router.go(-1);
    },
    next() {
      this.code && this.sendMobCode();
    },
    //  发送验证码
    sendMobCode () {
         let params = {
          selectType: 1,
          sign: this.accountData.sign,
          resetCode: this.code,
          userId: this.accountData.userId
        };
         this.axios({
          method: "post",
          url: "/user/validateResetCode.cf",
          params: CFEC.addConfig(params)
        })
        .then((res) => {
         res.data.status==="success" ? this.$router.replace({name:"resetByPhone", params:{accountData:res.data.data}}) : alert(res.data.message);
        });
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixins/index.styl"
.passmob
 &-tip
  padding: 2.8rem .6rem .6rem
  font-size: .8rem
  color: rgba(0,0,0,0.26)
  letter-spacing: -0.61px
  line-height: 1rem
 &-code
  position relative
  background: #fff
  input
   font-size: .8rem
   height: $cell-height
   padding-left:.6rem
   color: rgba(0,0,0,0.86)
 &-send-btn
   padding: .3rem .4rem
   font-size: .8rem
   color: #fff
   text-align center
   border-radius: 4px
   -webkit-border-radius: 4px
   background: #ff0030
   right: $right-24
</style>
