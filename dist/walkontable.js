/**
 * walkontable 0.2.0
 * 
 * Date: Sun Mar 31 2013 19:31:08 GMT+0200 (Central European Daylight Time)
*/

function WalkontableBorder(instance, settings) {
  var style;

  //reference to instance
  this.instance = instance;
  this.settings = settings;
  this.wtDom = this.instance.wtDom;

  this.main = document.createElement("div");
  style = this.main.style;
  style.position = 'absolute';
  style.top = 0;
  style.left = 0;

  for (var i = 0; i < 5; i++) {
    var DIV = document.createElement('DIV');
    DIV.className = 'wtBorder ' + (settings.className || '');
    style = DIV.style;
    style.backgroundColor = settings.border.color;
    style.height = settings.border.width + 'px';
    style.width = settings.border.width + 'px';
    this.main.appendChild(DIV);
  }

  this.top = this.main.childNodes[0];
  this.left = this.main.childNodes[1];
  this.bottom = this.main.childNodes[2];
  this.right = this.main.childNodes[3];

  this.topStyle = this.top.style;
  this.leftStyle = this.left.style;
  this.bottomStyle = this.bottom.style;
  this.rightStyle = this.right.style;

  this.corner = this.main.childNodes[4];
  this.corner.className += ' corner';
  this.cornerStyle = this.corner.style;
  this.cornerStyle.width = '5px';
  this.cornerStyle.height = '5px';
  this.cornerStyle.border = '2px solid #FFF';

  this.disappear();
  instance.wtTable.hider.appendChild(this.main);
}

/**
 * Show border around one or many cells
 * @param {Array} corners
 */
WalkontableBorder.prototype.appear = function (corners) {
  var isMultiple, $from, $to, fromOffset, toOffset, containerOffset, top, minTop, left, minLeft, height, width;
  if (this.disabled) {
    return;
  }

  var offsetRow = this.instance.getSetting('offsetRow')
    , offsetColumn = this.instance.getSetting('offsetColumn')
    , displayRows = this.instance.getSetting('displayRows')
    , displayColumns = this.instance.getSetting('displayColumns');

  var hideTop = false, hideLeft = false, hideBottom = false, hideRight = false;

  if (displayRows !== null) {
    if (corners[0] > offsetRow + displayRows - 1 || corners[2] < offsetRow) {
      hideTop = hideLeft = hideBottom = hideRight = true;
    }
    else {
      if (corners[0] < offsetRow) {
        corners[0] = offsetRow;
        hideTop = true;
      }
      if (corners[2] > offsetRow + displayRows - 1) {
        corners[2] = offsetRow + displayRows - 1;
        hideBottom = true;
      }
    }
  }

  if (displayColumns !== null) {
    if (corners[1] > offsetColumn + displayColumns - 1 || corners[3] < offsetColumn) {
      hideTop = hideLeft = hideBottom = hideRight = true;
    }
    else {
      if (corners[1] < offsetColumn) {
        corners[1] = offsetColumn;
        hideLeft = true;
      }
      if (corners[3] > offsetColumn + displayColumns - 1) {
        corners[3] = offsetColumn + displayColumns - 1;
        hideRight = true;
      }
    }
  }

  if (hideTop + hideLeft + hideBottom + hideRight < 4) { //at least one border is not hidden
    isMultiple = (corners[0] !== corners[2] || corners[1] !== corners[3]);
    $from = $(this.instance.wtTable.getCell([corners[0], corners[1]]));
    $to = isMultiple ? $(this.instance.wtTable.getCell([corners[2], corners[3]])) : $from;
    fromOffset = this.wtDom.offset($from[0]);
    toOffset = isMultiple ? this.wtDom.offset($to[0]) : fromOffset;
    containerOffset = this.wtDom.offset(this.instance.wtTable.TABLE);

    minTop = fromOffset.top;
    height = toOffset.top + $to.outerHeight() - minTop;
    minLeft = fromOffset.left;
    width = toOffset.left + $to.outerWidth() - minLeft;

    top = minTop - containerOffset.top - 1;
    left = minLeft - containerOffset.left - 1;

    if (parseInt($from.css('border-top-width'), 10) > 0) {
      top += 1;
      height -= 1;
    }
    if (parseInt($from.css('border-left-width'), 10) > 0) {
      left += 1;
      width -= 1;
    }
  }

  if (hideTop) {
    this.topStyle.display = 'none';
  }
  else {
    this.topStyle.top = top + 'px';
    this.topStyle.left = left + 'px';
    this.topStyle.width = width + 'px';
    this.topStyle.display = 'block';
  }

  if (hideLeft) {
    this.leftStyle.display = 'none';
  }
  else {
    this.leftStyle.top = top + 'px';
    this.leftStyle.left = left + 'px';
    this.leftStyle.height = height + 'px';
    this.leftStyle.display = 'block';
  }

  var delta = Math.floor(this.settings.border.width / 2);

  if (hideBottom) {
    this.bottomStyle.display = 'none';
  }
  else {
    this.bottomStyle.top = top + height - delta + 'px';
    this.bottomStyle.left = left + 'px';
    this.bottomStyle.width = width + 'px';
    this.bottomStyle.display = 'block';
  }

  if (hideRight) {
    this.rightStyle.display = 'none';
  }
  else {
    this.rightStyle.top = top + 'px';
    this.rightStyle.left = left + width - delta + 'px';
    this.rightStyle.height = height + 1 + 'px';
    this.rightStyle.display = 'block';
  }

  if (hideBottom && hideRight || !this.hasSetting(this.settings.border.cornerVisible)) {
    this.cornerStyle.display = 'none';
  }
  else {
    this.cornerStyle.top = top + height - 4 + 'px';
    this.cornerStyle.left = left + width - 4 + 'px';
    this.cornerStyle.display = 'block';
  }
};

/**
 * Hide border
 */
WalkontableBorder.prototype.disappear = function () {
  this.topStyle.display = 'none';
  this.leftStyle.display = 'none';
  this.bottomStyle.display = 'none';
  this.rightStyle.display = 'none';
  this.cornerStyle.display = 'none';
};

WalkontableBorder.prototype.hasSetting = function (setting) {
  if (typeof setting === 'function') {
    return setting();
  }
  return !!setting;
};
function Walkontable(settings) {
  var self = this,
      originalHeaders = [];

  //bootstrap from settings
  this.wtSettings = new WalkontableSettings(this, settings);
  this.wtDom = new WalkontableDom(this);
  this.wtTable = new WalkontableTable(this);
  this.wtScroll = new WalkontableScroll(this);
  this.wtWheel = new WalkontableWheel(this);
  this.wtEvent = new WalkontableEvent(this);

  //find original headers
  if (this.wtTable.THEAD.childNodes.length && this.wtTable.THEAD.childNodes[0].childNodes.length) {
    for (var c = 0, clen = this.wtTable.THEAD.childNodes[0].childNodes.length; c < clen; c++) {
      originalHeaders.push(this.wtTable.THEAD.childNodes[0].childNodes[c].innerHTML);
    }
    if (!this.hasSetting('columnHeaders')) {
      this.update('columnHeaders', function (column, TH) {
        self.wtDom.avoidInnerHTML(TH, originalHeaders[column]);
      });
    }
  }

  //initialize selections
  this.selections = {};
  var selectionsSettings = this.getSetting('selections');
  if (selectionsSettings) {
    for (var i in selectionsSettings) {
      if (selectionsSettings.hasOwnProperty(i)) {
        this.selections[i] = new WalkontableSelection(this, selectionsSettings[i]);
      }
    }
  }

  this.drawn = false;
}

Walkontable.prototype.draw = function (selectionsOnly) {
  //this.instance.scrollViewport([this.instance.getSetting('offsetRow'), this.instance.getSetting('offsetColumn')]); //needed by WalkontableScroll -> remove row from the last scroll page should scroll viewport a row up if needed
  if (this.hasSetting('async')) {
    var that = this;
    that.drawTimeout = setTimeout(function () {
      that._doDraw(selectionsOnly);
    }, 0);
  }
  else {
    this._doDraw(selectionsOnly);
  }
  return this;
};

Walkontable.prototype._doDraw = function (selectionsOnly) {
  selectionsOnly = selectionsOnly && this.getSetting('offsetRow') === this.lastOffsetRow && this.getSetting('offsetColumn') === this.lastOffsetColumn;
  if (this.drawn) {
    this.scrollVertical(0);
    this.scrollHorizontal(0);
  }
  this.lastOffsetRow = this.getSetting('offsetRow');
  this.lastOffsetColumn = this.getSetting('offsetColumn');
  this.wtTable.draw(selectionsOnly);
  this.getSetting('onDraw');
};

Walkontable.prototype.update = function (settings, value) {
  return this.wtSettings.update(settings, value);
};

Walkontable.prototype.scrollVertical = function (delta) {
  return this.wtScroll.scrollVertical(delta);
};

Walkontable.prototype.scrollHorizontal = function (delta) {
  return this.wtScroll.scrollHorizontal(delta);
};

Walkontable.prototype.scrollViewport = function (coords) {
  if (this.hasSetting('async')) {
    var that = this;
    clearTimeout(that.scrollTimeout);
    that.scrollTimeout = setTimeout(function () {
      that.wtScroll.scrollViewport(coords);
    }, 0);
  }
  else {
    this.wtScroll.scrollViewport(coords);
  }
  return this;
};

Walkontable.prototype.getViewport = function () {
  //TODO change it to draw values only (add this.wtTable.visibilityStartRow, this.wtTable.visibilityStartColumn)
  return [
    this.getSetting('offsetRow'),
    this.getSetting('offsetColumn'),
    this.wtTable.visibilityEdgeRow !== null ? this.wtTable.visibilityEdgeRow : this.getSetting('totalRows') - 1,
    this.wtTable.visibilityEdgeColumn !== null ? this.wtTable.visibilityEdgeColumn : this.getSetting('totalColumns') - 1
  ];
};

Walkontable.prototype.getSetting = function (key, param1, param2, param3) {
  return this.wtSettings.getSetting(key, param1, param2, param3);
};

Walkontable.prototype.hasSetting = function (key) {
  return this.wtSettings.has(key);
};

