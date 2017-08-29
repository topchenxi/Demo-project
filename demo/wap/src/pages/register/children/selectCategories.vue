<template>
    <div class="select-cate-warp">
        <header class="border-1px">
            <span @click="cancel" class="c-head-cancel f-vermiddle">Cancel</span>
            <span class="c-head-title f-cenmiddle">Sourcing Preference</span>
        </header>
        <ul class="categories-list-warp">
            <li v-for="item of showList" @click="select(item)">
                <span class="text">{{item.categoryEname}}</span>
                <span class="checked-icon" v-if="item.isSelected"></span>
            </li>
        </ul>
        <section v-if="!isShowMore" ref="showWarp" class="tips-warp" @click="showMore">
            <p>Click or Drag Up to Load More</p>
        </section>
        <section class="submit-warp">
            <button type="button" @click="saveInfo">Confirm</button>
        </section>
    </div>
</template>

<script>
    import {
        CFEC
    } from 'common/js/util';
    export default {
        data() {
            return {
                searchText: "",
                categoriesList: [],
                showList: [],
                isShowMore: false
            };
        },
        computed: {
            hasSelectList() {
                return this.$store.state.selectCategories;
            }
        },
        created() {
            let params = {};
            this.axios({
                method: 'get',
                url: '/dict/productTypes.cf',
                params: CFEC.addConfig(params)
            }).then(res => {
                if (res.data.status === "success") {
                    this.categoriesList = res.data.data;
                    // recommendProductTypes 默认显示最近类目
                    // moreProductTypes 显示更多类目
                    this.showList = this.categoriesList.recommendProductTypes;
                    this.setList();
                } else {
                    console.log('error2');
                }
            })
        },
        methods: {
            saveInfo() {
                this.$store.commit('setSelectCategories', this.hasSelectList);
                this.$router.go(-1);
            },
            select(item) {
                if (this.hasSelectList.length === 3 && !item.isSelected) {
                    alert('Please choose maximun 3 industries');
                    return;
                }
                item.isSelected = !item.isSelected;
                if (item.isSelected) {
                    this.hasSelectList.push(item);
                } else {
                    this.hasSelectList.forEach((sItem, index) => {
                        if (sItem.categoryId === item.categoryId) {
                            this.hasSelectList.splice(index, 1);
                            return false;
                        }
                    })
                }
            },
            showMore() {
                this.showList = this.categoriesList.moreProductTypes;
                this.setList();
                this.isShowMore = true;
            },
            cancel() {
                this.$router.replace('register');
                this.$store.commit('setSelectCategories');
            },
            setList() {
                if (!this.showList.length) return;
                let isInArray = item => {
                    if (!this.hasSelectList.length) return false;
                    for (let i = 0, len = this.hasSelectList.length; i < len; i++) {
                        let sItem = this.hasSelectList[i];
                        if (sItem.categoryId == item.categoryId) {
                            return true;
                        }
                    }
                }
                this.showList.forEach(item => {
                    let flag = isInArray(item);
                    this.$set(item, 'isSelected', flag);
                })
            }
        },
        mounted() {
            let dragNode = this.$refs.showWarp;
            function GetSlideAngle(dx, dy) {
                return Math.atan2(dy, dx) * 180 / Math.PI;
            }
            function GetSlideDirection(startX, startY, endX, endY) {
                let dy = startY - endY;
                let dx = endX - startX;
                let result = 0;
                if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
                    return result;
                }
                let angle = GetSlideAngle(dx, dy);
                if (angle >= 45 && angle < 135) {
                    result = 1;
                }
                return result;
            }
            let startX, startY;
            dragNode.addEventListener('touchstart', e => {
                startX = e.touches[0].pageX;
                startY = e.touches[0].pageY;
            }, false);
            dragNode.addEventListener('touchend', e => {
                let endX, endY;
                endX = e.changedTouches[0].pageX;
                endY = e.changedTouches[0].pageY;
                let direction = GetSlideDirection(startX, startY, endX, endY);
                if (direction === 1) {
                    this.showMore();
                    this.isShowMore = true;
                }
            }, false);
        }
    }
</script>

<style lang="stylus">

    @import "../../../common/stylus/mixin.styl";
    
    .select-cate-warp
        padding-top:2.8rem

    .categories-list-warp
        li
            display:block
            position:relative
            height:2.4rem
            line-height:2.4rem
            background-color:#fff
            padding-left:.6rem
            border-1px-b(rgba(0, 0, 0, .12))
            .text
                color:#333
                font-size:0.8rem
            .checked-icon
                position:absolute
                display:inline-block
                right:0.8rem
                top:0.7rem
                width:1rem
                height:1rem
                background:transparent url('../images/icon_checked.png') 0 0 no-repeat
                background-size: 1rem 1rem
    
    .tips-warp
        background:transparent
        height:15rem
        padding-top:1.2rem
        p
            width:100%
            color:#999
            font-size:0.8rem
            text-align:center
    
    .submit-warp
        position:fixed
        bottom:0
        left:0
        width:100%
        z-index:801
        background-color:#fff
        height:2.2rem
        line-height: 2.2rem
        button
            color:#fff
            margin:0 auto
            width:95%
            border-radius:5px
            background-color:#e50000
            padding:0
            height:1.8rem
            line-height:1.8rem
            display:block
            text-align:center
            font-size:.8rem
            margin-top:.2rem

</style>