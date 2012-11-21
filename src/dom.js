function WalkontableDom() {
}

//returns true is element is detached from DOM
//in IE7-8 detached element has parent HTMLDocument with nodeType 11
WalkontableDom.prototype.isFragment = function (node) {
  return (node.parentNode === null || node.parentNode.nodeType === 11);
};

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

//http://snipplr.com/view/3561/addclass-removeclass-hasclass/
WalkontableDom.prototype.hasClass = function (ele, cls) {
  return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
};

WalkontableDom.prototype.addClass = function (ele, cls) {
  if (!this.hasClass(ele, cls)) ele.className += " " + cls;
};

WalkontableDom.prototype.removeClass = function (ele, cls) {
  if (this.hasClass(ele, cls)) { //is this really needed?
    var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
    ele.className = ele.className.replace(reg, ' ');
  }
};

//http://net.tutsplus.com/tutorials/javascript-ajax/javascript-from-null-cross-browser-event-binding/
WalkontableDom.prototype.addEvent = (function () {
  var that = this;
  if (document.addEventListener) {
    return function (elem, type, cb) {
      if ((elem && !elem.length) || elem === window) {
        elem.addEventListener(type, cb, false);
      }
      else if (elem && elem.length) {
        var len = elem.length;
        for (var i = 0; i < len; i++) {
          that.addEvent(elem[i], type, cb);
        }
      }
    };
  }
  else {
    return function (elem, type, cb) {
      if ((elem && !elem.length) || elem === window) {
        elem.attachEvent('on' + type, function () {

          //normalize
          //http://stackoverflow.com/questions/4643249/cross-browser-event-object-normalization
          var e = window['event'];
          e.target = e.srcElement;
          //e.offsetX = e.layerX;
          //e.offsetY = e.layerY;
          e.relatedTarget = e.relatedTarget || e.type == 'mouseover' ? e.fromElement : e.toElement;
          if (e.target.nodeType === 3) e.target = e.target.parentNode; //Safari bug

          return cb.call(elem, e)
        });
      }
      else if (elem.length) {
        var len = elem.length;
        for (var i = 0; i < len; i++) {
          that.addEvent(elem[i], type, cb);
        }
      }
    };
  }
})();