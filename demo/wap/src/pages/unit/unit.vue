
<template>
    <div class="unit-warp">
      <c-header title="Select">
     
      </c-header>

       <ul>
            <li v-for="(item, index) of unitList"
                :key="item.categoryId" 
                @click="getUnit(item.enName, index)"  
                :class="{'checked': checkedIndex===index}"
                class="border-1px"  
            >
                {{item.enName}}
            </li>
        </ul>
    </div>
</template>

<script>
import header from "components/header";
import {Indicator} from "mint-ui";
export default {
    data() {
        return {
            unitList: [],   //  单位列表
            checkedIndex: ""  //  选中记录
        };
    },
    components: {
        "c-header": header
    },
    created() {
        // 拉取单位列表数据
        Indicator.open("Loading");
        this.axios({
            method:'get',
            url:'/commonData/list.cf',
            params:{
                keys:'order_unit',
                appFlag:2
            }
        })
            .then((res) => {
                this.unitList = res.data.data.order_unit;
                  Indicator.close();
            })
            .catch(() => {
                Indicator.close();
                Toast("Network Timeout");
            });
    },
    methods: {
        // 获得单位
        getUnit(unit, index) {
            this.$router.go(-1);
            this.checkedIndex = index;
            this.$store.commit("RECORD_UNIT", unit);
        }
    }
};
</script>


<style lang="stylus" rel="stylesheet/stylus" scoped>
 @import "../../common/stylus/mixin.styl";
ul
 background: #fff

 li
  font-size: .8rem
  display: block
  height: 2.4rem  
  background-size: 1.2rem 1.2rem
  font-size: .8rem;
  color: rgba(0,0,0,0.87);
  letter-spacing: -0.81px;
  line-height: 2.4rem;
  text-indent: .6rem;
  background-size: .8rem 1.2rem
  border-1px-b(rgba(0, 0, 0, .12))
  &.checked
   background: url("./images/icon_check.png") no-repeat 16.8rem center
   background-size: .8rem 1.2rem

.unit-warp
 padding-top: 2.2rem
</style>
