function WalkontableTable(TABLE) {
  this.TABLE = TABLE;
  this.wtCell = new WalkontableCell();
}

WalkontableTable.prototype.getColumn = function (index) {
  var column = []
    , TD
    , colIndex
    , s
    , r
    , c;
  for (s = 0, slen = this.TABLE.childNodes.length; s < slen; s++) {
    for (r = 0, rlen = this.TABLE.childNodes[s].childNodes.length; r < rlen; r++) {
      for (c = 0, clen = this.TABLE.childNodes[s].childNodes[r].childNodes.length; c < clen; c++) {
        TD = this.TABLE.childNodes[s].childNodes[r].childNodes[c];
        colIndex = this.wtCell.colIndex(TD);
        if(colIndex > index) {
          column.push(column[column.length - 1]); //there was no column with this index in current row, which means previous TD has rowSpan > 1
          break;
        }
        else if (colIndex === index || colIndex + TD.colSpan > index) {
          column.push(TD);
          break;
        }
      }
    }
  }
  return column;
};