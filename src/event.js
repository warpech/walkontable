function WalkontableEvent(instance) {
  var that = this;

  //reference to instance
  this.instance = instance;

  this.wtDom = new WalkontableDom();

  $(this.instance.settings.table).on('mousedown', function (event) {
    var TD = that.wtDom.closest(event.target, ['TD', 'TH']);
    if (TD) { //if not table border
      /*if (that.instance.areaSelection.isSelected(TD) > -1) {
       that.instance.areaSelection.remove(TD);
       }
       else {
       that.instance.areaSelection.add(TD);
       }

       that.instance.currentSelection.clear();
       that.instance.currentSelection.add(TD);*/

      if (that.instance.settings.onCurrentChange) {
        var coords = [
          that.wtDom.prevSiblings(TD.parentNode).length + that.instance.settings.startRow,
          TD.cellIndex
        ];
        that.instance.settings.onCurrentChange(coords);
      }
    }
  });
}