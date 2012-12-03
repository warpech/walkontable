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
  var totalRows = this.instance.getSetting('totalRows')
    , totalColumns = this.instance.getSetting('totalColumns')
    , displayRows = this.instance.getSetting('displayRows')
    , displayColumns = this.instance.getSetting('displayColumns')
    , displayTds
    , rowHeadersCount = this.instance.hasSetting('rowHeaders') ? 1 : 0
    , TR;

  displayRows = Math.min(displayRows, totalRows);
  displayTds = Math.min(displayColumns, totalColumns);

  if (this.instance.hasSetting('columnHeaders')) {
    var availableTHs = this.THEAD.childNodes[0].childNodes.length;
    while (availableTHs < displayTds + rowHeadersCount) {
      this.THEAD.firstChild.appendChild(document.createElement('TH'));
      availableTHs++;
    }
  }

  while (this.availableTRs < displayRows) {
    TR = document.createElement('TR');
    if (this.instance.hasSetting('rowHeaders')) {
      TR.appendChild(document.createElement('TH'));
    }
    for (var c = 0; c < displayTds; c++) {
      TR.appendChild(document.createElement('TD'));
    }
    this.TBODY.appendChild(TR);
    this.availableTRs++;
  }
  while (this.availableTRs > displayRows) {
    this.TBODY.removeChild(this.TBODY.lastChild);
    this.availableTRs--;
  }

  var TRs = this.TABLE.getElementsByTagName('TR');

  for (var r = 0, rlen = TRs.length; r < rlen; r++) {
    while (TRs[r].childNodes.length < displayTds + rowHeadersCount) {
      TRs[r].appendChild(document.createElement('TD'));
    }
    while (TRs[r].childNodes.length > displayTds + rowHeadersCount) {
      TRs[r].removeChild(TRs[r].lastChild);
    }
  }
};

WalkontableTable.prototype.draw = function () {
  var r
    , c
    , offsetRow = this.instance.getSetting('offsetRow')
    , offsetColumn = this.instance.getSetting('offsetColumn')
    , totalRows = this.instance.getSetting('totalRows')
    , totalColumns = this.instance.getSetting('totalColumns')
    , displayRows = this.instance.getSetting('displayRows')
    , displayColumns = this.instance.getSetting('displayColumns')
    , displayTds
    , rowHeadersCount = this.instance.hasSetting('rowHeaders') ? 1 : 0
    , TR
    , TH
    , TD
    , cellData;
  this.adjustAvailableNodes();

  displayRows = Math.min(displayRows, totalRows);
  displayTds = Math.min(displayColumns, totalColumns);

  if (this.instance.hasSetting('rowHeaders') && this.instance.hasSetting('columnHeaders')) {
    this.THEAD.childNodes[0].childNodes[0].innerHTML = '';
  }

  //draw THEAD
  if (this.instance.hasSetting('columnHeaders')) {
    for (c = 0; c < displayTds; c++) {
      this.THEAD.childNodes[0].childNodes[rowHeadersCount + c].innerHTML = this.instance.getSetting('columnHeaders', offsetColumn + c);
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
      this.instance.getSetting('cellRenderer', offsetRow + r, offsetColumn + c, TR.childNodes[c + rowHeadersCount]);
    }
  }

  //redraw selections
  if (this.instance.selections) {
    for (r in this.instance.selections) {
      if (this.instance.selections.hasOwnProperty(r)) {
        for (c in this.instance.selections[r].selected) {
          if (this.instance.selections[r].selected.hasOwnProperty(c)) {
            TD = this.getCell(this.instance.selections[r].selected[c]);
            if (TD) {
              this.instance.selections[r].onAdd(this.instance.selections[r].selected[c], TD);
            }
          }
        }
      }
    }
  }

  return this;
};

WalkontableTable.prototype.getCell = function (coords) {
  var offsetRow = this.instance.getSetting('offsetRow')
    , offsetColumn = this.instance.getSetting('offsetColumn')
    , displayRows = this.instance.getSetting('displayRows')
    , displayColumns = this.instance.getSetting('displayColumns')
    , rowHeadersCount = this.instance.hasSetting('rowHeaders') ? 1 : 0;

  if (coords[0] >= offsetRow && coords[0] <= offsetRow + displayRows) {
    if (coords[1] >= offsetColumn && coords[1] < offsetColumn + displayColumns) {
      return this.TBODY.childNodes[coords[0] - offsetRow].childNodes[coords[1] - offsetColumn + rowHeadersCount];
    }
  }
  return null;
};

WalkontableTable.prototype.getCoords = function (TD) {
  var rowHeadersCount = this.instance.hasSetting('rowHeaders') ? 1 : 0;
  return [
    this.wtDom.prevSiblings(TD.parentNode).length + this.instance.getSetting('offsetRow'),
    TD.cellIndex + this.instance.getSetting('offsetColumn') - rowHeadersCount
  ];
};