function init() {
  var wt = new Walkontable(document.getElementsByTagName('TABLE')[0]);




  var wtTable = new WalkontableTable(document.getElementsByTagName('table')[0]);
  console.log("row count", wtTable.rows.length);
  console.log("column count", wtTable.columns.length);




  function createButton(label, fn) {
    var BUTTON = document.createElement('BUTTON');
    BUTTON.innerHTML = label;
    wt.wtDom.addEvent(BUTTON, 'click', fn);
    document.body.insertBefore(BUTTON, document.getElementsByTagName('TABLE')[0]);
  }

  createButton('Merge selected', function () {
    wt.wtMerge.mergeSelection(wt.areaSelection);
  });

  var detached = [];

  createButton('Detach top', function () {
    var index = detached.length;
    var row = wtTable.getRow(index);
    if(row) {
      row.detach();
      detached.push(index);
    }
  });

  createButton('Attach top', function () {
    if(detached.length > 0) {
      var index = detached.pop();
      wtTable.getRow(index).attach();
    }
  });

  var detachedBody = [];

  createButton('Detach body top', function () {
    var index = detachedBody.length;
    var row = wtTable.getRow(index+1);
    if(row) {
      row.detach();
      detachedBody.push(index);
    }
  });

  createButton('Attach body top', function () {
    if(detachedBody.length > 0) {
      var index = detachedBody.pop();
      wtTable.getRow(index+1).attach();
    }
  });
}

window.onload = init;