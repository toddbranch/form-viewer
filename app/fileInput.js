angular.module('app').directive('fileInput', function () {
  return {
    template: '<input type="file">',
    scope: {
      file: '='
    },
    replace: true,
    link: function (scope, $el, attrs) {

      $el.on('change', function (event) {
        if ($el[0].files.length > 0) {
          scope.$apply(function () {
            scope.file = $el[0].files[0];
          });
        }
      });

    }
  };
});
