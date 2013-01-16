function WalkontableTable(instance) {
  //reference to instance
  this.instance = instance;
  this.TABLE = this.instance.getSetting('table');
  this.wtDom = new WalkontableDom();
  this.wtDom.removeTextNodes(this.TABLE);

  this.hasEmptyCellProblem = ($.browser.msie && (parseInt($.browser.version, 10) <= 7));
  this.hasCellSpacingProblem = ($.browser.msie && (parseInt($.browser.version, 10) <= 7));

  if (this.hasCellSpacingProblem) { //IE7
    this.TABLE.cellSpacing = 0;
  }

  this.visibilityEdgeRow = this.visibilityEdgeColumn = null;

  //wtSpreader
  var parent = this.TABLE.parentNode;
  if (!parent || parent.nodeType !== 1 || !this.wtDom.hasClass(parent, 'wtHolder')) {
    var spreader = document.createElement('DIV');
    if (this.instance.hasSetting('width') && this.instance.hasSetting('height')) {
      spreader.style.position = 'absolute';
      spreader.style.top = '0';
      spreader.style.left = '0';
      spreader.style.width = '4000px';
      spreader.style.height = '4000px';
    }
    spreader.className = 'wtSpreader';
    if (parent) {
      parent.insertBefore(spreader, this.TABLE); //if TABLE is detached (e.g. in Jasmine test), it has no parentNode so we cannot attach holder to it
    }
    spreader.appendChild(this.TABLE);
  }
  this.spreader = this.TABLE.parentNode;

  //wtHider
  parent = this.spreader.parentNode;
  if (!parent || parent.nodeType !== 1 || !this.wtDom.hasClass(parent, 'wtHolder')) {
    var hider = document.createElement('DIV');
    hider.style.position = 'relative';
    hider.className = 'wtHider';
    if (parent) {
      parent.insertBefore(hider, this.spreader); //if TABLE is detached (e.g. in Jasmine test), it has no parentNode so we cannot attach holder to it
    }
    hider.appendChild(this.spreader);
  }
  this.hider = this.spreader.parentNode;

  //wtHolder
  parent = this.hider.parentNode;
  if (!parent || parent.nodeType !== 1 || !this.wtDom.hasClass(parent, 'wtHolder')) {
    var holder = document.createElement('DIV');
    holder.style.position = 'relative';
    holder.className = 'wtHolder';
    if (parent) {
      parent.insertBefore(holder, this.hider); //if TABLE is detached (e.g. in Jasmine test), it has no parentNode so we cannot attach holder to it
    }
    holder.appendChild(this.hider);
  }
  this.parent = this.hider.parentNode;

  //bootstrap from settings
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

WalkontableTable.prototype.refreshHiderDimensions = function () {
  var height = this.instance.getSetting('height');
  var width = this.instance.getSetting('width');

  if (height || width) {
    this.hider.style.overflow = 'hidden';
  }

  if (height) {
    if (this.instance.wtScroll.wtScrollbarH.visible) {
      this.hider.style.height = height - this.instance.getSetting('scrollbarHeight') + 'px';
    }
    else {
      this.hider.style.height = height + 'px';
    }
  }
  if (width) {
    if (this.instance.wtScroll.wtScrollbarV.visible) {
      this.hider.style.width = width - this.instance.getSetting('scrollbarWidth') + 'px';
    }
    else {
      this.hider.style.width = width + 'px';
    }
  }
};

WalkontableTable.prototype.refreshStretching = function () {
  var stretchH = this.instance.getSetting('stretchH')
    , totalColumns = this.instance.getSetting('totalColumns')
    , displayColumns = this.instance.getSetting('displayColumns')
    , displayTds = Math.min(displayColumns, totalColumns)
    , offsetColumn = this.instance.getSetting('offsetColumn')
    , frozenColumns = this.instance.getSetting('frozenColumns')
    , frozenColumnsCount = frozenColumns ? frozenColumns.length : 0;

  if (stretchH === 'hybrid') {
    if (this.instance.wtScroll.wtScrollbarH.visible) {
      stretchH = 'last';
    }
    else {
      stretchH = 'none';
    }
  }

  if (stretchH === 'all' || stretchH === 'last') {
    var containerWidth = this.instance.getSetting('width');
    if (this.instance.wtScroll.wtScrollbarV.visible) {
      containerWidth -= this.instance.getSetting('scrollbarWidth');
    }

    var domWidth = $(this.instance.wtTable.TABLE).outerWidth();
    var diff = containerWidth - domWidth;
    if (diff > 0) {
      var widths = [];
      var widthSum = 0;
      if (this.instance.hasSetting('columnWidth')) {
        for (var c = 0; c < displayTds; c++) {
          if (this.instance.wtTable.TBODY.firstChild) {
            widths.push($(this.instance.wtTable.TBODY.firstChild.childNodes[c + frozenColumnsCount]).outerWidth()); //this is needed until td contents are clipped to be exactly the width of "columnWidth"
          }
          //widths.push(this.instance.getSetting('columnWidth', offsetColumn + c));
          widthSum += widths[c];
        }

        if (widthSum) {
          if (stretchH === 'all') {
            var newWidth;
            var remainingDiff = diff;
            var ratio = diff / widthSum;

            for (c = 0; c < displayTds; c++) {
              if (widths[c]) {
                if (c === displayTds - 1) {
                  newWidth = widths[c] + remainingDiff;
                }
                else {
                  newWidth = widths[c] + Math.floor(ratio * widths[c]);
                  remainingDiff -= Math.floor(ratio * widths[c]);
                }
              }
              this.instance.wtTable.COLGROUP.childNodes[c + frozenColumnsCount].style.width = newWidth + 'px';
            }
          }
          else {
            if (widths[widths.length - 1]) {
              this.instance.wtTable.COLGROUP.lastChild.style.width = widths[widths.length - 1] + diff + 'px';
            }
          }
        }
      }
    }
  }
};

WalkontableTable.prototype.adjustAvailableNodes = function () {
  var totalRows = this.instance.getSetting('totalRows')
    , totalColumns = this.instance.getSetting('totalColumns')
    , displayRows = this.instance.getSetting('displayRows')
    , displayColumns = this.instance.getSetting('displayColumns')
    , displayTds
    , frozenColumns = this.instance.getSetting('frozenColumns')
    , frozenColumnsCount = frozenColumns ? frozenColumns.length : 0
    , TR
    , c;

  displayRows = Math.min(displayRows, totalRows);
  displayTds = Math.min(displayColumns, totalColumns);

  //adjust COLGROUP
  while (this.colgroupChildrenLength < displayTds + frozenColumnsCount) {
    this.COLGROUP.appendChild(document.createElement('COL'));
    this.colgroupChildrenLength++;
  }
  while (this.colgroupChildrenLength > displayTds + frozenColumnsCount) {
    this.COLGROUP.removeChild(this.COLGROUP.lastChild);
    this.colgroupChildrenLength--;
  }

  //adjust THEAD
  if (this.instance.hasSetting('columnHeaders')) {
    while (this.theadChildrenLength < displayTds + frozenColumnsCount) {
      this.THEAD.firstChild.appendChild(document.createElement('TH'));
      this.theadChildrenLength++;
    }
    while (this.theadChildrenLength > displayTds + frozenColumnsCount) {
      this.THEAD.firstChild.removeChild(this.THEAD.firstChild.lastChild);
      this.theadChildrenLength--;
    }
  }

  //adjust TBODY
  while (this.tbodyChildrenLength < displayRows) {
    TR = document.createElement('TR');
    for (c = 0; c < frozenColumnsCount; c++) {
      TR.appendChild(document.createElement('TH'));
    }
    for (c = 0; c < displayTds; c++) {
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
    while (trChildrenLength < displayTds + frozenColumnsCount) {
      TRs[r].appendChild(document.createElement('TD'));
      trChildrenLength++;
    }
    while (trChildrenLength > displayTds + frozenColumnsCount) {
      TRs[r].removeChild(TRs[r].lastChild);
      trChildrenLength--;
    }
  }
};

WalkontableTable.prototype.draw = function (selectionsOnly) {
  if (!selectionsOnly) {
    this.tableOffset = this.wtDom.offset(this.TABLE);
    //this.TABLE.removeChild(this.TBODY); //possible future optimization - http://jsperf.com/table-scrolling/9
    this.adjustAvailableNodes();
    this._doDraw(selectionsOnly);
    //this.TABLE.appendChild(this.TBODY);
  }

  //redraw selections and scrollbars
  if (this.instance.hasSetting('async')) {
    var that = this;
    window.cancelRequestAnimFrame(this.selectionsFrame);
    that.selectionsFrame = window.requestAnimFrame(function () {
      that.refreshPositions(selectionsOnly);
    });
  }
  else {
    this.refreshPositions(selectionsOnly);
  }

  this.instance.drawn = true;

  //this.instance.scrollViewport([this.instance.getSetting('offsetRow'), this.instance.getSetting('offsetColumn')]); //needed by WalkontableScroll -> remove row from the last scroll page should scroll viewport a row up if needed
  return this;
};

WalkontableTable.prototype._doDraw = function () {
  var r
    , c
    , offsetRow = this.instance.getSetting('offsetRow')
    , offsetColumn = this.instance.getSetting('offsetColumn')
    , totalRows = this.instance.getSetting('totalRows')
    , totalColumns = this.instance.getSetting('totalColumns')
    , displayRows = this.instance.getSetting('displayRows')
    , displayColumns = this.instance.getSetting('displayColumns')
    , displayTds
    , frozenColumns = this.instance.getSetting('frozenColumns')
    , frozenColumnsCount = frozenColumns ? frozenColumns.length : 0
    , TR
    , TH
    , TD
    , cellData;

  displayRows = Math.min(displayRows, totalRows);
  displayTds = Math.min(displayColumns, totalColumns);

  //draw COLGROUP
  for (c = 0; c < this.colgroupChildrenLength; c++) {
    if (c < frozenColumnsCount) {
      this.wtDom.addClass(this.COLGROUP.childNodes[c], 'rowHeader');
      if (typeof frozenColumns[c] === "function") {
        frozenColumns[c](null, this.COLGROUP.childNodes[c])
      }
    }
    else {
      this.wtDom.removeClass(this.COLGROUP.childNodes[c], 'rowHeader');
    }
  }

  var width;
  if (this.instance.hasSetting('columnWidth')) {
    for (c = 0; c < displayTds; c++) {
      width = this.instance.getSetting('columnWidth', offsetColumn + c);
      if (width) {
        this.COLGROUP.childNodes[c + frozenColumnsCount].style.width = this.instance.getSetting('columnWidth', offsetColumn + c) + 'px';
      }
      else {
        this.COLGROUP.childNodes[c + frozenColumnsCount].style.width = '';
      }
    }
  }

  //draw THEAD
  if (frozenColumnsCount && this.instance.hasSetting('columnHeaders')) {
    for (c = 0; c < frozenColumnsCount; c++) {
      TH = this.THEAD.childNodes[0].childNodes[c];
      if (typeof frozenColumns[c] === "function") {
        frozenColumns[c](null, TH);
      }
      else {
        TH.innerHTML = '';
      }
      if (this.hasEmptyCellProblem && TH.innerHTML === '') { //IE7
        TH.innerHTML = '&nbsp;';
      }
    }
  }

  if (this.instance.hasSetting('columnHeaders')) {
    for (c = 0; c < displayTds; c++) {
      this.instance.getSetting('columnHeaders', offsetColumn + c, this.THEAD.childNodes[0].childNodes[frozenColumnsCount + c]);
    }
  }

  //draw TBODY
  this.visibilityEdgeRow = this.visibilityEdgeColumn = null;
  for (r = 0; r < displayRows; r++) {
    TR = this.TBODY.childNodes[r];
    for (c = 0; c < frozenColumnsCount; c++) { //in future use nextSibling; http://jsperf.com/nextsibling-vs-indexed-childnodes
      TH = TR.childNodes[c];
      cellData = typeof frozenColumns[c] === "function" ? frozenColumns[c](offsetRow + r, TH) : frozenColumns[c];
      if (cellData !== void 0) {
        TH.innerHTML = cellData;
      }
      /*
       we can assume that frozenColumns[c] function took care of inserting content into TH
       else {
       TH.innerHTML = '';
       }*/
    }
    for (c = 0; c < displayTds; c++) { //in future use nextSibling; http://jsperf.com/nextsibling-vs-indexed-childnodes
      if (this.visibilityEdgeColumn !== null && offsetColumn + c > this.visibilityEdgeColumn) {
        break;
      }
      else {
        TD = TR.childNodes[c + frozenColumnsCount];
        TD.className = '';
        this.instance.getSetting('cellRenderer', offsetRow + r, offsetColumn + c, TD);
        if (this.hasEmptyCellProblem && TD.innerHTML === '') { //IE7
          TD.innerHTML = '&nbsp;';
        }

        var visibility = this.isCellVisible(TD);
        if (this.visibilityEdgeRow === null && this.visibilityEdgeColumn === null && visibility === 1 && c !== 0) {
          this.visibilityEdgeColumn = offsetColumn + c;
        }
        if (this.visibilityEdgeRow === null && visibility === 1 && c === 0) {
          this.visibilityEdgeRow = offsetRow + r;
        }
      }
    }
    if (this.visibilityEdgeRow !== null && offsetRow + r > this.visibilityEdgeRow) {
      break;
    }
  }

  this.refreshSelections();
};

WalkontableTable.prototype.refreshPositions = function (selectionsOnly) {
  if (selectionsOnly) { //otherwise it was already rendered by _doDraw
    this.refreshSelections(selectionsOnly);
  }

  this.instance.wtScroll.refreshScrollbars();
};

WalkontableTable.prototype.refreshSelections = function (selectionsOnly) {
  var r;
  if (this.instance.selections) {
    for (r in this.instance.selections) {
      if (this.instance.selections.hasOwnProperty(r)) {
        this.instance.selections[r].draw(selectionsOnly);
      }
    }
  }
};

WalkontableTable.prototype.isCellVisible = function (TD) {
  var out
    , scrollV = this.instance.getSetting('scrollV')
    , scrollH = this.instance.getSetting('scrollH')
    , cellOffset = this.wtDom.offset(TD)
    , tableOffset = this.tableOffset
    , innerOffsetTop = cellOffset.top - tableOffset.top
    , innerOffsetLeft = cellOffset.left - tableOffset.left
    , $td = $(TD)
    , width = $td.outerWidth()
    , height = $td.outerHeight()
    , tableWidth = this.instance.hasSetting('width') ? this.instance.getSetting('width') : Infinity
    , tableHeight = this.instance.hasSetting('height') ? this.instance.getSetting('height') : Infinity;

  if (scrollV === 'auto' || scrollV === 'scroll' || scrollV === 'hybrid') {
    tableHeight -= this.instance.getSetting('scrollbarHeight'); //at this point we don't really know if the scrollbars are visible, so let's assume they are
  }
  if (scrollH === 'auto' || scrollH === 'scroll' || scrollH === 'hybrid') {
    tableWidth -= this.instance.getSetting('scrollbarWidth'); //at this point we don't really know if the scrollbars are visible, so let's assume they are
  }

  /**
   * Legend:
   * 0 - not visible
   * 1 - partially visible
   * 2 - visible
   */

  if (innerOffsetTop > tableHeight) {
    out = 0;
  }
  else if (innerOffsetLeft > tableWidth) {
    out = 0;
  }
  else if (innerOffsetTop + height > tableHeight) {
    out = 1;
  }
  else if (innerOffsetLeft + width > tableWidth) {
    out = 1;
  }
  else {
    out = 2;
  }

  return out;
};

/**
 * getCell
 * @param {Array} coords
 * @return {Object} HTMLElement on success or {Number} one of the exit codes on error:
 *  -1 row before viewport
 *  -2 row after viewport
 *  -3 column before viewport
 *  -4 column after viewport
 *
 */
WalkontableTable.prototype.getCell = function (coords) {
  var offsetRow = this.instance.getSetting('offsetRow');
  if (coords[0] < offsetRow) {
    return -1; //row before viewport
  }
  else if (coords[0] > offsetRow + this.instance.getSetting('displayRows') - 1) {
    return -2; //row after viewport
  }
  else {
    var offsetColumn = this.instance.getSetting('offsetColumn');
    if (coords[1] < offsetColumn) {
      return -3; //column before viewport
    }
    else if (coords[1] > offsetColumn + this.instance.getSetting('displayColumns') - 1) {
      return -4; //column after viewport
    }
    else {
      var frozenColumns = this.instance.getSetting('frozenColumns')
        , frozenColumnsCount = frozenColumns ? frozenColumns.length : 0;
      return this.TBODY.childNodes[coords[0] - offsetRow].childNodes[coords[1] - offsetColumn + frozenColumnsCount];
    }
  }
};

WalkontableTable.prototype.getCoords = function (TD) {
  var frozenColumns = this.instance.getSetting('frozenColumns')
    , frozenColumnsCount = frozenColumns ? frozenColumns.length : 0;
  return [
    this.wtDom.prevSiblings(TD.parentNode).length + this.instance.getSetting('offsetRow'),
    TD.cellIndex + this.instance.getSetting('offsetColumn') - frozenColumnsCount
  ];
};