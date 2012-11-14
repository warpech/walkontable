function WalkontableDom() {
}

//goes up the DOM tree until it finds an element that matches the nodeName
WalkontableDom.prototype.closestParent = function (elem, nodeName) {
  while ((elem = elem.parentNode) != null) {
    if (elem.nodeType === 1 && elem.nodeName === nodeName) {
      return elem;
    }
  }
  return null;
};