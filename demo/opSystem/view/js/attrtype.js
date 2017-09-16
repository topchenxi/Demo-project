/**
 * Created by Lenovo on 2015/7/6.
 */


// dialog
require(["dialog"],function(dialog){
    var $ = dialog.$,
        Dialog = dialog.Dialog,
        d;
	var currentLi = null;

    d = new Dialog({
        parent : $('#dialog'),
        customConf : {
            header : {attr: "",content: "",event:{}},
            body : {attr : "", content: $('.dialog-content'), event:{}}
        }
    });
    d.init();

    // d.show();

    $('button[name="showDialog"]').click(function(e){
		currentLi = $(this).parent();
		$('.dialog-content').find('input[type="checkbox"]').prop('checked',false);
        d.show();
        return false;
    });

    $('#_cancelAttr').click(function(){
        d.hide();
    });

	// 弹出窗点击保存时
	$('#_saveAttr').click(function(){
		//获取选择项
		var chkNames = [];
		var chkVals = [];
		$('input[name="chkAttr"]:checked').each(function(){
			chkVals.push($(this).val());
			chkNames.push($(this).next().text());
		});

		// 将选择的数据显示
		for(var i=0,len=chkVals.length;i<len;i++){
			var li = $('<li class="par-att-li"></li>').append($('<lable>'+chkNames[i]+'</lable>')).append($('<span class="del-icon2 sh-edit">X</span>'));
			currentLi.before(li);
			//currentUl.append(li);
		}
		d.hide();
		return false;
    });


	//移除已选的属性值
	var timer = null;
	$(".tdstyle")
	.on("mouseenter","li",function () {
		var self = $(this);
		timer = setTimeout(function () {
			//console.log(self).find('a').hasClass('sh-edit'));
			timer = setTimeout(function () {
				self.find('span').removeClass("sh-edit");
			}, 500);
		})
	})
	.on("mouseleave","li",function () {
		$(this).find('span').addClass('sh-edit');
		clearTimeout(timer);
	})
	.on("click","li span",function(){
		$(this).parent().remove();
	});
    //========================


    /***************************添加特性属性***************************/

    $(".select>li>input").click(function(){
        console.log(this);
        if(this.checked) {
            var li = $('<li class="par-att-li bg-red"></li>').append(
                $(
                    '<label for="">'
                    + $(this).siblings().html()
                    + '</label>'
                )
            ).append($('<span class="del-x">X</span>'));
            $(".selected").append(li);
        }
    });

    $('.selected').delegate('li > span', 'click', function(e){
        $(this).parent().remove();
    });

    //$(".selected>li>span").click(function(){
    //    console.log(this);
    //    $(this).parent().remove();
    //});


    /*************************** 类目选择 ****************************/

    function SelectProperty( conf ){
        this.default_config = {
            panel : null,
            allSelector : null,
            singleSelector : null
        };

        var _conf = conf || {},
            check;

        this.each( _conf, function( prop, val ){
            _conf[prop] = _conf.hasOwnProperty(prop)
                ? _conf[prop] : val;
        }, this );

        this.config = _conf;
        this.record = {};
        this.cache = {};

        this.each( this.config, function( prop, val){
            if ( val === null )
                check = true;
        });

        if ( check )
            return window;


        this.init();
    }

    SelectProperty.prototype = {
        construcotr : SelectProperty,

        init : function(){
            this.getDoms();
            this.bindEvent();
        },

        getDoms : function(){
            this.cache[ 'selectAll' ] = $(this.config.allSelector);
            this.cache[ 'selectSingle' ] = $(this.config.singleSelector);
            this.cache.panel = this.config.panel;
        },

        each : function( obj, fn, scope ){
            var prop;
            if ( !( obj && typeof obj == "object" && fn.constructor === Function ) )
                return obj;

            for ( prop in obj ){
                if ( obj.hasOwnProperty(prop) )
                    fn.apply(scope, [prop, obj[prop], obj]);
            }
        },

        bindEvent : function(){

            var _this = this;

            // 全选
            this.cache.selectAll.on( 'change', function(){
                var check = this.checked;
                _this.cache.selectSingle.each(function(){
                    _this.record[this.value] = check ? 1 : 0;
                    this.checked = check;
                });

                console.log(_this.record);
            });

            // 单选
            this.cache.panel.delegate( this.config.singleSelector, 'change', function(){
                if ( this === _this.cache.selectAll[0] )
                    return;

                var check = this.checked;
                _this.record[this.value] = check ? 1 : 0;

                if ( !check )
                    _this.cache.selectAll[0].checked = check;

                console.log(_this.record);
            });
        },

        getResult : function(){
            var arr = [];
            this.each( this.record, function( prop, val ){
                if ( val === 1)
                    arr.push( prop );
            }, this );

            return arr;
        }
    };

    var selectProperty = new SelectProperty({
        panel : $('#selectPanel'),
        allSelector : '#alldel',
        singleSelector : '.del'
    });

    function getSelectResult( keyName ){
        var result = [],
            selected = selectProperty.getResult(),
            i, len, temp;

        if ( selected.length < 1 )
            return result;

        for ( i = 0, len = selected.length; i < len; i++){
            temp = {};
            temp[ keyName ] = selected[ i ];
            result.push(temp);
        }

        return JSON.stringify(result);
    }

    $("#delBut").click(function(){
        $.ajax({
            type: "POST",
            url: "",
            data: getSelectResult( 'propertyId' ),
            success: function(data){
                if(data.status == "success"){
                    console.log("callback success!");
                }
            }
        });
    });



    /*提交父级属性规格*/
    /*{"propertyId":123,a=1，b=1,"propertyValues":[{"propertyValueId":12},{"propertyValueId":123}]}*/

    function inputValue(id) {
        var val = "{\"propertyId\":";
        val += id;      //一条记录的Id，即是形参trId
        val += ",";
        var inputLabel = $("#" + id +">td>input");
        val += inputLabel[0].name + "=" + inputLabel[0].checked + ",";
        val += inputLabel[1].name + "=" + inputLabel[0].checked + ",\"propertyValues\":[";
        //console.log(val);
        var len = $("#" + id + ">td>.par-att-div>ul>li");
        for (var i = 0; i < len.length - 1; i++) {
            if (i != len.length - 2) {

                val += "{\"propertyValueId\":" + len[i].id + "},";
            }
            else {
                val += "{\"propertyValueId\":" + len[i].id + "}]}";
            }
        }
        console.log(val);
        $("#" + id + ">input[name=aa]").val(val);
        console.log($("#" + id + ">input[name=aa]").val());
    }

    //inputValue(11);     //调用函数把选择好的一条记录内容放进vaule里面

    //添加父级属性更多、收起按钮
    $("#more").click(function(){
        var len = $("#11>td>.par-att-div>ul>li");
        if(len.length > 6){
            for(var i = 6;i<len.length-1;i++){
                len.eq(i).show();
            }
        }
        $("#more").hide();
        $("#less").show();
    });

    $("#less").click(function(){
        var len = $("#11>td>.par-att-div>ul>li");
        if(len.length > 6){
            for(var i = 6;i<len.length-1;i++){
                len.eq(i).hide();
            }
        }
        $("#more").show();
        $("#less").hide();
    });

});









