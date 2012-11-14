function WalkontableCell() {
  this.wtDom = new WalkontableDom();
}

//code from: http://jsfiddle.net/tUn54/2/
//but "tbody" is changed to "thead, tbody" and "td" is changed to "td, th"
//discussion: http://stackoverflow.com/questions/10966687/how-can-i-find-each-table-cells-visual-location-using-jquery

WalkontableCell.prototype.getCellLocation = function(TD) {
  var that = this;
  var TR = this.wtDom.closestParent(TD, ['TR']);
  var TABLE = this.wtDom.closestParent(TR, ['TABLE']);
  var TDs = this.wtDom.children(TR);
  var TRs = this.wtDom.nodeListToArray(TABLE.getElementsByTagName('TR'));
  var cols = TDs.indexOf(TD);
  var rows = TRs.indexOf(TR);

  var tmpRowSpan;
  var tmpColSpan;
  $(this.wtDom.prevSiblings(TD)).each(function () {
    tmpColSpan = this.colSpan;
    if(tmpColSpan > 1) {
      cols += tmpColSpan - 1;
    }
  });

  $(this.wtDom.prevSiblings(TR)).each(function () {
    //get row index for search cells
    var rowindex = TRs.indexOf(this);
    // assign the row to a variable for later use
    var TDs = that.wtDom.children(this);
    $(TDs).each(function () {
      tmpRowSpan = this.rowSpan;
      tmpColSpan = this.colSpan;

      // fetch all cells of this row
      if (tmpRowSpan > 1) {
        // check if it has both rowspan and colspan, because the single ones are handled before

        //check if it's affecting our cell with those values
        if (
        //is it a prerow?
          rowindex + tmpRowSpan >= rows
          ) {
          //if it's affecting, add this colspan to our cell column index
          cols += tmpColSpan;
        }
      }
    });
  });

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