var ulrMap = {};
//************行业管理
ulrMap['industList'] = "controller/categoryattribute/index.html"
ulrMap['industAdd'] = "controller/categoryattribute/addIndustry.html"
ulrMap['industUpdate'] = "controller/categoryattribute/updateIndustry.html"

//************类目管理
ulrMap['ctgryList'] = "controller/categoryattribute/categorylist.html"
ulrMap['ctgryAdd'] = "controller/categoryattribute/addCategory.html"
ulrMap['ctgryUpdate'] = "controller/categoryattribute/updateCategory.html"

//************标签管理
ulrMap['lableList'] = "controller/categoryattribute/lablelist/list.html"
ulrMap['lableAdd'] = "controller/categoryattribute/lablelist/lableUpdate.html"
ulrMap['lableUpdate'] = "controller/categoryattribute/lablelist/lableUpdate.html"

//************标签组管理
ulrMap['lablegroupList'] = "controller/categoryattribute/lablegroup/lablegrplist.html"
ulrMap['lablegroupAdd'] = "controller/categoryattribute/lablegroup/lablegrpUpdate.html"
ulrMap['lablegroupUpdate'] = "controller/categoryattribute/lablegroup/lablegrpUpdate.html"

//************属性值管理
ulrMap['attrList'] = "controller/categoryattribute/attr/attrListNew.html"
ulrMap['attrAdd'] = "controller/categoryattribute/attr/arrtUpdateNew.html"
ulrMap['attrUpdate'] = "controller/categoryattribute/attr/arrtUpdateNew.html"
ulrMap['attrMove'] = "controller/categoryattribute/attr/moveTo.html"

//************属性规格管理
ulrMap['attrtypeList'] = "controller/categoryattribute/attrtype/attrtypelist.html"
ulrMap['attrtypeAdd'] = "controller/categoryattribute/attrtype/attrtypeAdd.html"
ulrMap['attrtypeUpdate'] = "controller/categoryattribute/attrtype/attrtypeUpdate.html"
ulrMap['parentattrlist'] = "controller/categoryattribute/attrtype/parentattrlist.html"

function setIframe(mark){
	console.log(ulrMap[mark]);
 	parent.document.getElementById("ifrm").setAttribute("src",ulrMap[mark]);
	//this.href=ulrMap[mark];
}

function delIndust(id){
	console.log('id==='+id);
	if(confirm("确定删除 id="+id +"的数据?")){
		console.log('去调后台删数据吧');
		
	}
		
}

