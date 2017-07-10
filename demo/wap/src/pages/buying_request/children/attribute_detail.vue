
<template>
 <div>
 <!--顶部导航-->
    <c-header :title="this.$route.params.propertyEnName"></c-header>
 <!--顶部导航-->
 <ul class="attributs-ul border-1px">
   <li class="border-1px" v-for="(item, index) of JSON.parse(this.$route.params.propertyValues)" @click="chooseProperty(item.propertyValueEn, index)" :key="index"  :class="{'checked': checkedIndex===index}" >
     {{item.propertyValueEn}}
   </li>
 </ul>
  </div>
</template>
<script>
import header from "components/header";
export default {
  data() {
    return {
      isInit: true, // 初始化进入
      categoryId: this.$store.state.categoryId,
      properties: null,
      checkedIndex: ""
    };
  },

  components: {
    "c-header": header
  },

  methods: { 
    // 选择属性
  chooseProperty(propertyName, _index) {
    this.checkedIndex = _index;
    this.$store.commit("RECORD_PROPERIES", {
      index: this.$route.params.index,
      property: propertyName
    });    

    this.$router.go(-1);
  }
  }

};
</script>


<style lang="stylus" rel="stylesheet/stylus" scoped>
 @import "../../../common/stylus/mixins/index.styl"

.attributs-ul 
 background: #fff
 padding-top: 2.2rem
 li
  font-size: .8rem
  display: block
  height: 2.4rem  
  font-size: .8rem
  color: rgba(0,0,0,0.87)
  letter-spacing: -0.81px
  line-height: 2.4rem
  text-indent: .6rem
  border-1px-b(rgba(0, 0, 0, .12), false)
  &.checked
   background: url("../images/icon_check.png") no-repeat 16.8rem center
   background-size: .8rem 1.2rem


  
</style>
