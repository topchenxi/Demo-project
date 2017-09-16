require(['jquery', 'validation', 'validation-lang'], function ($) {
	//对属性值的控制 
	var timer = null;
	var self = null;
	$(".select-children li").mouseenter(function () {
		var self = $(this);
		timer = setTimeout(function () {
			//console.log(self).find('a').hasClass('sh-edit'));

			timer = setTimeout(function () {
				self.find('a').removeClass("sh-edit");
			}, 1000);
		})
	}).mouseleave(function () {
		$(this).find('a').addClass('sh-edit');
		clearTimeout(timer);
	}).click(function(){
		$(this).children('input').attr("checked","checked");
	});
	
	
	// 查询标签组-校验,回车事件
	$("#tagGrpName").bind('keypress',function(){
		 if(event.keyCode == "13")    
            {
               if($("#tagGrpName").val().replace(/\s/g,'') == '' ){
					return false;
				} 
            }
	});
	// 查询标签组-校验,点搜索事件
	$("#tagGrpSearch").click(function(){
		if($("#tagGrpName").val().replace(/\s/g,'') == '' ){
			return false;
		}
	});
	
	// 查询属性值时-校验,回车事件
	$("#attrName").bind('keypress',function(){
		 if(event.keyCode == "13")    
            {
               if($("#attrName").val().replace(/\s/g,'') == '' ){
					return false;
				} 
            }
	});
	// 查询属性值时-校验,点搜索事件
	$("#attrSearch").click(function(){
		if($("#attrName").val().replace(/\s/g,'') == '' ){
			return false;
		}
	});
	
	// 点击标签组时 标签的效果
	$(".select-content").find(".tagGrp").on("click",function(){
		//console.log($(this));
		var nextTag = $(this).next();
		if(nextTag.hasClass("tags")){
			nextTag.toggle();
		}else{
		 	alert("去数据库查标签吧");
		}
	});
	
	// 点击标签时 更换选中标签的背景色
	$(".select-content").find(".tags>a").on("click",function(){
		$(".tags>a").removeClass("color-grey");
		$(this).addClass("color-grey");
	});
	
	
	
	// ******************表单验证
	$('#frmMove').validate();
	$('#frmUpdate').validate();
	
})