Walkontable.prototype.destroy = function () {
  clearTimeout(this.drawTimeout);
  clearTimeout(this.scrollTimeout);
  clearTimeout(this.wheelTimeout);
  clearTimeout(this.dblClickTimeout);
  clearTimeout(this.selectionsTimeout);
};
function WalkontableDom(instance) {
  if (instance) {
    this.instance = instance;
  }
  this.tdCache = [];
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

WalkontableDom.prototype.prevSiblings = function (elem) {
  var out = [];
  while ((elem = elem.previousSibling) != null) {
    if (elem.nodeType === 1) {
      out.push(elem);
    }
  }
  return out;
};

WalkontableDom.prototype.tdHasClass = function (trIndex, tdIndex, cls) {
  return !!(this.tdCache[trIndex] && this.tdCache[trIndex][tdIndex] && this.tdCache[trIndex][tdIndex][cls]);
};

WalkontableDom.prototype.tdAddClass = function (trIndex, tdIndex, cls) {
  if (!this.tdHasClass(trIndex, tdIndex, cls)) {
    if (!this.tdCache[trIndex]) {
      this.tdCache[trIndex] = [];
    }
    if (!this.tdCache[trIndex][tdIndex]) {
      this.tdCache[trIndex][tdIndex] = {};
      this.tdCache[trIndex][tdIndex]._node = this.instance.wtTable.getCell([trIndex + this.instance.getSetting('offsetRow'), tdIndex + this.instance.getSetting('offsetColumn')]);
    }
    this.tdCache[trIndex][tdIndex]._node.className += " " + cls;
    this.tdCache[trIndex][tdIndex][cls] = true;
  }
};

WalkontableDom.prototype.tdRemoveClass = function (trIndex, tdIndex, cls) {
  if (this.tdHasClass(trIndex, tdIndex, cls)) {
    var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
    this.tdCache[trIndex][tdIndex]._node.className = this.tdCache[trIndex][tdIndex]._node.className.replace(reg, ' ').replace(/^\s\s*/, '').replace(/\s\s*$/, ''); //last 2 replaces do right trim (see http://blog.stevenlevithan.com/archives/faster-trim-javascript)
    this.tdCache[trIndex][tdIndex][cls] = false;
  }
};

WalkontableDom.prototype.tdResetCache = function () {
  for (var i in this.tdCache) {
    if (this.tdCache.hasOwnProperty(i)) {
      for (var j in this.tdCache[i]) {
        if (this.tdCache[i].hasOwnProperty(j)) {
          for (var k in this.tdCache[i][j]) {
            if (this.tdCache[i][j].hasOwnProperty(k)) {
              if (k !== '_node') {
                this.tdCache[i][j][k] = false;
              }
            }
          }
        }
      }
    }
  }
};

if (document.documentElement.classList) {
  // HTML5 classList API
  WalkontableDom.prototype.hasClass = function (ele, cls) {
    return ele.classList.contains(cls);
  };

  WalkontableDom.prototype.addClass = function (ele, cls) {
    ele.classList.add(cls);
  };

  WalkontableDom.prototype.removeClass = function (ele, cls) {
    ele.classList.remove(cls);
  };
}
else {
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
      ele.className = ele.className.replace(reg, ' ').replace(/^\s\s*/, '').replace(/\s\s*$/, ''); //last 2 replaces do right trim (see http://blog.stevenlevithan.com/archives/faster-trim-javascript)
    }
  };
}

/*//http://net.tutsplus.com/tutorials/javascript-ajax/javascript-from-null-cross-browser-event-binding/
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

 WalkontableDom.prototype.triggerEvent = function (element, eventName, target) {
 var event;
 if (document.createEvent) {
 event = document.createEvent("MouseEvents");
 event.initEvent(eventName, true, true);
 } else {
 event = document.createEventObject();
 event.eventType = eventName;
 }

 event.eventName = eventName;
 event.target = target;

 if (document.createEvent) {
 target.dispatchEvent(event);
 } else {
 target.fireEvent("on" + event.eventType, event);
 }
 };*/

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

/**
 * Remove childs function
 * WARNING - this doesn't unload events and data attached by jQuery
 * http://jsperf.com/jquery-html-vs-empty-vs-innerhtml/9
 * @param element
 * @returns {void}
 */
//
WalkontableDom.prototype.empty = function (element) {
  var child;
  while (child = element.lastChild) {
    element.removeChild(child);
  }
};

/**
 * Insert content into element trying avoid innerHTML method.
 * @return {void}
 */
WalkontableDom.prototype.avoidInnerHTML = function (element, content) {
  if ((/(<(.*)>|&(.*);)/g).test(content)) {
    element.innerHTML = content;
  } else {
    var child;
    while (child = element.lastChild) {
      element.removeChild(child);
    }

    element.appendChild(document.createTextNode(content));
  }
};

/**
 * seems getBounding is usually faster: http://jsperf.com/offset-vs-getboundingclientrect/4
 * but maybe offset + cache would work?
 * edit: after more tests turns out offsetLeft/Top is faster
 */

WalkontableDom.prototype.offset = function (elem) {
  var offsetLeft = elem.offsetLeft
    , offsetTop = elem.offsetTop;
  while (elem = elem.offsetParent) {
    offsetLeft += elem.offsetLeft;
    offsetTop += elem.offsetTop;
  }
  return {
    left: offsetLeft,
    top: offsetTop
  };
};
function WalkontableEvent(instance) {
  var that = this;

  //reference to instance
  this.instance = instance;

  this.wtDom = this.instance.wtDom;

  var dblClickOrigin = [null, null, null, null];
  this.instance.dblClickTimeout = null;

  var onMouseDown = function (event) {
    var cell = that.parentCell(event.target);

    if (cell.TD && cell.TD.nodeName === 'TD') {
      if (that.instance.hasSetting('onCellMouseDown')) {
        that.instance.getSetting('onCellMouseDown', event, cell.coords, cell.TD);
      }
    }
    else if (that.wtDom.hasClass(event.target, 'corner')) {
      that.instance.getSetting('onCellCornerMouseDown', event, event.target);
    }

    if (event.button !== 2) { //if not right mouse button
      if (cell.TD && cell.TD.nodeName === 'TD') {
        dblClickOrigin.shift();
        dblClickOrigin.push(cell.TD);
      }
      else if (that.wtDom.hasClass(event.target, 'corner')) {
        dblClickOrigin.shift();
        dblClickOrigin.push(event.target);
      }
    }
  };

  var lastMouseOver;
  var onMouseOver = function (event) {
    if (that.instance.hasSetting('onCellMouseOver')) {
      var TD = that.wtDom.closest(event.target, ['TD', 'TH']);
      if (TD && TD !== lastMouseOver) {
        lastMouseOver = TD;
        if (TD.nodeName === 'TD') {
          that.instance.getSetting('onCellMouseOver', event, that.instance.wtTable.getCoords(TD), TD);
        }
      }
    }
  };

  var onMouseUp = function (event) {
    if (event.button !== 2) { //if not right mouse button
      var cell = that.parentCell(event.target);

      if (cell.TD && cell.TD.nodeName === 'TD') {
        dblClickOrigin.shift();
        dblClickOrigin.push(cell.TD);
      }
      else {
        dblClickOrigin.shift();
        dblClickOrigin.push(event.target);
      }

      if (dblClickOrigin[3] !== null && dblClickOrigin[3] === dblClickOrigin[2]) {
        if (that.instance.dblClickTimeout && dblClickOrigin[2] === dblClickOrigin[1] && dblClickOrigin[1] === dblClickOrigin[0]) {
          if (cell.TD) {
            that.instance.getSetting('onCellDblClick', event, cell.coords, cell.TD);
          }
          else if (that.wtDom.hasClass(event.target, 'corner')) {
            that.instance.getSetting('onCellCornerDblClick', event, cell.coords, cell.TD);
          }

          clearTimeout(that.instance.dblClickTimeout);
          that.instance.dblClickTimeout = null;
        }
        else {
          clearTimeout(that.instance.dblClickTimeout);
          that.instance.dblClickTimeout = setTimeout(function () {
            that.instance.dblClickTimeout = null;
          }, 500);
        }
      }
    }
  };

  $(this.instance.wtTable.parent).on('mousedown', onMouseDown);
  $(this.instance.wtTable.TABLE).on('mouseover', onMouseOver);
  $(this.instance.wtTable.parent).on('mouseup', onMouseUp);
}

WalkontableEvent.prototype.parentCell = function (elem) {
  var cell = {};
  cell.TD = this.wtDom.closest(elem, ['TD', 'TH']);
  if (cell.TD) {
    cell.coords = this.instance.wtTable.getCoords(cell.TD);
  }
  else if (!cell.TD && this.wtDom.hasClass(elem, 'wtBorder') && this.wtDom.hasClass(elem, 'current') && !this.wtDom.hasClass(elem, 'corner')) {
    cell.coords = this.instance.selections.current.selected[0];
    cell.TD = this.instance.wtTable.getCell(cell.coords);
  }
  return cell;
};
//http://stackoverflow.com/questions/3629183/why-doesnt-indexof-work-on-an-array-ie8
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (elt /*, from*/) {
    var len = this.length >>> 0;

    var from = Number(arguments[1]) || 0;
    from = (from < 0)
      ? Math.ceil(from)
      : Math.floor(from);
    if (from < 0)
      from += len;

    for (; from < len; from++) {
      if (from in this &&
        this[from] === elt)
        return from;
    }
    return -1;
  };
}

/**
 * http://notes.jetienne.com/2011/05/18/cancelRequestAnimFrame-for-paul-irish-requestAnimFrame.html
 */
window.requestAnimFrame = (function () {
  return  window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (/* function */ callback, /* DOMElement */ element) {
      return window.setTimeout(callback, 1000 / 60);
    };
})();

window.cancelRequestAnimFrame = (function () {
  return window.cancelAnimationFrame ||
    window.webkitCancelRequestAnimationFrame ||
    window.mozCancelRequestAnimationFrame ||
    window.oCancelRequestAnimationFrame ||
    window.msCancelRequestAnimationFrame ||
    clearTimeout
})();
function WalkontableScroll(instance) {
  this.instance = instance;
  this.wtScrollbarV = new WalkontableScrollbar(instance, 'vertical');
  this.wtScrollbarH = new WalkontableScrollbar(instance, 'horizontal');
}

WalkontableScroll.prototype.refreshScrollbars = function () {
  this.wtScrollbarH.prepare();
  this.wtScrollbarV.prepare();
  this.instance.wtTable.recalcViewportCells();
  this.wtScrollbarH.refresh();
  this.wtScrollbarV.refresh();
};

