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
    , displayColumns = this.instance.getSetting('displayColumns');

  while (this.availableTRs < displayRows) {
    var TR = document.createElement('TR');
    for (var c = 0; c < displayColumns; c++) {
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
    , columnHeaders = this.instance.getSetting('columnHeaders');
  this.adjustAvailableNodes();

  //draw THEAD
  for (c = 0; c < displayColumns; c++) {
    this.THEAD.childNodes[0].childNodes[c].innerHTML = columnHeaders[offsetColumn + c];
  }

  //draw TBODY
  for (r = 0; r < displayRows; r++) {
    var TR = this.TBODY.childNodes[r];
    for (c = 0; c < displayColumns; c++) {
      var TD = TR.childNodes[c];
      var dataRow = this.instance.settings.data[offsetRow + r];
      var dataCell = dataRow && dataRow[offsetColumn + c];
      if (dataCell) {
        TD.innerHTML = dataCell;
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