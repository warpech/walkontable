function WalkontableColumn(wtTable, index) {
  this.wtCell = new WalkontableCell();
  this.TABLE = wtTable.TABLE;
  this.index = index;
  this.cells = this.build();
}

WalkontableColumn.prototype.build = function () {
  var column = []
    , TD
    , colIndex
    , s
    , slen
    , r
    , rlen
    , c
    , clen
    , found;
  for (s = 0, slen = this.TABLE.childNodes.length; s < slen; s++) {
    for (r = 0, rlen = this.TABLE.childNodes[s].childNodes.length; r < rlen; r++) {
      for (c = 0, clen = this.TABLE.childNodes[s].childNodes[r].childNodes.length; c < clen; c++) {
        TD = this.TABLE.childNodes[s].childNodes[r].childNodes[c];
        colIndex = this.wtCell.colIndex(TD);
        if (colIndex > this.index) {
          found = true;
          column.push(column[column.length - 1]); //there was no column with this index in current row, which means previous TD has rowSpan > 1
          break;
        }
        else if (colIndex === this.index || colIndex + TD.colSpan > this.index) {
          found = true;
          column.push(TD);
          break;
        }
      }
    }
  }

  if (found) {
    return column;
  }
  else {
    return null; //column index was not found
  }
};