
<template>
    <header class="border-1px">
        <i class="c-head-back"
           @click="back"></i>
        <slot name="title"
              class="c-head-title"></slot>
        <slot name="home" class="c-head-backhome"></slot>
        <slot name="next"></slot>
    </header>
</template>

<script>
export default {
    methods: {
        back() {
            this.$router.go(-1);
        }
    }
};
</script> <style lang="stylus" rel="stylesheet/stylus" scoped></style>
