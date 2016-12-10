(function(){
	angular
	.module('FlickrApp')
	.controller('emptyFieldModalController', ['$uibModalInstance', emptyFieldModalController])

	function emptyFieldModalController($uibModalInstance){
		var vm = this;
		vm.ok = ok;
		vm.cancel = cancel;

		function ok(){
			$uibModalInstance.close();
		}

		function cancel(){
			$uibModalInstance.dismiss('cancel');
		}
	}
})();