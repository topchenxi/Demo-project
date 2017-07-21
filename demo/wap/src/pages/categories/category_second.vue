<template>
    <div>
        <!--顶部导航-->
        <c-header :title="categoryEname"></c-header>
        <!--顶部导航 -->
        <ul class="c-cat-ul">
            <li @click="adjustRouter(item.categoryEname, item.categoryId, item.isBottom)"
                v-for="item of categorySecond.list"
                :key="item.categoryId"
                class="c-cat-item border-1px">
                <span>
                    {{item.categoryEname}}
                </span>
            </li>
        </ul>
    </div>
</template>

<script>
import header from "components/header";
import { Indicator, Toast } from "mint-ui";
export default {
    data() {
        return {
            categorySecond: { // 二级类目
                list: []
            },
            categoryId: this.$route.params.categoryId // 类目ID
        };
    },
    computed: {
        //  获取类目名称
        categoryEname() {
            return this.$route.params.categoryEname;
        }

    },

    components: {
        "c-header": header
    },
    created() {
        this.fetchCategorySecond(this.categoryId);
    },
    activated() {
        this.categoryId = this.$route.params.categoryId;
    },
    watch: {
        categoryId(newId) {
            this.fetchCategorySecond(newId);
        }
    },
    methods: {
        // 获取二级类目
        fetchCategorySecond(categoryId) {
            Indicator.open("Loading");
            this.axios({
                method:'get',
                url:'/dict/category/search.cf',
                params:{
                    parentId:categoryId,
                    appFlag:2
                }
            })

                .then((res) => {
                    this.$nextTick(() => {
                        Indicator.close();
                        this.categorySecond.list = res.data.data;

                    });

                })

                .catch(() => {
                    Indicator.close();
                    Toast("Network Timeout");

                });

        },
        // 检查是否是末级类目
        adjustRouter(_categoryEname, _categoryId, _isBottom) {

            let categoryInfo = {

                categoryName: _categoryEname,

                categoryId: _categoryId

            };

            if (this.$store.state.flag_categoryEntry && _isBottom) {

                this.$store.commit("RECORD_REQUEST_CATEGORY", categoryInfo);

                this.$router.push("/buyingRequest");

            } else if (!this.$store.state.flag_categoryEntry && _isBottom) {
                
                this.$router.push("/categorySearch/" + _categoryId + "/" + _categoryEname);

            } else {

                this.$router.push("/categoriesThird/" + _categoryId + "/" + _categoryEname);

            }

        }

    }

};
</script>


<style lang="stylus" rel="stylesheet/stylus" scoped></style>