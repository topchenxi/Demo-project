
<template>
    <div>
        <header class="border-1px">
            <span class="c-head-cancel f-vermiddle" @click="canacel"> 
                     Cancel
                </span>
            <span class="c-head-title f-cenmiddle">
                    Password Reset
                </span>
            <span class="c-head-next" @click="next" :style="{'color':nextActive}">  
                      Next
                </span>
        </header>
         
        <input type="text" v-model="account" placeholder="Email / Username" class="reset-user f-boxsizing"> 
    </div>
</template>

<script>
export default {
    data() {
        return {
          account: null   //  保存账号
        };
    },
    computed: {

    //  改变next的颜色
      nextActive() {
        return this.account && "#ff0030";
     }
    },

    methods: {

    //  取消
        canacel() {
            this.$router.replace("/login"); 
        },

    //  检查是否有输入账号并进入下一步
        next() {
          this.account ? this.fetchAccount() : "";
        },

    //  拉取账号
        fetchAccount() {
          this.axios({
              method:'get',
              url:'/user/resetPasswordByAccount.cf',
              params:{
                  username:this.account,
                  appFlag:2
              }
          })
          .then(res => {
            if (res.data.status==="success") {
            this.$router.push({name:"accountChoose", params:{"accountData": res.data.data}});
            this.$store.commit("RECIRD_ACCOUNT_STATUS", false);
              } else {
                alert("The account is not exist");
              }
          });
        }
    }
};
</script>


<style lang="stylus" rel="stylesheet/stylus" >
@import "../../common/stylus/mixins/index.styl"
 .reset
  &-user
   grid-size($cell-height, 100%)
   padding-left: $left-24
   margin-top: 2.8rem
   font-size: (32/40)rem
   color: rgba(0,0,0,0.86)   
</style>
