angular.module('app').directive('viewer', function () {
  return {
    templateUrl: 'templates/viewer.html',
    controller: 'viewerCtrl',
    controllerAs: 'ctrl'
  };
});

angular.module('app').controller('viewerCtrl', [
  '$scope',
  'fileService',
  'disabledService',
  function ($scope, fileService, disabledService) {
    var vm = this;
    //var currentXml;

    vm.file = {};
    vm.pages = [];
    vm.save = function () {
      var encoded = fileService.encodeForm(currentXml);
      downloadLink = 'data:application/vnd.xfdl,' + encodeURI(encoded);

      $('body').prepend('<a href=\'' + downloadLink + '\' download="' + vm.name + '">Download</a>');
    };

    vm.form = '';

    $scope.$watch(
      'ctrl.file',
      function (newFile) {
        if (newFile instanceof File) {
          vm.name = newFile.name;

          fileService
            .decodeForm(newFile)
            .then(function (xml) {
              currentXml = xml;
              disabledService.initialize(xml);
              vm.form = $(xml).find('formid title').text();
              vm.pages = $(xml).find('page');
            });
        }
      }
    );
  }
]);
