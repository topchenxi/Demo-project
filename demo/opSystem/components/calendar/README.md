﻿## 说明
laydate.js是压缩后的核心代码，laydate.dev.js是开发版的源代码。

need目录存放着核心css

skins是皮肤目录

将laydate pull到你的本地后，将其存放到您js相关目录下的laydate目录，不要改动laydate的结构，否则无法正常运行。

## 愿景
做全球最好的web日期控件。


## 简要
她基于原生JavaScript精心雕琢，兼容了包括IE6在内的所有主流浏览器。她具备优雅的内部代码，良好的性能体验，和完善的皮肤体系，并且完全开源，你可以任意获取开发版源代码，一扫某些传统日期控件的封闭与狭隘。layDate本着资源共享的开发者精神和对网页日历交互无穷的追求，延续了layui一贯的简单与易用。她遵循LGPL协议，您可以免费将她用于任何个人项目。

## 更新日志

1.1

1. layer.now(timestamp,format)支持多类型参数。timestamp支持今天的前若干天，和今天的后若干天，并且如果是一个有效的时间戳,则返回该时间戳对应的日期。如果什么都没传入，则返回当前时间日期。format为日期格式，为空时则采用默认的“-”分割。
2. 优化核心代码。
3. 分和秒的选择改成10列*6行。
4. 修复星期未居中对齐的样式问题
5. 修复在页面加载完毕事件中，调用laydate所造成的立即执行的bug
6. 皮肤包新增[墨绿]。

## 备注
[官网](http://sentsin.com/layui/laydate/)、[Say交流](http://say.sentsin.com/home-58.html)

## 2016-07-22 更新 by ken
新增 enabledMark 参数字段，主要用于禁用某区间日期不能选择，如不加这个参数则laydate为默认日期选择器。

example:
var start = {
    elem: '#startTime',
    enabledMark:[
        {
            start:'2016-06-22', //禁用区间开始日期
            end:'2016-06-26',  //禁用区间结束日期
            enabledText:'售罄'  //禁用区间日期底部显示的文本，该参数可加可不加
        }
    ],
    choose: function(data) {
        // choose date
    },
    clear: function() {
        // clear date
    }
};

laydate(start); // 初始化日期控件