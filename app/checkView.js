angular.module('app').directive('checkView', function () {
  return {
    templateUrl: 'templates/checkView.html',
    scope: {
      check: '='
    },
    controller: 'checkViewCtrl',
    controllerAs: 'ctrl',
    bindToController: true
  };
});

angular.module('app').controller('checkViewCtrl', [
  'positionService',
  'disabledService',
  function (positionService, disabledService) {
    var vm  = this;

    vm.style = positionService.getPosition(vm.check);

    var checkVal = $(vm.check).find('value').text();
    vm.checked = checkVal === 'on' ? true : false;

    vm.disabled = !disabledService.isEnabled(vm.check);
  }
]);
