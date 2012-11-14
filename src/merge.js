function WalkontableMerge(onRemove) {
  this.onRemove = onRemove;
}

WalkontableMerge.prototype.merge = function (nodes) {
  var lastRowIndex, lastCellIndex, curRowIndex, curCellIndex, rowSpan = 0, colSpan = 0, i;

  nodes.sort(function (a, b) {
    return a.parentNode.rowIndex - b.parentNode.rowIndex;
  });

  nodes.sort(function (a, b) {
    return a.cellIndex - b.cellIndex;
  });

  for (i = nodes.length - 1; i >= 0; i--) {
    curRowIndex = nodes[i].parentNode.rowIndex;
    curCellIndex = nodes[i].cellIndex;

    if (typeof lastRowIndex !== 'undefined' && (lastRowIndex - curRowIndex > 1 || lastCellIndex - curCellIndex > 1 )) {
      throw new Error("cannot_merge_nonconsecutive_cells");
    }

    if(lastRowIndex !== curRowIndex) {
      rowSpan++;
    }
    if(lastCellIndex !== curCellIndex) {
      colSpan++;
    }

    if (i === 0) {
      if(rowSpan > 1) {
        nodes[0].rowSpan = rowSpan;
      }
      if(colSpan > 1) {
        nodes[0].colSpan = colSpan;
      }
    }
    else {
      nodes[i].parentNode.removeChild(nodes[i]);

    }

    lastRowIndex = curRowIndex;
    lastCellIndex = curCellIndex;
  }
};