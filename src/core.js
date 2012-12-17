function Walkontable(settings) {
  var that = this;
  var originalHeaders = [];

  //default settings. void 0 means it is required, null means it can be empty
  this.defaults = {
    table: void 0,
    async: false,
    data: void 0,
    offsetRow: 0,
    offsetColumn: 0,
    frozenColumns: null,
    columnHeaders: false,
    totalRows: void 0,
    totalColumns: void 0,
    width: null,
    height: null,
    displayRows: null,
    displayColumns: null,
    cellRenderer: function (row, column, TD) {
      var cellData = that.getSetting('data', row, column);
      if (cellData !== void 0) {
        TD.innerHTML = cellData;
      }
      else {
        TD.innerHTML = '';
      }
    },
    columnWidth: null,
    selections: null,
    onCellMouseDown: null,
    onCellMouseOver: null,
    onCellDblClick: null,
    onCellCornerMouseDown: null,
    onCellCornerDblClick: null,
    scrollbarWidth: 9,
    scrollbarHeight: 9
  };

  //reference to settings
  this.settings = {};
  for (var i in this.defaults) {
    if (this.defaults.hasOwnProperty(i)) {
      if (settings[i] !== void 0) {
        this.settings[i] = settings[i];
      }
      else if (this.defaults[i] === void 0) {
        throw new Error('A required setting "' + i + '" was not provided');
      }
      else {
        this.settings[i] = this.defaults[i];
      }
    }
  }

  //bootstrap from settings
  this.wtTable = new WalkontableTable(this);
  this.wtScroll = new WalkontableScroll(this);
  this.wtWheel = new WalkontableWheel(this);
  this.wtEvent = new WalkontableEvent(this);
  this.wtDom = new WalkontableDom();

  //find original headers
  if (this.wtTable.THEAD.childNodes.length && this.wtTable.THEAD.childNodes[0].childNodes.length) {
    for (var c = 0, clen = this.wtTable.THEAD.childNodes[0].childNodes.length; c < clen; c++) {
      originalHeaders.push(this.wtTable.THEAD.childNodes[0].childNodes[c].innerHTML);
    }
    if (!this.hasSetting('columnHeaders')) {
      this.settings.columnHeaders = function (column) {
        return originalHeaders[column];
      }
    }
  }

  //initialize selections
  this.selections = {};
  if (this.settings.selections) {
    for (i in this.settings.selections) {
      if (this.settings.selections.hasOwnProperty(i)) {
        this.selections[i] = new WalkontableSelection(this, this.settings.selections[i]);
      }
    }
  }

  this.drawn = false;
}

Walkontable.prototype.draw = function (selectionsOnly) {
  //this.instance.scrollViewport([this.instance.getSetting('offsetRow'), this.instance.getSetting('offsetColumn')]); //needed by WalkontableScroll -> remove row from the last scroll page should scroll viewport a row up if needed
  if (this.hasSetting('async')) {
    var that = this;
    that.drawFrame = setTimeout(function () {
      that._doDraw(selectionsOnly);
    }, 0);
  }
  else {
    this._doDraw(selectionsOnly);
  }
  return this;
};

Walkontable.prototype._doDraw = function (selectionsOnly) {
  selectionsOnly = selectionsOnly && this.settings.offsetRow === this.lastOffsetRow && this.settings.offsetColumn === this.lastOffsetColumn;
  this.lastOffsetRow = this.settings.offsetRow;
  this.lastOffsetColumn = this.settings.offsetColumn;
  this.wtTable.draw(selectionsOnly);
};

Walkontable.prototype.update = function (settings, value) {
  if (value === void 0) { //settings is object
    for (var i in settings) {
      if (settings.hasOwnProperty(i)) {
        this.settings[i] = settings[i];
      }
    }
  }
  else { //if value is defined then settings is the key
    this.settings[settings] = value;
  }
  return this;
};

Walkontable.prototype.scrollVertical = function (delta) {
  return this.wtScroll.scrollVertical(delta);
};

Walkontable.prototype.scrollHorizontal = function (delta) {
  return this.wtScroll.scrollHorizontal(delta);
};

Walkontable.prototype.scrollViewport = function (coords) {
  if (this.hasSetting('async')) {
    var that = this;
    that.scrollFrame = setTimeout(function () {
      that.wtScroll.scrollViewport(coords);
    }, 0);
  }
  else {
    this.wtScroll.scrollViewport(coords);
  }
  return this;
};

Walkontable.prototype.getSetting = function (key, param1, param2, param3) {
  if (key === 'displayRows' && this.settings['height']) {
    return Math.min(this.settings['height'] / 20, this.getSetting('totalRows') - this.getSetting('offsetRow')); //silly assumption but should be fine for now
  }
  else if (key === 'displayColumns' && this.settings['width']) {
    return Math.min(this.settings['width'] / 50, this.getSetting('totalColumns') - this.getSetting('offsetColumn')); //silly assumption but should be fine for now
  }
  else if (key === 'displayRows' && this.settings['displayRows'] === null) {
    return this.getSetting('totalRows');
  }
  else if (key === 'displayColumns' && this.settings['displayColumns'] === null) {
    return this.settings['rowHeaders'] ? this.getSetting('totalColumns') + 1 : this.getSetting('totalColumns');
  }
  else if (key === 'viewportRows') {
    if (this.wtTable.visibilityEdgeRow) {
      return this.wtTable.visibilityEdgeRow - this.getSetting('offsetRow');
    }
    return this.getSetting('displayRows');
  }
  else if (key === 'viewportColumns') {
    if (this.wtTable.visibilityEdgeColumn) {
      return this.wtTable.visibilityEdgeColumn - this.getSetting('offsetColumn');
    }
    return this.getSetting('displayColumns');
  }

  if (typeof this.settings[key] === 'function') {
    return this.settings[key](param1, param2, param3);
  }
  else if (param1 !== void 0 && Object.prototype.toString.call(this.settings[key]) === '[object Array]' && param1 !== void 0) {
    return this.settings[key][param1];
  }
  else {
    return this.settings[key];
  }
};

Walkontable.prototype.hasSetting = function (key) {
  return !!this.settings[key]
};