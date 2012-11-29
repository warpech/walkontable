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
  this.slider.className = 'dragdealer';

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
      if (that.instance.drawn) {
        if (that.type === 'vertical') {
          that.instance.update({offsetRow: Math.round((that.instance.getSetting('totalRows') - that.instance.getSetting('displayRows')) * y)});
        }
        else if (that.type === 'horizontal') {
          that.instance.update({offsetColumn: Math.round((that.instance.getSetting('totalColumns') - that.instance.getSetting('displayColumns')) * x)});
        }
        that.instance.draw();
      }
    }
  });
}

WalkontableScrollbar.prototype.refresh = function () {
  var ratio = 1
    , handleSize
    , totalRows = this.instance.getSetting('totalRows')
    , totalColumns = this.instance.getSetting('totalColumns');
  if (this.type === 'vertical') {
    this.slider.style.top = this.$table.position().top + 'px';
    this.slider.style.left = this.$table.outerWidth() - 1 + 'px'; //1 is sliders border-width
    this.slider.style.height = this.$table.outerHeight() - 2 + 'px'; //2 is sliders border-width

    if (totalRows) {
      ratio = this.instance.getSetting('displayRows') / totalRows;
    }
    handleSize = Math.round($(this.slider).height() * ratio);
    if (handleSize < 10) {
      handleSize = 30;
    }
    this.handle.style.height = handleSize + 'px';
  }
  else if (this.type === 'horizontal') {
    this.slider.style.left = this.$table.position().left + 'px';
    this.slider.style.top = this.$table.outerHeight() - 1 + 'px'; //1 is sliders border-width
    this.slider.style.width = this.$table.outerWidth() - 2 + 'px'; //2 is sliders border-width

    if (totalColumns) {
      ratio = this.instance.getSetting('displayColumns') / totalColumns;
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