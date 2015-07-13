angular.module('app').factory('disabledService', function () {
  var lockStore = {};
  var noFieldsLocked;

  function extractItemRefs(ref) {
    var itemRefs = $(ref).find('itemref');

    return _.map(itemRefs, function (ref) {
      return $(ref).text();
    });
  }

  function initialize(xml) {
    var $xml = $(xml);

    var $signitemrefs = $xml
      .find('signature signer')
      .siblings('signitemrefs');

    if ($signitemrefs.length === 0) {
      noFieldsLocked = true;
      return;
    }

    noFieldsLocked = false;

    var omissions = _.map($signitemrefs, function (ref) {
      return extractItemRefs(ref);
    });

    var intersection = _.intersection.apply(this, omissions);

    lockStore = _.reduce(
      intersection,
      function (memo, itemref) {
        var parts = itemref.split('.');
        memo[_.last(parts)] = true;
        return memo;
      },
      {}
    );
  }

  function isEnabled(el) {
    var sid = el.getAttribute('sid');

    return lockStore[sid] || noFieldsLocked || false;
  }

  return {
    initialize: initialize,
    isEnabled: isEnabled
  };
});
