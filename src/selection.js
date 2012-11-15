function WalkontableSelection(onAdd, onRemove) {
  this.selected = [];
  this.onAdd = onAdd; //optional
  this.onRemove = onRemove; //optional
  this.wtCell = new WalkontableCell();
}

WalkontableSelection.prototype.add = function (TD) {
  this.selected.push(TD);
  if (this.onAdd) {
    this.onAdd(TD);
  }
};

WalkontableSelection.prototype.remove = function (TD) {
  var index = this.isSelected(TD);
  if (index > -1) {
    this.selected.splice(index, 1);
    if (this.onRemove) {
      this.onRemove(TD);
    }
  }
};

WalkontableSelection.prototype.clear = function () {
  for (var i = 0, ilen = this.selected.length; i < ilen; i++) {
    this.remove(this.selected[i]);
  }
};

WalkontableSelection.prototype.isSelected = function (TD) {
  return this.selected.indexOf(TD);
};

WalkontableSelection.prototype.getSelected = function () {
  return this.selected;
};

WalkontableSelection.prototype.rectangleSize = function () {
  var that = this
    , rowLengths = {}
    , row
    , col
    , lastRow = -1
    , lastFirstCol = -1
    , lastCol = -1
    , lastColSpan = -1
    , i
    , ilen
    , j
    , jlen
    , height = 0;

  this.selected.sort(function (a, b) {
    return that.wtCell.colIndex(a) - that.wtCell.colIndex(b);
  });

  this.selected.sort(function (a, b) {
    return that.wtCell.rowIndex(a) - that.wtCell.rowIndex(b);
  });

  for (i = 0, ilen = this.selected.length; i < ilen; i++) {
    row = this.wtCell.rowIndex(this.selected[i]);
    col = this.wtCell.colIndex(this.selected[i]);
    for (j = 0, jlen = this.selected[i].rowSpan; j < jlen; j++) {
      if (typeof rowLengths[row + j] === 'undefined') {
        if (lastFirstCol !== -1 && lastFirstCol !== col) {
          return null; //rectangular selection must always begin on the same column
        }
        if (lastRow !== -1 && row - lastRow > 1) {
          return null; //selected rows must be consecutive
        }
        lastFirstCol = col;
        rowLengths[row + j] = 0;
        height++;
      }
      else {
        if (lastCol !== -1 && col - (lastCol + lastColSpan - 1) > 1) {
          return null; //selected cols must be consecutive
        }
      }
      rowLengths[row + j] += this.selected[i].colSpan;
      lastCol = col;
      lastColSpan = this.selected[i].colSpan;
      lastRow = row;
    }
  }

  if (!ilen) {
    return null;
  }

  lastRow = -1;
  for (i in rowLengths) {
    if (rowLengths.hasOwnProperty(i)) {
      if (lastRow !== -1 && rowLengths[i] !== lastRow) {
        return null;
      }
      lastRow = rowLengths[i];
    }
  }

  return {width: lastRow, height: height};
};