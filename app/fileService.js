function prependEncodingHeader(text) {
  return 'application/vnd.xfdl;content-encoding="base64-gzip"\n' + text;
}

function restrictLineLength(text) {
  // lines are all 76 chars for some reason

  var lines = text.match(/.{1,76}/g);
  return lines.join('\n');
}

function removeEncodingHeader(text) {
  return text.replace(/application\/vnd.xfdl;\s*content-encoding="base64-gzip"\n/, '');
}

angular.module('app').factory('fileService', [
  '$q',
  function ($q) {
    function decodeForm(file) {
      var reader = new FileReader();
      var deferred = new $q.defer();

      reader.readAsBinaryString(file);

      reader.onload = function () {
        var base64Text = removeEncodingHeader(reader.result);
        var gzippedText = atob(base64Text);
        var xmlText = pako.ungzip(gzippedText, {to: 'string'});
        var xml = $.parseXML(xmlText);

        deferred.resolve(xml);
      };

      return deferred.promise;
    }

    function encodeForm(xml) {
      var serializer = new XMLSerializer();
      var xmlText = serializer.serializeToString(xml);
      var gzippedText = pako.gzip(xmlText, {to: 'string'});
      var base64Text = btoa(gzippedText);
      var base64formatted = restrictLineLength(base64Text);

      return prependEncodingHeader(base64formatted);
    }

    return {
      decodeForm: decodeForm,
      encodeForm: encodeForm
    };
  }
]);
