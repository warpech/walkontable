function init() {
  var wt = new Walkontable(document.getElementsByTagName('TABLE')[0])
    , i;

  wt.wtCourtain.courtains.bottom.box = [];
  for (i = arr.length - 1; i >= 0; i--) {
    var TR = document.createElement('TR');
    for (var j = 0; j < 7; j++) {
      var TD = document.createElement('TD');
      TD.innerHTML = arr[i][j];
      TR.appendChild(TD);
    }
    wt.wtCourtain.courtains.bottom.box.push([, TR]);
  }

  for (i = 0; i < 10; i++) {
    wt.wtCourtain.attachRow('bottom');
  }


  function createButton(label, fn) {
    var BUTTON = document.createElement('BUTTON');
    BUTTON.innerHTML = label;
    wt.wtDom.addEvent(BUTTON, 'click', fn);
    document.body.insertBefore(BUTTON, document.getElementsByTagName('TABLE')[0]);
  }

  createButton('Merge selected', function () {
    wt.wtMerge.mergeSelection(wt.areaSelection);
  });

  createButton('Detach right', function () {
    wt.wtCourtain.detachColumn('right');
  });

  createButton('Attach right', function () {
    wt.wtCourtain.attachColumn('right');
  });

  createButton('Detach left', function () {
    wt.wtCourtain.detachColumn('left');
  });

  createButton('Attach left', function () {
    wt.wtCourtain.attachColumn('left');
  });

  createButton('Detach top', function () {
    wt.wtCourtain.detachRow('top');
  });

  createButton('Attach top', function () {
    wt.wtCourtain.attachRow('top');
  });

  createButton('Detach bottom', function () {
    for (var i = 0; i < 10; i++) {
      wt.wtCourtain.detachRow('bottom');
      wt.wtCourtain.attachRow('top');
    }
  });

  createButton('Attach bottom', function () {
    for (var i = 0; i < 10; i++) {
      wt.wtCourtain.detachRow('top');
      wt.wtCourtain.attachRow('bottom');
    }
  });
}

window.onload = init;