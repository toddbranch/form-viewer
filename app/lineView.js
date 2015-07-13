angular.module('app').directive('lineView', function () {
  return {
    templateUrl: 'templates/lineView.html',
    scope: {
      line: '='
    },
    controller: 'lineViewCtrl',
    controllerAs: 'ctrl',
    bindToController: true
  };
});

angular.module('app').controller('lineViewCtrl', [
  'positionService',
  function (positionService) {
    var vm  = this;

    var style = positionService.getPosition(vm.line);
    var $line = $(vm.line);

    vm.style = style;
  }
]);
