angular.module('app').directive('fieldView', function () {
  return {
    templateUrl: 'templates/fieldView.html',
    scope: {
      field: '='
    },
    controller: 'fieldViewCtrl',
    controllerAs: 'ctrl',
    bindToController: true
  };
});

angular.module('app').controller('fieldViewCtrl', [
  'positionService',
  '$scope',
  'disabledService',
  function (positionService, $scope, disabledService) {
    var vm  = this;

    vm.style = positionService.getPosition(vm.field);
    vm.text = $(vm.field).find('value').text();
    vm.disabled = !disabledService.isEnabled(vm.field);

    $scope.$watch(
      'ctrl.text',
      function (newText) {
        $(vm.field).find('value').text(newText);
      }
    );
  }
]);
