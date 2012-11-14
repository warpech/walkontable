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
  var rowLengths = {}
    , row
    , last
    , i
    , ilen
    , j
    , jlen
    , height = 0;

  for (i = 0, ilen = this.selected.length; i < ilen; i++) {
    row = this.wtCell.rowIndex(this.selected[i]);
    for (j = 0, jlen = this.selected[i].rowSpan; j < jlen; j++) {
      if (typeof rowLengths[row + j] === 'undefined') {
        rowLengths[row + j] = 0;
        height++;
      }
      rowLengths[row + j] += this.selected[i].colSpan;
    }
  }

  if (!ilen) {
    return null;
  }

  for (i in rowLengths) {
    if (rowLengths.hasOwnProperty(i)) {
      if (typeof last !== 'undefined' && rowLengths[i] !== last) {
        return null;
      }
      last = rowLengths[i];
    }
  }

  return {width: last, height: height};
};