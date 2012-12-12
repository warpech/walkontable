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
 * Provides requestAnimationFrame in a cross browser way.
 * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 */
if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = (function () {
    return window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
        window.setTimeout(callback, 1000 / 60);
      };
  })();
}