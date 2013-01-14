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
      that.onScroll(type === 'vertical' ? y : x);
    }
  });
  that.skipRefresh = false;
}

WalkontableScrollbar.prototype.onScroll = function (delta) {
  if (this.instance.drawn) {
    var keys = this.type === 'vertical' ? ['offsetRow', 'totalRows', 'viewportRows'] : ['offsetColumn', 'totalColumns', 'viewportColumns'];
    var total = this.instance.getSetting(keys[1]);
    var display = this.instance.getSetting(keys[2]);
    if (total > display) {
      var newOffset = Math.max(0, Math.round((total - display) * delta));
      if (newOffset !== this.instance.getSetting(keys[0])) { //is new offset different than old offset
        this.instance.update(keys[0], newOffset);
        this.instance.draw();
      }
    }
  }
};

WalkontableScrollbar.prototype.refresh = function () {
  if (this.skipRefresh) {
    return;
  }
  var ratio = 1
    , handleSize
    , handlePosition
    , offsetRow = this.instance.getSetting('offsetRow')
    , offsetColumn = this.instance.getSetting('offsetColumn')
    , totalRows = this.instance.getSetting('totalRows')
    , totalColumns = this.instance.getSetting('totalColumns')
    , tableWidth = this.instance.hasSetting('width') ? this.instance.getSetting('width') : this.$table.outerWidth()
    , tableHeight = this.instance.hasSetting('height') ? this.instance.getSetting('height') : this.$table.outerHeight()
    , viewportRows = Math.min(this.instance.getSetting('viewportRows'), totalRows)
    , viewportColumns = Math.min(this.instance.getSetting('viewportColumns'), totalColumns);

  if (!tableWidth) {
    throw new Error("I could not compute table width. Is the <table> element attached to the DOM?");
  }
  if (!tableHeight) {
    throw new Error("I could not compute table height. Is the <table> element attached to the DOM?");
  }

  tableWidth -= this.instance.getSetting('scrollbarWidth');
  tableHeight -= this.instance.getSetting('scrollbarHeight');

  if (this.type === 'vertical') {
    if (totalRows) {
      ratio = viewportRows / totalRows;
    }

    var scrollV = this.instance.getSetting('scrollV');
    if ((ratio === 1 && scrollV === 'auto') || scrollV === 'none') {
      this.slider.style.display = 'none';
      this.visible = false;
    }
    else {
      handleSize = Math.round($(this.slider).height() * ratio);
      if (handleSize < 10) {
        handleSize = 30;
      }
      handlePosition = Math.round((tableHeight - handleSize) * (offsetRow / totalRows));
      if (handlePosition > tableHeight - handleSize) {
        handlePosition = tableHeight - handleSize;
      }

      this.slider.style.display = 'block';
      this.visible = true;
      this.slider.style.top = this.$table.position().top + 'px';
      this.slider.style.left = tableWidth - 1 + 'px'; //1 is sliders border-width
      this.slider.style.height = tableHeight - 2 + 'px'; //2 is sliders border-width
      this.handle.style.height = handleSize + 'px';
      this.handle.style.top = handlePosition + 'px';
    }
  }
  else if (this.type === 'horizontal') {
    if (totalColumns) {
      ratio = viewportColumns / totalColumns;
    }

    var scrollH = this.instance.getSetting('scrollH');
    if ((ratio === 1 && scrollH === 'auto') || scrollH === 'none') {
      this.slider.style.display = 'none';
      this.visible = false;
      //this.instance.wtTable.TABLE.style.tableLayout = 'fixed';
      //this.instance.wtTable.TABLE.style.width = tableWidth + 'px';
    }
    else {
      handleSize = Math.round($(this.slider).width() * ratio);
      if (handleSize < 10) {
        handleSize = 30;
      }
      handlePosition = Math.round((tableWidth - handleSize) * (offsetColumn / totalColumns));
      if (handlePosition > tableWidth - handleSize) {
        handlePosition = tableWidth - handleSize;
      }

      //this.instance.wtTable.TABLE.style.tableLayout = 'auto';
      //this.instance.wtTable.TABLE.style.width = '';
      this.slider.style.display = 'block';
      this.visible = true;
      this.slider.style.left = this.$table.position().left + 'px';
      this.slider.style.top = tableHeight - 1 + 'px'; //1 is sliders border-width
      this.slider.style.width = tableWidth - 2 + 'px'; //2 is sliders border-width
      this.handle.style.width = handleSize + 'px';
      this.handle.style.left = handlePosition + 'px';
    }
  }

  this.dragdealer.setWrapperOffset();
  //this.dragdealer.setBoundsPadding();
  this.dragdealer.setBounds();
  //this.dragdealer.setSteps();
};