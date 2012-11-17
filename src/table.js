function WalkontableTable(TABLE) {
  this.TABLE = TABLE;
  this.wtCell = new WalkontableCell();
}

WalkontableTable.prototype.getRow = function (index) {
  var row = []
    , TD
    , s
    , slen
    , r
    , rlen
    , c
    , clen
    , i
    , sectionOffset = 0
    , col
  //, totalCols = this.TABLE.childNodes[0].childNodes[0].length
    , colIndex;
  sections : for (s = 0, slen = this.TABLE.childNodes.length; s < slen; s++) {
    for (r = 0, rlen = this.TABLE.childNodes[s].childNodes.length; r < rlen; r++) {
      if (r + sectionOffset === index) {
        col = 0;
        for (c = 0, clen = this.TABLE.childNodes[s].childNodes[r].childNodes.length; c < clen; c++) {
          TD = this.TABLE.childNodes[s].childNodes[r].childNodes[c];
          colIndex = this.wtCell.colIndex(TD);
          while (col < colIndex) {
            var TD2 = this.getColumn(col)[index];
            for (i = TD2.colSpan; i > 0; i--) {
              row.push(TD2);
              col++;
            }
          }
          for (i = TD.colSpan; i > 0; i--) {
            row.push(TD);
            col++;
          }
        }
        break sections;
      }
    }
    sectionOffset += rlen;
  }
  return row;
};

WalkontableTable.prototype.getColumn = function (index) {
  var column = []
    , TD
    , colIndex
    , s
    , slen
    , r
    , rlen
    , c
    , clen;
  for (s = 0, slen = this.TABLE.childNodes.length; s < slen; s++) {
    for (r = 0, rlen = this.TABLE.childNodes[s].childNodes.length; r < rlen; r++) {
      for (c = 0, clen = this.TABLE.childNodes[s].childNodes[r].childNodes.length; c < clen; c++) {
        TD = this.TABLE.childNodes[s].childNodes[r].childNodes[c];
        colIndex = this.wtCell.colIndex(TD);
        if (colIndex > index) {
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