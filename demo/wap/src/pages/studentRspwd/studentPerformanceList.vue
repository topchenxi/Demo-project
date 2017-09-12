<template>
  <div class="studentPerformance-wrap">
    <!--公共头部-->
    <v-header 
      title="学生业绩"
      :isFixed="false"
    >
    </v-header>
    <!-- 业绩查询 -->
    <section class="studentPerformanceList" v-if="data!=null">
      <mt-cell :title="'学生编号：'+stuNumber" class="t mb"></mt-cell>
      <div class="list">
        <h2>装机量：</h2>
        <ul class="con" v-if="data.length>0">
          <li class="clearfix" v-for="(item,index) in data" :key="index">
            <div class="date">{{item.date}}</div>
            <div class="count">{{item.count}}个</div>
          </li>
        </ul>
        <ul class="con" v-if="data.length<1">
          <li class="noresult clearfix">
            没有更多的数据
          </li>
        </ul>
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
        stuNumber:this.$route.params.id,
        data:null
      };
    },
    
    components:{
      "v-header": header
    },

    created() {
        this.getList();
    },
    
    methods: {
      getList(){
        let _this = this;
        let url = '/referrer/getPerformance.cf';
        let params = {
          stuNumber:_this.stuNumber
        }
        _this.axios({
            method:'get',
            url:url,
            params:CFEC.addConfig(params)
          })
          .then((res) => {
            if(res.data.status == 'success'){
              _this.data = res.data.data.list;
            }else{
              alert(res.data.message);
            }
          });
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
#app{
  height:100%;
}
.mb{
  margin-bottom:10px;
}
.t{
  border-bottom:1px solid rgba(0,0,0,0.12);
}
.list{
  h2{
    font-size:0.9rem;
    margin-bottom:10px;
    padding: 0 10px;
  }
  ul{
    background-color:#fff;
    border-top:1px solid rgba(0,0,0,0.13);
    li{
      font-size:0.9rem;
      height:48px;
      line-height:48px;
      padding:0 10px;
      border-bottom:1px solid rgba(0,0,0,0.12);
      .date,
      .count{
        width:50%;
        float:left;
      }
      .count{
        text-align:right;
      }
    }
    .noresult{
      text-align:center;
    }
  }
}

</style>