<template>
<div v-if="productsDetail" class="products-detail-wrapper">
     <ul class="products-detail-proinfo">
         <li v-if="productsDetail.product.fobPriceFrom" class="border-1px"> <span>FOB Price:</span> <span>US $ {{productsDetail.product.fobPriceFrom}} - {{productsDetail.product.fobPriceTo}} / {{productsDetail.product.fobPriceUnitEnName}}</span></li>
         <li v-if="productsDetail.product.minOrder" class="border-1px"> <span>MOQ:</span> <span>{{productsDetail.product.minOrder}} {{productsDetail.product.minOrderUnitEnName}}</span></li>
         <li v-if="productsDetail.product.monthOrder" class="border-1px"> <span>Monthly Capacity:</span> <span>{{productsDetail.product.monthOrder}} {{productsDetail.product.monthOrderUnitEnName}}</span></li>
         <li v-if="productsDetail.product.shipmentPort" class="border-1px"> <span>Port:</span> <span class="f-ellipsis-2">{{productsDetail.product.shipmentPort}}</span></li>
         <li v-if="productsDetail.product.payments" class="border-1px"> <span>Payment Terms:</span> <span class="f-ellipsis-2">{{productsDetail.product.payments}}</span></li>
    </ul>   
    <ul class="products-detail-shopinfo">
        <li v-if="productsDetail.shopInfo.companyNatureEnName" class="border-1px"><span>Business Type:</span> <span>{{productsDetail.shopInfo.companyNatureEnName}}</span></li>
        <li v-if="productsDetail.shopInfo.companyTypeEnName" class="border-1px"><span>Company Type:</span> <span>{{productsDetail.shopInfo.companyTypeEnName}}</span></li>
        <li v-if="productsDetail.shopInfo.cityEnName" class="border-1px"><span>Country/ Region:</span> <span>{{productsDetail.shopInfo.cityEnName}} {{productsDetail.shopInfo.provinceEnName}}</span></li>
   </ul>
    <ul class="products-detail-property">
        <li v-if="productsDetail.product.propertyList" v-for="(item, index) of productsDetail.product.propertyList" :key="index" class="border-1px"><span>{{item.propertyEnName}}:</span> <span class="f-ellipsis-2">{{item.propertyEnValue}}</span></li>
   </ul>
   <div class="products-detail-productdes border-1px">
       <p class="productdes-title">Product Description:</p>
       <p class="productdes-content f-breakword" v-html="replaceDes"></p>
   </div>
