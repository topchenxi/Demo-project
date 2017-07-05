
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
        <section class="retrieve-tip">
          Retrieve your password
        </section>
       <ul class="retrieve-account">
         <li class="f-boxsizing border-1px" :class="{'retrieve-icon': index===1}" @click="accoutChoose(1)">
         {{userEmail}}
         </li>
         <li class="f-boxsizing" :class="{'retrieve-icon': index===2}" @click="accoutChoose(2)">
         {{userMob}}
         </li>
       </ul>
    </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      index: null,  //  用来做选择图标
      accountData: this.$route.params.accountData  //  保存账户信息
    };
  },
  activated() {     
   
   if (!this.$store.state.accountStatus) {
     this.accountData = this.$route.params.accountData;
     this.index = null;
     this.$store.commit("RECIRD_ACCOUNT_STATUS", true);    
   }
  },
  computed:{
    //  获取邮箱
    userEmail() {
      return "Email: " + this.accountData.userEmail;
    },
    //  获取用户信息
    userMob() {
      return "Mob: " + this.accountData.mobile;
    },
    //  改变next颜色
    nextActive() {
      if (this.index) {
        return "#ff0030";
      } 
    }
  },
  methods: {
      //   切换icon
    accoutChoose(acount) {
      this.index = acount;   
    },
    cancel() {
      this.$router.go(-1);
    },
    //  下一步
    next() {

      if (this.index===1) {                // email 
        let params = {
          selectType: 0,
          sign: this.accountData.sign,
          userId: this.accountData.userId
        };
       this.axios({
          method: "post",
          url: "/user/resetPasswordByMode.cf",
          params: params
        })
        .then((res) => {
         res.data.status === "success" ? this.$router.replace({name:"resetSuccess", params:{type: 1}}) : alert(res.data.message);
        });
       
      } else if (this.index===2) {        // mob
        let params = {
          selectType: 1,
          sign: this.accountData.sign,
          userId: this.accountData.userId
        };

        this.axios({
          method: "post",
          url: "/user/resetPasswordByMode.cf",
          params: params
        })
        .then((res) => {
         let newAccountData = Object.assign({}, res.data.data, {mobile: this.accountData.mobile});
         res.data.status === "success" ? this.$router.push({name:"verifyCode", params:{ accountData: newAccountData }}) : alert(res.data.message);
        });
      }
    }
  }
};
</script>


<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixins/index.styl"
.retrieve     
 &-tip
  height: $cell-height
  line-height: @height
  padding: 2.2rem 0 0 .6rem
  font-size: .8rem
  color: rgba(0, 0, 0, .26)
  letter-spacing: -0.81px
 &-account
  background: #fff
  li
   height: $cell-height
   line-height: @height
   padding: 0 .6rem
   font-size: .8rem
   color: rgba(0,0,0,0.86)
   letter-spacing: -0.81px
   &:first-child
    border-1px-b(rgba(0, 0, 0, .12), false)
 &-icon
  background: url("./images/icon_check.png") no-repeat 16rem center
  background-size: 26px 18px
</style>
