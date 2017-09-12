define(['../module'],function(ng){
	ng
    .factory('contractService', ['$http', 'api', function($http, api){
        return {
            getContractList:function(params){
                return $http.get(api.getContractTempl, {
                        'params': params
                    });
            },
            getDetail:function(params){
                return $http.get(api.getPreviewContract,{'params': params});
            },
            addContract:function(params){
                return $http.post(api.addContract,params);
            },
            updateStatusContractTemplate:function(param){
                return $http.post(api.updateStatusContractTemplate,param);
            }
        }

    }])
	.controller('ContractListCtrl', ['$scope','$location','$uibModal','contractService','commonService','commonTool', 
        function($scope,$location,$uibModal,contractService,commonService,commonTool){
		var tools = $scope.tools = {};
        var vm = $scope.vm = {};
        var paging =  $scope.paging = {
            'page': 1,
            'pageSize': 10,
            'status':"",
            'name':""
        };
        // 转到第几页
        tools.newpagesize = null;
    
        // 1.查询条件初始化
        tools.initCondition = function(isOnload){
            if(isOnload){
                vm.pages = commonService.setPageSizeArray(10, 30, 50);
            }
        };
        // 2.查询列表
        tools.getList = function(){
            contractService.getContractList(commonTool.filterParam(paging)).success(function(data) {
            	if(data.status=='success'){
            		vm.items = data.page.items;
            	}
                paging.total = data.page.total;
            });
        };
        // 3.列表翻页
        tools.getnewpage = function() {
            if (tools.newpagesize != null) {
                paging.page = tools.newpagesize;
                tools.getList();
                vm.newpagesize = null;
            }
        };
        
        // 7.查看详情
        tools.toshowDetail = function(contractId,status){
            // console.log(contractId);
            $location.path('/contract/contractView').search({
                'templateId':contractId,
                'status':status
            })
        };
        // 新增合同模板
        tools.toaddContract = function(){
        	 /**$location.path('/contract/updateContract').search({
        	 	'isAdd':true
            })*/
			
			var uibModalInstance = $uibModal.open({
			  animation: true,
			  templateUrl: 'addContractTemplate.html',
			  controller: 'AddContractTemplateCtrl',
			  resolve: {
			    item: function () {
			      return null;
			    }
			  }
			});
            uibModalInstance.result.then(function(rs){
                tools.getList();
            }
//            ,function(){
//                console.log('uibModal dismissed at: ' + new Date())
//            }
            )
        };
        // 修改合同模板
        tools.toupdateContract = function(index){
        	/*$location.path('/contract/updateContract').search({
        	 	'isAdd':false,
        	 	'name':name,
        	 	'path':path
            })*/
            var uibModalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'addContractTemplate.html',
                controller: 'AddContractTemplateCtrl',
                resolve: {
                    item: function () {
                        console.log( vm.items[index]);
                        var temp = vm.items[index];
                        var param={};
                        param.name = temp.name;
                        param.path = temp.path;
                        param.contractTemplateId = temp.contractTemplateId;
                        return param;
                    }
                }
            });
            uibModalInstance.result.then(function(rs){
                    tools.getList();
                }
            );
        };

        // 删除和生效合同
        tools.updateStatusTempl = function(index,id,type){
            if(type == 1 && vm.items[index].status == 1){
                alert("当前合同模板已经是生效状态");
                return;
            }
            var msg="合同模板生效";
            if(type != 1 ){
                if(!confirm('确认删除模板['+vm.items[index].name+']?')){
                    return;
                }
                msg =  "删除合同模板";
            };

            var param = {"templateId":id,"type":type};
            contractService.updateStatusContractTemplate(param).success(function(data) {
                if(data.status=='success'){
                    alert(msg+"成功");
                    tools.getList();
                }else{
                    alert(msg + "失败");
                }
            });
        }
            tools.initCondition(true);
            tools.getList();

	}])	

	.controller('AddContractTemplateCtrl', ['$scope','$uibModalInstance','api','Upload','contractService','commonTool','item',
		function($scope,$uibModalInstance,api,Upload,contractService,commonTool,item){
        var vm = $scope.vm={};
        var func = $scope.func ={};
         //   console.log(item);
        if(commonTool.isEmpty(item)){
        	vm.item={};
        	vm.title="添加合同模板";
        }else{
        	vm.item=item;
        	vm.title="修改合同模板";
        }
        func.uploadFile = function(files) {
            //console.log("file=",files);
            if (files && files.length>0) {
                //console.log("file11=",files);
                var file = files[0];
                if((!/.*\.doc$/.test(file.name)) ||  file.size>2*1024*1024){
                    alert("上传文件不符合要求,说明:只支持格式:doc;文件大小不超过2M")
                    return false;
                }
                Upload.upload({
                    url: api.uploadContract,
                    file: file
                }).progress(function(evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                }).success(function(data, status, headers, config) {
                    vm.item.path = data.data.url;
                });
            }
        };
        func.save = function(isValid,type){
            if (!isValid) {
                alert('验证不通过');
                return;
            }
            var msg="模板保存为草稿";
            if(type==1){
                //生效
                msg="模板保存并生效"
                vm.item.status=1;
            }else{
                // 草稿
                vm.item.status=0;
            }
            contractService.addContract(vm.item).success(function(data) {
                if(data.status=='success'){
                    alert(msg + "成功");
                    $uibModalInstance.close(1);;
                }else{
                    alert(msg + "失败");
                }
            });
        }

        func.cancel = function(){
        	$uibModalInstance.dismiss('cancel');
        }
	}])
	.controller('ContractDetailCtrl', ['$scope','$sce','$location','$window','contractService','commonTool',
            function($scope,$sce,$location,$window,contractService,commonTool){
        var tools = $scope.tools = {} ;
        var vm = $scope.vm={};
        var param = $scope.param={};
        //        console.log($location.search().templateId);
        param.templateId = $location.search().templateId;
        vm.status = $location.search().status;
        // 查询详情
        tools.getDetail = function(){
            contractService.getDetail(param).success(function(data) {
                //console.log(data);
                if(data.status=='success'){
                    vm.name = data.data.title;
                   // vm.item = data.data.model;
                    vm.trustHtml = $sce.trustAsHtml(data.data.model.content);
                }
            });
        }
        tools.active = function(){
            var params = {"templateId":param.templateId,"type":1};
            contractService.updateStatusContractTemplate(params).success(function(data) {
                if(data.status=='success'){
                    alert("合同模板生效成功");
                    $window.history.back();
                }else{
                    alert("合同模板生效失败");
                }
            });
        }
        // 返回
        tools.back = function(){
            $window.history.back();
        }
        tools.getDetail();
	}])
        .filter('transStatus',function(){
            return function (status) {
                var statusName = "";
                switch(status){
                    case 0: statusName="草稿";break;
                    case 1: statusName="生效";break;
                    default :break;
                }
                return statusName;
            }
        })
  
})