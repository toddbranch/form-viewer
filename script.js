var reader = new FileReader();

$('#viewButton').click(function () {
  $('.content').empty();
  var file = $('#test')[0].files[0];
  readFile(file);
});

$('#saveButton').click(save);

function getXML() {
  var encoded = reader.result.replace('application/vnd.xfdl;content-encoding="base64-gzip"', '');
  encoded = encoded.replace('application/vnd.xfdl; content-encoding="base64-gzip"', '');
  return jQuery.parseXML(pako.ungzip(atob(encoded), {to: 'string'}));
}

function readerWatcher() {
  if (reader.readyState != 2) {
    setTimeout(readerWatcher, 100);
  } else {
    results = getXML();

    var pages = $(results).find('page');

    _.each(pages, function (page) {
      var $page = $(page);
      var $pageEl = $('<div class="page"></div>');

      addButtons($page, $pageEl);
      addLabels($page, $pageEl);
      addFields($page, $pageEl);

      $('.content').append($pageEl);
    });
  }
}

function readFile(file) {
  reader.readAsBinaryString(file);
  readerWatcher();
}

function save() {
  var s = new XMLSerializer();
  serialized = s.serializeToString(results);

  gzipped = pako.gzip(serialized, {to: 'string'});
  encoded = btoa(gzipped);

  downloadLink = 'data:application/xfdl,' + encoded;

  $('body').prepend('<a href="' + downloadLink + '" download="opr.xfdl">Download</a>');
}

function getStyles($location) {
  var xLoc = $location.find('x').text();
  var yLoc = $location.find('y').text();
  var height = $location.find('height').text();
  var width = $location.find('width').text();

  return {
    position: 'absolute',
    left: xLoc + 'px',
    top: yLoc + 'px',
    height: height + 'px',
    width: width + 'px'
  };
}

function addButtons($page, $pageEl) {
  var buttons = $page.find('button');

  _.each(buttons, function (button) {
    var $button = $(button);

    if ($button.find('within').length > 0) {
      return;
    }

    var value = $button.find('value').text();

    var $location = $button.find('itemlocation');

    var renderedButton = $('<button class="button"></button>');
    renderedButton.css(getStyles($location));
    renderedButton.text(value);

    $pageEl.append(renderedButton);
  });
}

function addLabels($page, $pageEl) {
  var labels = $page.find('label');

  _.each(labels, function (label) {
    var $label = $(label);

    var value = $label.find('value').text();

    if (value === '') {
      return;
    }

    var $location = $label.find('itemlocation');

    var renderedLabel = $('<div class="label"></div>');
    renderedLabel.css(getStyles($location));
    renderedLabel.text(value);

    $pageEl.append(renderedLabel);
  });
}

function addFields($page, $pageEl) {
  var fields = $page.find('field');

  _.each(fields, function (field) {
    var $field = $(field);

    var value = $field.find('value').text();

    var $location = $field.find('itemlocation');

    var renderedField = $('<textarea class="field"></textarea>');
    renderedField.css(getStyles($location));
    renderedField.text(value);

    $pageEl.append(renderedField);
  });
}
