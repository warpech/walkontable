function Walkontable(settings) {
  var that = this;

  //reference to settings
  this.settings = settings;

  //bootstrap from settings
  this.wtTable = new WalkontableTable(this);
  this.wtScroll = new WalkontableScroll(this);
  this.wtEvent = new WalkontableEvent(this);
  this.wtDom = new WalkontableDom();
  this.displayColumns = this.wtTable.THEAD.childNodes[0].childNodes.length;
  this.drawn = false;

  this.currentSelection = new WalkontableSelection(function (coords) {
    var TD = that.wtTable.getCell(coords);
    that.wtDom.addClass(TD, 'current');
  }, function (coords) {
    var TD = that.wtTable.getCell(coords);
    that.wtDom.removeClass(TD, 'current');
  });

  this.areaSelection = new WalkontableSelection(function (coords) {
    var TD = that.wtTable.getCell(coords);
    that.wtDom.addClass(TD, 'selected');
  }, function (coords) {
    var TD = that.wtTable.getCell(coords);
    that.wtDom.removeClass(TD, 'selected');
  });
}

Walkontable.prototype.draw = function () {
  this.wtTable.draw();
  this.wtScroll.refresh();
  this.drawn = true;
  return this;
};

Walkontable.prototype.update = function (settings) {
  for (var i in settings) {
    if (settings.hasOwnProperty(i)) {
      this.settings[i] = settings[i];
    }
  }
  return this;
};