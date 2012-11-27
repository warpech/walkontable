function Walkontable(settings) {
  var that = this;

  //default settings
  var defaults = {
    table: void 0,
    data: void 0,
    startRow: 0,
    startColumn: 0,
    totalRows: function () {
      return that.settings.data.length;
    },
    totalColumns: function () {
      if(that.settings.data[0]) {
        return that.settings.data[0].length;
      }
      else {
        throw new Error('Cannot estimate total number of columns because the data source is empty. Please provide totalColumns in settings');
      }
    },
    displayRows: function () {
      return that.getSetting('totalRows'); //display all rows by default
    },
    displayColumns: function () {
      if (that.wtTable.THEAD.childNodes[0].childNodes.length) {
        return that.wtTable.THEAD.childNodes[0].childNodes.length;
      }
      else {
        return that.getSetting('totalColumns'); //display all columns by default
      }
    },
    onCurrentChange: void 0
  };

  //reference to settings
  this.settings = {};
  for (var i in defaults) {
    if (defaults.hasOwnProperty(i)) {
      if (settings[i] !== void 0) {
        this.settings[i] = settings[i];
      }
      else {
        this.settings[i] = defaults[i];
      }
    }
  }

  //bootstrap from settings
  this.wtTable = new WalkontableTable(this);
  this.wtScrollV = new WalkontableScroll(this, 'vertical');
  this.wtScrollH = new WalkontableScroll(this, 'horizontal');
  this.wtWheel = new WalkontableWheel(this);
  this.wtEvent = new WalkontableEvent(this);
  this.wtDom = new WalkontableDom();
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
  this.wtScrollV.refresh();
  this.wtScrollH.refresh();
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

Walkontable.prototype.getSetting = function (key) {
  if (typeof this.settings[key] === 'function') {
    return this.settings[key]();
  }
  else {
    return this.settings[key];
  }
};