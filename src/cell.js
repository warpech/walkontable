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

  $(this.wtDom.prevSiblings(TD)).each(function () {
    cols += ($(this).attr("colspan")) ? parseInt($(this).attr("colspan")) - 1 : 0;
  });

  $(this.wtDom.prevSiblings(TR)).each(function () {
    //get row index for search cells
    var rowindex = TRs.indexOf(this);
    // assign the row to a variable for later use
    var TDs = that.wtDom.children(this);
    $(TDs).each(function () {
      // fetch all cells of this row
      if ($(this).attr("rowspan") || $(this).attr("colspan")) {
        // check if it has both rowspan and colspan, because the single ones are handled before
        //var colspn = parseInt($(this).attr("colspan") || 1);
        var colspn = 1;
        var rowspn = parseInt($(this).attr("rowspan") || 1);

        //check if it's affecting our cell with those values
        if (colspn == 1 && rowspn == 1) {
          return;
        }
        if (
        //is it a prerow?
          rowindex + rowspn >= rows
          ) {
          //if it's affecting, add this colspan to our cell column index
          cols += colspn;
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