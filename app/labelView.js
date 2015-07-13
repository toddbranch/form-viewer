angular.module('app').directive('labelView', function () {
  return {
    templateUrl: 'templates/labelView.html',
    scope: {
      label: '='
    },
    controller: 'labelViewCtrl',
    controllerAs: 'ctrl',
    bindToController: true
  };
});

angular.module('app').controller('labelViewCtrl', [
  'positionService',
  function (positionService) {
    var vm  = this;

    vm.style = positionService.getPosition(vm.label);
    vm.text = $(vm.label).find('value').text();
  }
]);
