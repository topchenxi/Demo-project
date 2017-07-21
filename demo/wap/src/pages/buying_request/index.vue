
<template>
    <div class="buying-request-container">
       <!--顶部导航-->
        <c-header title="Post Buying Request" :isLeftIcon="false">
           <span slot="left" class="c-header-left-text" @click="cancel">
               Cancel
           </span>
           <span slot="right" class="c-header-right-text" :style="{color: nextColor}" @click="checkTextArea">
               Next
           </span>
        </c-header>
     <!--顶部导航-->
     
        <section class="buying-request-main">
            <div class="pro-name-wrap">
                <input type="text" class="buying-request-pro-name f-boxsizing" placeholder="Product Name" v-model="productName" @input="checkChinese">
                <img @click="delSubject" v-show="cleanSubject" src="./images/icon_clean.png" alt="">
            </div>
    
            <!--数量和单位-->
            <div class="buying-request-quantity-wrapper f-clear border-1px" v-show="!isMoq">
                <input type="text" pattern="\d*" class="buying-request-quantity f-boxsizing" v-model="quantity" placeholder="Quantity">
    
                <router-link to="/unit" class="buying-request-unit border-1px-r f-boxsizing" tag="div">
                    {{unit}}
                </router-link>
            </div>
            <!--moq-->
            <div class="buying-request-moq-wrap border-1px">
                <span>MOQ</span><mt-switch class="buying-request-moq-switch f-vermiddle" v-model="isMoq" @change="moqHandle"></mt-switch>
            </div>

            <!--类目-->
            <div class="buying-request-common-warpper border-1px">
    
                <div class="buying-request-common-title f-boxsizing">Category</div>
    
                <router-link :to="'/chooseCategory/' + productName" class="buying-request-common-choose f-boxsizing f-ellipsis-1" tag="div">
    
                    {{categoryName}}
    
                </router-link>
    
            </div>
            <!--时间选择器-->
            <div class="buying-request-common-warpper border-1px">
    
                <div class="buying-request-common-title f-boxsizing">Valid Time</div>
    
                <div class="buying-request-common-choose f-boxsizing" @click="visible=true">
                    {{validTimeYear}}-{{validTimeMonth}}-{{validTimeDays}}
                </div>
    
            </div>
    
            <!--多行文本框-->
            <textarea class="c-textarea f-breakword f-boxsizing" placeholder="For best quotes.please provide details like product specifications,usages,etc." v-model="textareaText"></textarea>
            <label for="file" class="c-upload-btn-default border-1px">
                <span class="c-upload-plu-icon"></span> Gallery
    
            </label>
    
            <input id="file" type="file" ref="elFile" @change="getImgFiles" style="display: none" accept="image/*">
    
            <section class="c-upload-wrap-img f-clear">
                <div v-for="(item, index) of uploadImg">
                    <img src="./images/icon_clean.png" @click="delImg(index)" class="c-upload-del-icon">
                    <img :src="imgUrl+item" alt="" class="c-upload-img">
                </div>
            </section>
    
            <mt-popup v-model="visible" position="bottom">
    
                <mt-picker :slots="dateSlots" defaultIndex=2 @change="dataChange" :visible-item-count="5" ref="picker" show-toolbar>
    
                    <span class="mint-popup-cancel" @click="visible=false">Cancel</span>
    
                    <span class="mint-popup-done" @click="validTimeConfirm">Done</span>
    
                </mt-picker>
    
            </mt-popup>
    
        </section>
    
    </div>
</template>

<script>

import { Indicator, Toast } from "mint-ui";
import header from "components/header";

// 时间选择器
let date = new Date();
let currentMonth = date.getMonth();
let currentYear = date.getFullYear();
let currentDay = date.getDate();

const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const year = ["2015", "2016", "2017", "2018", "2019", "2020"];
const days = [];

let currentYearIndex = year.indexOf(String(currentYear));

for (let i = 1; i < 32; i++) {
    days.push(i);
}

let currentDaysLen = days.indexOf(currentDay);

