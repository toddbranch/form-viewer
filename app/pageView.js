angular.module('app').directive('pageView', function () {
  return {
    templateUrl: 'templates/pageView.html',
    scope: {
      page: '='
    },
    controller: 'pageViewCtrl',
    controllerAs: 'ctrl',
    bindToController: true
  };
});

angular.module('app').controller('pageViewCtrl', [
  function () {
    this.buttons = $(this.page).find('button');
    this.labels = $(this.page).find('label');
    this.fields = $(this.page).find('field');
    this.checks = $(this.page).find('check');
    this.popups = $(this.page).find('popup');
    this.lines = $(this.page).find('line');
  }
]);
