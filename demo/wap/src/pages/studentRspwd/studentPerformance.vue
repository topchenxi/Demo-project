<template>
  <div class="studentPerformance-wrap">
    <!--公共头部-->
    <v-header 
      title="学生业绩"
      :isFixed="false"
      :isLeftIcon="false"
    >
    </v-header>
    <mt-navbar v-model="selected">
      <mt-tab-item id="1">业绩录入</mt-tab-item>
      <mt-tab-item id="2">业绩查询</mt-tab-item>
    </mt-navbar>
    <!-- 业绩录入 -->
    <section class="Entry" v-if="selected=='1'">
      <div class="form">
        <mt-field placeholder="请输入学生编号" type="text" v-model="stuNumber" :disableClear="false" class="input stuNum" :state="checkInput(stuNumber)"></mt-field>
        <div v-for="(item,index) in appNumbers" class="line">
          <mt-field placeholder="请输入APP编号" type="text" v-model="appNumbers[index]" :disableClear="false" :state="checkInput(appNumbers[index])" class="input"></mt-field>
          <a href="javascript:void(0)" class="addBtn fl" @click="removeAppNum(index)" v-if="index!=appNumbers.length-1">-</a>
          <a href="javascript:void(0)" class="addBtn fl" @click="addAppNum(index+1)" v-if="index==appNumbers.length-1">+</a>
        </div>
      </div>
      <div class="btnBar">
        <button class="btn" :disabled="checkAppNumbers()" @click="submitAction()">提交</button>
      </div>
    </section>
    <!-- 业绩查询 -->
    <section class="Inquire" v-if="selected=='2'">
      <div class="form">
        <mt-field placeholder="请输入学生编号" type="text" v-model="stuNumber" :disableClear="false" class="input stuNum" :state="checkInput(stuNumber)"></mt-field>
      </div>
      <div class="btnBar">
        <button class="btn" :disabled="stuNumber==''" @click="inquireAction()">查询</button>
      </div>
    </section>
  </div>
</template>

<script>
  
  import header from "components/header";
  import {localStorage,CFEC} from "common/js/util.js";

  export default {
    data() {
      return {
        selected:'1',
        stuNumber:'',
        appNumbers:['']
      };
    },
    
    components:{
      "v-header": header
    },

    created() {
        if(localStorage.get('stuNumber')){
          this.stuNumber = localStorage.get('stuNumber');
        }
    },
    
    methods: {
      //  顶部的直接返回HOME页面
      backHome() {
          this.$router.replace("/home");
      },
      // 删除APP编号
      removeAppNum(index){
        let _this = this;
        _this.appNumbers.splice(index,1);
      },
      // 增加APP编号
      addAppNum(){
        let _this = this;
        _this.appNumbers.push('');
      },
      // 检测数组
      checkAppNumbers(){
        let _this = this;
        if(_this.appNumbers.indexOf('') == -1 && _this.stuNumber!=''){
          return false;
        }else{
          return true;
        }
      },
      // 检测输入
      checkInput(val){
        let _this = this;
        if(val != ''){
          return 'success';
        }else{
          return 'error';
        }
      },
      // 提交
      submitAction(){
        let _this = this;
        let url = '/referrer/savePerformance.cf';
        let params = {
          stuNumber:_this.stuNumber,
          appNumbers:_this.appNumbers.join(',')
        }
        _this.axios({
            method:'get',
            url:url,
            params:CFEC.addConfig(params)
          })
          .then((res) => {
            if(res.data.status == 'success'){
              localStorage.set('stuNumber',_this.stuNumber);
              _this.appNumbers = [''];
              alert('已保存成功');
            }else{
              alert(res.data.message);
            }
          });
      },
      // 查询成绩
      inquireAction(){
        let _this = this;
        if(_this.stuNumber != ''){
          this.$router.push('spList/'+_this.stuNumber);
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
#app{
  height:100%;
}
.studentPerformance-wrap{
  padding-bottom:20px;
}
.mint-navbar .mint-tab-item.is-selected{
  border-bottom: 3px solid rgb(255, 0, 48);
  color: rgb(255, 0, 48);
  margin-bottom:0;
}
.mint-navbar .mint-tab-item{
  padding:12px 0;
}
.mint-tab-item-label{
  font-size:0.8rem;
}
.mint-field-state{
  margin-left:0;
  margin-right:35px;
}
.stuNum{
  .mint-field-state{
    margin-left:0;
    margin-right:0;
  }
}
.form{
  padding-top:10px;
  .input{
    margin-bottom:10px;
  }
  .line{
    position: relative;
    .addBtn{
      display:block;
      width:48px;
      height:48px;
      line-height:48px;
      position:absolute;
      right:0;
      top:0;
      font-size:40px;
      color:#999;
      text-align:center;
    }
  }
}
.btnBar{
  width:100%;
  height:32px;
  padding:6px 0;
  .btn{
    width:80%;
    height:42px;
    line-height:42px;
    color:#fff;
    background-color:rgb(255, 0, 48);
    display:block;
    text-align:center;
    margin:0 auto;
    border-radius:4px;
    font-size:1rem;
    &:disabled{
      background-color:#ccc;
    }
  }
}

</style>