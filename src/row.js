function WalkontableRow(wtTable, index) {
  this.wtCell = new WalkontableCell();
  this.wtTable = wtTable;
  this.TABLE = wtTable.TABLE;
  this.index = index;
  this.cells = this.build();
}

WalkontableRow.prototype.build = function () {
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
    , colIndex
    , found;
  sections : for (s = 0, slen = this.TABLE.childNodes.length; s < slen; s++) {
    for (r = 0, rlen = this.TABLE.childNodes[s].childNodes.length; r < rlen; r++) {
      if (r + sectionOffset === this.index) {
        found = true;
        col = 0;
        for (c = 0, clen = this.TABLE.childNodes[s].childNodes[r].childNodes.length; c < clen; c++) {
          TD = this.TABLE.childNodes[s].childNodes[r].childNodes[c];
          colIndex = this.wtCell.colIndex(TD);
          while (col < colIndex) {
            var TD2 = this.wtTable.getColumn(col).cells[this.index];
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
  if (found) {
    return row;
  }
  else {
    return null; //row index was not found
  }
};