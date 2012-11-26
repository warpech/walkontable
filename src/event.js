function WalkontableEvent(instance) {
  var that = this;

  //reference to instance
  this.instance = instance;

  this.wtDom = new WalkontableDom();

  $(this.instance.settings.table).on('mousedown', function (event) {
    var TD = that.wtDom.closest(event.target, ['TD', 'TH']);
    if (TD) { //if not table border
      var coords = that.instance.wtTable.getCoords(TD);

      if (that.instance.areaSelection.isSelected(coords, TD) > -1) {
        that.instance.areaSelection.remove(coords, TD);
      }
      else {
        that.instance.areaSelection.add(coords, TD);
      }

      that.instance.currentSelection.clear();
      that.instance.currentSelection.add(coords, TD);

      if (that.instance.settings.onCurrentChange) {
        that.instance.settings.onCurrentChange(coords);
      }
    }
  });
}