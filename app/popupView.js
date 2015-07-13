angular.module('app').directive('popupView', function () {
  return {
    templateUrl: 'templates/popupView.html',
    scope: {
      popup: '=',
      page: '='
    },
    controller: 'popupViewCtrl',
    controllerAs: 'ctrl',
    bindToController: true
  };
});

angular.module('app').controller('popupViewCtrl', [
  'positionService',
  '$scope',
  'disabledService',
  function (positionService, $scope, disabledService) {
    var vm  = this;

    var groupName = $(vm.popup).find('group').text();
    var cells = $(vm.page).find('group:contains("' + groupName + '")').parent('cell');

    // need to make list of options
    cells = _.map(cells, function (cell) {
      return {
        value: cell.getAttribute('sid'),
        text: $(cell).find('value').text()
      };
    });

    vm.cells = cells;
    vm.style = positionService.getPosition(vm.popup);
    vm.value = $(vm.popup).find('value').text();
    vm.disabled = !disabledService.isEnabled(vm.popup);

    $scope.$watch(
      'ctrl.value',
      function (newValue) {
        $(vm.popup).find('value').text(newValue);
      }
    );
  }
]);
