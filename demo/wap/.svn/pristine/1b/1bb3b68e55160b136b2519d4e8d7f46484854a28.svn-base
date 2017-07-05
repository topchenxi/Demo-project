
<template >
  <div class="attributes-wrap">
 <!--顶部导航-->
    <c-header title="Attributes"></c-header>
 <!--顶部导航-->
    <section class="attributes-notice">We recommend that you fill in the following attributes, so that suppliers can better understand what you need.</section>
  
    <ul class="attributs-ul">
      <router-link class="border-1px"
                   :to="'/attributeDetail/'+ item.propertyEnName + '/' + JSON.stringify(item.propertyValues) + '/' + index"
                   tag="li"
                   v-for="(item, index) of properties"
                   :key="index"> {{item.propertyEnName}}
        <span class="get-property">{{propertiesValue[index]}}</span>
      </router-link>
    </ul>
    <div class="submit"
         @click="ifLogin">
      <span>Submit</span>
    </div>
  </div>
</template>

<script>
import header from "components/header";
import { Indicator } from "mint-ui";
import { localStorage } from "common/js/util.js";
export default {

  data() {

    return {
      categoryId: this.$store.state.categoryId, 
      properties: null,   // 属性Key
      storeProperies1: []  
    };

  },
  components: {
    "c-header": header
  },
  computed: {
    // 获取属性值
    propertiesValue() {
      return this.$store.state.properties;
    }
  },

  created() {
    this.getAttribute(this.categoryId);
  },

  watch: {  
    categoryId(newId) {
      this.getAttribute(newId);
      this.$store.commit("CLEAR_PROPERIES");
    }
  },

  activated() {
    this.categoryId = this.$store.state.categoryId;
  },
  methods: {
    // 获取属性列表
    getAttribute(_categoryId) {
      Indicator.open("Loading");
      this.axios.get("/dict/categoryProperties.cf?lastCategoryId=" + _categoryId)
        .then((res) => {
          Indicator.close();
          
            this.properties = res.data.data.properties;

        })
        .catch((err) => {
          Indicator.close();
          console.log(err);
        });
    },
    // 是否登录
    ifLogin() {
      if (JSON.parse(localStorage.get("localUserInfo"))) {
        this.sendRequest();
      } else {
        this.$router.push("/login");
        this.$store.commit("BACK_LOGIN", false);

      }
    },
     //  发布采购需求
    sendRequest() {
      Indicator.open("Sending...");
      let localToken = JSON.parse(localStorage.get("localUserInfo")).message;
    //  拼装属性
      let a = [];
      if (this.properties) {
      for (let [key, value] of this.properties.entries()) {
        let c = {};
        if (this.propertiesValue[key]) {
          c.propertyEnName = value.propertyEnName;
          c.propertyEnValue = this.propertiesValue[key];
          a.push(c);
        }
      }
      }

      let requsetParams = this.$store.state.requestParams;
      requsetParams.procurementStr.productLastCategoryId = this.categoryId;
      requsetParams.token = localToken;
      requsetParams.procurementStr.procurementProductProperties = a;
      
      this.axios({
                    method: "post",
                      url: "/procurement/send.cf",
                      params: requsetParams
                    }) 
        .then((res) => {
          if (res.data.status === "success") {
            this.$store.commit("SEND_REQUEST_SUCCESS", true);
            Indicator.close();
            this.$router.replace("/postRequestSuccess");
          } else {
            Indicator.close();
            alert(res.data.message);
           
          }
        })
        .catch((err) => {
          console.log(err);
          Indicator.close();
        });
    }
  }


};
</script>


<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../../common/stylus/mixins/index.styl"


 .submit
  display:block
  background: #fff
  width 100%
  height 3rem
  position: fixed
  bottom: 0
  span
   display block
   height:2rem
   background: #ff0030
   width 17.55rem
   color: #fff
   text-align center
   line-height 2rem
   font-size .8rem
   position absolute
   left:.6rem
   top: .6rem
   border-radius 4px 


.get-property
  position absolute
  right: 2.4rem
  font-size: .7rem;
  color: rgba(0,0,0,0.54);
  letter-spacing: -0.53px;

.attributes-notice
 font-size: .7rem;
 color: rgba(0,0,0,0.26);
 letter-spacing: -0.61px;
 line-height: 1rem;
 padding: .6rem
 word-break: break-word

.attributs-ul 
 background: #fff
 li
  font-size: .8rem
  display: block
  height: 2.4rem  
  background-size: 1.2rem 1.2rem
  font-size: .8rem
  color: rgba(0,0,0,0.87)
  letter-spacing: -0.81px
  line-height: 2.4rem
  text-indent: .6rem
  background-size: .8rem 1.2rem
  background: url("../images/icon_list_arrow.png") no-repeat 16.8rem center
  background-size: .8rem 1.2rem
  border-1px-b(rgba(0, 0, 0, .12), false)

.attributes-wrap 
 padding-top: 2.2rem
</style>
