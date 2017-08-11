# 前端架构

## 准备工作

1. 安装nodejs 地址：https://nodejs.org/
2. 安装插件
   - `npm install grunt -g`  自动化工具
   - `npm install grunt-cli -g` （安装grunt命令到）
   - `npm install http-server -g` 简易的http服务
3. 当前项目路径执行 `npm install` 安装项目所需依赖，包括grunt与项目所需的插件


## 启动项目

在当前目录执行 `node app` 就已经启动项目了，在浏览器输入 http://127.0.0.1:3000 就可以访问项目了。     
前端的项目是基于 **express**搭建的，后期要做新页面，需要先在express添加路由，才开始编写，在 `serve/routes` 中添加。


## 前端自动化

前端自动化工程是使用的工具 **grunt**，后续的开发人员最好熟悉下这个工具。  
当前项目只有几个任务：
1. `grunt less` 生成cfec.css 核心css文件
2. `grunt uglify` 合并项目基础的js文件，平时比较少用，带添加新组件时，并添加别名才会使用
3. `grunt cachebuster` 生成文件md5 map表的，用于每次上线时，更新引用静态资源版本号的。
4. `grunt md2html` markdrwn 文件转html 文件， 用于编写文档。


## 前端文档

前端文档使用 **angularjs** 为基础架构，使用http-server为http服务。在当前目录执行 `hs -p 8088` 就已经启动项目了，在浏览器输入 http://127.0.0.1:8088/docs 就可以访问文档了。     


 
## 编写组件

组件使用 **requirejs** 来管理。


```javascript   
   //定义一个模块
    define('dialog', ['jquery'], function(){
      function dialog() {
        ...
      }    
      return dialog    
    })
    

    //引用模块    
    require(['dialog'], function(dialog){
      ...
      // 业务逻辑
    })
    
```

###目前的再用的组件

```
 |- validation  验证插件 官网：http://jqueryvalidation.org/
 |- umeditor 富文本编辑器 官网：http://ueditor.baidu.com/website/umeditor.html
 |- webupload 上传控件  官网：http://fex.baidu.com/webuploader/
 |- cookie  操作cookie 提供3个api .set() 和 .get() .remove()
 |- calendar 日历 官网：http://laydate.layui.com/ 
 |- artTemplate 模板引擎  官网：http://aui.github.io/artTemplate/
 |- avalon  迷你mvvm库  官网：http://avalonjs.github.io/
 |- tips 气泡  官网：http://object505.mit-license.org
 |- select 模拟下拉框
 |- layer 弹窗 官网：http://layer.layui.com/
 |- skype 
 |- superslide 幻灯片 官网：http://www.superslide2.com/
 |- jqzoom 放大镜 参考网站：http://www.cnblogs.com/kissdodog/archive/2012/12/15/2819887.html
 |- selectCategory 类目选择  参考文件：\home\js\buyFavoSet.js

```



## 一些项目的svn地址

###老平台项目
国际站: http://192.168.10.121/svn/en_cantonfair/branches
用户中心（大C）：http://192.168.10.121/svn/cfec-c/branches
cfone：http://192.168.10.121/svn/cantonpm/branches/code/cfone
中文站：http://192.168.10.7/svn/website_cn/trunk/code/source
专题：http://192.168.10.7/svn/cantonpm/code/java/trunk/cms

###新品台项目
前端-开发版：http://192.168.10.121/svn/new_platform_temp/assets
前端-稳定版（用于上线的）：http://192.168.10.121/svn/tnp/frontend/branches/frontend
oms-前端：http://192.168.10.121/svn/tnp/fpage/branches/pubpage
cms：http://192.168.10.121/svn/tnp/cms/branches/cms