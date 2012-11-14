function WalkontableDom() {
}

//goes up the DOM tree (including given element) until it finds an element that matches the nodeName
WalkontableDom.prototype.closest = function (elem, nodeNames) {
  while (elem != null) {
    if (elem.nodeType === 1 && nodeNames.indexOf(elem.nodeName) > -1) {
      return elem;
    }
    elem = elem.parentNode;
  }
  return null;
};

//goes up the DOM tree until it finds an element that matches the nodeName
WalkontableDom.prototype.closestParent = function (elem, nodeNames) {
  return this.closest(elem.parentNode, nodeNames);
};

WalkontableDom.prototype.children = function (elem) {
  var out = [];
  var nodes = elem.childNodes;
  for (var i = 0, ilen = nodes.length; i < ilen; i++) {
    if (nodes[i].nodeType === 1) {
      out.push(nodes[i]);
    }
  }
  return out;
};

WalkontableDom.prototype.prevSiblings = function (elem) {
  var out = [];
  while ((elem = elem.previousSibling) != null) {
    if (elem.nodeType === 1) {
      out.push(elem);
    }
  }
  return out;
};

//http://jsperf.com/nodelist-to-array/11
WalkontableDom.prototype.nodeListToArray = function (nodeList) {
  var l = []; // Will hold the array of Node's
  for (var i = 0, ll = nodeList.length; i != ll; l.push(nodeList[i++])) {
  }
  return l;
};