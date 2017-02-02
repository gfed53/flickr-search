(function(){
	angular
	.module('FlickrApp')
	.controller('UpdateModalController', ['flInitAPIs', '$uibModalInstance', UpdateModalController])

	function UpdateModalController(flInitAPIs, $uibModalInstance){
		var vm = this;
		vm.ok = ok;
		vm.cancel = cancel;

		//Existing submissions will occupy their respective boxes
		vm.apisObj = flInitAPIs.apisObj;
		vm.currentUserName = flInitAPIs.apisObj.id;

		function ok(obj){
			$uibModalInstance.close(obj);
		}

		function cancel(){
			$uibModalInstance.dismiss();
		}
	}
})();