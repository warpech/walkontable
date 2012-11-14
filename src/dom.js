function WalkontableDom() {
}

//goes up the DOM tree until it finds an element that matches the nodeName
WalkontableDom.prototype.closestParent = function (elem, nodeNames) {
  while ((elem = elem.parentNode) != null) {
    if (elem.nodeType === 1 && nodeNames.indexOf(elem.nodeName) > -1) {
      return elem;
    }
  }
  return null;
};