export default {
    data() {
        return {
            pickerValue: "",  // 选择器的值
            quantity: "",    // 数量 
            productName: "", //  商品名
            textareaText: "",  // 多选框
            uploadImg: [],  //  上传的图片路径
            fileName: [],   //  上传的文件名称
            visible: false,  
            currentYear: "", // 初始年份
            validTimeYear: currentYear,
            validTimeMonth: currentMonth + 2,
            validTimeDays: currentDay,
            _validTimeYear: currentYear,
            _validTimeMonth: currentMonth + 1,
            _validTimeDays: currentDay,
            isChange: false, // 是否触发选择器
            imgUrl: null, 
            isClean:false,  
            isMoq: false   
        };
    },

    components: {
        "c-header": header
    },

    computed: {
        // 清空主题
        cleanSubject() {
            if (this.productName.replace(/(^\s*)|(\s*$)/g, "")) {
                return true;
            } else {
                return false;
            }
        },
        // 改变next的颜色
        nextColor() {

            if ((this.quantity || this.isMoq) && this.productName && this.textareaText && this.categoryId) {
                return "#ff0030";
            } else {
                return "rgba(0,0,0,0.2)";
            }
        },
        // 获得单位
        unit() {
            return this.$store.state.unit;
        },
        //  获得类目名称
        categoryName() {
            return this.$store.state.categoryName;
        },
        // 获得类目Id
        categoryId() {
            return this.$store.state.categoryId;
        },
        // mint-ui的日期组件配置
        dateSlots() {
            return [{
                flex: 1,
                values: month,
                className: "slot1",
                defaultIndex: currentMonth + 1,
                textAlign: "center"
            },
            {
                flex: 1,
                values: days,
                defaultIndex: currentDaysLen,
                className: "slot3",
                textAlign: "center"
            },
            {
                flex: 1,
                values: year,
                className: "slot3",
                defaultIndex: currentYearIndex,
                textAlign: "center"
            }
            ];
        }
    },
    // 重置页面
    activated() {
        if (this.$store.state.requestStatus) {
            this.isMoq = false;
            this.quantity = "";
            this.productName = "";
            this.textareaText = "";
            this.uploadImg.length = 0;
            this.fileName.length = 0;
            this.validTimeYear = currentYear;
            this.validTimeMonth = currentMonth + 2;
            this.validTimeDays = currentDay;
            this.$store.commit("RECORD_REQUEST_CATEGORY", { categoryName: "Please choose a category", categoryId: null });
            this.$store.commit("SEND_REQUEST_SUCCESS", false);
            this.$store.commit("CLEAR_PROPERIES");
        };
    },
    // 自定义指令，用来做自适应的textarea，目前用不着
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
        // 删除主题
        delSubject(el) {
        this.productName = "";
    },
        //  不让输入中文
        checkChinese() {
            if (/[\u4e00-\u9fa5]/.test(this.productName)) {
                this.productName = "";
            }
        },
        cancel() {
            // 首页入口、采购需求管理入口
            this.$route.params.from ? this.$router.go(-1) : this.$router.replace("/home");
            this.$store.commit("REFRESH_REQUEST", 2);
        },
        // 检查textarea的输入
        checkTextArea() {
            let canNext = (this.quantity || this.isMoq) && this.productName && this.textareaText && this.categoryId;

            if (canNext) {

                if (this.textareaText.replace(/(^\s*)|(\s*$)/g, "").length > 19 && this.textareaText.replace(/(^\s*)|(\s*$)/g, "").length < 8000) {
                    this.next();
                } else {
                    alert("Please enter the product description (20-8000 characters).");
                }
            }
        },
        //  进入选择属性页
        next() {

            // boolean 转 0,1
            let moqParams;
            if (this.isMoq) {
                moqParams = 1;
            } else {
                moqParams = 0;
            }
            
            let requsetParams = {
                procurementStr: {
                    moq: moqParams,
                    expectNum: this.quantity,
                    endTimeStr: `${this.validTimeYear}-${this.validTimeMonth}-${this.validTimeDays}`,
                    productName: encodeURI(this.productName),
                    productDes: encodeURI(this.textareaText)

                },
                appFlag: 2
            };
            this.uploadImg ? requsetParams.procurementStr.attachmentUrl = this.uploadImg.join(",") : "";
            this.fileName ? requsetParams.procurementStr.attachmentName = this.fileName.join(",") : "";
            this.isMoq ? requsetParams.procurementStr.expectUnit = "" : requsetParams.procurementStr.expectUnit=this.unit;
            this.$store.commit("RECORD_REQUEST_PARAMS", requsetParams);
            this.$router.push("/attributeList");
        },
        // 获得时间
        validTimeConfirm() {
            this.visible = false;
            if (this.isChange) {
                this.validTimeYear = this._validTimeYear;
                this.validTimeMonth = month.indexOf(this._validTimeMonth) + 1;
                this.validTimeDays = this._validTimeDays;
            }
        },
        // 是否是平润年
        isLeapYear(year) {
            return (year % 400 === 0) || (year % 100 !== 0 && year % 4 === 0);
        },
        // 大月和小月
        isShortMonth(month) {
            return [4, 6, 9, 11].indexOf(month) > -1;
        },
        //  获取不同月份的天数
        getMonthEndDay(year, month) {
            if (this.isShortMonth(month)) {
                return 30;
            } else if (month === 2) {
                return this.isLeapYear(year) ? 29 : 28;
            } else {
                return 31;
            }
        },

        // 有效时间选择器   
        dataChange(picker, values) {
            this.isChange = true; 

            if ((month.indexOf(values[0]) < currentMonth) && (values[2] <= currentYear)) {
                picker.setSlotValue(0, month[currentMonth]);
            }
            if ((values[2] < currentYear) || (values[2] > currentYear + 1)) {
                picker.setSlotValue(2, year[currentYearIndex]);
            }

            if ((values[1] < currentDay && (values[2] <= currentYear) && (currentMonth === month.indexOf(values[0]))) || values[1] > this.getMonthEndDay(values[2], month.indexOf(values[0]) + 1)) {
                currentDaysLen = days.indexOf(this.getMonthEndDay(values[2], month.indexOf(values[0]) + 1));
                picker.setSlotValue(1, days[currentDaysLen]);
            }
            this._validTimeYear = values[2];
            this._validTimeMonth = values[0];
            this._validTimeDays = values[1];
        },
        //  上传文件的随机名字
        randowName() {
            let fname = "";
            for (var i = 1; i <= 8; i++) {
                fname += Math.floor((1 + Math.random()) * 0x100)
                    .toString(16)
                    .substring(1);
            }
            fname += ".jpg";
            return fname;
        },
        handleConfirm(value) {
            // alert(value);
        },
        //  上传文件并获得相应url
        getImgFiles() {
            if (this.uploadImg.length <= 7) {
                Indicator.open("Upload Image");
                let imgFiles = this.$refs.elFile.files;
                // let reader = new FileReader();
                let _this = this;
                // reader.readAsArrayBuffer(imgFiles[0]);
                // reader.onload = function () {
                // let blob = new Blob([this.result]);
                let fd = new FormData();
                fd.append("file", imgFiles[0]);
                fd.append('appFlag',2);
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
                alert("The maximum number of photos is 8");
            }
        },
        // 删除文件
        delImg(index) {
            this.uploadImg.splice(index, 1);
            this.fileName.splice(index, 1);
        },

      // 防止选moq之前写了数量
        moqHandle() {
         
            if (this.isMoq) {
                this.quantity = "";
            }

        }
    }

};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../common/stylus/mixins/index.styl"

