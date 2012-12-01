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
}