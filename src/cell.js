function WalkontableCell() {
  this.wtDom = new WalkontableDom();
}

//code from: http://jsfiddle.net/tUn54/2/
//but "tbody" is changed to "thead, tbody" and "td" is changed to "td, th"
//discussion: http://stackoverflow.com/questions/10966687/how-can-i-find-each-table-cells-visual-location-using-jquery

WalkontableCell.prototype.getCellLocation = function (TD) {
  var that = this
    , TR = this.wtDom.closestParent(TD, ['TR'])
    , TABLE = this.wtDom.closestParent(TR, ['TABLE'])
    , TDs = this.wtDom.children(TR)
    , TRs = this.wtDom.nodeListToArray(TABLE.getElementsByTagName('TR'))
    , cols = TDs.indexOf(TD)
    , rows = TRs.indexOf(TR)

    , i
    , ilen
    , j
    , jlen

    , prevTDs
    , prevTRs
    , tmpRowSpan
    , tmpColSpan
    , rowindex;

  prevTDs = this.wtDom.prevSiblings(TD);
  for (i = 0, ilen = prevTDs.length; i < ilen; i++) {
    tmpColSpan = prevTDs[i].colSpan;
    if (tmpColSpan > 1) {
      cols += tmpColSpan - 1;
    }
  }

  prevTRs = this.wtDom.prevSiblings(TR);
  for (i = 0, ilen = prevTRs.length; i < ilen; i++) { //get row index for search cells
    rowindex = TRs.indexOf(prevTRs[i]); // assign the row to a variable for later use
    prevTDs = that.wtDom.children(prevTRs[i]);
    for (j = 0, jlen = prevTDs.length; j < jlen; j++) {// fetch all cells of this row
      tmpRowSpan = prevTDs[j].rowSpan;
      tmpColSpan = prevTDs[j].colSpan;
      if (tmpRowSpan > 1) {//check if it's affecting our cell with those values
        if (rowindex + tmpRowSpan >= rows //if row is affecting
          && that.colIndex(prevTDs[j]) < cols //and col is before our col
          ) { //if it's affecting, add this colspan to our cell column index
          cols += tmpColSpan;
        }
      }
    }
  }

  return {
    rows: rows,
    cols: cols
  };
};

//calculates column index including colspan & rowspan
WalkontableCell.prototype.colIndex = function (elem) {
  var loc = this.getCellLocation(elem);
  return loc.cols;
};

//calculates row index including rowspan
WalkontableCell.prototype.rowIndex = function (elem) {
  var loc = this.getCellLocation(elem);
  return loc.rows;
};