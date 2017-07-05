
<template>
    <div>
        <section class="header border-1px">
              <form action="">
            <div class="input-wrap">
                <img v-show="searchText"
                     class="clear-all"
                     src="../images/icon_clean.png"
                     alt=""
                     @click="clearKeyWord">
              
                <input type="search" v-model="searchText" placeholder="Please input key word...">
              
            </div>
              </form>
            <span class="cancel"
                  @click="cancel">Cancel</span>
        </section>
        <ul v-show="!searchText" class="country-list-wrap"> 
            <li class="country-list border-1px" v-for="(item, index) of countryList"
                :key="index"
                @click="selectCountry(item)"
                >
                {{item.countryEnName}}
            </li>
        </ul>
        <ul v-show="searchText" class="country-list-wrap">
            <li class="country-result">Search Result</li>
            <li class="country-list border-1px" v-for="(item, index) of countryResult" :key="index"  @click="selectCountry(item)">
                {{item.countryEnName}}
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    data() {
        return {
            searchText: "",   //  搜索的文字
            countryList: []   //  保存国家列表
        };
    },
    computed: {
        //  获得国家
        countryResult() {
            let filterCountryList = [];
            let secrchTextLen;
            if (this.searchText) {
                   secrchTextLen = this.searchText.length;
            }
            for (let value of this.countryList) {
                if (this.searchText.toUpperCase().substr(0)=== (value.countryEnName).toUpperCase().substr(0, secrchTextLen)) {
                   filterCountryList.push({
                       countryId: value.countryId,
                       countryEnName: value.countryEnName,
                       countryCode: value.countryCode
                   });
                }
            }
            return filterCountryList;
        }
    },
    created() {
        // 拉取国家列表数据 
        this.axios.get("/dict/countries.cf?isOrderBySortOrder=1")
            .then((res) => {
                
                this.countryList = res.data.data;
            })
            .catch(() => {
            });
    },
    methods: {
        //  清空国家关键字
        clearKeyWord() {
            this.searchText = "";
        },
        cancel() {
            this.$router.go(-1);
        },
        //  选择并保存国家
        selectCountry(countryInfo) {
            this.$store.commit("RECORD_COUNTRY", countryInfo);
            this.$router.go(-1);
        }
    }
};

</script>


<style lang="stylus" rel="stylesheet/stylus" >
@import "../../../common/stylus/mixin.styl";
     .country-list-wrap
      padding-top: 2.2rem

     .country-result
      background: rgba(0 ,0, 0, .04)
      color: rgba(0 ,0, 0, .86)
      font-size: .8rem
      padding: .4rem

     .country-list
      height: 2.4rem
      line-height: 2.4rem
      background: #fff
      padding-left: .6rem     
      font-size: .8rem
      color: rgba(0,0,0,0.87);
      letter-spacing: -0.81px;
      border-1px-b(rgba(0, 0, 0, .12))
      

     .clear-all
      position: absolute
      top: 50%
      transform: translateY(-50%)
      right: .5rem
      width: 1rem
      height: 1rem

     .cancel
       font-size: .8rem;
       color: rgba(0,0,0,0.54);
       letter-spacing: -0.61px;
       position: absolute
       right: .6rem

     .header 
      background: #FAFAFA 
      height:2.2rem
      line-height: 2.2rem
      border-1px-b(rgba(0, 0, 0, .12))
      position: fixed
      top: 0
      left: 0
      width: 100%
      z-index: 800
      .input-wrap
       height 1.4rem 
       width: 14.5rem
       position: absolute
       top: 50%
       left: .6rem
       transform: translateY(-50%)
       border-radius: 6px;
       &:before
        z-index: -1;
        content:"";
        display: block;
        position: absolute;
        top: -.6px;
        left: -1px;
        width: 201%;
        height: 201%;
        transform-origin: 0 0;
        transform: scale(.5, .5);
        border: 1px solid rgba(0, 0, 0, 0.54);
        border-radius: 4px;
       &.change-left
        left: .6rem 
       input 
        display: block
        font-size: .8rem
        width: 100%
        height: 100%
        padding-left: 1.3rem
        background: #fafafa url("../images/icon_search_light.png") no-repeat .3rem center
        background-size: .7rem .7rem
        font-size: .7rem
        box-sizing: border-box
        -webkit-box-sizing:border-box  
</style>
