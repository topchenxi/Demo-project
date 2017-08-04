<template>
    <div>
        <!--顶部导航-->
        <c-header :title="categoryEname"></c-header>
        <!--顶部导航-->
        <ul class="c-cat-ul">
            <li class="c-cat-item border-1px"
                @click="adjustRouter(item.categoryEname, item.categoryId)"
                v-for="item of categoryThird.list"
                :key="item.categoryId">
                <span>
                    {{item.categoryEname}}
                </span>               
            </li>
        </ul>
    </div>
</template>

<script>
import header from "components/header";
import {CFEC} from "common/js/util.js";
import {
    Indicator,
    Toast
} from "mint-ui";
export default {
    data() {
        return {
            categoryThird: {    //  三级类目
                list: []
            },
            categoryId: this.$route.params.categoryId // 类目ID
        };
    },
    components: {
        "c-header": header
    },

    computed: {
        // 获取类目名称
        categoryEname() {
            return this.$route.params.categoryEname;
        }
    },

    created() {
        // 获取三级类目
        this.fetchCategoryThird(this.categoryId);
    },

    activated() {
        // 从路由获取类目ID
        this.categoryId = this.$route.params.categoryId;
    },

    watch: {
        // 监控类目Id变化
        categoryId(newId) {
            this.fetchCategoryThird(newId);
        }
    },

    methods: {
        // 获取三级类目
        fetchCategoryThird(categoryId) {
            Indicator.open("Loading");
            let params = {
                parentId:categoryId
            }
            this.axios({
                method:'get',
                url:'/dict/category/search.cf',
                params:CFEC.addConfig(params)
            })
                .then((res) => {
                    this.$nextTick(() => {
                        Indicator.close();
                        this.categoryThird.list = res.data.data;
                    });
                })
                .catch(() => {
                    Indicator.close();
                    Toast("Network Timeout");
                });

        },
        // 路由调整 检查是否是末级类目
        adjustRouter(_categoryEname, _categoryId) {
            let categoryInfo = {
                categoryName: _categoryEname,
                categoryId: _categoryId
            };

            if (this.$store.state.flag_categoryEntry) {
                this.$store.commit("RECORD_REQUEST_CATEGORY", categoryInfo);
                this.$router.push("/buyingRequest");
            } else {
                this.$router.push("/categorySearch/" + _categoryId + "/" + _categoryEname);
            }
        }
    }
};
</script>


<style lang="stylus" rel="stylesheet/stylus" scoped></style>