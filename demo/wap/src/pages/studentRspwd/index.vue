<template>
  <div class="studentRspsw-wrap">
    <!--公共头部-->
    <v-header 
      title="Password Reset"
      :isFixed="false"
    >
        <img slot="right" @click="backHome" 
        class="c-header-right-icon f-vermiddle" 
        src="./images/icon_tab_home_nor.png" alt="">
    </v-header>

    <!--表单-->
    <section class="resetForm">
      <mt-field placeholder="Consultant's Account" :state="validateModel('studentAccount')" type="tel" v-model="form.studentAccount.value"></mt-field>
      <mt-field placeholder="Consultant's Password" :state="validateModel('studentPsw')" type="password" v-model="form.studentPsw.value"></mt-field>
      <mt-field placeholder="Buyer's Account(email/CFID)" :state="validateModel('buyerAccount')" v-model="form.buyerAccount.value"></mt-field>
      <mt-field placeholder="New Password(Please enter 6-25 characters)" :state="validateModel('buyerPsw')" type="password" v-model="form.buyerPsw.value"></mt-field>
      <mt-field placeholder="Input new password again" :state="validateModel('buyerPswConfirm')" type="password" v-model="form.buyerPswConfirm.value"></mt-field>
    </section>
    <section class="btnGroup">
      <mt-button type="default" size="large" @click.native="submitAction">Submit</mt-button>
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
            msg:'Consultant\'s Account can not be empty, please check!'
          },
          studentPsw:{
            value:'',
            state:'warning',
            msg:'Consultant\'s Password can not be empty, please check!'
          },
          buyerAccount:{
            value:'',
            state:'warning',
            msg:'Buyer\'s account is your email or CantonfairID, please check!'
          },
          buyerPsw:{
            value:'',
            state:'warning',
            msg:'Please enter 6-25 characters，at least one number and one letter.'
          },
          buyerPswConfirm:{
            value:'',
            state:'warning',
            msg:'Passwords do not match. Please check and enter again.'
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
          this.form.studentAccount.value = student.studentAccount;
          this.form.studentPsw.value = student.studentPsw;
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
              if(String(val).length>0){
                return true;
              }else{
                return false;
              }
            }
          },
          studentPsw:{
            validate:function(val){
              if(String(val).length>0){
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
              if(reg1.test(val) && reg2.test(val) && String(val).length >=6 && String(val).length <= 25){
                return true;
              }else{
                return false;
              }
            }
          },
          buyerPswConfirm:{
            validate:function(val){
              let reg1 = /[a-zA-Z]+/;
              let reg2 = /(\d+)/;
              if(reg1.test(val) && reg2.test(val) && String(val)==String(_this.form.buyerPsw.value)){
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
        let _this = this;
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
              let studentObj = {
                studentAccount:_this.form.studentAccount.value,
                studentPsw:_this.form.studentPsw.value
              }
              localStorage.set('student',JSON.stringify(studentObj));
              
              alert('Submitted successfully!');
              this.form.buyerAccount.value = '';
              this.form.buyerPsw.value = '';
              this.form.buyerPswConfirm.value = '';
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