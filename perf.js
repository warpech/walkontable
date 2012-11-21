function init() {
  var startRow = 0;
  var displayRows = 10;
  var wt = new Walkontable({
    table: document.getElementsByTagName('TABLE')[0],
    data: arr,
    startRow: startRow,
    displayRows: displayRows
  });
  wt.draw();

  function createButton(label, fn, newLine) {
    if (newLine) {
      var BR = document.createElement('BR');
      document.body.insertBefore(BR, document.getElementsByTagName('TABLE')[0]);
    }

    var BUTTON = document.createElement('BUTTON');
    BUTTON.innerHTML = label;
    var wtDom = new WalkontableDom();
    wtDom.addEvent(BUTTON, 'click', fn);
    document.body.insertBefore(BUTTON, document.getElementsByTagName('TABLE')[0]);
  }

  /**
   * Page up/down
   */

  createButton('Page down', function () {
    startRow += 10;
    if (startRow >= arr.length - 1 - displayRows) {
      startRow = arr.length - 1 - displayRows;
    }
    wt.update({startRow: startRow}).draw();
  });

  createButton('Page up', function () {
    startRow -= 10;
    if (startRow < 0) {
      startRow = 0;
    }
    wt.update({startRow: startRow}).draw();
  });
}

window.onload = init;