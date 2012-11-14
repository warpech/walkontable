function Walkontable(TABLE) {
  var that = this;
  this.wtDom = new WalkontableDom();
  this.wtMerge = new WalkontableMerge();
  this.currentSelection = new WalkontableSelection(function (TD) {
    TD.style.backgroundColor = "blue";
  }, function (TD) {
    TD.style.backgroundColor = "white";
  });
  this.areaSelection = new WalkontableSelection(function (TD) {
    TD.style.border = "1px solid red";
  }, function (TD) {
    TD.style.border = "1px solid white";
  });

  TABLE.addEventListener('click', function (event) {
    var TD = that.wtDom.closest(event.target, ['TD', 'TH']);
    if (TD) { //if not table border
      if (that.areaSelection.isSelected(TD) > -1) {
        that.areaSelection.remove(TD);
      }
      else {
        that.areaSelection.add(TD);
      }

      that.currentSelection.clear();
      that.currentSelection.add(TD);
    }
  });
}