</div>
</template>
<script>

    export default {
        data() {
            return {
                detail:{}
            };
        },
        props: ["productsDetail"],   // 要加判断
        methods: {
            hideDetial() {
                this.$emit("hideDetial");
            },
            defaultStyle(){
                let meta = '<meta charset="utf-8"><meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0, target-densityDpi=device-dpi ,user-scalable=no, minimal-ui" /><meta content="yes" name="apple-mobile-web-app-capable"><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><meta content="black" name="apple-mobile-web-app-status-bar-style">';

                let cssStr = '.wapDetail dl,.wapDetail dt,.wapDetail dd,.wapDetail ul,.wapDetail ol,.wapDetail li,.wapDetail h1,.wapDetail h2,.wapDetail h3,.wapDetail h4,.wapDetail h5,.wapDetail h6,.wapDetail pre,.wapDetail code,.wapDetail form,.wapDetail fieldset,.wapDetail legend,.wapDetail input,.wapDetail textarea,.wapDetail p,.wapDetail blockquote,.wapDetail th,.wapDetail td,.wapDetail hr,.wapDetail button,.wapDetail article,.wapDetail aside,.wapDetail details,.wapDetail figcaption,.wapDetail figure,.wapDetail footer,.wapDetail header,.wapDetail menu,.wapDetail nav,.wapDetail section{margin:0;padding:0;}.wapDetail,.wapDetail *{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;}.wapDetail{font-size:10px;font-family:Helvetica Neue,Helvetica,Roboto,Arial,Lucida Grande,sans-serif;width:100%;}.wapDetailContainer{width:100%;font-size:1.6em;line-height:1.6em;white-space:normal;word-break:break-all;}.wapDetailContainer p{width:100%;display:block;}.wapDetailContainer img{max-width:100%;display:block;}.wapDetailContainer table{width:100%;padding:0;margin:10px 0 10px;border-collapse:collapse;display:table;}.wapDetailContainer table td{vertical-align:top;line-height:1rem;text-align:left;padding:5px 10px;border:1px solid #DDD;word-wrap:break-word;word-break: normal;}';
                
                return meta + '<style>' + cssStr + '</style>';
            },
            filterStyle(str) {
                let that = this;
                // 去除字体相关属性
                let regexpArr = [];
                // 过滤font-family
                regexpArr.push('font-family:[^:|^>]*;');
                // 过滤font-size
                regexpArr.push('font-size:[^:|^>]*;');
                // 过滤 width
                regexpArr.push('width:[^:|^>]*;');
                regexpArr.push('max-width:[^:|^>]*;');
                regexpArr.push('min-width:[^:|^>]*;');
                // 过滤 height
                regexpArr.push('max-height:[^:|^>]*;');
                regexpArr.push('min-height:[^:|^>]*;');
                regexpArr.push('line-height:[^:|^>]*;');
                regexpArr.push('height:[^:|^>]*;');
                // 过滤width/height属性
                regexpArr.push('width=[^=]*"');
                regexpArr.push('height=[^=]*"');

                // 过滤图片 data-src _src 属性
                regexpArr.push('data-src=[^=]*"');
                regexpArr.push('_src=[^=]*"');

                let regexp = eval('/' + regexpArr.join('|') + '/g');
                // 替换图片路径
                let resultStr = str;

                // 匹配所有图片地址入组，并且进行替换
                let imgMatch = /<img[^>]*>/g;
                let imgSrcMatch = /http:\/\/(image|img)\.e-cantonfair\.com\/[^"]*\.(?:png|jpg|bmp|gif)/g;
                let imgArrTemp = str.match(imgMatch);
                if (imgArrTemp) {
                    if (imgArrTemp.length > 0) {
                        let imgArr = [];
                        for (let i = 0; i < imgArrTemp.length; i++) {
                            // if (imgArrTemp[i].match(imgSrcMatch)) {
                            //     let tempSrc = imgArrTemp[i].match(imgSrcMatch)[0];
                            //     let newSrc = that.filterImg(imgArrTemp[i]);
                            //     resultStr = resultStr.replace(tempSrc, newSrc);
                            // }


                            let thisTemp = imgArrTemp[i];
                            if (thisTemp.indexOf('data-src') != -1) {
                                let placeholderSrc = thisTemp.match(/src=[^=]*"/)[0].replace('src="', '').replace('"', '');
                                let attrDataSrc = thisTemp.match(/data-src=[^=]*"/)[0].replace('data-src="', '').replace('"', '');
                                attrDataSrc = that.filterImg(attrDataSrc);
                                let imgStr = String(thisTemp).replace(placeholderSrc, attrDataSrc);
                                resultStr = resultStr.replace(thisTemp, imgStr);
                            } else {
                                if (thisTemp.match(imgSrcMatch)) {
                                    let tempSrc = thisTemp.match(imgSrcMatch)[0];
                                    let newSrc = that.filterImg(thisTemp);
                                    resultStr = resultStr.replace(tempSrc, newSrc);
                                }
                            }
                        }
                    }
                }

                // 过滤css以及指定属性
                resultStr = resultStr.replace(regexp, '').replace('<pre class="gd-desc" style="overflow: hidden;">', '<div class="gd-desc">').replace('</pre>', '</div>').replace(/&nbsp;/g, '').replace(/  /g, '');
                return resultStr;
            },
            // 处理移动端图片地址
            filterImg(_src) {
                var imgTypeMatch = /\.(?:png|jpg|bmp|gif)/;
                var imgSrcMatch = /http:\/\/(image|img)\.e-cantonfair\.com\/[^"]*\.(?:png|jpg|bmp|gif)/g;
                var tempSrc = _src.match(imgSrcMatch)[0];
                var tempImgType = _src.match(imgTypeMatch)[0];
                var newSrc = _src.match(imgSrcMatch)[0].replace(tempImgType, '') + '_750x750_1' + tempImgType;
                if(newSrc.match(/http:\/\/img\.e-cantonfair\.com\//g)){
                    newSrc = newSrc.replace('http://img.e-cantonfair.com/','http://image.e-cantonfair.com/');
                }
                return newSrc;
            }
        },
        computed:{
         replaceDes() {
             let hasDesc,hasWapDesc,htmlStr;
             hasDesc = typeof this.productsDetail.product.productDetail.detailDescription;
             hasWapDesc = typeof this.productsDetail.product.productDetail.detailDescriptionForWap;
             
             if(hasWapDesc != 'undefined'){
                htmlStr = this.productsDetail.product.productDetail.detailDescriptionForWap;
             }else{
                 if(hasDesc != 'undefined'){
                    if(this.productsDetail.product.productDetail.detailDescription.indexOf('wapDetail') != -1){
                        htmlStr = this.productsDetail.product.productDetail.detailDescription;
                    }else{
                        htmlStr = this.defaultStyle();
                        htmlStr += '<div class="wapDetail"><div class="wapDetailContainer">'+this.filterStyle(this.productsDetail.product.productDetail.detailDescription)+'</div></div>';
                    }
                 }else{
                    htmlStr = '';
                 }
             }
             return htmlStr;
         }
        }
    };

</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../../common/stylus/mixins/index.styl"

.products-detail
 &-wrapper
  background: #f3f4f6
  width: 100%
  ul
   background: #fff
   li
    height: 2.4rem  
    font-size: .7rem
    color: rgba(0,0,0,0.87)
    border-1px-t(rgba(0, 0, 0, .12), false)
    letter-spacing: -0.61px
    span
     word-wrap break-word
     word-break: break-word
     padding-right .6rem
     line-height: 1rem
     &:first-child
      color: rgba(0,0,0,0.26)
      display: inline-block
      width: 3.4rem
      line-height: .7rem
      position: absolute
      top:50%
      transform: translateY(-50%)
      padding-left: .6rem
      padding-right: .6rem
     &:nth-child(2)
      position: absolute
      top:50%
      transform: translateY(-50%)
      left: 5.6rem
 &-proinfo,
 &-shopinfo, 
 &-property, 
 &-productdes
  margin-top: .625rem


.products-detail-productdes
 font-size: .7rem;
 color: rgba(0,0,0,0.87)
 letter-spacing: -0.61px
 background: #fff
 border-1px-tb(rgba(0, 0, 0, .12), false)
 .productdes-title
  padding:.6rem 0 0 .6rem
  height: 1.2rem
  line-height: 1rem
  color: rgba(0,0,0,0.26)  
 .productdes-content 
  padding: .2rem .6rem .6rem .6rem
  min-height: 4rem
</style>