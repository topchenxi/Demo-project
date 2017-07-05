<template>
    <div>
        <!--顶部导航-->
        <c-header title="Category"></c-header>
        <!--顶部导航-->
        <ul class="c-cat-ul">
            <router-link :to="'/categorySecond/' + item.categoryId + '/' + item.categoryEname"
                         tag="li"
                         v-for="item of categoryFirst.list"
                         :key="item.categoryId"
                         class="c-cat-item border-1px">
                <span>
                    {{item.categoryEname}}
                </span>
            </router-link>
        </ul>

    </div>
</template>

<script>
import header from "components/header";
import {
    Indicator,
    Toast
} from "mint-ui";
export default {
    data() {
        return {
            categoryFirst: { // 一级类目
                list: []
            }
        };
    },

    components: {
        "c-header": header
    },

    created() {    
        this.fetchCategoryFirst();
    },

    methods: {
        fetchCategoryFirst() {
            //    `/dict/category/search.cf?parentId=${0}`./api/categoriesData
            // ./api/categoriesData
            Indicator.open("Loadig...");
            this.axios.get(`/dict/category/search.cf?parentId=${0}`)
                .then((res) => {
                    Indicator.close();
                    this.categoryFirst.list = res.data.data;
                })
                .catch(() => {
                    Indicator.close();
                    Toast("Network Timeout");
                });
        }
    }

};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>