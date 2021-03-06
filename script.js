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

    var dims = $(results).find('designer\\:pagesize, pagesize').eq(0).text().split(';');
    var pageStyle = {
      width: dims[0] + 'px',
      height: dims[1] + 'px'
    };

    var pages = $(results).find('page');

    _.each(pages, function (page) {
      var $page = $(page);
      var $pageEl = $('<div class="page"></div>');

      addButtons($page, $pageEl);
      addLabels($page, $pageEl);
      addFields($page, $pageEl);
      addPopups($page, $pageEl);
      addChecks($page, $pageEl);

      $pageEl.css(pageStyle);

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
  // need to check for 'ae'
  var xLoc, yLoc, height, width;

  var $ae = $location.find('ae');

  if ($ae.length) {
    var $xy = $ae.eq(0).find('ae');
    xLoc = $xy.eq(1).text();
    yLoc = $xy.eq(2).text();

    var $hw = $ae.eq(4).find('ae');
    width = $hw.eq(1).text();
    height = $hw.eq(2).text();
  } else {
    xLoc = $location.find('x').text();
    yLoc = $location.find('y').text();
    height = $location.find('height').text();
    width = $location.find('width').text();
  }

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

function addPopups($page, $pageEl) {
  var popups = $page.find('popup');

  _.each(popups, function (popup) {
    var $popup = $(popup);

    var $location = $popup.find('itemlocation');

    var renderedPopup = $('<select class="popup"></select>');
    renderedPopup.css(getStyles($location));

    var groupName = $popup.find('group').text();

    // need to get each option and append here
    var $options = $page.find('group:contains("' + groupName + '")').parent('cell');

    _.each($options, function (option) {
      var renderedOption = $('<option></option>');
      var optionText = $(option).find('value').text();
      renderedOption.text(optionText);
      renderedOption.val(optionText);
      renderedPopup.append(renderedOption);
    });

    var selectedCell = $popup.find('value').text();
    if (selectedCell) {
      var $selectedCell = $page.find('cell[sid=' + selectedCell + ']');
      renderedPopup.val($selectedCell.find('value').text());
    }

    $pageEl.append(renderedPopup);
  });
}

function addChecks($page, $pageEl) {
  var checks = $page.find('check');

  _.each(checks, function (check) {
    var $check = $(check);

    var $location = $check.find('itemlocation');

    var renderedCheck = $('<input type="checkbox" class="check"></input>');
    renderedCheck.css(getStyles($location));

    if ($check.find('value').text() === 'on') {
      renderedCheck.prop('checked', true);
    }

    $pageEl.append(renderedCheck);
  });
}
