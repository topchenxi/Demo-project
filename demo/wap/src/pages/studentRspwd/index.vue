<template>
  <div class="studentRspsw-wrap">
    <!--公共头部-->
    <v-header 
      title="采购商密码重置"
      :isFixed="false"
    >
        <img slot="right" @click="backHome" 
        class="c-header-right-icon f-vermiddle" 
        src="./images/icon_tab_home_nor.png" alt="">
    </v-header>

    <!--表单-->
    <section class="resetForm">
      <mt-field placeholder="学生帐号" :state="validateModel('studentAccount')" type="tel" v-model="form.studentAccount.value"></mt-field>
      <mt-field placeholder="学生密码" :state="validateModel('studentPsw')" type="password" v-model="form.studentPsw.value"></mt-field>
      <mt-field placeholder="采购商帐号（email/CFID）" :state="validateModel('buyerAccount')" v-model="form.buyerAccount.value"></mt-field>
      <mt-field placeholder="新密码" :state="validateModel('buyerPsw')" type="password" v-model="form.buyerPsw.value"></mt-field>
      <mt-field placeholder="重复密码" :state="validateModel('buyerPswConfirm')" type="password" v-model="form.buyerPswConfirm.value"></mt-field>
    </section>
    <section class="btnGroup">
      <mt-button type="default" size="large" @click.native="submitAction">提交</mt-button>
    </section>

    <!--版权声明-->
    <c-copyright></c-copyright>
    <!--版权声明-->
    </scroller>
  </div>
</template>

<script>
  import header from "components/header";
  import copyRight from 'components/copyRight';
  import {localStorage,CFEC} from "common/js/util.js";

  export default {
    data() {
      return {
        form:{
          studentAccount:{
            value:'',
            state:'warning',
            msg:'学生帐号为学生手机号，请核对'
          },
          studentPsw:{
            value:'',
            state:'warning',
            msg:'学生帐号密码默认为手机号后6位，请核对'
          },
          buyerAccount:{
            value:'',
            state:'warning',
            msg:'采购商帐号为Email或者CantonfairID，请核对'
          },
          buyerPsw:{
            value:'',
            state:'warning',
            msg:'采购商密码要求至少使用1个阿拉伯数字和1个英文字符进行组合，请核对'
          },
          buyerPswConfirm:{
            value:'',
            state:'warning',
            msg:'采购商密码两次输入不相同，请核对'
          }
        }
      };
    },
    
    components:{
      "v-header": header,
      "c-copyright":copyRight
    },

    created() {
        if(localStorage.get('student')){
          let student = JSON.parse(localStorage.get('student'));
          this.studentAccount = student.studentAccount;
          this.studentPsw = student.studentPsw;
        }
    },
    
    methods: {
      //  顶部的直接返回HOME页面
      backHome() {
          this.$router.replace("/home");
      },
      // 数据校验
      validateModel(type){
        let _this = this;
        let validateObj = {
          studentAccount:{
            validate:function(val){
              let reg = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/;
              if(val.length == 11 && reg.test(val)){
                return true;
              }else{
                return false;
              }
            }
          },
          studentPsw:{
            validate:function(val){
              let reg = /(\d+)$/;
              if(val.length==6){
                return true;
              }else{
                return false;
              }
            }
          },
          buyerAccount:{
            validate:function(val){
              let reg1 = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
              let reg2 = /(\d)/;
              if(reg1.test(val) || reg2.test(val)){
                return true;
              }else{
                return false;
              }
            }
          },
          buyerPsw:{
            validate:function(val){
              let reg1 = /[a-zA-Z]+/;
              let reg2 = /(\d)/;
              if(reg1.test(val) && reg2.test(val) && val.length >=8 && val.length <= 25){
                return true;
              }else{
                return false;
              }
            }
          },
          buyerPswConfirm:{
            validate:function(val){
              let reg1 = /[a-zA-Z]+/;
              let reg2 = /(\d+)$/;
              if(reg1.test(val) && reg2.test(val) && val==_this.form.buyerPsw.value){
                return true;
              }else{
                return false;
              }
            }
          }
        }
        let val = this.form[type].value;
        if(validateObj[type].validate(val)){
          this.form[type].state = 'success';
        }else{
          this.form[type].state = 'warning';
        }
        let state = this.form[type].state;
        return state;
      },
      // 提交检查所有数据
      checkAll(){
        let obj = this.form;
        for(let i in obj){
          if(obj[i].state != 'success'){
            alert(obj[i].msg);
            return false;
          }
        }
        return true;
      },
      submitAction(){
        if(this.checkAll()){
          let url = "/student/resetPass.cf";
          let params = {
            name:this.form.studentAccount.value,
            password:this.form.studentPsw.value,
            account:this.form.buyerAccount.value,
            password1:this.form.buyerPsw.value,
            password2:this.form.buyerPswConfirm.value
          }
          this.axios({
            method:'get',
            url:url,
            params:CFEC.addConfig(params)
          })
          .then((res) => {
            if(res.data.status == 'success'){
              alert('修改成功');
            }else{
              alert(res.data.message);
            }
          });
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
#app{
  height:100%;
}
.studentRspsw-wrap{
  height:100%;
}
.resetForm{
  margin-bottom:1rem;
}
.btnGroup{
  padding:0 0.5rem;
  .mint-button{
    background: rgb(255, 0, 48);
    color:#fff;
  }
}
</style>