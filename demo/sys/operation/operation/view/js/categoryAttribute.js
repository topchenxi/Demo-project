/**
 * Created by Lenovo on 2015/7/6.
 */

var dialog, modify ;

require(['dialog'], function (dialog) {
    var Dialog = dialog.Dialog,
        $ = dialog.$;
    var conf = {
        parent: $('.dialog'),
        customConf: {
            body: {
                attr: "class=\"a\"",                   // 属性
                // content可以为htmp碎片，Dom节点
                content: $('.container').show,                        // 内容
                event: {
                    click: function () {
                    }
                }  // 事件
            }
        }
    }

    dialog = new Dialog(conf);
    modify = $('#modify');
    dialog.init();  // 初始化组件，生成html、绑定事件，执行回调等
    // dialog.show();  // 显示组件
    modify.click(function () {
        dialog.show();
    });
});