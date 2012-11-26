function WalkontableTable(instance) {
  //reference to instance
  this.instance = instance;

  //bootstrap from settings
  this.wtDom = new WalkontableDom();
  this.wtDom.removeTextNodes(this.instance.settings.table);
  this.TABLE = this.instance.settings.table;
  this.THEAD = this.instance.settings.table.childNodes[0];
  this.TBODY = this.instance.settings.table.childNodes[1];

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
    , startRow = this.instance.getSetting('startRow')
    , startColumn = this.instance.getSetting('startColumn')
    , displayRows = this.instance.getSetting('displayRows')
    , displayColumns = this.instance.getSetting('displayColumns');
  this.adjustAvailableNodes();

  //draw THEAD
  for (c = 0; c < displayColumns; c++) {
    this.THEAD.childNodes[0].childNodes[c].innerHTML = this.instance.settings.columnHeaders[startColumn + c];
  }

  //draw TBODY
  for (r = 0; r < displayRows; r++) {
    var TR = this.TBODY.childNodes[r];
    for (c = 0; c < displayColumns; c++) {
      var TD = TR.childNodes[c];
      TD.innerHTML = this.instance.settings.data[startRow + r][startColumn + c];
    }
  }
  return this;
};

WalkontableTable.prototype.getCell = function (coords) {
  if (coords[0] >= this.instance.settings.startRow && coords[0] <= this.instance.settings.startRow + this.instance.settings.displayRows) {
    if (coords[1] >= 0 && coords[1] <= this.instance.settings.displayColumns) {
      return this.TBODY.childNodes[coords[0] - this.instance.settings.startRow].childNodes[coords[1]];
    }
  }
  return null;
};