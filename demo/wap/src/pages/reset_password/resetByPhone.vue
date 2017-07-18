
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
                      Submit
                </span>
        </header>
        <section class="reset-password border-1px">
            <input type="password" class="f-boxsizing" v-model.trim="newPassword" placeholder="New Password (6-25 characters)">
            <input type="password" class="f-boxsizing" v-model.trim="confirmPassword" placeholder="Confirm Password">
        </section>
    </div>
</template>

<script>
import { MessageBox } from "mint-ui";
export default {
    data() {
        return {
         accountData:this.$route.params.accountData,
           newPassword: null,
           confirmPassword: null
        };
    },
  computed: {
    //  改变next颜色
   nextActive() {
    // alert(this.newPassword);
       return this.newPassword && this.confirmPassword ? "#ff0030": "";
   }
    },
    methods: {
    //  取消    
    cancel() {
           
            MessageBox({
            title: " ",
            message: "Are you sure want to leave this page?",
            showCancelButton: true,
            confirmButtonText:"Confirm",
            cancelButtonText:"Cancel",
            confirmButtonClass: "messagebox-confirm-btn",
            cancelButtonClass: "messagebox-cencel-btn"
        })
        .then(action => {
                action==="confirm" ? this.$router.replace("/login") : "";
            });
        },
    //  下一步
    next() {
      let a = () => {
      let ressetPassword = /(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{6,}/;
      let newPass = this.newPassword;
      let confirmPass = this.confirmPassword;
     
      if (ressetPassword.test(newPass) && ressetPassword.test(confirmPass)) {
      newPass===confirmPass ? this.sendUpdate() : alert("Please input the match password.");             
      } else {
          alert("Password must be 6-25 characters and containing number and letter.");
      }
    };
    if (this.newPassword && this.confirmPassword) {
        a();
    }

},
   //  提交重置的密码
    sendUpdate() {
          let params = {
          selectType: 1,
          sign: this.accountData.sign,
          resetCode: this.accountData.resetCode,
          userId: this.accountData.userId,
          newPassword:this.newPassword,
          newPasswordConfirm: this.confirmPassword,
          appFlag:2
        };
         this.axios({   
          method: "post",
          url: "/user/moblieWayToPasswordUpdate.cf",
          params: params
        })
        .then((res) => {
            if (res.data.status==="success") {
             this.$router.replace({name:"resetSuccess", params:{type:2}});
            }
        });
    }
    }
};
</script>


<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixins/index.styl"
.reset-password
 padding-top: 2.8rem
 position: relative
 input:first-child
  border-bottom .5px solid rgba(0, 0 ,0 ,.12)
 input
  padding-left: .6rem
  height: $cell-height
  width: 100%
  font-size: .8rem
  color: rgba(0,0,0,0.86)
  letter-spacing: -0.81px 
</style>
