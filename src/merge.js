function WalkontableMerge() {
  this.wtCell = new WalkontableCell();
}

WalkontableMerge.prototype.mergeSelection = function (wtSelection) {
  var i
    , nodes
    , rect = wtSelection.rectangleSize();

  if (!rect) {
    return false;
  }

  nodes = wtSelection.getSelected();

  for (i = nodes.length - 1; i >= 0; i--) {
    if (i === 0) {
      if (rect.height > 1) {
        nodes[0].rowSpan = rect.height;
      }
      if (rect.width > 1) {
        nodes[0].colSpan = rect.width;
      }
    }
    else {
      nodes[i].parentNode.removeChild(nodes[i]);
      wtSelection.remove(nodes[i]);
    }
  }

  return true;
};