(function(){
	angular
	.module('FlickrApp')
	.controller('InitModalController', ['$uibModalInstance', InitModalController])

	function InitModalController($uibModalInstance){
		var vm = this;
		vm.ok = ok;
		vm.cancel = cancel;

		function ok(obj){
			$uibModalInstance.close(obj);
		}

		function cancel(){
			$uibModalInstance.dismiss('cancel');
		}
	}
})();