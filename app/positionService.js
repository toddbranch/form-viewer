angular.module('app').factory('positionService', function () {
  function toPx(size) {
    return size + 'px';
  }

  function isAE($location) {
    var $ae = $location.find('ae');
    return $ae.length > 0;
  }

  function getAEposition($location) {
    var $ae = $location.find('ae');

    var $xy = $ae.eq(0).find('ae');
    var $hw = $ae.eq(4).find('ae');

    return {
      left: toPx($xy.eq(1).text()),
      top: toPx($xy.eq(2).text()),
      width: toPx($hw.eq(1).text()),
      height: toPx($hw.eq(2).text())
    };
  }

  function getStandardPosition($location) {
    return {
      left: toPx($location.find('x').text()),
      top: toPx($location.find('y').text()),
      height: toPx($location.find('height').text()),
      width: toPx($location.find('width').text())
    };
  }

  function getPosition(el) {
    var $location = $(el).find('itemlocation').eq(0);
    var position;

    if (isAE($location)) {
      position = getAEposition($location);
    } else {
      position = getStandardPosition($location);
    }

    position.position = 'absolute';

    return position;
  }

  return {
    getPosition: getPosition
  };
});
