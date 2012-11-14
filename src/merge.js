function WalkontableMerge() {
  this.wtCell = new WalkontableCell();
}

WalkontableMerge.prototype.mergeSelection = function (wtSelection) {
  var that = this, lastRowIndex, lastCellIndex, curRowIndex, curCellIndex, rowSpan = 0, colSpan = 0, i, nodes;

  if (!wtSelection.isRectangular()) {
    throw new Error("not rec");
  }

  nodes = wtSelection.getSelected();

  nodes.sort(function (a, b) {
    return that.wtCell.rowIndex(a) - that.wtCell.rowIndex(b);
  });

  nodes.sort(function (a, b) {
    return that.wtCell.colIndex(a) - that.wtCell.colIndex(b);
  });

  for (i = nodes.length - 1; i >= 0; i--) {
    curRowIndex = this.wtCell.rowIndex(nodes[i]);
    curCellIndex = this.wtCell.colIndex(nodes[i]);

    if (lastRowIndex !== curRowIndex) {
      rowSpan++;
    }
    if (lastCellIndex !== curCellIndex) {
      colSpan++;
    }

    if (i === 0) {
      if (rowSpan > 1) {
        nodes[0].rowSpan = rowSpan;
      }
      if (colSpan > 1) {
        nodes[0].colSpan = colSpan;
      }
    }
    else {
      nodes[i].parentNode.removeChild(nodes[i]);
      wtSelection.remove(nodes[i]);
    }

    lastRowIndex = curRowIndex;
    lastCellIndex = curCellIndex;
  }

  return true;
};