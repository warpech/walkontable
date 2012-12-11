function WalkontableEvent(instance) {
  var that = this;

  //reference to instance
  this.instance = instance;

  this.wtDom = new WalkontableDom();

  var dblClickOrigin = null
    , dblClickTimeout = null;

  var onMouseDown = function (event) {
    var coords
      , TD = that.wtDom.closest(event.target, ['TD', 'TH']);
    if (TD) {
      coords = that.instance.wtTable.getCoords(TD);
    }
    else if (!TD && that.wtDom.hasClass(event.target, 'wtBorder') && that.wtDom.hasClass(event.target, 'current')) {
      coords = that.instance.selections.current.selected[0];
      TD = that.instance.wtTable.getCell(coords);
    }
    if (dblClickOrigin === null) {
      dblClickOrigin = TD; //double click origin must come from mouse down event, so we will reject double clicks that started as dragging
    }
    if (that.instance.settings.onCellMouseDown) {
      if (TD && TD.nodeName === 'TD') {
        that.instance.getSetting('onCellMouseDown', event, coords, TD);
      }
    }
  };

  var lastMouseOver;
  var onMouseOver = function (event) {
    if (that.instance.settings.onCellMouseOver) {
      var TD = that.wtDom.closest(event.target, ['TD', 'TH']);
      if (TD !== lastMouseOver) {
        lastMouseOver = TD;
        if (TD.nodeName === 'TD') {
          that.instance.getSetting('onCellMouseOver', event, that.instance.wtTable.getCoords(TD), TD);
        }
      }
    }
  };

  var onMouseUp = function (event) {
    if (event.button !== 2 && that.instance.settings.onCellDblClick) { //if not right mouse button
      var coords
        , TD = that.wtDom.closest(event.target, ['TD', 'TH']);
      if (TD) {
        coords = that.instance.wtTable.getCoords(TD);
      }
      else if (!TD && that.wtDom.hasClass(event.target, 'wtBorder') && that.wtDom.hasClass(event.target, 'current')) {
        coords = that.instance.selections.current.selected[0];
        TD = that.instance.wtTable.getCell(coords);
      }

      if (TD && dblClickOrigin === TD && TD.nodeName === 'TD') {
        that.instance.getSetting('onCellDblClick', event, coords, TD);
        dblClickOrigin = null;
        dblClickTimeout = null;
      }
      else {
        clearTimeout(dblClickTimeout);
        dblClickTimeout = setTimeout(function () {
          dblClickOrigin = null;
          dblClickTimeout = null;
        }, 500);
      }
    }
  };

  $(this.instance.wtTable.parent).on('mousedown', onMouseDown);
  $(this.instance.settings.table).on('mouseover', onMouseOver);
  $(this.instance.wtTable.parent).on('mouseup', onMouseUp);
}