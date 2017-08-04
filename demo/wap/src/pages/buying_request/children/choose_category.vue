
<template>
    <div class="caterogy-request-warp">
    <!--顶部导航-->
       <c-header title="Categories"></c-header>
    <!--顶部导航-->
       <ul>
           <li class="caterogy-request border-1px" @click="sliceString(item.categoryCascade, item.categoryId)" v-if="status==='success'" v-for="item of categoryList">{{item.categoryCascade}}</li>
       </ul> 
    
        <router-link class="visit-store border-1px" to="/categoryFirst"  @click.native="toCategory">
              Don't find? Choose my caterory
            <span class="arrow-r"></span>
        </router-link>
    </div>
</template>

<script>
  import header from "components/header";
  import {CFEC} from "common/js/util.js";
export default {
     data() {
         return {
            categoryList: [],  // 类目列表
            status: null   
         };
     },
     components: {
         "c-header": header
     },
    //  获取类目
     created() {
         let params = {
             prefix:this.$route.params.productName
         }
        this.axios({
            method:'get',
            url:'/dict/suggestCategory2.cf',
            params:CFEC.addConfig(params)
        })
            .then((res) => {
                this.categoryList = res.data.data;
                this.status = res.data.status;
            });
     },
     methods: {
            //  采购需求类目选择页进类目页
            toCategory() {
                this.$store.commit("CHANGE_CATEGORY_ENTRY", true);
            },
            sliceString(_categoryName, _categoryId) {        
              this.$store.commit("RECORD_REQUEST_CATEGORY", {categoryName: _categoryName.substring(_categoryName.lastIndexOf(">")+1), categoryId: _categoryId});
              this.$router.go(-1);
            }
     }
};
</script>


<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../../common/stylus/mixins/index.styl"

 .caterogy-request-warp
   padding-top: 2.2rem

.visit-store
  margin-top: .6rem
  display: block
  height: 2.4rem  
  background:#fff url("../images/icon_listview.png") no-repeat .6rem center
  background-size: 1.2rem 1.2rem
  border-1px-tb(rgba(0, 0, 0, .12), false)
  font-size: .8rem;
  color: rgba(0,0,0,0.87);
  letter-spacing: -0.81px;
  line-height: 2.4rem;
  text-indent: 2.4rem;
  .arrow-r
    width: .8rem
    height: 1.2rem
    display: block
    background: url("../images/icon_list_arrow.png") no-repeat
    background-size: .8rem 1.2rem
    position: absolute
    left: 16.8rem
    top: 50%
    transform: translateY(-50%)

.caterogy-request 
 font-size: .7rem;
 color: rgba(0,0,0,0.87); 
 letter-spacing: -0.61px;
 line-height: 1rem;
 padding: .6rem
 background: #fff
 word-break: break-all
 border-1px-b(rgba(0, 0, 0, .12), false)

 


</style>
