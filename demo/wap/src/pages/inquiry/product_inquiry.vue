<template>
    <div class="inquiry-container">
        <!--顶部导航-->
        <c-header title="Inquiry" :isLeftIcon="false">
             <span slot="left" class="c-header-left-text" @click="cancel">
               Cancel
           </span>
           <span slot="right" class="c-header-right-text" :style="{color: active}" @click="checkTextareaLen">
               Send
           </span>
        </c-header>
        <!--顶部导航-->
        <section class="inquiry-receiver f-ellipsis-1">
            To: {{shopInfo.companyEnName}}
        </section>
    
        <textarea class="inquiry-subject" v-model="inquiryInputTitle">
    
        </textarea>
    
        <section class="inquiry-pro-info f-clear">
    
            <img :src="IMG_URL + smallImg" alt="" class="pro-img">
    
            <div class="inquiry-pro-info-right">
    
                <p class="proname f-ellipsis-2">{{products.name}}</p>
    
                <p v-show="products.fobPriceFrom" class="common"><span class="f-ellipsis-1">FOB:US $ {{products.fobPriceFrom}} - {{products.fobPriceTo}} / {{products.fobPriceUnitEnName}}</span></p>
    
                <p v-show="products.minOrder" class="common"><span class="f-ellipsis-1">MOQ:{{products.minOrder}} {{products.minOrderUnitEnName}}</span></p>
    
                <div class="logo-wrapper"><img :src="LOGO_URL + item" alt="" v-for="item of shopInfo.logo" class="logo-img">
                </div>
            </div>
        </section>
    
        <section class="inquiry-quantity-wrapper f-clear">
            <input type="text" pattern="\d*" class="inquiry-quantity f-boxsizing" v-model.trim="quantity" placeholder="Quantity">
            <router-link to="/unit" class="inquiry-unit border-1px-r f-boxsizing" tag="div">
                <span>{{unit}}</span>
            </router-link>
        </section>
        
        <textarea class="c-textarea f-boxsizing" placeholder="Specify your inquiry here" v-model="textareaText" >
        </textarea>
    
        <label for="file" class="c-upload-btn-default border-1px">
            <span class="c-upload-plu-icon"></span> Gallery
        </label>
    
        <input id="file" type="file" ref="elFile" @change="getImgFiles" style="display: none" accept="image/*">
        <section class="c-upload-wrap-img f-clear">
            <div v-for="(item, index) of uploadImg" :key="index">
                <img src="./images/icon_clean.png" @click="delImg(index)" class="c-upload-del-icon">
                <img :src="imgUrl + item" alt="" class="c-upload-img">
            </div>
        </section>
    
    </div>
</template>

<script>
import { localStorage } from "common/js/util.js";
import { IMG_URL } from "common/js/common";
import { Indicator } from "mint-ui";
import { Toast } from "mint-ui";  
import header from "components/header";

