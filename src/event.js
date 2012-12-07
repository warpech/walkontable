function WalkontableEvent(instance) {
  var that = this;

  //reference to instance
  this.instance = instance;

  this.wtDom = new WalkontableDom();

  $(this.instance.settings.table).on('mousedown', function (event) {
    if (that.instance.settings.onCellMouseDown) {
      var TD = that.wtDom.closest(event.target, ['TD', 'TH']);
      that.instance.getSetting('onCellMouseDown', event, that.instance.wtTable.getCoords(TD), TD);
    }
  });

  var lastMouseOver;
  $(this.instance.settings.table).on('mouseover', function (event) {
    if (that.instance.settings.onCellMouseOver) {
      var TD = that.wtDom.closest(event.target, ['TD', 'TH']);
      if (TD !== lastMouseOver) {
        lastMouseOver = TD;
        that.instance.getSetting('onCellMouseOver', event, that.instance.wtTable.getCoords(TD), TD);
      }
    }
  });

  var dblClickOrigin
    , dblClickTimeout;
  $(this.instance.settings.table).on('mouseup', function (event) {
    if (event.which !== 2 && that.instance.settings.onCellDblClick) { //if not right mouse button
      var TD = that.wtDom.closest(event.target, ['TD', 'TH']);
      if (dblClickOrigin === TD) {
        that.instance.getSetting('onCellDblClick', event, that.instance.wtTable.getCoords(TD), TD);
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
  });

  //TODO: add border events
  //instance.container.find('.htBorder.current').on('mousedown', onDblClick);
  //instance.container.find('.htBorder.current').on('mouseover', onDblClick);
  //instance.container.find('.htBorder.current').on('dblclick', onDblClick);
}