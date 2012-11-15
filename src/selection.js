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
    , rowBegins = {}
    , rowEnds = {}
    , row
    , col
    , rowSpan
    , colSpan
    , lastRow
    , i
    , ilen
    , j
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
    rowSpan = this.selected[i].rowSpan;
    colSpan = this.selected[i].colSpan;
    for (j = 0; j < rowSpan; j++) {
      if (typeof rowBegins[row + j] === 'undefined' || col < rowBegins[row + j]) {
        rowBegins[row + j] = col;
      }
      if (typeof rowEnds[row + j] === 'undefined' || col + colSpan - 1 > rowEnds[row + j]) {
        rowEnds[row + j] = col + colSpan - 1;
      }
      if (typeof rowLengths[row + j] === 'undefined') {
        rowLengths[row + j] = 0;
        height++;
      }
      rowLengths[row + j] += colSpan;
    }
  }

  if (!ilen) {
    return null; //empty selection
  }

  lastRow = -1;
  for (i in rowBegins) {
    if (rowBegins.hasOwnProperty(i)) {
      if (lastRow !== -1 && rowBegins[i] !== lastRow) {
        return null; //selected rows begin in different column
      }
      lastRow = rowBegins[i];
    }
  }

  lastRow = -1;
  for (i in rowEnds) {
    if (rowEnds.hasOwnProperty(i)) {
      if (lastRow !== -1 && rowEnds[i] !== lastRow) {
        return null; //selected rows end in different column
      }
      if (rowEnds[i] !== rowBegins[i] + rowLengths[i] - 1) {
        return null; //selected rows end does not match begin + length
      }
      lastRow = rowEnds[i];
    }
  }

  lastRow = -1;
  for (i in rowLengths) {
    if (rowLengths.hasOwnProperty(i)) {
      if (lastRow !== -1 && rowLengths[i] !== lastRow) {
        return null; //selected rows have different length
      }
      if (lastRow !== -1 && !rowLengths.hasOwnProperty(i - 1)) {
        return null; //there is a row gap in selection
      }
      lastRow = rowLengths[i];
    }
  }

  return {width: lastRow, height: height};
};