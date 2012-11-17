function init() {
  var wt = new Walkontable(document.getElementsByTagName('TABLE')[0]);

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
    wt.wtCourtain.detachRow('bottom');
  });

  createButton('Attach bottom', function () {
    wt.wtCourtain.attachRow('bottom');
  });
}

window.onload = init;