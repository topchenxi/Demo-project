<template>
    <div class="keyword">
        <div class="popular-search">Popular Searches</div>
      
        <span class="popular-text" v-for="item of keyWords1" v-show="searchType===1" @click="searchKeyWord(item)">
            {{item}}
        </span>
         <span class="popular-text" v-for="item of keyWords2" v-show="searchType===2" @click="searchKeyWord(item)">
            {{item}}
        </span>
       
    </div>
</template>
<script>
    export default {
        data() {
            return {
                keyWords1: [],  //  商品关键词
                keyWords2: [],  //  店铺关键词
                copySearchDetial: null
            };
        },
        props: {
            searchType: {
                type: Number
            }
        },
        methods: {
            searchKeyWord(word) {
                this.$store.commit("CHANGE_KEYWORD", word);
                this.$emit("searchKeyWord");
            }
        },
       created() {
            this.axios.get("/home/getLatestHotKeyWords.cf")

                .then((res) => {
                    this.keyWords1 = res.data.data[0].keyword.split(",");
                    this.keyWords2 = res.data.data[1].keyword.split(",");
                })
                .catch(err => console.log(err));
        }
    };

</script>


<style lang="stylus" rel="stylesheet/stylus" scoped>

.popular-search
  height: 2.2rem
  font-size: .7rem
  color: rgba(0, 0, 0, .26)
  letter-spacing: -0.61px
  line-height: 2rem
  padding-left: .6rem

.popular-text
  display: block
  padding: .4rem .5rem
  border: 1px solid rgba(0, 0, 0, 0.12)
  border-radius: 4px
  font-size: .7rem
  color: rgba(0, 0, 0, 0.54)
  letter-spacing: -0.61px
  line-height: 1rem
  float: left
  margin-left: .6rem

.keyword 
 background: #fff
 overflow: hidden
 padding-bottom: .6rem
</style>