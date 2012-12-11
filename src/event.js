function WalkontableEvent(instance) {
  var that = this;

  //reference to instance
  this.instance = instance;

  this.wtDom = new WalkontableDom();

  var dblClickOrigin = [null, null, null, null]
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

    if (that.instance.settings.onCellMouseDown) {
      if (TD && TD.nodeName === 'TD') {
        that.instance.getSetting('onCellMouseDown', event, coords, TD);
      }
    }
    if (event.button !== 2 && that.instance.settings.onCellDblClick && TD.nodeName === 'TD') { //if not right mouse button
      dblClickOrigin.shift();
      dblClickOrigin.push(TD);
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

      dblClickOrigin.shift();
      dblClickOrigin.push(TD);

      if(dblClickOrigin[4] !== null && dblClickOrigin[3] === dblClickOrigin[2]) {
        if (dblClickTimeout && dblClickOrigin[2] === dblClickOrigin[1] && dblClickOrigin[1] === dblClickOrigin[0]) {
          that.instance.getSetting('onCellDblClick', event, coords, TD);
          clearTimeout(dblClickTimeout);
          dblClickTimeout = null;
        }
        else {
          clearTimeout(dblClickTimeout);
          dblClickTimeout = setTimeout(function () {
            dblClickTimeout = null;
          }, 500);
        }
      }
    }
  };

  $(this.instance.wtTable.parent).on('mousedown', onMouseDown);
  $(this.instance.settings.table).on('mouseover', onMouseOver);
  $(this.instance.wtTable.parent).on('mouseup', onMouseUp);
}