WalkontableScroll.prototype.scrollVertical = function (delta) {
  if (!this.instance.drawn) {
    throw new Error('scrollVertical can only be called after table was drawn to DOM');
  }

  var offsetRow = this.instance.getSetting('offsetRow')
    , newOffsetRow = offsetRow + delta;

  if (newOffsetRow > 0) {
    var totalRows = this.instance.getSetting('totalRows');
    var height = (this.instance.getSetting('height') || Infinity) - this.instance.getSetting('scrollbarHeight'); //Infinity is needed, otherwise you could scroll a table that did not have height specified

    if (newOffsetRow >= totalRows) {
      newOffsetRow = totalRows - 1;
    }

    var TD = this.instance.wtTable.TBODY.firstChild.firstChild;
    if (TD.nodeName === 'TH') {
      TD = TD.nextSibling;
    }
    var cellOffset = this.instance.wtDom.offset(TD);
    var tableOffset = this.instance.wtTable.tableOffset;

    var sum = cellOffset.top - tableOffset.top;
    var row = newOffsetRow;
    while (sum < height && row < totalRows) {
      sum += this.instance.getSetting('rowHeight', row);
      row++;
    }

    if (sum < height) {
      while (newOffsetRow > 0) {
        //if sum still less than available height, we cannot scroll that far (must move offset up)
        sum += this.instance.getSetting('rowHeight', newOffsetRow - 1);
        if (sum < height) {
          newOffsetRow--;
        }
        else {
          break;
        }
      }
    }
  }
  else if (newOffsetRow < 0) {
    newOffsetRow = 0;
  }

  if (newOffsetRow !== offsetRow) {
    this.instance.update('offsetRow', newOffsetRow);
  }
  return this.instance;
};

WalkontableScroll.prototype.scrollHorizontal = function (delta) {
  if (!this.instance.drawn) {
    throw new Error('scrollHorizontal can only be called after table was drawn to DOM');
  }

  var offsetColumn = this.instance.getSetting('offsetColumn')
    , newOffsetColumn = offsetColumn + delta;

  if (newOffsetColumn > 0) {
    var totalColumns = this.instance.getSetting('totalColumns');
    var width = this.instance.getSetting('width');

    if (newOffsetColumn >= totalColumns) {
      newOffsetColumn = totalColumns - 1;
    }

    var TD = this.instance.wtTable.TBODY.firstChild.firstChild;
    if (TD.nodeName === 'TH') {
      TD = TD.nextSibling;
    }
    var cellOffset = this.instance.wtDom.offset(TD);
    var tableOffset = this.instance.wtTable.tableOffset;

    var sum = cellOffset.left - tableOffset.left;
    var col = newOffsetColumn;
    while (sum < width && col < totalColumns) {
      sum += this.instance.getSetting('columnWidth', col);
      col++;
    }

    if (sum < width) {
      while (newOffsetColumn > 0) {
        //if sum still less than available width, we cannot scroll that far (must move offset to the left)
        sum += this.instance.getSetting('columnWidth', newOffsetColumn - 1);
        if (sum < width) {
          newOffsetColumn--;
        }
        else {
          break;
        }
      }
    }
  }
  else if (newOffsetColumn < 0) {
    newOffsetColumn = 0;
  }

  if (newOffsetColumn !== offsetColumn) {
    this.instance.update('offsetColumn', newOffsetColumn);
  }
  return this.instance;
};

/**
 * Scrolls viewport to a cell by minimum number of cells
 */
WalkontableScroll.prototype.scrollViewport = function (coords) {
  var offsetRow = this.instance.getSetting('offsetRow')
    , offsetColumn = this.instance.getSetting('offsetColumn')
    , viewportRows = this.instance.getSetting('viewportRows')
    , viewportColumns = this.instance.getSetting('viewportColumns')
    , totalRows = this.instance.getSetting('totalRows')
    , totalColumns = this.instance.getSetting('totalColumns');

  if (coords[0] < 0 || coords[0] > totalRows - 1) {
    throw new Error('row ' + coords[0] + ' does not exist');
  }
  else if (coords[1] < 0 || coords[1] > totalColumns - 1) {
    throw new Error('column ' + coords[1] + ' does not exist');
  }

  viewportRows = viewportRows || 1; //for cells larger than viewport it reports 0, but we still have to treat it like visible cell
  viewportColumns = viewportColumns || 1;

  if (viewportRows < totalRows) {
    if (coords[0] > offsetRow + viewportRows - 1) {
      this.scrollVertical(coords[0] - (offsetRow + viewportRows - 1));
    }
    else if (coords[0] < offsetRow) {
      this.scrollVertical(coords[0] - offsetRow);
    }
    else {
      this.scrollVertical(0); //Craig's issue: remove row from the last scroll page should scroll viewport a row up if needed
    }
  }
  else {
    //this.scrollVertical(coords[0] - offsetRow); //this should not be needed anymore
  }

  if (viewportColumns > 0 && viewportColumns < totalColumns) {
    if (coords[1] > offsetColumn + viewportColumns - 1) {
      this.scrollHorizontal(coords[1] - (offsetColumn + viewportColumns - 1));
    }
    else if (coords[1] < offsetColumn) {
      this.scrollHorizontal(coords[1] - offsetColumn);
    }
    else {
      this.scrollHorizontal(0); //Craig's issue
    }
  }
  else {
    //this.scrollHorizontal(coords[1] - offsetColumn); //this should not be needed anymore
  }

  return this.instance;
};
function WalkontableScrollbar(instance, type) {
  var that = this;

  //reference to instance
  this.instance = instance;
  this.type = type;
  this.$table = $(this.instance.wtTable.TABLE);

  //create elements
  this.slider = document.createElement('DIV');
  this.sliderStyle = this.slider.style;
  this.sliderStyle.position = 'absolute';
  this.sliderStyle.top = '0';
  this.sliderStyle.left = '0';
  this.sliderStyle.display = 'none';
  this.slider.className = 'dragdealer ' + type;

  this.handle = document.createElement('DIV');
  this.handleStyle = this.handle.style;
  this.handle.className = 'handle';

  this.slider.appendChild(this.handle);
  this.instance.wtTable.parent.appendChild(this.slider);

  var firstRun = true;
  this.dragTimeout = null;
  var dragDelta;
  var dragRender = function () {
    that.onScroll(dragDelta);
  };

  this.dragdealer = new Dragdealer(this.slider, {
    vertical: (type === 'vertical'),
    horizontal: (type === 'horizontal'),
    slide: false,
    speed: 100,
    animationCallback: function (x, y) {
      if (firstRun) {
        firstRun = false;
        return;
      }
      that.skipRefresh = true;
      dragDelta = type === 'vertical' ? y : x;
      if (that.dragTimeout === null) {
        that.dragTimeout = setInterval(dragRender, 100);
        dragRender();
      }
    },
    callback: function (x, y) {
      that.skipRefresh = false;
      clearInterval(that.dragTimeout);
      that.dragTimeout = null;
      dragDelta = type === 'vertical' ? y : x;
      that.onScroll(dragDelta);
    }
  });
  that.skipRefresh = false;
}

WalkontableScrollbar.prototype.onScroll = function (delta) {
  if (this.instance.drawn) {
    var keys = this.type === 'vertical' ? ['offsetRow', 'totalRows', 'viewportRows', 'top', 'height'] : ['offsetColumn', 'totalColumns', 'viewportColumns', 'left', 'width'];
    var total = this.instance.getSetting(keys[1]);
    var display = this.instance.getSetting(keys[2]);
    if (total > display) {
      var newOffset = Math.round(parseInt(this.handleStyle[keys[3]], 10) * total / parseInt(this.slider.style[keys[4]], 10)); //offset = handlePos * totalRows / offsetRows

      if (delta === 1) {
        if (this.type === 'vertical') {
          this.instance.scrollVertical(Infinity).draw();
        }
        else {
          this.instance.scrollHorizontal(Infinity).draw();
        }
      }
      else if (newOffset !== this.instance.getSetting(keys[0])) { //is new offset different than old offset
        if (this.type === 'vertical') {
          this.instance.scrollVertical(newOffset - this.instance.getSetting(keys[0])).draw();
        }
        else {
          this.instance.scrollHorizontal(newOffset - this.instance.getSetting(keys[0])).draw();
        }
      }
      else {
        this.refresh();
      }
    }
  }
};

/**
 * Returns what part of the scroller should the handle take
 * @param viewportCount {Number} number of visible rows or columns
 * @param totalCount {Number} total number of rows or columns
 * @return {Number} 0..1
 */
WalkontableScrollbar.prototype.getHandleSizeRatio = function (viewportCount, totalCount) {
  if (!totalCount || viewportCount > totalCount) {
    return 1;
  }
  return viewportCount / totalCount;
};

WalkontableScrollbar.prototype.prepare = function () {
  if (this.skipRefresh) {
    return;
  }
  var ratio
    , scroll;

  if (this.type === 'vertical') {
    ratio = this.getHandleSizeRatio(this.instance.getSetting('viewportRows'), this.instance.getSetting('totalRows'));
    scroll = this.instance.getSetting('scrollV');

  }
  else {
    ratio = this.getHandleSizeRatio(this.instance.getSetting('viewportColumns'), this.instance.getSetting('totalColumns'));
    scroll = this.instance.getSetting('scrollH');
  }

  if (((ratio === 1 || isNaN(ratio)) && scroll === 'auto') || scroll === 'none') {
    //isNaN is needed because ratio equals NaN when totalRows/totalColumns equals 0
    this.visible = false;
  }
  else {
    this.visible = true;
  }
};

