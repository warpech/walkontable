function WalkontableTable(instance) {
  //reference to instance
  this.instance = instance;

  //bootstrap from settings
  this.TABLE = this.instance.getSetting('table');
  this.wtDom = new WalkontableDom();
  this.wtDom.removeTextNodes(this.TABLE);
  this.TBODY = this.TABLE.getElementsByTagName('TBODY')[0];
  if (!this.TBODY) {
    this.TBODY = document.createElement('TBODY');
    this.TABLE.appendChild(this.TBODY);
  }
  this.THEAD = this.TABLE.getElementsByTagName('THEAD')[0];
  if (!this.THEAD) {
    this.THEAD = document.createElement('THEAD');
    this.TABLE.insertBefore(this.THEAD, this.TBODY);
  }

  if (this.instance.hasSetting('columnHeaders')) {
    if (!this.THEAD.childNodes.length) {
      var TR = document.createElement('TR');
      this.THEAD.appendChild(TR);
    }
  }

  this.availableTRs = 0;
}

WalkontableTable.prototype.adjustAvailableNodes = function () {
  var displayRows = this.instance.getSetting('displayRows')
    , displayColumns = this.instance.getSetting('displayColumns')
    , displayTds = displayColumns
    , TR
    , TH
    , TD;

  if (this.instance.hasSetting('rowHeaders')) {
    displayTds--;
  }

  if (this.instance.hasSetting('columnHeaders')) {
    var availableTHs = this.THEAD.childNodes[0].childNodes.length;
    while (availableTHs < displayColumns) {
      TH = document.createElement('TH');
      this.THEAD.firstChild.appendChild(TH);
      availableTHs++;
    }
  }

  while (this.availableTRs < displayRows) {
    TR = document.createElement('TR');
    if (this.instance.hasSetting('rowHeaders')) {
      TH = document.createElement('TH');
      TR.appendChild(TH);
    }
    for (var c = 0; c < displayTds; c++) {
      TD = document.createElement('TD');
      TR.appendChild(TD);
    }
    this.TBODY.appendChild(TR);
    this.availableTRs++;
  }

  var TRs = this.TABLE.getElementsByTagName('TR');

  for (var r = 0, rlen = TRs.length; r < rlen; r++) {
    while (TRs[r].childNodes.length > displayColumns) {
      TRs[r].removeChild(TRs[r].lastChild);
    }
  }
};

WalkontableTable.prototype.draw = function () {
  var r
    , c
    , offsetRow = this.instance.getSetting('offsetRow')
    , offsetColumn = this.instance.getSetting('offsetColumn')
    , displayRows = this.instance.getSetting('displayRows')
    , displayColumns = this.instance.getSetting('displayColumns')
    , offsetTd = 0
    , displayTds = displayColumns
    , TR
    , TH
    , TD
    , cellData;
  this.adjustAvailableNodes();

  if (this.instance.hasSetting('rowHeaders')) {
    displayTds--;
    offsetTd++;
    if (this.instance.hasSetting('columnHeaders')) {
      this.THEAD.childNodes[0].childNodes[0].innerHTML = '';
    }
  }

  //draw THEAD
  if (this.instance.hasSetting('columnHeaders')) {
    for (c = 0; c < displayTds; c++) {
      this.THEAD.childNodes[0].childNodes[offsetTd + c].innerHTML = this.instance.getSetting('columnHeaders', offsetColumn + c);
    }
  }

  //draw TBODY
  for (r = 0; r < displayRows; r++) {
    TR = this.TBODY.childNodes[r];
    if (this.instance.hasSetting('rowHeaders')) {
      TH = TR.childNodes[0];
      cellData = this.instance.getSetting('rowHeaders', offsetRow + r);
      if (cellData !== void 0) {
        TH.innerHTML = cellData;
      }
      else {
        TH.innerHTML = '';
      }
    }
    for (c = 0; c < displayTds; c++) {
      TD = TR.childNodes[c + offsetTd];
      cellData = this.instance.getSetting('data', offsetRow + r, offsetColumn + c);
      if (cellData !== void 0) {
        TD.innerHTML = cellData;
      }
      else {
        TD.innerHTML = '';
      }
    }
  }
  return this;
};

WalkontableTable.prototype.getCell = function (coords) {
  var offsetRow = this.instance.getSetting('offsetRow')
    , offsetColumn = this.instance.getSetting('offsetColumn')
    , displayRows = this.instance.getSetting('displayRows')
    , displayColumns = this.instance.getSetting('displayColumns');

  if (coords[0] >= offsetRow && coords[0] <= offsetRow + displayRows) {
    if (coords[1] >= offsetColumn && coords[1] <= offsetColumn + displayColumns) {
      return this.TBODY.childNodes[coords[0] - offsetRow].childNodes[coords[1] - offsetColumn];
    }
  }
  return null;
};

WalkontableTable.prototype.getCoords = function (TD) {
  return [
    this.wtDom.prevSiblings(TD.parentNode).length + this.instance.getSetting('offsetRow'),
    TD.cellIndex + this.instance.getSetting('offsetColumn')
  ];
};