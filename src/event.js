function WalkontableEvent(instance) {
  var that = this;

  //reference to instance
  this.instance = instance;

  this.wtDom = new WalkontableDom();

  var onMouseDown = function (event) {
    if (that.instance.settings.onCellMouseDown) {
      var coords
        , TD = that.wtDom.closest(event.target, ['TD', 'TH']);
      if (TD) {
        coords = that.instance.wtTable.getCoords(TD);
      }
      else if (!TD && that.wtDom.hasClass(event.target, 'wtBorder') && that.wtDom.hasClass(event.target, 'current')) {
        coords = that.instance.selections.current.selected[0];
        TD = that.instance.wtTable.getCell(coords);
      }
      that.instance.getSetting('onCellMouseDown', event, coords, TD);
    }
  };

  var lastMouseOver;
  var onMouseOver = function (event) {
    if (that.instance.settings.onCellMouseOver) {
      var TD = that.wtDom.closest(event.target, ['TD', 'TH']);
      if (TD !== lastMouseOver) {
        lastMouseOver = TD;
        that.instance.getSetting('onCellMouseOver', event, that.instance.wtTable.getCoords(TD), TD);
      }
    }
  };

  var dblClickOrigin
    , dblClickTimeout;
  var onMouseUp = function (event) {
    if (event.which !== 2 && that.instance.settings.onCellDblClick) { //if not right mouse button
      var coords
        , TD = that.wtDom.closest(event.target, ['TD', 'TH']);
      if (TD) {
        coords = that.instance.wtTable.getCoords(TD);
      }
      else if (!TD && that.wtDom.hasClass(event.target, 'wtBorder') && that.wtDom.hasClass(event.target, 'current')) {
        coords = that.instance.selections.current.selected[0];
        TD = that.instance.wtTable.getCell(coords);
      }

      if (dblClickOrigin === TD) {
        that.instance.getSetting('onCellDblClick', event, coords, TD);
        dblClickOrigin = null;
      }
      else {
        dblClickOrigin = TD;
        clearTimeout(dblClickTimeout);
        dblClickTimeout = setTimeout(function () {
          dblClickOrigin = null;
        }, 500);
      }
    }
  };

  $(this.instance.wtTable.parent).on('mousedown', onMouseDown);
  $(this.instance.settings.table).on('mouseover', onMouseOver);
  $(this.instance.wtTable.parent).on('mouseup', onMouseUp);
}