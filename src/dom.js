function WalkontableDom() {
}

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

WalkontableDom.prototype.removeTextNodes = function (elem, parent) {
  if (elem.nodeType === 3) {
    parent.removeChild(elem); //bye text nodes!
  }
  else if (['TABLE', 'THEAD', 'TBODY', 'TFOOT', 'TR'].indexOf(elem.nodeName) > -1) {
    var childs = elem.childNodes;
    for (var i = childs.length - 1; i >= 0; i--) {
      this.removeTextNodes(childs[i], elem);
    }
  }
};