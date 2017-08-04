
<template>
  <div class="reply-container">

    <!--顶部导航-->
    <c-header title="Reply" :isLeftIcon="false">
          <span slot="left" class="c-header-left-text" @click="cancel">Cancel</span>
          <span slot="right" class="c-header-right-text" @click="checkReplyContent" :style="{'color': active}">Send</span>
    </c-header>
    <!--顶部导航-->

    <textarea class="c-textarea f-boxsizing"
              v-model="replyContent" v-flexText></textarea>
    <span class="reply-textnum">
                {{replyContentNum}} characters remaining
              </span>
    
        <input id="file"
               type="file"
               ref="elFile"
               @change="getImgFiles"
               style="display: none"
               accept="image/*">
         <section class="c-upload-wrap-img reply-upload-wrap-img f-clear">
             <div v-for="(item, index) of uploadImg"
                 :key="index">
                <img src="../images/icon_clean.png"
                     @click="delImg(index)"
                     class="c-upload-del-icon">
                <img :src="imgUrl + item"
                     alt=""
                     class="c-upload-img">
        </div>
         </section>
             <label for="file"
               class="c-upload-btn-reply border-1px">
            <span class="c-upload-plu-icon"></span> Gallery
        </label>

  </div>
</template>

<script>
import {Indicator, Toast} from "mint-ui";
import { localStorage,CFEC } from "common/js/util.js";
import header from "components/header";
export default {
  data() {
    return {
      replyContent: "", //  回复的内容
      fileName: [],     //  上传文件的随机名称
      uploadImg: [],    //  上传图片的路径
      imgUrl: null      //  回显的图片路径
    };
  },
  
  components: {
    "c-header": header
  },

  computed: {
    
    //  回复字数的改变
    replyContentNum() {
      return 2000 - this.replyContent.length;
    },

    //  改变next的颜色
    active() {
      if (this.replyContent) {
        return "#ff0030";
      } else {
        return "rgba(0,0,0,0.26)";
      }
    }
  },

  //  做自适应多行文本框的，现在已不用
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
  methods: {

    //  检查是否有输入
    checkReplyContent() {
      if (!this.replyContent) return;
      if (!this.$route.params.type) {
        this.sendReply();
      } else {
        this.saveInquiry();
      }
    },

    //  发送回复
    sendReply() {
      Indicator.open("Sending...");
       let localToken = JSON.parse(localStorage.get("localUserInfo")).message;
      
      let params = {
        token:localToken,
        receiverId:this.$route.params.receiverId,
        content:this.replyContent,
        messageId:this.$route.params.messageId,
        filePath:this.uploadImg.join(","),
        fileName:this.fileName.join(",")
      };

                    this.axios({
                        method: "post",
                        url: "/message/replyInquiry.cf",
                        params: CFEC.addConfig(params)
                    })
        .then((res) => {
            Indicator.close();
          if (res.data.status==="success") {
            this.replyContent = "";
            this.fileName.length = 0;
            this.uploadImg.length = 0;
            Toast("send successful");
            this.$router.go(-1);
          } else {
            alert(res.data.message);
          }
        })
        .catch(() => {
           Indicator.close();
        });
    },

    //  保存要发送询盘的一些信息
    saveInquiry() {   
      Indicator.open("Sending...");
       let localToken = JSON.parse(localStorage.get("localUserInfo")).message;

      let params = {
        subject: this.$route.params.subject,
        messageTypeId:4,
        procumentId:this.$route.params.messageId,
        token:localToken,
        receiverId:this.$route.params.receiverId,
        content:this.replyContent,
        filePath:this.uploadImg.join(","),
        fileName:this.fileName.join(",")
      };

        this.axios({
                        method: "post",
                        url: "/message/saveInquiry.cf",
                        params: CFEC.addConfig(params)
                    })
        .then((res) => {
              Indicator.close();
             if (res.data.status==="success") {
            this.replyContent = "";
            this.fileName.length = 0;
            this.uploadImg.length = 0;
        
            Toast("send successful");
            this.$router.go(-1);
          } else {
            alert(res.data.message);
          }
        })
        .catch(() => {
           Indicator.close();
        });
    },
    cancel() {
      this.$router.go(-1);
    },
    randowName() {
      let fname = "";
      for (var i = 1; i <= 8; i++) {
        fname += Math.floor((1 + Math.random()) * 0x100)
          .toString(16)
          .substring(1);
      
      }
      fname +=".jpg";
      return fname;
    },

    // 发送图片方法
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
          fd = CFEC.addConfig(fd);
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

  // 删除图片
    delImg(index) {

      this.uploadImg.splice(index, 1);
      this.fileName.splice(index, 1);

    }
  }
};
</script>


<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../../common/stylus/mixins/index.styl"

.reply
 &-container
  padding-top: 2.2rem
 &-upload-wrap-img
  padding: .6rem 0 0 0
 &-textnum
  display:block
  font-size: .6rem;
  color: rgba(0,0,0,0.26);
  letter-spacing: -0.21px;
  line-height: .6rem;
  margin-right: .6rem
  padding-top: .6rem
  text-align right
</style>
