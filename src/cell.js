function WalkontableCell() {
}

//code from: http://jsfiddle.net/tUn54/2/
//but "tbody" is changed to "table" and "td" is changed to "td, th"
//discussion: http://stackoverflow.com/questions/10966687/how-can-i-find-each-table-cells-visual-location-using-jquery

function getCellLocation(cell) {

  var cols = cell.closest("tr").children("td, th").index(cell);
  var rows = cell.closest("table").children("tr").index(cell.closest("tr"));
  var preColSpans = 0;
  cell.prevAll("td, th").each(function () {
    cols += ($(this).attr("colspan")) ? parseInt($(this).attr("colspan")) - 1 : 0;
  });

  cell.parent("tr").prevAll("tr").each(function () {
    //get row index for search cells
    var rowindex = cell.closest("table").children("tr").index($(this));
    // assign the row to a variable for later use
    var row = $(this);
    row.children("td, th").each(function () {
      // fetch all cells of this row
      var colindex = row.children("td, th").index($(this));
      //check if this cell comes before our cell
      if ($(this).attr("rowspan") && $(this).attr("colspan")) {
        // check if it has both rowspan and colspan, because the single ones are handled before
        var colspn = parseInt($(this).attr("colspan"));
        var rowspn = parseInt($(this).attr("rowspan"));
        //check if it's affecting our cell with those values
        if (
        //is it a prerow?
          rowindex + rowspn > rows
            // is this columns real index greater than current index?
            && colindex + colspn + preColSpans > cols
            //is this column's previous index smaller than current index?
            && colindex + preColSpans - 1 <= cols
          ) {
          //if it's affecting, add this colspan to our cell column index
          cols += colspn;
          preColSpans += colspn;

        }
      }
    });
  });

  return {
    rows: rows,
    cols: cols
  };
}

//calculates column index including colspan & rowspan
WalkontableCell.prototype.colIndex = function (elem) {
  /*var i = 0;
   while ((elem = elem.previousSibling) != null) {
   if(elem.nodeType === 1) {
   console.log(elem, elem.nodeType, typeof elem, elem.innerHTML, elem.colSpan);
   i += elem.colSpan;
   }
   }
   return i;*/
  var loc = getCellLocation($(elem));
  return loc.cols;
};

//calculates row index including rowspan
WalkontableCell.prototype.rowIndex = function (elem) {

  var loc = getCellLocation($(elem));
  return loc.rows;
};