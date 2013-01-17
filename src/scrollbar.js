function WalkontableScrollbar(instance, type) {
  var that = this;

  //reference to instance
  this.instance = instance;
  this.type = type;
  this.$table = $(this.instance.wtTable.TABLE);

  //create elements
  this.slider = document.createElement('DIV');
  this.slider.style.position = 'absolute';
  this.slider.style.top = '0';
  this.slider.style.left = '0';
  this.slider.style.display = 'none';
  this.slider.className = 'dragdealer ' + type;

  this.handle = document.createElement('DIV');
  this.handle.className = 'handle';

  this.slider.appendChild(this.handle);
  this.instance.wtTable.parent.appendChild(this.slider);

  that.waitTimeout = null;
  that.queuedAnimationCallback = null;
  this.dragdealer = new Dragdealer(this.slider, {
    vertical: (type === 'vertical'),
    horizontal: (type === 'horizontal'),
    speed: 100,
    yPrecision: 100,
    animationCallback: function (x, y) {
      that.skipRefresh = true;
      var nextRender = function () {
        if (that.skipRefresh) { //mouse button still not released
          that.onScroll(type === 'vertical' ? y : x);
        }
        that.waitTimeout = setTimeout(function () {
          that.waitTimeout = null;
          if (that.queuedAnimationCallback) {
            that.queuedAnimationCallback();
            that.queuedAnimationCallback = null;
          }
        }, 100);
      };
      if (that.waitTimeout === null) {
        nextRender();
      }
      else {
        that.queuedAnimationCallback = nextRender;
      }
    },
    callback: function (x, y) {
      that.skipRefresh = false;
      clearTimeout(that.waitTimeout);
      that.waitTimeout = null;
      that.onScroll(type === 'vertical' ? y : x);
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
      var newOffset = Math.round(parseInt(this.handle.style[keys[3]]) * total / parseInt(this.slider.style[keys[4]])); //offset = handlePos * totalRows / offsetRows
      if (delta === 1) {
        if (this.type === 'vertical') {
          this.instance.scrollVertical(Infinity).draw();
        }
        else {
          this.instance.scrollHorizontal(Infinity).draw();
        }
      }
      else if (newOffset !== this.instance.getSetting(keys[0])) { //is new offset different than old offset
        this.instance.update(keys[0], newOffset);
        this.instance.draw();
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
  if (!totalCount) {
    return 1;
  }
  if (viewportCount > totalCount) { //it exists in code since long time, but does it even happen
    viewportCount = totalCount;
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

  if ((ratio === 1 && scroll === 'auto') || scroll === 'none') {
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
    this.slider.style.display = 'none';
    return;
  }

  var ratio
    , sliderSize
    , handleSize
    , handlePosition
    , offsetCount
    , totalCount
    , tableWidth = this.instance.hasSetting('width') ? this.instance.getSetting('width') : this.$table.outerWidth()
    , tableHeight = this.instance.hasSetting('height') ? this.instance.getSetting('height') : this.$table.outerHeight();

  if (!tableWidth) {
    //throw new Error("I could not compute table width. Is the <table> element attached to the DOM?");
    return;
  }
  if (!tableHeight) {
    //throw new Error("I could not compute table height. Is the <table> element attached to the DOM?");
    return;
  }

  if (this.instance.wtScroll.wtScrollbarV.visible) {
    tableWidth -= this.instance.getSetting('scrollbarWidth');
  }
  if (this.instance.wtScroll.wtScrollbarH.visible) {
    tableHeight -= this.instance.getSetting('scrollbarHeight');
  }

  if (this.type === 'vertical') {
    offsetCount = this.instance.getSetting('offsetRow');
    totalCount = this.instance.getSetting('totalRows');
    ratio = this.getHandleSizeRatio(this.instance.getSetting('viewportRows'), totalCount);

    sliderSize = tableHeight - 2; //2 is sliders border-width

    this.slider.style.top = this.$table.position().top + 'px';
    this.slider.style.left = tableWidth - 1 + 'px'; //1 is sliders border-width
    this.slider.style.height = sliderSize + 'px';
  }
  else { //horizontal
    offsetCount = this.instance.getSetting('offsetColumn');
    totalCount = this.instance.getSetting('totalColumns');
    ratio = this.getHandleSizeRatio(this.instance.getSetting('viewportColumns'), totalCount);

    sliderSize = tableWidth - 2; //2 is sliders border-width

    this.slider.style.left = this.$table.position().left + 'px';
    this.slider.style.top = tableHeight - 1 + 'px'; //1 is sliders border-width
    this.slider.style.width = sliderSize + 'px';
  }

  handleSize = Math.round(sliderSize * ratio);
  if (handleSize < 10) {
    handleSize = 15;
  }
  handlePosition = Math.round(sliderSize * (offsetCount / totalCount));
  if (handlePosition > tableWidth - handleSize) {
    handlePosition = tableWidth - handleSize;
  }

  if (this.type === 'vertical') {
    this.handle.style.height = handleSize + 'px';
    this.handle.style.top = handlePosition + 'px';
  }
  else { //horizontal
    this.handle.style.width = handleSize + 'px';
    this.handle.style.left = handlePosition + 'px';
  }

  this.slider.style.display = 'block';

  this.dragdealer.setWrapperOffset();
  this.dragdealer.setBounds();
};