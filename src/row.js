function WalkontableRow(wtTable, index) {
  this.wtCell = new WalkontableCell();
  this.wtTable = wtTable;
  this.index = index;
  this.TABLE = wtTable.TABLE;
  this.TR = null;
  this.TSECTION = null;
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
    , colIndex;
  sections : for (s = 0, slen = this.TABLE.childNodes.length; s < slen; s++) {
    for (r = 0, rlen = this.TABLE.childNodes[s].childNodes.length; r < rlen; r++) {
      if (r + sectionOffset === this.index) {
        this.TR = this.TABLE.childNodes[s].childNodes[r];
        this.TSECTION = this.TR.parentNode;
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
  if (this.TR) {
    return row;
  }
  else {
    return null; //row index was not found
  }
};

WalkontableRow.prototype.detach = function () {
  for (var i = 0, ilen = this.cells.length; i < ilen; i++) {
    if (this.cells[i].rowSpan > 1) {
      this.cells[i].rowSpan = this.cells[i].rowSpan - 1;
      var futureNeighbor = this.nextRow().cells[i + 1];
      futureNeighbor.parentNode.insertBefore(this.cells[i], futureNeighbor);
    }
  }
  this.TSECTION.removeChild(this.TR);
};

WalkontableRow.prototype.attach = function () {
  this.TSECTION.insertBefore(this.TR, this.TSECTION.firstChild);
};

WalkontableRow.prototype.nextRow = function () {
  return this.wtTable.getRow(this.index + 1);
};