WalkontableScrollbar.prototype.refresh = function () {
  if (this.skipRefresh) {
    return;
  }
  else if (!this.visible) {
    this.sliderStyle.display = 'none';
    return;
  }

  var ratio
    , delta
    , sliderSize
    , handleSize
    , handlePosition
    , offsetCount
    , totalCount
    , tableOuterWidth = this.$table.outerWidth()
    , tableOuterHeight = this.$table.outerHeight()
    , tableWidth = this.instance.hasSetting('width') ? this.instance.getSetting('width') : tableOuterWidth
    , tableHeight = this.instance.hasSetting('height') ? this.instance.getSetting('height') : tableOuterHeight;

  if (!tableWidth) {
    //throw new Error("I could not compute table width. Is the <table> element attached to the DOM?");
    return;
  }
  if (!tableHeight) {
    //throw new Error("I could not compute table height. Is the <table> element attached to the DOM?");
    return;
  }

  if (this.instance.hasSetting('width') && this.instance.wtScroll.wtScrollbarV.visible) {
    tableWidth -= this.instance.getSetting('scrollbarWidth');
  }
  if (tableWidth > tableOuterWidth + this.instance.getSetting('scrollbarWidth')) {
    tableWidth = tableOuterWidth;
  }

  if (this.instance.hasSetting('height') && this.instance.wtScroll.wtScrollbarH.visible) {
    tableHeight -= this.instance.getSetting('scrollbarHeight');
  }
  if (tableHeight > tableOuterHeight + this.instance.getSetting('scrollbarHeight')) {
    tableHeight = tableOuterHeight;
  }

  if (this.type === 'vertical') {
    offsetCount = this.instance.getSetting('offsetRow');
    totalCount = this.instance.getSetting('totalRows');
    ratio = this.getHandleSizeRatio(this.instance.getSetting('viewportRows'), totalCount);

    sliderSize = tableHeight - 2; //2 is sliders border-width

    this.sliderStyle.top = this.$table.position().top + 'px';
    this.sliderStyle.left = tableWidth - 1 + 'px'; //1 is sliders border-width
    this.sliderStyle.height = sliderSize + 'px';
  }
  else { //horizontal
    offsetCount = this.instance.getSetting('offsetColumn');
    totalCount = this.instance.getSetting('totalColumns');
    ratio = this.getHandleSizeRatio(this.instance.getSetting('viewportColumns'), totalCount);

    sliderSize = tableWidth - 2; //2 is sliders border-width

    this.sliderStyle.left = this.$table.position().left + 'px';
    this.sliderStyle.top = tableHeight - 1 + 'px'; //1 is sliders border-width
    this.sliderStyle.width = sliderSize + 'px';
  }

  handleSize = Math.round(sliderSize * ratio);
  if (handleSize < 10) {
    handleSize = 15;
  }

  handlePosition = Math.round(sliderSize * (offsetCount / totalCount));
  if ((delta = tableWidth - handleSize) > 0 && handlePosition > delta) {
    handlePosition = delta;
  }

  if (this.type === 'vertical') {
    this.handleStyle.height = handleSize + 'px';
    this.handleStyle.top = handlePosition + 'px';

  }
  else { //horizontal
    this.handleStyle.width = handleSize + 'px';
    this.handleStyle.left = handlePosition + 'px';
  }

  this.sliderStyle.display = 'block';

  this.dragdealer.setWrapperOffset();
  this.dragdealer.setBounds();
};
function WalkontableSelection(instance, settings) {
  this.instance = instance;
  this.settings = settings;
  this.selected = [];
  this.wtDom = new WalkontableDom(this.instance);
  if (settings.border) {
    this.border = new WalkontableBorder(instance, settings);
  }
}

WalkontableSelection.prototype.add = function (coords) {
  this.selected.push(coords);
};

WalkontableSelection.prototype.remove = function (coords) {
  var index = this.isSelected(coords);
  if (index > -1) {
    this.selected.splice(index, 1);
  }
};

