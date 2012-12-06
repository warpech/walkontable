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
  this.COLGROUP = this.TABLE.getElementsByTagName('COLGROUP')[0];
  if (!this.COLGROUP) {
    this.COLGROUP = document.createElement('COLGROUP');
    this.TABLE.insertBefore(this.COLGROUP, this.THEAD);
  }

  if (this.instance.hasSetting('columnHeaders')) {
    if (!this.THEAD.childNodes.length) {
      var TR = document.createElement('TR');
      this.THEAD.appendChild(TR);
    }
  }

  this.colgroupChildrenLength = this.COLGROUP.childNodes.length;
  this.theadChildrenLength = this.THEAD.firstChild ? this.THEAD.firstChild.childNodes.length : 0;
  this.tbodyChildrenLength = this.TBODY.childNodes.length;
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

  //adjust COLGROUP
  while (this.colgroupChildrenLength < displayTds + rowHeadersCount) {
    this.COLGROUP.appendChild(document.createElement('COL'));
    this.colgroupChildrenLength++;
  }
  while (this.colgroupChildrenLength > displayTds + rowHeadersCount) {
    this.COLGROUP.removeChild(this.COLGROUP.lastChild);
    this.colgroupChildrenLength--;
  }

  //adjust THEAD
  if (this.instance.hasSetting('columnHeaders')) {
    while (this.theadChildrenLength < displayTds + rowHeadersCount) {
      this.THEAD.firstChild.appendChild(document.createElement('TH'));
      this.theadChildrenLength++;
    }
    while (this.theadChildrenLength > displayTds + rowHeadersCount) {
      this.THEAD.firstChild.removeChild(this.THEAD.firstChild.lastChild);
      this.theadChildrenLength--;
    }
  }

  //adjust TBODY
  while (this.tbodyChildrenLength < displayRows) {
    TR = document.createElement('TR');
    if (this.instance.hasSetting('rowHeaders')) {
      TR.appendChild(document.createElement('TH'));
    }
    for (var c = 0; c < displayTds; c++) {
      TR.appendChild(document.createElement('TD'));
    }
    this.TBODY.appendChild(TR);
    this.tbodyChildrenLength++;
  }
  while (this.tbodyChildrenLength > displayRows) {
    this.TBODY.removeChild(this.TBODY.lastChild);
    this.tbodyChildrenLength--;
  }

  var TRs = this.TBODY.childNodes;
  var trChildrenLength;
  for (var r = 0, rlen = TRs.length; r < rlen; r++) {
    trChildrenLength = TRs[r].childNodes.length;
    while (trChildrenLength < displayTds + rowHeadersCount) {
      TRs[r].appendChild(document.createElement('TD'));
      trChildrenLength++;
    }
    while (trChildrenLength > displayTds + rowHeadersCount) {
      TRs[r].removeChild(TRs[r].lastChild);
      trChildrenLength--;
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
  this.tableOffset = this.wtDom.offset(this.TABLE);

  displayRows = Math.min(displayRows, totalRows);
  displayTds = Math.min(displayColumns, totalColumns);

  //draw COLGROUP
  if (this.instance.hasSetting('rowHeaders')) {
    this.wtDom.addClass(this.COLGROUP.childNodes[0], 'rowHeader');
  }
  else {
    this.wtDom.removeClass(this.COLGROUP.childNodes[0], 'rowHeader');
  }

  if (this.instance.hasSetting('columnWidth')) {
    for (c = 0; c < displayTds; c++) {
      this.COLGROUP.childNodes[c + rowHeadersCount].style.width = this.instance.getSetting('columnWidth', offsetColumn + c) + 'px';
    }
  }

  //draw THEAD
  if (this.instance.hasSetting('rowHeaders') && this.instance.hasSetting('columnHeaders')) {
    this.THEAD.childNodes[0].childNodes[0].innerHTML = '';
  }

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
    for (c = 0; c < displayTds; c++) { //in future use nextSibling; http://jsperf.com/nextsibling-vs-indexed-childnodes
      TD = TR.childNodes[c + rowHeadersCount];
      TD.className = '';
      this.instance.getSetting('cellRenderer', offsetRow + r, offsetColumn + c, TD);
    }
  }

  //redraw selections
  if (this.instance.selections) {
    for (r in this.instance.selections) {
      if (this.instance.selections.hasOwnProperty(r)) {
        this.instance.selections[r].draw();
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

  if (coords[0] >= offsetRow && coords[0] <= offsetRow + displayRows - 1) {
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