### Layer组件文档

* 依赖：`require.js` `layer.js` 
* 调用方式：
```
  require(['layer'], function (layer){
        layer.alert('message');
  }
```

### 基础参数
```
 layer.open({
    type: 1,                                //0（信息框，默认）,1（页面层）,2（iframe层）,3（加载层）,4（tips层）

    title :'我是标题'                       //标题
    title: ['文本', 'font-size:18px;'],     //标题
    title: false,                           //不显示标题

    content: '传入任意的文本或html',        //这里content是一个普通的String
    content: $('#id') ,                     //这里content是一个DOM
    content: 'http://sentsin.com',          //这里content是一个URL

    skin: 'demo-class'  ,                   //自定义的弹窗风格
    btn: ['按钮一', '按钮二', '按钮三'],    //设置按钮
    success: function(layero, index){
        console.log(layero, index);
    }，                                     //创建完毕时即执行一些语句，可以通过该回调
    yes: function(index){
        //do something
        layer.close(index);                 //一般设定yes回调，必须进行手工关闭
    },

    offset: 'rb',                           //右下角弹出
    time: 2000,                             //2秒后自动关闭
    shift: 4                                //动画类型
    area: ['420px', '240px'],               //宽高
    closeBtn: false,                        //不显示关闭按钮
    shadeClose: true,                       //开启遮罩关闭
    shade: [0.1, '#fff']                    //0.1透明度的白色背景
  });
```


### 用户文档
* `layer.open(options) `：核心方法--基础弹窗
> 参数说明
  * options - 基础参数

* `layer.alert(content, options, yes) `：普通信息框--类似系统alert，却比alert更灵便
> 参数说明
  * content - 显示在弹出窗口上的内容
  * yes - 执行yes回调方法
  
* `layer.confirm(content, options, yes, cancel) `：询问框--询问框类似系统confirm
> 参数说明
  * cancel - 执行cancel回调方法

* `layer.msg(content, options, end) `：提示框-- 简陋的变化 ，零用户操作
> 参数说明
  * end - 执行end回调方法

* `layer.tips(content, follow, options) `：tips层--不仅占据很少的面积，而且默认还会3秒后自动消失
> 参数说明
  * follow - '#id'

* `layer.close(index)  `：关闭特定层
> 参数说明
  ```
  //当你想关闭当前页的某个层时
  var index = layer.open();
  var index = layer.alert();
  var index = layer.load();
  var index = layer.tips();
  //正如你看到的，每一种弹层调用方式，都会返回一个index
  layer.close(index); //此时你只需要把获得的index，轻轻地赋予layer.close即可
  
  ```

* `layer.closeAll(type)   `：关闭所有层
> 参数说明
  ```
  layer.closeAll(); //疯狂模式，关闭所有层
  layer.closeAll('dialog'); //关闭信息框
  layer.closeAll('page'); //关闭所有页面层
  layer.closeAll('iframe'); //关闭所有的iframe层
  layer.closeAll('loading'); //关闭加载层
  layer.closeAll('tips'); //关闭所有的tips层  

  ```


* `layer.full()、layer.min()、layer.restore()`：手工执行最大小化--用于在自定义元素上触发最大化、最小化和全屏。

