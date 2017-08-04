<template>
    <div id="version">
        <v-header title="Version Upgrade"></v-header>
        <div class="version-warp">
           <img src="./images/icon_app.png">
            <p>e-Cantonfair app has a new version, for better experience, we recommend you to upgrade it.</p>
            <button type="button" @click="toUpdate">Upgrade Now</button>
        </div>
    </div>
</template>

<script>
    import header from "components/header"
    export default {
        data() {
            return {}
        },
        methods: {
            toUpdate(){
                window.location.href="http://app.e-cantonfair.com/wap.html";
            }
        },
        components: {
            "v-header": header
        }
    }
</script>

<style lang="stylus" scoped>

#version
    padding-top: 2.2rem

.version-warp
    text-align:center
    > img
        width :22%
        height :22%
        margin-top:3rem
    > p
        width :(590/750*100)%
        margin : 0 auto
        font-family: SFUIText-Regular
        font-size: (28/40)rem
        color: rgba(0,0,0,0.54)
        line-height: 1rem
        margin-top :1.5rem
    > button
        display :block
        margin:0 auto
        text-align :center
        width :46%
        height :(80/40)rem
        line-height :(80/40)rem
        background: #FF0030
        border-radius: 8px
        font-size: (32/40)rem
        color: #FFFFFF
        padding :0
        margin-top :1.5rem
</style>