.buying-request
 &-container
  padding-top: 2.8rem
 &-main
  input
   height: $cell-height
  .pro-name-wrap
   background: #fff
   img
    width: 1.4rem
    height: 1.4rem
    position relative
    top: .44rem
 &-pro-name  
  width: 16.8rem
  padding: 0 0 0 $left-24
  font-size: .8rem
  letter-spacing: -0.81px
 &-quantity-wrapper
  background: #fff
  border-1px-t(rgba(0, 0, 0, .12), false)
 &-quantity
  width: 50%
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
  border-1px-l(rgba(0, 0, 0, .12), false)
 &-common-warpper
  height: $cell-height 
  line-height: @height
  background: #fff
  border-1px-t(rgba(0, 0, 0, .12), false)
 &-common-title
  width: 22%
  font-size: .8rem
  padding-left: .6rem
  white-space: nowrap
  float: left
 &-common-choose
  width: 78%
  padding:0 1.2rem 0 .6rem
  margin-right: .6rem
  margin-left: -.6rem
  float: right
  font-size: .8rem
  color: rgba(0, 0, 0, .54)
  text-align right
  background: url("./images/icon_list_arrow.png") no-repeat right center
  background-size: .8rem 1.2rem
 &-moq-wrap
  height: $cell-height
  line-height: @height 
  background: #fff
  border-1px-t(rgba(0, 0, 0, .12), false)   
  span
   font-size: .8rem
   padding-left: .6rem
 &-moq-switch
   right: .6rem
  
</style>
