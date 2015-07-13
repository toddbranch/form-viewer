angular.module('app').directive('buttonView', function () {
  return {
    templateUrl: 'templates/buttonView.html',
    scope: {
      button: '='
    },
    controller: 'buttonViewCtrl',
    controllerAs: 'ctrl',
    bindToController: true
  };
});

angular.module('app').controller('buttonViewCtrl', [
  'positionService',
  function (positionService) {
    var vm  = this;

    var style = positionService.getPosition(vm.button);
    var $button = $(vm.button);

    if ($button.find('within').length > 0) {
      style.display = 'none';
    }

    vm.style = style;
    vm.text = $button.find('value').text();
  }
]);
