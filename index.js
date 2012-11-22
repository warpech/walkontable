function init() {
  var displayRows = 10;

  function createButton(label, fn, newLine) {
    var TABLE = document.getElementsByTagName('TABLE')[0];

    if (newLine) {
      var BR = document.createElement('BR');
      TABLE.parentNode.insertBefore(BR, TABLE);
    }

    var BUTTON = document.createElement('BUTTON');
    BUTTON.innerHTML = label;
    $(BUTTON).on('mousedown', fn);
    TABLE.parentNode.insertBefore(BUTTON, TABLE);
  }

  /**
   * Page up/down
   */

  createButton('Page down', function () {
    wt.scrollVertical(displayRows).draw();
  });

  createButton('Page up', function () {
    wt.scrollVertical(-displayRows).draw();
  });

  /**
   * Init Walkontable
   */

  var arr = [];
  for (var i = 0; i < 100000; i++) {
    arr.push([i, "a", "b", "c", "d", "e", "f"]);
  }

  var wt = new Walkontable({
    table: document.getElementsByTagName('TABLE')[0],
    data: arr,
    startRow: 0,
    displayRows: displayRows
  });
  wt.draw();
}

window.onload = init;