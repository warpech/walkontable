function WalkontableBorder(instance, settings) {
  //reference to instance
  this.instance = instance;
  this.settings = settings;

  this.main = document.createElement("div");
  this.main.style.position = 'absolute';
  this.main.style.top = 0;
  this.main.style.left = 0;

  for (var i = 0; i < 4; i++) {
    var DIV = document.createElement('DIV');
    DIV.className = 'wtBorder ' + settings.className;
    DIV.style.backgroundColor = settings.border.color;
    DIV.style.height = settings.border.width + 'px';
    DIV.style.width = settings.border.width + 'px';
    this.main.appendChild(DIV);
  }

  this.top = this.main.childNodes[0];
  this.left = this.main.childNodes[1];
  this.bottom = this.main.childNodes[2];
  this.right = this.main.childNodes[3];

  this.disappear();
  instance.wtTable.TABLE.parentNode.appendChild(this.main);
}

/**
 * Show border around one or many cells
 * @param {Array} corners
 */
WalkontableBorder.prototype.appear = function (corners) {
  var $from, $to, fromOffset, toOffset, containerOffset, top, minTop, left, minLeft, height, width;
  if (this.disabled) {
    return;
  }

  $from = $(this.instance.wtTable.getCell([corners[0], corners[1]]));
  $to = (corners.length > 2) ? $(this.instance.wtTable.getCell([corners[2], corners[3]])) : $from;
  fromOffset = $from.offset();
  toOffset = (corners.length > 2) ? $to.offset() : fromOffset;
  containerOffset = $(this.instance.wtTable.TABLE).offset();

  minTop = fromOffset.top;
  height = toOffset.top + $to.outerHeight() - minTop;
  minLeft = fromOffset.left;
  width = toOffset.left + $to.outerWidth() - minLeft;

  top = minTop - containerOffset.top - 1;
  left = minLeft - containerOffset.left - 1;

  if (parseInt($from.css('border-top-width')) > 0) {
    top += 1;
    //height -= 1;
  }
  if (parseInt($from.css('border-left-width')) > 0) {
    left += 1;
    //width -= 1;
  }

  this.top.style.top = top + 'px';
  this.top.style.left = left + 'px';
  this.top.style.width = width + 'px';

  this.left.style.top = top + 'px';
  this.left.style.left = left + 'px';
  this.left.style.height = height + 'px';

  var delta = Math.floor(this.settings.border.width / 2);

  this.bottom.style.top = top + height - delta + 'px';
  this.bottom.style.left = left + 'px';
  this.bottom.style.width = width + 'px';

  this.right.style.top = top + 'px';
  this.right.style.left = left + width - delta + 'px';
  this.right.style.height = height + 1 + 'px';

  this.main.style.display = 'block';
};

/**
 * Hide border
 */
WalkontableBorder.prototype.disappear = function () {
  this.main.style.display = 'none';
};