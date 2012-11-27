function WalkontableTable(instance) {
  //reference to instance
  this.instance = instance;

  //bootstrap from settings
  this.TABLE = this.instance.getSetting('table');
  this.wtDom = new WalkontableDom();
  this.wtDom.removeTextNodes(this.TABLE);
  this.THEAD = this.TABLE.childNodes[0];
  this.TBODY = this.TABLE.childNodes[1];

  this.availableTRs = 0;
}

WalkontableTable.prototype.adjustAvailableNodes = function () {
  var displayRows = this.instance.getSetting('displayRows')
    , displayColumns = this.instance.getSetting('displayColumns')
    , displayTds = displayColumns;

  if (this.instance.hasSetting('rowHeaders')) {
    displayTds--;
  }

  while (this.availableTRs < displayRows) {
    var TR = document.createElement('TR');
    if (this.instance.hasSetting('rowHeaders')) {
      var TH = document.createElement('TH');
      TR.appendChild(TH);
    }
    for (var c = 0; c < displayTds; c++) {
      var TD = document.createElement('TD');
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
    , rowData
    , cellData;
  this.adjustAvailableNodes();

  if (this.instance.hasSetting('rowHeaders')) {
    displayTds--;
    offsetTd++;
    this.THEAD.childNodes[0].childNodes[0].innerHTML = '';
  }

  //draw THEAD
  for (c = 0; c < displayTds; c++) {
    this.THEAD.childNodes[0].childNodes[offsetTd + c].innerHTML = this.instance.getSetting('columnHeaders', offsetColumn + c);
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
      rowData = this.instance.settings.data[offsetRow + r];
      cellData = rowData && rowData[offsetColumn + c];
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