export default {
    data() {
        return {
            smallImg: "",   //  回显的商品图片路径
            isLarge: false,   
            products: {},  //  保存商品信息
            shopInfo: {},  //  保存商品信息
            IMG_URL,   
            LOGO_URL,
            inquiryInputTitle: "",  //  询盘主题
            quantity: "",       //  询盘数量
            uploadImg: [],      //  存放上传的图片
            textareaText: "",   //  多行文本框的内容
            userId: "",     // 卖家userID
            fileName: [],   //  随机的文件名
            imgUrl: null,   //  上传的图片路径  
            productId: this.$route.params.productId  // 获取商品Id
        };
    },
    components: {
        "c-header": header
    },
    // 做自适应的textarea,目前没用上
    directives: {
        flexText: {
           inserted(el) {
                let textareaHeight = parseInt(window.getComputedStyle(el, null).height);
                el.setAttribute("data-height", textareaHeight);
            },
            update(el) {
                if (el.scrollHeight > (parseInt(el.getAttribute("data-height")))) {      
                    el.style.height = "auto";
                    el.style.height = el.scrollHeight + "px";
                }  
            }
        }
    },
    computed: {
        //  获取单位
        unit() {
            return this.$store.state.unit;
        },
        //  改变next颜色
        active() {
            if (this.inquiryInputTitle && this.quantity && this.textareaText) {
                return "#ff0030";
            } else {
                return "rgba(0,0,0,0.26)";
            }
        }
    },

    activated() {
        // 获取商品ID
        this.productId = this.$route.params.productId;
    },

    watch: {
        // 检测商品Id变化
        productId(newId) {
            this.fetchProductInfo(newId);
        }
    },

    created() {
        // 拉取商品信息
        this.fetchProductInfo(this.productId);
    },

    methods: {
        // 上传图片的随机名称
        randowName() {
            let fname = "";
            for (var i = 1; i <= 8; i++) {
                fname += Math.floor((1 + Math.random()) * 0x100)
                    .toString(16)
                    .substring(1);

            }
            fname += ".jpg"
            return fname;
        },
        // 拉取商品信息的方法
        fetchProductInfo(_productId) {
            this.axios.get(`/search/toProductDetail.cf?productId=${_productId}`)
                .then((res) => {
                    let product = res.data.data.product;
                    let shopInfo = res.data.data.shopInfo;

                    this.$set(this.products, "name", product.name);
                    this.$set(this.products, "fobPriceFrom", product.fobPriceFrom);
                    this.$set(this.products, "fobPriceTo", product.fobPriceTo);
                    this.$set(this.products, "fobPriceUnitEnName", product.fobPriceUnitEnName);
                    this.$set(this.products, "minOrder", product.minOrder);
                    this.$set(this.products, "minOrderUnitEnName", product.minOrderUnitEnName);
                    this.$set(this.products, "sellerId", product.sellerId);
                    this.$set(this.shopInfo, "companyEnName", shopInfo.companyEnName);
                    this.inquiryInputTitle = "Inquiry about " + product.name;
                    this.userId = product.userId; // 卖家userID
                    try {
                        this.smallImg = product.imgs.split(",")[0];
                        this.$set(this.shopInfo, "logo", shopInfo.logo.split(","));

                    } catch (err) { }
                })

                .catch((err) => {

                    console.log(err);

                });
        },
        // 上传文件方法
        getImgFiles() {

            if (this.uploadImg.length <= 2) {

                Indicator.open("Upload Image");

                let imgFiles = this.$refs.elFile.files;

                // let reader = new FileReader();

                let _this = this;

                // reader.readAsArrayBuffer(imgFiles[0]);

                // reader.onload = function () {

                // let blob = new Blob([this.result]);

                let fd = new FormData();

                fd.append("file", imgFiles[0]);

                _this.axios({
                    method: "post",
                    url: "/fdfsUpload/uploadImage.cf?",
                    data: fd,
                    timeout: 60000
                })

                    .then((res) => {
                        _this.imgUrl = res.data.data.abslouteUrl;
                        _this.uploadImg.push(res.data.data.url);
                        _this.fileName.push(_this.randowName());
                        Indicator.close();

                    })

                    .catch(() => {

                        Indicator.close();
                        Toast("Network Timeout");

                    });

                // };

            } else {
                alert("The maximum number of photos is 3");
            }
        },
        
        // 删除文件
        delImg(index) {

            this.uploadImg.splice(index, 1);
            this.fileName.splice(index, 1);

        },

        // 登录验证
        ifLogin() {
            if (localStorage.get("localUserInfo")) {
                this.sendInquiry();
            } else {
                this.$router.push("/login");
                this.$store.commit("BACK_LOGIN", false);
            }
        },

        //  检查多行文本框
        checkTextareaLen() {
            let canSend = this.inquiryInputTitle.replace(/(^\s*)|(\s*$)/g, "") && this.quantity && this.textareaText;

            if (canSend) {

                if (this.textareaText.replace(/(^\s*)|(\s*$)/g, "").length < 20 || this.textareaText.replace(/(^\s*)|(\s*$)/g, "").length > 8000) {
                    alert("Please enter the description (20-8000 characters).");
                } else {
                    this.ifLogin();
                }
            }
        },

         //  发送询盘
        sendInquiry() {

            let localToken = JSON.parse(localStorage.get("localUserInfo")).message;

            if (this.inquiryInputTitle && this.quantity && this.textareaText) {
                let params = {
                    appFlag: 2,
                    content: this.textareaText,
                    messageTypeId: 1,
                    productId: this.$route.params.productId,
                    totalNum: this.quantity,
                    unit: this.$store.state.unit,
                    receiverId: this.userId,
                    subject: this.inquiryInputTitle,
                    token: localToken,
                    filePath: this.uploadImg.join(','),
                    fileName: this.fileName.join(',')
                }

                this.axios({
                    method: "post",
                    url: "/message/saveInquiry.cf",
                    params: params
                })
                    .then((res) => {
                        if (res.data.status === "success") {
                            this.textareaText = "";
                            this.quantity = "";
                            this.uploadImg.length = 0;
                            this.fileName.length = 0;
                            this.$router.go(-1);
                            Toast("Sent Successfully");
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        },

        cancel() {
            this.$router.go(-1);
        }

    }

};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixins/index.styl"
.inquiry
 &-container
  padding-top: 2.2rem
 &-receiver
  height: 2.2rem
  line-height: @height
  padding-left: .6rem   
  font-size: .7rem
  color: rgba(0,0,0,0.26)
  letter-spacing: -0.61px
 &-subject
  width: 100%
  box-sizing: border-box
  -webkit-box-sizing: border-box
  padding:.3rem .6rem
  margin-bottom:.6rem
  font-size: .8rem;
  color: rgba(0,0,0,0.87)
  letter-spacing: -0.81px
  background: #fff
 &-pro-info 
  display: flex
  height: 5.3rem
  padding: .6rem
  margin-bottom: .6rem
  background: #fff
  .pro-img
   grid-size(5rem)
   float: left
  &-right
   padding-left: .6rem 
   .proname
    font-size: .7rem;
    color: rgba(0,0,0,0.87);
    letter-spacing: -0.61px;
    line-height: 1rem;
   .common
    font-size: .7rem;
    color: rgba(0,0,0,0.54);
    letter-spacing: -0.61px;
    line-height: 1rem;
   .logo-wrapper
    padding-top: .3rem 
   .logo-img
    grid-size(.8rem)
    & + .logo-img
     margin-left .4rem
 &-quantity-wrapper
  background: #fff
 &-quantity
  width: 50%
  height: $cell-height
  padding: 0 .6rem
  font-size: .8rem
 &-unit
  height: $cell-height
  width: 50%
  padding: 0 .6rem 
  margin-right: .6rem
  margin-left: -.6rem
  float: right
  font-size: .8rem
  color: rgba(0,0,0,0.87)
  line-height @height
  letter-spacing: -0.81px
  background: url("./images/icon_list_arrow.png") no-repeat right center
  background-size: .8rem 1.2rem
  border-1px-l(rgba(0, 0, 0, .12), false, 60%, 50%)

</style>