function WalkontableCell() {
  this.wtDom = new WalkontableDom();
}

//code from: http://jsfiddle.net/tUn54/2/
//but "tbody" is changed to "thead, tbody" and "td" is changed to "td, th"
//discussion: http://stackoverflow.com/questions/10966687/how-can-i-find-each-table-cells-visual-location-using-jquery

WalkontableCell.prototype.getCellLocation = function(TD) {
  var TR = this.wtDom.closestParent(TD, 'TR');
  var TABLE = this.wtDom.closestParent(TR, 'TABLE');
  var cols = $(TR).children("td, th").index(TD);
  var rows = $(TABLE).children("thead, tbody").children("tr").index(TR);
  var $cell = $(TD);

  //var cols = cell.closest("tr").children("td, th").index(cell);
  //var rows = cell.closest("table").children("thead, tbody").children("tr").index(cell.closest("tr"));

  $cell.prevAll("td, th").each(function () {
    cols += ($(this).attr("colspan")) ? parseInt($(this).attr("colspan")) - 1 : 0;
  });

  $cell.parent("tr").prevAll("tr").each(function () {
    //get row index for search cells
    var rowindex = $(TABLE).children("thead, tbody").children("tr").index(this);
    // assign the row to a variable for later use
    var row = $(this);
    row.children("td, th").each(function () {
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