WalkontableSelection.prototype.clear = function () {
  this.selected.length = 0; //http://jsperf.com/clear-arrayxxx
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

/**
 * Returns the top left (TL) and bottom right (BR) selection coordinates
 * @returns {Object}
 */
WalkontableSelection.prototype.getCorners = function () {
  var minRow
    , minColumn
    , maxRow
    , maxColumn
    , i
    , ilen = this.selected.length;

  if (ilen > 0) {
    minRow = maxRow = this.selected[0][0];
    minColumn = maxColumn = this.selected[0][1];

    if (ilen > 1) {
      for (i = 1; i < ilen; i++) {
        if (this.selected[i][0] < minRow) {
          minRow = this.selected[i][0];
        }
        else if (this.selected[i][0] > maxRow) {
          maxRow = this.selected[i][0];
        }

        if (this.selected[i][1] < minColumn) {
          minColumn = this.selected[i][1];
        }
        else if (this.selected[i][1] > maxColumn) {
          maxColumn = this.selected[i][1];
        }
      }
    }
  }

  return [minRow, minColumn, maxRow, maxColumn];
};

WalkontableSelection.prototype.draw = function (selectionsOnly) {
  var corners, r, c;

  var offsetRow = this.instance.getSetting('offsetRow')
    , lastVisibleRow = offsetRow + this.instance.getSetting('displayRows') - 1
    , offsetColumn = this.instance.getSetting('offsetColumn')
    , lastVisibleColumn = offsetColumn + this.instance.getSetting('displayColumns') - 1;

  if (this.selected.length) {
    corners = this.getCorners();

    for (r = offsetRow; r <= lastVisibleRow; r++) {
      for (c = offsetColumn; c <= lastVisibleColumn; c++) {
        if (r >= corners[0] && r <= corners[2] && c >= corners[1] && c <= corners[3]) {
          //selected cell
          this.settings.highlightRowClassName && this.wtDom.tdRemoveClass(r - offsetRow, c - offsetColumn, this.settings.highlightRowClassName);
          this.settings.highlightColumnClassName && this.wtDom.tdRemoveClass(r - offsetRow, c - offsetColumn, this.settings.highlightColumnClassName);
          this.settings.className && this.wtDom.tdAddClass(r - offsetRow, c - offsetColumn, this.settings.className);
        }
        else if (r >= corners[0] && r <= corners[2]) {
          //selection is in this row
          this.settings.highlightColumnClassName && this.wtDom.tdRemoveClass(r - offsetRow, c - offsetColumn, this.settings.highlightColumnClassName);
          this.settings.highlightRowClassName && this.wtDom.tdAddClass(r - offsetRow, c - offsetColumn, this.settings.highlightRowClassName);
          this.settings.className && this.wtDom.tdRemoveClass(r - offsetRow, c - offsetColumn, this.settings.className);
        }
        else if (c >= corners[1] && c <= corners[3]) {
          //selection is in this column
          this.settings.highlightRowClassName && this.wtDom.tdRemoveClass(r - offsetRow, c - offsetColumn, this.settings.highlightRowClassName);
          this.settings.highlightColumnClassName && this.wtDom.tdAddClass(r - offsetRow, c - offsetColumn, this.settings.highlightColumnClassName);
          this.settings.className && this.wtDom.tdRemoveClass(r - offsetRow, c - offsetColumn, this.settings.className);
        }
        else {
          //no selection
          this.settings.highlightRowClassName && this.wtDom.tdRemoveClass(r - offsetRow, c - offsetColumn, this.settings.highlightRowClassName);
          this.settings.highlightColumnClassName && this.wtDom.tdRemoveClass(r - offsetRow, c - offsetColumn, this.settings.highlightColumnClassName);
          this.settings.className && this.wtDom.tdRemoveClass(r - offsetRow, c - offsetColumn, this.settings.className);
        }
      }
    }

    this.border && this.border.appear(corners);
  }
  else {
    if (selectionsOnly) {
      for (r = 0; r <= lastVisibleRow - offsetRow; r++) {
        for (c = 0; c <= lastVisibleColumn - offsetColumn; c++) {
          this.settings.highlightRowClassName && this.wtDom.tdRemoveClass(r, c, this.settings.highlightRowClassName);
          this.settings.highlightColumnClassName && this.wtDom.tdRemoveClass(r, c, this.settings.highlightColumnClassName);
          this.settings.className && this.wtDom.tdRemoveClass(r, c, this.settings.className);
        }
      }
    }

    this.border && this.border.disappear();
  }
};

function WalkontableSettings(instance, settings) {
  var that = this;
  this.instance = instance;

  //default settings. void 0 means it is required, null means it can be empty
  this.defaults = {
    table: void 0,

    //presentation mode
    async: false,
    scrollH: 'auto', //values: scroll (always show scrollbar), auto (show scrollbar if table does not fit in the container), none (never show scrollbar)
    scrollV: 'auto', //values: see above
    stretchH: 'hybrid', //values: hybrid, all, last, none
    currentRowClassName: null,
    currentColumnClassName: null,

    //data source
    data: void 0,
    offsetRow: 0,
    offsetColumn: 0,
    frozenColumns: null,
    columnHeaders: null, //this must be a function in format: function (col, TH) {}
    totalRows: void 0,
    totalColumns: void 0,
    width: null,
    height: null,
    cellRenderer: function (row, column, TD) {
      var cellData = that.getSetting('data', row, column);
      if (cellData !== void 0) {
        that.instance.wtDom.avoidInnerHTML(TD, cellData);
      }
      else {
        this.wtDom.empty(TD);
      }
    },
    columnWidth: 50,
    selections: null,

    //callbacks
    onCellMouseDown: null,
    onCellMouseOver: null,
    onCellDblClick: null,
    onCellCornerMouseDown: null,
    onCellCornerDblClick: null,
    onDraw: null,

    //constants
    scrollbarWidth: 10,
    scrollbarHeight: 10
  };

  //reference to settings
  this.settings = {};
  for (var i in this.defaults) {
    if (this.defaults.hasOwnProperty(i)) {
      if (settings[i] !== void 0) {
        this.settings[i] = settings[i];
      }
      else if (this.defaults[i] === void 0) {
        throw new Error('A required setting "' + i + '" was not provided');
      }
      else {
        this.settings[i] = this.defaults[i];
      }
    }
  }

  this.rowHeightCache = [];
}

/**
 * generic methods
 */

WalkontableSettings.prototype.update = function (settings, value) {
  if (value === void 0) { //settings is object
    for (var i in settings) {
      if (settings.hasOwnProperty(i)) {
        this.settings[i] = settings[i];
      }
    }
  }
  else { //if value is defined then settings is the key
    this.settings[settings] = value;
  }
  return this.instance;
};

WalkontableSettings.prototype.getSetting = function (key, param1, param2, param3) {
  if (this[key]) {
    return this[key](param1, param2, param3);
  }
  else {
    return this._getSetting(key, param1, param2, param3);
  }
};

WalkontableSettings.prototype._getSetting = function (key, param1, param2, param3) {
  if (typeof this.settings[key] === 'function') {
    return this.settings[key](param1, param2, param3);
  }
  else if (param1 !== void 0 && Object.prototype.toString.call(this.settings[key]) === '[object Array]' && param1 !== void 0) {
    return this.settings[key][param1];
  }
  else {
    return this.settings[key];
  }
};

WalkontableSettings.prototype.has = function (key) {
  return !!this.settings[key]
};

/**
 * specific methods
 */

WalkontableSettings.prototype.rowHeight = function (row) {
  if (typeof this.rowHeightCache[row] !== 'undefined') {
    return this.rowHeightCache[row];
  }
  return 20;
};

WalkontableSettings.prototype.columnWidth = function (column) {
  return Math.min(200, this._getSetting('columnWidth', column));
};

WalkontableSettings.prototype.displayRows = function () {
  var estimated
    , calculated;

  if (this.settings['height']) {
    if (typeof this.settings['height'] !== 'number') {
      throw new Error('Walkontable height parameter must be a number (' + typeof this.settings['height'] + ' given)');
    }
    estimated = Math.ceil(this.settings['height'] / 20); //silly assumption but should be fine for now
    calculated = this.getSetting('totalRows') - this.getSetting('offsetRow');
    if (calculated < 0) {
      this.update('offsetRow', Math.max(0, this.getSetting('totalRows') - estimated));
      return estimated;
    }
    else {
      return Math.min(estimated, calculated);
    }
  }
  else {
    return this.getSetting('totalRows');
  }
};

WalkontableSettings.prototype.displayColumns = function () {
  var estimated
    , calculated;

  if (this.settings['width']) {
    if (typeof this.settings['width'] !== 'number') {
      throw new Error('Walkontable width parameter must be a number (' + typeof this.settings['width'] + ' given)');
    }
    estimated = Math.ceil(this.settings['width'] / 50); //silly assumption but should be fine for now
    calculated = this.getSetting('totalColumns') - this.getSetting('offsetColumn');
    if (calculated < 0) {
      this.update('offsetColumn', Math.max(0, this.getSetting('totalColumns') - estimated));
      return estimated;
    }
    else {
      return Math.min(estimated, calculated);
    }
  }
  else {
    return this.getSetting('totalColumns');
  }
};

WalkontableSettings.prototype.viewportRows = function () {
  if (this.instance.wtTable.visibilityEdgeRow !== null) {
    return this.instance.wtTable.visibilityEdgeRow - this.instance.wtTable.visibilityStartRow;
  }
  return this.getSetting('displayRows');
};

WalkontableSettings.prototype.viewportColumns = function () {
  if (this.instance.wtTable.visibilityEdgeColumn !== null) {
    return this.instance.wtTable.visibilityEdgeColumn - this.instance.wtTable.visibilityStartColumn;
  }
  return this.getSetting('displayColumns');
};
var FLAG_VISIBLE_HORIZONTAL = 0x1; // 000001
var FLAG_VISIBLE_VERTICAL = 0x2; // 000010
var FLAG_PARTIALLY_VISIBLE_HORIZONTAL = 0x4; // 000100
var FLAG_PARTIALLY_VISIBLE_VERTICAL = 0x8; // 001000
var FLAG_NOT_VISIBLE_HORIZONTAL = 0x16; // 010000
var FLAG_NOT_VISIBLE_VERTICAL = 0x32; // 100000

function WalkontableTable(instance) {
  //reference to instance
  this.instance = instance;
  this.TABLE = this.instance.getSetting('table');
  this.wtDom = this.instance.wtDom;
  this.wtDom.removeTextNodes(this.TABLE);

  this.hasEmptyCellProblem = ($.browser.msie && (parseInt($.browser.version, 10) <= 7));
  this.hasCellSpacingProblem = ($.browser.msie && (parseInt($.browser.version, 10) <= 7));

  if (this.hasCellSpacingProblem) { //IE7
    this.TABLE.cellSpacing = 0;
  }
  this.TABLE.setAttribute('tabindex', 10000); //http://www.barryvan.com.au/2009/01/onfocus-and-onblur-for-divs-in-fx/; 32767 is max tabindex for IE7,8

  this.visibilityStartRow = this.visibilityStartColumn = this.visibilityEdgeRow = this.visibilityEdgeColumn = null;

  //wtSpreader
  var parent = this.TABLE.parentNode;
  if (!parent || parent.nodeType !== 1 || !this.wtDom.hasClass(parent, 'wtHolder')) {
    var spreader = document.createElement('DIV');
    if (this.instance.hasSetting('width') && this.instance.hasSetting('height')) {
      var spreaderStyle = spreader.style;
      spreaderStyle.position = 'absolute';
      spreaderStyle.top = '0';
      spreaderStyle.left = '0';
      spreaderStyle.width = '4000px';
      spreaderStyle.height = '4000px';
    }
    spreader.className = 'wtSpreader';
    if (parent) {
      parent.insertBefore(spreader, this.TABLE); //if TABLE is detached (e.g. in Jasmine test), it has no parentNode so we cannot attach holder to it
    }
    spreader.appendChild(this.TABLE);
  }
  this.spreader = this.TABLE.parentNode;

  //wtHider
  parent = this.spreader.parentNode;
  if (!parent || parent.nodeType !== 1 || !this.wtDom.hasClass(parent, 'wtHolder')) {
    var hider = document.createElement('DIV');
    hider.className = 'wtHider';
    if (parent) {
      parent.insertBefore(hider, this.spreader); //if TABLE is detached (e.g. in Jasmine test), it has no parentNode so we cannot attach holder to it
    }
    hider.appendChild(this.spreader);
  }
  this.hider = this.spreader.parentNode;
  this.hiderStyle = this.hider.style;
  this.hiderStyle.position = 'relative';

  //wtHolder
  parent = this.hider.parentNode;
  if (!parent || parent.nodeType !== 1 || !this.wtDom.hasClass(parent, 'wtHolder')) {
    var holder = document.createElement('DIV');
    holder.style.position = 'relative';
    holder.className = 'wtHolder';
    if (parent) {
      parent.insertBefore(holder, this.hider); //if TABLE is detached (e.g. in Jasmine test), it has no parentNode so we cannot attach holder to it
    }
    holder.appendChild(this.hider);
  }
  this.parent = this.hider.parentNode;

  //bootstrap from settings
  this.TBODY = this.TABLE.getElementsByTagName('TBODY')[0];
  if (!this.TBODY) {
    this.TBODY = document.createElement('TBODY');
    this.TABLE.appendChild(this.TBODY);
  }
  this.THEAD = this.TABLE.getElementsByTagName('THEAD')[0];
  if (!this.THEAD) {
    this.THEAD = document.createElement('THEAD');
    this.TABLE.insertBefore(this.THEAD, this.TBODY);
  }
  this.COLGROUP = this.TABLE.getElementsByTagName('COLGROUP')[0];
  if (!this.COLGROUP) {
    this.COLGROUP = document.createElement('COLGROUP');
    this.TABLE.insertBefore(this.COLGROUP, this.THEAD);
  }

  if (this.instance.hasSetting('columnHeaders')) {
    if (!this.THEAD.childNodes.length) {
      var TR = document.createElement('TR');
      this.THEAD.appendChild(TR);
    }
  }

  this.colgroupChildrenLength = this.COLGROUP.childNodes.length;
  this.theadChildrenLength = this.THEAD.firstChild ? this.THEAD.firstChild.childNodes.length : 0;
  this.tbodyChildrenLength = this.TBODY.childNodes.length;
}

WalkontableTable.prototype.refreshHiderDimensions = function () {
  var height = this.instance.getSetting('height');
  var width = this.instance.getSetting('width');

  if (height || width) {
    this.hiderStyle.overflow = 'hidden';
  }

  if (height) {
    if (this.instance.wtScroll.wtScrollbarH.visible) {
      this.hiderStyle.height = height - this.instance.getSetting('scrollbarHeight') + 'px';
    }
    else {
      this.hiderStyle.height = height + 'px';
    }
  }
  if (width) {
    if (this.instance.wtScroll.wtScrollbarV.visible) {
      this.hiderStyle.width = width - this.instance.getSetting('scrollbarWidth') + 'px';
    }
    else {
      this.hiderStyle.width = width + 'px';
    }
  }
};

WalkontableTable.prototype.refreshStretching = function () {
  var stretchH = this.instance.getSetting('stretchH')
    , totalColumns = this.instance.getSetting('totalColumns')
    , displayColumns = this.instance.getSetting('displayColumns')
    , displayTds = Math.min(displayColumns, totalColumns)
    , offsetColumn = this.instance.getSetting('offsetColumn')
    , frozenColumns = this.instance.getSetting('frozenColumns')
    , frozenColumnsCount = frozenColumns ? frozenColumns.length : 0;

  if (!this.instance.hasSetting('columnWidth')) {
    return;
  }

  if (stretchH === 'hybrid') {
    if (this.instance.wtScroll.wtScrollbarH.visible) {
      stretchH = 'last';
    }
    else {
      stretchH = 'none';
    }
  }

  var TD;
  if (this.instance.wtTable.TBODY.firstChild && this.instance.wtTable.TBODY.firstChild.firstChild) {
    TD = this.instance.wtTable.TBODY.firstChild.firstChild;
  }
  else if (this.instance.wtTable.THEAD.firstChild && this.instance.wtTable.THEAD.firstChild.firstChild) {
    TD = this.instance.wtTable.THEAD.firstChild.firstChild;
  }

  if (frozenColumnsCount) {
    TD = TD.nextSibling;
  }

  if (!TD) {
    return;
  }

  var cellOffset = this.instance.wtDom.offset(TD)
    , tableOffset = this.instance.wtTable.tableOffset
    , rowHeaderWidth = cellOffset.left - tableOffset.left
    , widths = []
    , widthSum = 0
    , c;
  for (c = 0; c < displayTds; c++) {
    widths.push(this.instance.getSetting('columnWidth', offsetColumn + c));
    widthSum += widths[c];
  }
  var domWidth = widthSum + rowHeaderWidth;

  if (stretchH === 'all' || stretchH === 'last') {
    var containerWidth = this.instance.getSetting('width');
    if (this.instance.wtScroll.wtScrollbarV.visible) {
      containerWidth -= this.instance.getSetting('scrollbarWidth');
    }

    var diff = containerWidth - domWidth;
    if (diff > 0) {
      if (stretchH === 'all') {
        var newWidth;
        var remainingDiff = diff;
        var ratio = diff / widthSum;

        for (c = 0; c < displayTds; c++) {
          if (widths[c]) {
            if (c === displayTds - 1) {
              newWidth = widths[c] + remainingDiff;
            }
            else {
              newWidth = widths[c] + Math.floor(ratio * widths[c]);
              remainingDiff -= Math.floor(ratio * widths[c]);
            }
          }
          widths[c] = newWidth;
        }
      }
      else {
        if (widths[widths.length - 1]) {
          widths[widths.length - 1] = widths[widths.length - 1] + diff;
        }
      }
    }
  }

  for (c = 0; c < displayTds; c++) {
    if (widths[c]) {
      this.COLGROUP.childNodes[c + frozenColumnsCount].style.width = widths[c] + 'px';
    }
    else {
      this.COLGROUP.childNodes[c + frozenColumnsCount].style.width = '';
    }
  }
};

WalkontableTable.prototype.adjustAvailableNodes = function () {
  var instance = this.instance
    , totalRows = instance.getSetting('totalRows')
    , totalColumns = instance.getSetting('totalColumns')
    , displayRows = instance.getSetting('displayRows')
    , displayColumns = instance.getSetting('displayColumns')
    , displayTds
    , frozenColumns = instance.getSetting('frozenColumns')
    , frozenColumnsCount = frozenColumns ? frozenColumns.length : 0
    , TR
    , c;

  displayRows = Math.min(displayRows, totalRows);
  displayTds = Math.min(displayColumns, totalColumns);

  //adjust COLGROUP
  while (this.colgroupChildrenLength < displayTds + frozenColumnsCount) {
    this.COLGROUP.appendChild(document.createElement('COL'));
    this.colgroupChildrenLength++;
  }
  while (this.colgroupChildrenLength > displayTds + frozenColumnsCount) {
    this.COLGROUP.removeChild(this.COLGROUP.lastChild);
    this.colgroupChildrenLength--;
  }

  //adjust THEAD
  if (this.instance.hasSetting('columnHeaders')) {
    while (this.theadChildrenLength < displayTds + frozenColumnsCount) {
      this.THEAD.firstChild.appendChild(document.createElement('TH'));
      this.theadChildrenLength++;
    }
    while (this.theadChildrenLength > displayTds + frozenColumnsCount) {
      this.THEAD.firstChild.removeChild(this.THEAD.firstChild.lastChild);
      this.theadChildrenLength--;
    }
  }

  //adjust TBODY
  while (this.tbodyChildrenLength < displayRows) {
    TR = document.createElement('TR');
    for (c = 0; c < frozenColumnsCount; c++) {
      TR.appendChild(document.createElement('TH'));
    }
    this.TBODY.appendChild(TR);
    this.tbodyChildrenLength++;
  }
  while (this.tbodyChildrenLength > displayRows) {
    this.TBODY.removeChild(this.TBODY.lastChild);
    this.tbodyChildrenLength--;
  }

  var TRs = this.TBODY.childNodes;
  var trChildrenLength;
  for (var r = 0, rlen = TRs.length; r < rlen; r++) {
    trChildrenLength = TRs[r].childNodes.length;
    while (trChildrenLength < displayTds + frozenColumnsCount) {
      var TD = document.createElement('TD');
      TD.setAttribute('tabindex', 10000); //http://www.barryvan.com.au/2009/01/onfocus-and-onblur-for-divs-in-fx/; 32767 is max tabindex for IE7,8
      TRs[r].appendChild(TD);
      trChildrenLength++;
    }
    while (trChildrenLength > displayTds + frozenColumnsCount) {
      TRs[r].removeChild(TRs[r].lastChild);
      trChildrenLength--;
    }
  }
};

WalkontableTable.prototype.draw = function (selectionsOnly) {
  if (!selectionsOnly) {
    this.tableOffset = this.wtDom.offset(this.TABLE);
    // this.TABLE.removeChild(this.TBODY); //possible future optimization - http://jsperf.com/table-scrolling/9
    this.adjustAvailableNodes();
    this._doDraw();
    // this.TABLE.appendChild(this.TBODY);
  }

  this.refreshPositions(selectionsOnly);

  this.instance.drawn = true;
  return this;
};

WalkontableTable.prototype._doDraw = function () {
  var r
    , c
    , offsetRow = this.instance.getSetting('offsetRow')
    , offsetColumn = this.instance.getSetting('offsetColumn')
    , totalRows = this.instance.getSetting('totalRows')
    , totalColumns = this.instance.getSetting('totalColumns')
    , displayRows = this.instance.getSetting('displayRows')
    , displayColumns = this.instance.getSetting('displayColumns')
    , displayTds
    , frozenColumns = this.instance.getSetting('frozenColumns')
    , frozenColumnsCount = frozenColumns ? frozenColumns.length : 0
    , TR
    , TH
    , TD
    , cellData;

  displayRows = Math.min(displayRows, totalRows);
  displayTds = Math.min(displayColumns, totalColumns);

  //draw COLGROUP
  for (c = 0; c < this.colgroupChildrenLength; c++) {
    if (c < frozenColumnsCount) {
      this.wtDom.addClass(this.COLGROUP.childNodes[c], 'rowHeader');
      if (typeof frozenColumns[c] === "function") {
        frozenColumns[c](null, this.COLGROUP.childNodes[c])
      }
    }
    else {
      this.wtDom.removeClass(this.COLGROUP.childNodes[c], 'rowHeader');
    }
  }

  this.refreshStretching(); //needed here or otherwise scrollbarH is not shown

  //draw THEAD
  if (frozenColumnsCount && this.instance.hasSetting('columnHeaders')) {
    for (c = 0; c < frozenColumnsCount; c++) {
      TH = this.THEAD.childNodes[0].childNodes[c];
      if (typeof frozenColumns[c] === "function") {
        frozenColumns[c](null, TH);
      }
      else {
        this.wtDom.empty(TH);
      }
      if (this.hasEmptyCellProblem && TH.innerHTML === '') { //IE7
        TH.innerHTML = '&nbsp;';
      }
    }
  }

  if (this.instance.hasSetting('columnHeaders')) {
    for (c = 0; c < displayTds; c++) {
      this.instance.getSetting('columnHeaders', offsetColumn + c, this.THEAD.childNodes[0].childNodes[frozenColumnsCount + c]);
    }
  }

  //draw TBODY
  this.visibilityEdgeRow = this.visibilityEdgeColumn = null;
  this.visibilityStartRow = offsetRow; //needed bacause otherwise the values get out of sync in async mode
  this.visibilityStartColumn = offsetColumn;
  for (r = 0; r < displayRows; r++) {
    TR = this.TBODY.childNodes[r];
    for (c = 0; c < frozenColumnsCount; c++) { //in future use nextSibling; http://jsperf.com/nextsibling-vs-indexed-childnodes
      TH = TR.childNodes[c];
      cellData = typeof frozenColumns[c] === "function" ? frozenColumns[c](offsetRow + r, TH) : frozenColumns[c];
      if (cellData !== void 0) {
        this.wtDom.avoidInnerHTML(TH, cellData);
      }
      /*
       we can assume that frozenColumns[c] function took care of inserting content into TH
       else {
       TH.innerHTML = '';
       }*/
    }

    var visibilityFullRow = null;
    var visibilityFullColumn = null;
    this.wtDom.tdResetCache();

    for (c = 0; c < displayTds; c++) { //in future use nextSibling; http://jsperf.com/nextsibling-vs-indexed-childnodes
      if (this.visibilityEdgeColumn !== null && offsetColumn + c > this.visibilityEdgeColumn) {
        break;
      }
      else {
        TD = TR.childNodes[c + frozenColumnsCount];
        TD.className = '';
        TD.removeAttribute('style');
        this.instance.getSetting('cellRenderer', offsetRow + r, offsetColumn + c, TD);
        if (this.hasEmptyCellProblem && TD.innerHTML === '') { //IE7
          TD.innerHTML = '&nbsp;';
        }

        var visibility = this.isCellVisible(offsetRow + r, offsetColumn + c, TD);
        if (this.visibilityEdgeColumn === null && visibility & FLAG_VISIBLE_HORIZONTAL) {
          visibilityFullColumn = offsetColumn + c;
        }
        else if (this.visibilityEdgeColumn === null && visibility & FLAG_PARTIALLY_VISIBLE_HORIZONTAL) {
          this.visibilityEdgeColumn = offsetColumn + c;
        }

        if (this.visibilityEdgeRow === null && visibility & FLAG_VISIBLE_VERTICAL) {
          visibilityFullRow = offsetRow + r;
        }
        else if (this.visibilityEdgeRow === null && visibility & FLAG_PARTIALLY_VISIBLE_VERTICAL) {
          this.visibilityEdgeRow = offsetRow + r;
        }
      }
    }
    /*if (this.visibilityEdgeRow !== null && offsetRow + r > this.visibilityEdgeRow) {
     break;
     }*/
  }

  if (this.visibilityEdgeRow === null) {
    this.visibilityEdgeRow = visibilityFullRow + 1;
  }
  if (this.visibilityEdgeColumn === null) {
    this.visibilityEdgeColumn = visibilityFullColumn + 1;
  }
};

WalkontableTable.prototype.refreshPositions = function (selectionsOnly) {
  this.instance.wtScroll.refreshScrollbars();
  this.refreshHiderDimensions();
  this.refreshStretching();
  this.refreshSelections(selectionsOnly);
};

WalkontableTable.prototype.refreshSelections = function (selectionsOnly) {
  var r;
  if (this.instance.selections) {
    for (r in this.instance.selections) {
      if (this.instance.selections.hasOwnProperty(r)) {
        this.instance.selections[r].draw(selectionsOnly);
      }
    }
  }
};

WalkontableTable.prototype.recalcViewportCells = function () {
  if (this.instance.wtScroll.wtScrollbarV.visible && this.visibilityEdgeColumnRemainder <= this.instance.getSetting('scrollbarWidth')) {
    this.visibilityEdgeColumn--;
    this.visibilityEdgeColumnRemainder = Infinity;
  }
  if (this.instance.wtScroll.wtScrollbarH.visible && this.visibilityEdgeRowRemainder <= this.instance.getSetting('scrollbarHeight')) {
    this.visibilityEdgeRow--;
    this.visibilityEdgeRowRemainder = Infinity;
  }
};

WalkontableTable.prototype.isCellVisible = function (r, c, TD) {
  var out = 0
    , scrollV = this.instance.getSetting('scrollV')
    , scrollH = this.instance.getSetting('scrollH')
    , cellOffset = this.wtDom.offset(TD)
    , tableOffset = this.tableOffset
    , innerOffsetTop = cellOffset.top - tableOffset.top
    , innerOffsetLeft = cellOffset.left - tableOffset.left
    , $td = $(TD)
    , width = $td.outerWidth()
    , height = $td.outerHeight()
    , tableWidth = this.instance.hasSetting('width') ? this.instance.getSetting('width') : Infinity
    , tableHeight = this.instance.hasSetting('height') ? this.instance.getSetting('height') : Infinity;

  this.instance.wtSettings.rowHeightCache[r] = height;

  /**
   * Legend:
   * 0 - not visible vertically
   * 1 - not visible horizontally
   * 2 - partially visible vertically
   * 3 - partially visible horizontally
   * 4 - visible
   */

  if (innerOffsetTop > tableHeight) {
    out |= FLAG_NOT_VISIBLE_VERTICAL;
  }
  else if (innerOffsetTop + height > tableHeight) {
    this.visibilityEdgeRowRemainder = tableHeight - innerOffsetTop;
    out |= FLAG_PARTIALLY_VISIBLE_VERTICAL;
  }
  else {
    out |= FLAG_VISIBLE_VERTICAL;
  }

  if (innerOffsetLeft > tableWidth) {
    out |= FLAG_NOT_VISIBLE_HORIZONTAL;
  }
  else if (innerOffsetLeft + width > tableWidth) {
    this.visibilityEdgeColumnRemainder = tableWidth - innerOffsetLeft;
    out |= FLAG_PARTIALLY_VISIBLE_HORIZONTAL;
  }
  else {
    out |= FLAG_VISIBLE_HORIZONTAL;
  }

  return out;
};

/**
 * getCell
 * @param {Array} coords
 * @return {Object} HTMLElement on success or {Number} one of the exit codes on error:
 *  -1 row before viewport
 *  -2 row after viewport
 *  -3 column before viewport
 *  -4 column after viewport
 *
 */
WalkontableTable.prototype.getCell = function (coords) {
  var offsetRow = this.instance.getSetting('offsetRow');
  if (coords[0] < offsetRow) {
    return -1; //row before viewport
  }
  else if (coords[0] > offsetRow + this.instance.getSetting('displayRows') - 1) {
    return -2; //row after viewport
  }
  else {
    var offsetColumn = this.instance.getSetting('offsetColumn');
    if (coords[1] < offsetColumn) {
      return -3; //column before viewport
    }
    else if (coords[1] > offsetColumn + this.instance.getSetting('displayColumns') - 1) {
      return -4; //column after viewport
    }
    else {
      var frozenColumns = this.instance.getSetting('frozenColumns')
        , frozenColumnsCount = (frozenColumns ? frozenColumns.length : 0)
        , tr = this.TBODY.childNodes[coords[0] - offsetRow];

      if (typeof tr === "undefined") { //this block is only needed in async mode
        this.adjustAvailableNodes();
        tr = this.TBODY.childNodes[coords[0] - offsetRow];
      }

      return tr.childNodes[coords[1] - offsetColumn + frozenColumnsCount];
    }
  }
};

WalkontableTable.prototype.getCoords = function (TD) {
  var frozenColumns = this.instance.getSetting('frozenColumns')
    , frozenColumnsCount = frozenColumns ? frozenColumns.length : 0;
  return [
    this.wtDom.prevSiblings(TD.parentNode).length + this.instance.getSetting('offsetRow'),
    TD.cellIndex + this.instance.getSetting('offsetColumn') - frozenColumnsCount
  ];
};
function WalkontableWheel(instance) {
  var that = this;

  //reference to instance
  this.instance = instance;
  $(this.instance.wtTable.TABLE).on('mousewheel', function (event, delta, deltaX, deltaY) {
    clearTimeout(that.instance.wheelTimeout);
    that.instance.wheelTimeout = setTimeout(function () { //timeout is needed because with fast-wheel scrolling mousewheel event comes dozen times per second
      if (deltaY) {
        //ceil is needed because jquery-mousewheel reports fractional mousewheel deltas on touchpad scroll
        //see http://stackoverflow.com/questions/5527601/normalizing-mousewheel-speed-across-browsers
        if (that.instance.wtScroll.wtScrollbarH.visible) { // if we see scrollbar
          that.instance.scrollVertical(-Math.ceil(deltaY)).draw();
        }
      }
      else if (deltaX) {
        if (that.instance.wtScroll.wtScrollbarV.visible) { // if we see scrollbar
          that.instance.scrollHorizontal(Math.ceil(deltaX)).draw();
        }
      }
    }, 0);
    event.preventDefault();
  });
}
/**
 * Dragdealer JS v0.9.5 - patched by Walkontable at line 66
 * http://code.ovidiu.ch/dragdealer-js
 *
 * Copyright (c) 2010, Ovidiu Chereches
 * MIT License
 * http://legal.ovidiu.ch/licenses/MIT
 */

/* Cursor */

var Cursor =
{
	x: 0, y: 0,
	init: function()
	{
		this.setEvent('mouse');
		this.setEvent('touch');
	},
	setEvent: function(type)
	{
		var moveHandler = document['on' + type + 'move'] || function(){};
		document['on' + type + 'move'] = function(e)
		{
			moveHandler(e);
			Cursor.refresh(e);
		}
	},
	refresh: function(e)
	{
		if(!e)
		{
			e = window.event;
		}
		if(e.type == 'mousemove')
		{
			this.set(e);
		}
		else if(e.touches)
		{
			this.set(e.touches[0]);
		}
	},
	set: function(e)
	{
		if(e.pageX || e.pageY)
		{
			this.x = e.pageX;
			this.y = e.pageY;
		}
		else if(e.clientX || e.clientY)
		{
			this.x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			this.y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}
	}
};
Cursor.init();

/* Position */

var Position =
{
	get: function(obj)
	{
		var curtop = 0, curleft = 0; //Walkontable patch. Original (var curleft = curtop = 0;) created curtop in global scope
		if(obj.offsetParent)
		{
			do
			{
				curleft += obj.offsetLeft;
				curtop += obj.offsetTop;
			}
			while((obj = obj.offsetParent));
		}
		return [curleft, curtop];
	}
};

/* Dragdealer */

var Dragdealer = function(wrapper, options)
{
	if(typeof(wrapper) == 'string')
	{
		wrapper = document.getElementById(wrapper);
	}
	if(!wrapper)
	{
		return;
	}
	var handle = wrapper.getElementsByTagName('div')[0];
	if(!handle || handle.className.search(/(^|\s)handle(\s|$)/) == -1)
	{
		return;
	}
	this.init(wrapper, handle, options || {});
	this.setup();
};
Dragdealer.prototype =
{
	init: function(wrapper, handle, options)
	{
		this.wrapper = wrapper;
		this.handle = handle;
		this.options = options;
		
		this.disabled = this.getOption('disabled', false);
		this.horizontal = this.getOption('horizontal', true);
		this.vertical = this.getOption('vertical', false);
		this.slide = this.getOption('slide', true);
		this.steps = this.getOption('steps', 0);
		this.snap = this.getOption('snap', false);
		this.loose = this.getOption('loose', false);
		this.speed = this.getOption('speed', 10) / 100;
		this.xPrecision = this.getOption('xPrecision', 0);
		this.yPrecision = this.getOption('yPrecision', 0);
		
		this.callback = options.callback || null;
		this.animationCallback = options.animationCallback || null;
		
		this.bounds = {
			left: options.left || 0, right: -(options.right || 0),
			top: options.top || 0, bottom: -(options.bottom || 0),
			x0: 0, x1: 0, xRange: 0,
			y0: 0, y1: 0, yRange: 0
		};
		this.value = {
			prev: [-1, -1],
			current: [options.x || 0, options.y || 0],
			target: [options.x || 0, options.y || 0]
		};
		this.offset = {
			wrapper: [0, 0],
			mouse: [0, 0],
			prev: [-999999, -999999],
			current: [0, 0],
			target: [0, 0]
		};
		this.change = [0, 0];
		
		this.activity = false;
		this.dragging = false;
		this.tapping = false;
	},
	getOption: function(name, defaultValue)
	{
		return this.options[name] !== undefined ? this.options[name] : defaultValue;
	},
	setup: function()
	{
		this.setWrapperOffset();
		this.setBoundsPadding();
		this.setBounds();
		this.setSteps();
		
		this.addListeners();
	},
	setWrapperOffset: function()
	{
		this.offset.wrapper = Position.get(this.wrapper);
	},
	setBoundsPadding: function()
	{
		if(!this.bounds.left && !this.bounds.right)
		{
			this.bounds.left = Position.get(this.handle)[0] - this.offset.wrapper[0];
			this.bounds.right = -this.bounds.left;
		}
		if(!this.bounds.top && !this.bounds.bottom)
		{
			this.bounds.top = Position.get(this.handle)[1] - this.offset.wrapper[1];
			this.bounds.bottom = -this.bounds.top;
		}
	},
	setBounds: function()
	{
		this.bounds.x0 = this.bounds.left;
		this.bounds.x1 = this.wrapper.offsetWidth + this.bounds.right;
		this.bounds.xRange = (this.bounds.x1 - this.bounds.x0) - this.handle.offsetWidth;
		
		this.bounds.y0 = this.bounds.top;
		this.bounds.y1 = this.wrapper.offsetHeight + this.bounds.bottom;
		this.bounds.yRange = (this.bounds.y1 - this.bounds.y0) - this.handle.offsetHeight;
		
		this.bounds.xStep = 1 / (this.xPrecision || Math.max(this.wrapper.offsetWidth, this.handle.offsetWidth));
		this.bounds.yStep = 1 / (this.yPrecision || Math.max(this.wrapper.offsetHeight, this.handle.offsetHeight));
	},
	setSteps: function()
	{
		if(this.steps > 1)
		{
			this.stepRatios = [];
			for(var i = 0; i <= this.steps - 1; i++)
			{
				this.stepRatios[i] = i / (this.steps - 1);
			}
		}
	},
	addListeners: function()
	{
		var self = this;
		
		this.wrapper.onselectstart = function()
		{
			return false;
		}
		this.handle.onmousedown = this.handle.ontouchstart = function(e)
		{
			self.handleDownHandler(e);
		};
		this.wrapper.onmousedown = this.wrapper.ontouchstart = function(e)
		{
			self.wrapperDownHandler(e);
		};
		var mouseUpHandler = document.onmouseup || function(){};
		document.onmouseup = function(e)
		{
			mouseUpHandler(e);
			self.documentUpHandler(e);
		};
		var touchEndHandler = document.ontouchend || function(){};
		document.ontouchend = function(e)
		{
			touchEndHandler(e);
			self.documentUpHandler(e);
		};
		var resizeHandler = window.onresize || function(){};
		window.onresize = function(e)
		{
			resizeHandler(e);
			self.documentResizeHandler(e);
		};
		this.wrapper.onmousemove = function(e)
		{
			self.activity = true;
		}
		this.wrapper.onclick = function(e)
		{
			return !self.activity;
		}
		
		this.interval = setInterval(function(){ self.animate() }, 25);
		self.animate(false, true);
	},
	handleDownHandler: function(e)
	{
		this.activity = false;
		Cursor.refresh(e);
		
		this.preventDefaults(e, true);
		this.startDrag();
		this.cancelEvent(e);
	},
	wrapperDownHandler: function(e)
	{
		Cursor.refresh(e);
		
		this.preventDefaults(e, true);
		this.startTap();
	},
	documentUpHandler: function(e)
	{
		this.stopDrag();
		this.stopTap();
		//this.cancelEvent(e);
	},
	documentResizeHandler: function(e)
	{
		this.setWrapperOffset();
		this.setBounds();
		
		this.update();
	},
	enable: function()
	{
		this.disabled = false;
		this.handle.className = this.handle.className.replace(/\s?disabled/g, '');
	},
	disable: function()
	{
		this.disabled = true;
		this.handle.className += ' disabled';
	},
	setStep: function(x, y, snap)
	{
		this.setValue(
			this.steps && x > 1 ? (x - 1) / (this.steps - 1) : 0,
			this.steps && y > 1 ? (y - 1) / (this.steps - 1) : 0,
			snap
		);
	},
	setValue: function(x, y, snap)
	{
		this.setTargetValue([x, y || 0]);
		if(snap)
		{
			this.groupCopy(this.value.current, this.value.target);
		}
	},
	startTap: function(target)
	{
		if(this.disabled)
		{
			return;
		}
		this.tapping = true;
		
		if(target === undefined)
		{
			target = [
				Cursor.x - this.offset.wrapper[0] - (this.handle.offsetWidth / 2),
				Cursor.y - this.offset.wrapper[1] - (this.handle.offsetHeight / 2)
			];
		}
		this.setTargetOffset(target);
	},
	stopTap: function()
	{
		if(this.disabled || !this.tapping)
		{
			return;
		}
		this.tapping = false;
		
		this.setTargetValue(this.value.current);
		this.result();
	},
	startDrag: function()
	{
		if(this.disabled)
		{
			return;
		}
		this.offset.mouse = [
			Cursor.x - Position.get(this.handle)[0],
			Cursor.y - Position.get(this.handle)[1]
		];
		
		this.dragging = true;
	},
	stopDrag: function()
	{
		if(this.disabled || !this.dragging)
		{
			return;
		}
		this.dragging = false;
		
		var target = this.groupClone(this.value.current);
		if(this.slide)
		{
			var ratioChange = this.change;
			target[0] += ratioChange[0] * 4;
			target[1] += ratioChange[1] * 4;
		}
		this.setTargetValue(target);
		this.result();
	},
	feedback: function()
	{
		var value = this.value.current;
		if(this.snap && this.steps > 1)
		{
			value = this.getClosestSteps(value);
		}
		if(!this.groupCompare(value, this.value.prev))
		{
			if(typeof(this.animationCallback) == 'function')
			{
				this.animationCallback(value[0], value[1]);
			}
			this.groupCopy(this.value.prev, value);
		}
	},
	result: function()
	{
		if(typeof(this.callback) == 'function')
		{
			this.callback(this.value.target[0], this.value.target[1]);
		}
	},
	animate: function(direct, first)
	{
		if(direct && !this.dragging)
		{
			return;
		}
		if(this.dragging)
		{
			var prevTarget = this.groupClone(this.value.target);
			
			var offset = [
				Cursor.x - this.offset.wrapper[0] - this.offset.mouse[0],
				Cursor.y - this.offset.wrapper[1] - this.offset.mouse[1]
			];
			this.setTargetOffset(offset, this.loose);
			
			this.change = [
				this.value.target[0] - prevTarget[0],
				this.value.target[1] - prevTarget[1]
			];
		}
		if(this.dragging || first)
		{
			this.groupCopy(this.value.current, this.value.target);
		}
		if(this.dragging || this.glide() || first)
		{
			this.update();
			this.feedback();
		}
	},
	glide: function()
	{
		var diff = [
			this.value.target[0] - this.value.current[0],
			this.value.target[1] - this.value.current[1]
		];
		if(!diff[0] && !diff[1])
		{
			return false;
		}
		if(Math.abs(diff[0]) > this.bounds.xStep || Math.abs(diff[1]) > this.bounds.yStep)
		{
			this.value.current[0] += diff[0] * this.speed;
			this.value.current[1] += diff[1] * this.speed;
		}
		else
		{
			this.groupCopy(this.value.current, this.value.target);
		}
		return true;
	},
	update: function()
	{
		if(!this.snap)
		{
			this.offset.current = this.getOffsetsByRatios(this.value.current);
		}
		else
		{
			this.offset.current = this.getOffsetsByRatios(
				this.getClosestSteps(this.value.current)
			);
		}
		this.show();
	},
	show: function()
	{
		if(!this.groupCompare(this.offset.current, this.offset.prev))
		{
			if(this.horizontal)
			{
				this.handle.style.left = String(this.offset.current[0]) + 'px';
			}
			if(this.vertical)
			{
				this.handle.style.top = String(this.offset.current[1]) + 'px';
			}
			this.groupCopy(this.offset.prev, this.offset.current);
		}
	},
	setTargetValue: function(value, loose)
	{
		var target = loose ? this.getLooseValue(value) : this.getProperValue(value);
		
		this.groupCopy(this.value.target, target);
		this.offset.target = this.getOffsetsByRatios(target);
	},
	setTargetOffset: function(offset, loose)
	{
		var value = this.getRatiosByOffsets(offset);
		var target = loose ? this.getLooseValue(value) : this.getProperValue(value);
		
		this.groupCopy(this.value.target, target);
		this.offset.target = this.getOffsetsByRatios(target);
	},
	getLooseValue: function(value)
	{
		var proper = this.getProperValue(value);
		return [
			proper[0] + ((value[0] - proper[0]) / 4),
			proper[1] + ((value[1] - proper[1]) / 4)
		];
	},
	getProperValue: function(value)
	{
		var proper = this.groupClone(value);

		proper[0] = Math.max(proper[0], 0);
		proper[1] = Math.max(proper[1], 0);
		proper[0] = Math.min(proper[0], 1);
		proper[1] = Math.min(proper[1], 1);
		
		if((!this.dragging && !this.tapping) || this.snap)
		{
			if(this.steps > 1)
			{
				proper = this.getClosestSteps(proper);
			}
		}
		return proper;
	},
	getRatiosByOffsets: function(group)
	{
		return [
			this.getRatioByOffset(group[0], this.bounds.xRange, this.bounds.x0),
			this.getRatioByOffset(group[1], this.bounds.yRange, this.bounds.y0)
		];
	},
	getRatioByOffset: function(offset, range, padding)
	{
		return range ? (offset - padding) / range : 0;
	},
	getOffsetsByRatios: function(group)
	{
		return [
			this.getOffsetByRatio(group[0], this.bounds.xRange, this.bounds.x0),
			this.getOffsetByRatio(group[1], this.bounds.yRange, this.bounds.y0)
		];
	},
	getOffsetByRatio: function(ratio, range, padding)
	{
		return Math.round(ratio * range) + padding;
	},
	getClosestSteps: function(group)
	{
		return [
			this.getClosestStep(group[0]),
			this.getClosestStep(group[1])
		];
	},
	getClosestStep: function(value)
	{
		var k = 0;
		var min = 1;
		for(var i = 0; i <= this.steps - 1; i++)
		{
			if(Math.abs(this.stepRatios[i] - value) < min)
			{
				min = Math.abs(this.stepRatios[i] - value);
				k = i;
			}
		}
		return this.stepRatios[k];
	},
	groupCompare: function(a, b)
	{
		return a[0] == b[0] && a[1] == b[1];
	},
	groupCopy: function(a, b)
	{
		a[0] = b[0];
		a[1] = b[1];
	},
	groupClone: function(a)
	{
		return [a[0], a[1]];
	},
	preventDefaults: function(e, selection)
	{
		if(!e)
		{
			e = window.event;
		}
		if(e.preventDefault)
		{
			e.preventDefault();
		}
		e.returnValue = false;
		
		if(selection && document.selection)
		{
			document.selection.empty();
		}
	},
	cancelEvent: function(e)
	{
		if(!e)
		{
			e = window.event;
		}
		if(e.stopPropagation)
		{
			e.stopPropagation();
		}
		e.cancelBubble = true;
	}
};

/**
 * jQuery.browser shim that makes Walkontable working with jQuery 1.9+
 */
if (!jQuery.browser) {
  (function () {
    var matched, browser;

    /*
     * Copyright 2011, John Resig
     * Dual licensed under the MIT or GPL Version 2 licenses.
     * http://jquery.org/license
     */
    jQuery.uaMatch = function (ua) {
      ua = ua.toLowerCase();

      var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
        /(webkit)[ \/]([\w.]+)/.exec(ua) ||
        /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
        /(msie) ([\w.]+)/.exec(ua) ||
        ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
        [];

      return {
        browser: match[ 1 ] || "",
        version: match[ 2 ] || "0"
      };
    };

    matched = jQuery.uaMatch(navigator.userAgent);
    browser = {};

    if (matched.browser) {
      browser[ matched.browser ] = true;
      browser.version = matched.version;
    }

    // Chrome is Webkit, but Webkit is also Safari.
    if (browser.chrome) {
      browser.webkit = true;
    }
    else if (browser.webkit) {
      browser.safari = true;
    }

    jQuery.browser = browser;

  })();
}
/*! Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.0.6
 * 
 * Requires: 1.2.2+
 */

(function($) {

var types = ['DOMMouseScroll', 'mousewheel'];

if ($.event.fixHooks) {
    for ( var i=types.length; i; ) {
        $.event.fixHooks[ types[--i] ] = $.event.mouseHooks;
    }
}

$.event.special.mousewheel = {
    setup: function() {
        if ( this.addEventListener ) {
            for ( var i=types.length; i; ) {
                this.addEventListener( types[--i], handler, false );
            }
        } else {
            this.onmousewheel = handler;
        }
    },
    
    teardown: function() {
        if ( this.removeEventListener ) {
            for ( var i=types.length; i; ) {
                this.removeEventListener( types[--i], handler, false );
            }
        } else {
            this.onmousewheel = null;
        }
    }
};

$.fn.extend({
    mousewheel: function(fn) {
        return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
    },
    
    unmousewheel: function(fn) {
        return this.unbind("mousewheel", fn);
    }
});


function handler(event) {
    var orgEvent = event || window.event, args = [].slice.call( arguments, 1 ), delta = 0, returnValue = true, deltaX = 0, deltaY = 0;
    event = $.event.fix(orgEvent);
    event.type = "mousewheel";
    
    // Old school scrollwheel delta
    if ( orgEvent.wheelDelta ) { delta = orgEvent.wheelDelta/120; }
    if ( orgEvent.detail     ) { delta = -orgEvent.detail/3; }
    
    // New school multidimensional scroll (touchpads) deltas
    deltaY = delta;
    
    // Gecko
    if ( orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
        deltaY = 0;
        deltaX = -1*delta;
    }
    
    // Webkit
    if ( orgEvent.wheelDeltaY !== undefined ) { deltaY = orgEvent.wheelDeltaY/120; }
    if ( orgEvent.wheelDeltaX !== undefined ) { deltaX = -1*orgEvent.wheelDeltaX/120; }
    
    // Add event and delta to the front of the arguments
    args.unshift(event, delta, deltaX, deltaY);
    
    return ($.event.dispatch || $.event.handle).apply(this, args);
}

})(jQuery);
