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
   * Scroll left/right
   */

  createButton('Scroll left', function () {
    wt.scrollHorizontal(-100).draw();
  });

  createButton('Scroll right', function () {
    wt.scrollHorizontal(100).draw();
  });

  /**
   * Init Walkontable
   */

  function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars.charAt(Math.round(Math.random() * (chars.length - 1)));
    return result;
  }

  var arr = [];
  var arrPart = [];
  var str = 'abcdefghijklmnopqrstuvwxyz';

  for (var i = 0; i < 100; i++) {
    arrPart.push([
      i,
      randomString(3 * (1 + Math.sin(i)), str),
      randomString(3 * (1 + Math.sin(i + 2)), str),
      randomString(3 * (1 + Math.sin(i + 4)), str),
      randomString(3 * (1 + Math.sin(i + 6)), str),
      randomString(3 * (1 + Math.sin(i + 8)), str),
      randomString(3 * (1 + Math.sin(i + 10)), str)
    ]);
  }

  for (var i = 0; i < 100000; i++) {
    arr.push(arrPart[i % 100]); //clone 100 row chunks until array has size of 100000
  }

  var wt = new Walkontable({
    table: document.getElementsByTagName('TABLE')[0],
    data: function (row, col) {
      return arr[row][col];
    },
    totalRows: function () {
      return arr.length;
    },
    totalColumns: function () {
      return arr[0].length;
    },
    offsetRow: 0,
    offsetColumn: 0,
    displayRows: displayRows,
    displayColumns: 5,
    rowHeaders: function (row) {
      return row + 1
    }
  });
  wt.draw();
}

window.onload = init;