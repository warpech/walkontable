function WalkontableScrollbar(instance, type) {
  var that = this;

  //reference to instance
  this.instance = instance;
  this.type = type;
  var TABLE = this.instance.getSetting('table');
  this.$table = $(TABLE);
  var wtDom = new WalkontableDom();

  //create elements
  this.slider = document.createElement('DIV');
  this.slider.style.position = 'absolute';
  this.slider.style.top = '0';
  this.slider.style.left = '0';
  this.slider.className = 'dragdealer ' + type;

  this.handle = document.createElement('DIV');
  this.handle.className = 'handle';

  var parent = TABLE.parentNode;
  if (!parent || parent.nodeType !== 1 || !wtDom.hasClass(parent, 'wtHolder')) {
    var holder = document.createElement('DIV');
    holder.style.position = 'relative';
    holder.className = 'wtHolder';
    if (parent) {
      parent.insertBefore(holder, TABLE); //if TABLE is detached (e.g. in Jasmine test), it has no parentNode so we cannot attach holder to it
    }
    holder.appendChild(TABLE);
    parent = holder;
  }

  this.slider.appendChild(this.handle);
  parent.appendChild(this.slider);

  this.dragdealer = new Dragdealer(this.slider, {
    vertical: (type === 'vertical'),
    horizontal: (type === 'horizontal'),
    speed: 100,
    yPrecision: 100,
    animationCallback: function (x, y) {
      that.onScroll(type === 'vertical' ? y : x);
    }
  });
}

WalkontableScrollbar.prototype.onScroll = function (delta) {
  if (this.instance.drawn) {
    var keys = this.type === 'vertical' ? ['offsetRow', 'totalRows', 'displayRows'] : ['offsetColumn', 'totalColumns', 'displayColumns'];
    var total = this.instance.getSetting(keys[1]);
    var display = this.instance.getSetting(keys[2]);
    if(total > display) {
      var newOffset = Math.max(0, Math.round((total - display) * delta));
      if (newOffset !== this.instance.getSetting(keys[0])) { //is new offset different than old offset
        this.instance.update(keys[0], newOffset);
        this.instance.draw();
      }
    }
  }
};

WalkontableScrollbar.prototype.refresh = function () {
  var ratio = 1
    , handleSize
    , totalRows = this.instance.getSetting('totalRows')
    , totalColumns = this.instance.getSetting('totalColumns')
    , tableWidth = this.$table.outerWidth()
    , tableHeight = this.$table.outerHeight()
    , displayRows = Math.min(this.instance.getSetting('displayRows'), totalRows)
    , displayColumns = Math.min(this.instance.getSetting('displayColumns'), totalColumns);

  if (!tableWidth) {
    throw new Error("I could not compute table width. Is the <table> element attached to the DOM?");
  }
  if (!tableHeight) {
    throw new Error("I could not compute table height. Is the <table> element attached to the DOM?");
  }

  if (this.type === 'vertical') {
    this.slider.style.top = this.$table.position().top + 'px';
    this.slider.style.left = tableWidth - 1 + 'px'; //1 is sliders border-width
    this.slider.style.height = tableHeight - 2 + 'px'; //2 is sliders border-width

    if (totalRows) {
      ratio = displayRows / totalRows;
    }
    handleSize = Math.round($(this.slider).height() * ratio);
    if (handleSize < 10) {
      handleSize = 30;
    }
    this.handle.style.height = handleSize + 'px';
  }
  else if (this.type === 'horizontal') {
    this.slider.style.left = this.$table.position().left + 'px';
    this.slider.style.top = tableHeight - 1 + 'px'; //1 is sliders border-width
    this.slider.style.width = tableWidth - 2 + 'px'; //2 is sliders border-width

    if (totalColumns) {
      ratio = displayColumns / totalColumns;
    }
    handleSize = Math.round($(this.slider).width() * ratio);
    if (handleSize < 10) {
      handleSize = 30;
    }
    this.handle.style.width = handleSize + 'px';
  }

  this.dragdealer.setWrapperOffset();
  //this.dragdealer.setBoundsPadding();
  this.dragdealer.setBounds();
  //this.dragdealer.setSteps();
};