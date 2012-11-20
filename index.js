function init() {
  var wt = new Walkontable(document.getElementsByTagName('TABLE')[0]);


  var wtTable = new WalkontableTable(document.getElementsByTagName('table')[0]);
  console.log("row count", wtTable.rows.length);
  console.log("column count", wtTable.columns.length);


  function createButton(label, fn, newLine) {
    if(newLine) {
      var BR = document.createElement('BR');
      document.body.insertBefore(BR, document.getElementsByTagName('TABLE')[0]);
    }

    var BUTTON = document.createElement('BUTTON');
    BUTTON.innerHTML = label;
    wt.wtDom.addEvent(BUTTON, 'click', fn);
    document.body.insertBefore(BUTTON, document.getElementsByTagName('TABLE')[0]);
  }

  /**
   * Merge
   */

  createButton('Merge selected', function () {
    wt.wtMerge.mergeSelection(wt.areaSelection);
  });

  /**
   * Detach rows
   */

  var detached = [];

  createButton('Detach top', function () {
    var index = detached.length;
    var row = wtTable.getRow(index);
    if (row) {
      row.detach();
      detached.push(index);
    }
  }, true);

  createButton('Attach top', function () {
    if (detached.length > 0) {
      var index = detached.pop();
      wtTable.getRow(index).attach();
    }
  });

  var detachedBottom = [];

  createButton('Detach bottom', function () {
    var theadOffset = wtTable.TABLE.childNodes[0].getElementsByTagName('TR').length;
    var count = wtTable.TABLE.childNodes[1].getElementsByTagName('TR').length;
    if (count) {
      var row = wtTable.getRow(theadOffset + count - 1);
      row.detach();
      detachedBottom.push(theadOffset + count - 1);
    }
  });

  createButton('Attach bottom', function () {
    if (detachedBottom.length > 0) {
      var index = detachedBottom.pop();
      wtTable.getRow(index).attach();
    }
  });

  var detachedBody = [];

  createButton('Detach body top', function () {
    var index = detachedBody.length;
    var row = wtTable.getRow(index + 1);
    if (row) {
      row.detach();
      detachedBody.push(index);
    }
  });

  createButton('Attach body top', function () {
    if (detachedBody.length > 0) {
      var index = detachedBody.pop();
      wtTable.getRow(index + 1).attach();
    }
  });

  /**
   * Detach columns
   */

  var detachedLeft = [];

  createButton('Detach left', function () {
    var index = detachedLeft.length;
    var row = wtTable.getColumn(index);
    if (row) {
      row.detach();
      detachedLeft.push(index);
    }
  }, true);

  createButton('Attach left', function () {
    if (detachedLeft.length > 0) {
      var index = detachedLeft.pop();
      wtTable.getColumn(index).attach();
    }
  });
}

window.onload = init;