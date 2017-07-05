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
            To: {{companyName}}
        </section>
    
        <textarea class="inquiry-subject" v-model="inquiryInputTitle" >
        </textarea>
    
        <textarea class="c-textarea f-boxsizing" placeholder="Specify your inquiry here" v-model="textareaText" >
        </textarea>
        <label for="file" class="c-upload-btn-default border-1px">
            <span class="c-upload-plu-icon"></span> Gallery
        </label>
        <input id="file" type="file" ref="elFile" @change="getImgFiles" style="display: none" accept="image/*">
        <section class="c-upload-wrap-img f-clear">
            <div v-for="(item, index) of uploadImg" class="c-upload-wrap-img">
                <img src="./images/icon_clean.png" @click="delImg(index)" class="c-upload-del-icon">
                <img :src="imgUrl+item" alt="" class="c-upload-img">
            </div>
    
        </section>
    
    </div>
</template>

<script>
import { localStorage } from "common/js/util.js";
import { Indicator } from "mint-ui";
import { Toast } from "mint-ui";
import header from "components/header";

export default {
    data() {
        return {
            smallImg: "",
            isLarge: false,
            companyName: "",  //  公司名称
            inquiryInputTitle: "",  //  询盘主题
            uploadImg: [],   // 上传的图片路径
            textareaText: "",  //  多行文本框内容
            userId: "", // 卖家userID
            fileName: [],  //  上传的文件名
            imgUrl: null   // 图片上传成功回显的路径
        };
    },
    components:{
        "c-header": header
    },
    //  做自适应文本框用的自定义指令，目前已不用
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

        //  获得单位
        unit() {
            return this.$store.state.unit;
        },

        //  改变next的颜色
        active() {
            if (this.inquiryInputTitle.replace(/(^\s*)|(\s*$)/g, "") && this.textareaText.replace(/(^\s*)|(\s*$)/g, "")) {
                return "#ff0030";
            } else {
                return "rgba(0,0,0,0.26)";
            }
        }
    },

    created() {
        let _companyName = this.$route.params.companyName;
        this.companyName = _companyName;
        this.inquiryInputTitle = "Inquiry about " + _companyName;
        this.userId = this.$route.params.userId;
    },

    methods: {
        //  上传图片的随机名称
        randowName() {
            let fname = "";
            for (var i = 1; i <= 8; i++) {
                fname += Math.floor((1 + Math.random()) * 0x100)
                    .toString(16)
                    .substring(1);
                fname += ".jpg";
            }
            return fname;
        },

        //  上传文件的方法
        getImgFiles() {

            if (this.uploadImg.length <= 2) {

                Indicator.open("Upload Image");

                let imgFiles = this.$refs.elFile.files;

                let reader = new FileReader();

                let _this = this;

                reader.readAsArrayBuffer(imgFiles[0]);

                reader.onload = function () {

                    let blob = new Blob([this.result]);

                    let fd = new FormData();

                    fd.append("fieldname", blob);

                    _this.axios({

                        method: "post",

                        url: "/fdfsUpload/uploadImage.cf?",

                        data: fd,
                        timeout: 20000

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

                };

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
        //  验证多行文本框
        checkTextareaLen() {
            let canNext = this.inquiryInputTitle.replace(/(^\s*)|(\s*$)/g, "") && this.textareaText.replace(/(^\s*)|(\s*$)/g, "");
            if (canNext) {
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

            let params = {
                content: this.textareaText, // 询盘详细
                messageTypeId: 5, // 店铺询盘Id
                receiverId: this.userId,
                subject: this.inquiryInputTitle, // 主题
                token: localToken,
                appFlag: 1
            };

            this.uploadImg ? params.filePath = this.uploadImg.join(",") : "";
            this.fileName ? params.fileName = this.fileName.join(",") : "";

            this.axios({
                method: "post",
                url: "/message/saveInquiry.cf",
                params: params
            })
                .then((res) => {
                    if (res.data.status === "success") {
                        this.textareaText = "";
                        this.uploadImg.length = 0;
                        this.fileName.length = 0;
                        Toast("Sent Successfully");
                        this.$router.go(-1);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });

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
  padding-top 2.2rem 
 &-receiver
  height: 2.2rem
  line-height: @height
  padding-left: .6rem   
  font-size: .8rem
  color: rgba(0,0,0,0.26)
  letter-spacing: -0.61px  
 &-subject
  width: 100%
  box-sizing: border-box
  -webkit-box-sizing: border-box
  padding:.3rem .6rem
  font-size: .8rem;
  color: rgba(0,0,0,0.87)
  letter-spacing: -0.81px
  background: #fff
</style>