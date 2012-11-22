function Walkontable(settings) {
  var that = this;

  //reference to settings
  this.settings = settings;

  //bootstrap from settings
  this.wtTable = new WalkontableTable(this);
  this.wtScroll = new WalkontableScroll(this);
  this.wtWheel = new WalkontableWheel(this);
  this.wtEvent = new WalkontableEvent(this);
  this.wtDom = new WalkontableDom();
  if (this.settings.displayColumns === void 0) {
    this.settings.displayColumns = this.wtTable.THEAD.childNodes[0].childNodes.length;
    this.settings.columnHeaders = this.wtTable.THEAD.childNodes[0].childNodes.length;
  }
  if (this.settings.columnHeaders === void 0) {
    this.settings.columnHeaders = [];
    for (var c = 0, clen = this.wtTable.THEAD.childNodes[0].childNodes.length; c < clen; c++) {
      this.settings.columnHeaders.push(this.wtTable.THEAD.childNodes[0].childNodes[c].innerHTML);
    }
  }
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

Walkontable.prototype.scrollVertical = function (delta) {
  var max = this.settings.data.length - 1 - this.settings.displayRows;
  this.settings.startRow = this.settings.startRow + delta;
  if (this.settings.startRow < 0) {
    this.settings.startRow = 0;
  }
  else if (this.settings.startRow >= max) {
    this.settings.startRow = max;
  }
  return this;
};

Walkontable.prototype.scrollHorizontal = function (delta) {
  var max = this.settings.data[0].length - 1 - this.settings.displayColumns;
  this.settings.startColumn = this.settings.startColumn + delta;
  if (this.settings.startColumn < 0) {
    this.settings.startColumn = 0;
  }
  else if (this.settings.startColumn >= max) {
    this.settings.startColumn = max;
  }
  return this;
};