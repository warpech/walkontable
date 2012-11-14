function WalkontableMerge(onRemove) {
  this.onRemove = onRemove;
}

WalkontableMerge.prototype.merge = function (nodes) {
  nodes[0].colSpan = nodes.length;
  for (var i = 0, ilen = nodes.length; i < ilen; i++) {
    if (i > 0) {
      nodes[i].parentNode.removeChild(nodes[i]);
      this.onRemove(nodes[i]);
    }
  }
};