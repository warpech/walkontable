function WalkontableSelection(instance, setting) {
  this.selected = [];
  this.onAdd = function (coords) {
    var TD = instance.wtTable.getCell(coords);
    if (TD) {
      if (setting.className) {
        instance.wtDom.addClass(TD, setting.className);
      }
      if (setting.border) {
        TD.style.outline = setting.border.width + 'px ' + setting.border.style + ' ' + setting.border.color;
      }
    }
  };
  this.onRemove = function (coords) {
    var TD = instance.wtTable.getCell(coords);
    if (TD) {
      if (setting.className) {
        instance.wtDom.removeClass(TD, setting.className);
      }
      if (setting.border) {
        TD.style.outline = '';
      }
    }
  };
}

WalkontableSelection.prototype.add = function (coords) {
  this.selected.push(coords);
  this.onAdd(coords);
};

WalkontableSelection.prototype.remove = function (coords) {
  var index = this.isSelected(coords);
  if (index > -1) {
    this.selected.splice(index, 1);
    this.onRemove(coords);
  }
};

WalkontableSelection.prototype.clear = function () {
  for (var i = 0, ilen = this.selected.length; i < ilen; i++) {
    this.remove(this.selected[i]);
  }
};

WalkontableSelection.prototype.isSelected = function (coords) {
  for (var i = 0, ilen = this.selected.length; i < ilen; i++) {
    if (this.selected[i][0] === coords[0] && this.selected[i][1] === coords[1]) {
      return i;
    }
  }
  return -1;
};

WalkontableSelection.prototype.getSelected = function () {
  return this.selected;
};

/*WalkontableSelection.prototype.rectangleSize = function () {
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
 , height = 0
 , tableSection
 , lastTableSection;

 this.selected.sort(function (a, b) {
 return that.wtCell.colIndex(a) - that.wtCell.colIndex(b);
 });

 this.selected.sort(function (a, b) {
 return that.wtCell.rowIndex(a) - that.wtCell.rowIndex(b);
 });

 for (i = 0, ilen = this.selected.length; i < ilen; i++) {
 tableSection = this.wtDom.closestParent(this.selected[i], ['THEAD', 'TBODY', 'TFOOT', 'TABLE']);
 if(lastTableSection && lastTableSection !== tableSection) {
 return null; //can only select cells that are in the same section (thead, tbody, tfoot or table if none of them is defined)
 }
 lastTableSection = tableSection;

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
 };*/