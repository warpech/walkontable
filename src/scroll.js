function WalkontableScroll(instance, type) {
  var that = this;

  //reference to instance
  this.instance = instance;
  this.type = type;
  this.$table = $(this.instance.settings.table);

  //create elements
  var holder = document.createElement('DIV');
  holder.style.position = 'relative';
  holder.className = 'wtHolder';

  this.slider = document.createElement('DIV');
  this.slider.style.position = 'absolute';
  this.slider.style.top = '0';
  this.slider.style.left = '0';
  this.slider.className = 'dragdealer';

  this.handle = document.createElement('DIV');
  this.handle.className = 'handle';

  this.instance.settings.table.parentNode.insertBefore(holder, this.instance.settings.table);
  this.slider.appendChild(this.handle);
  holder.appendChild(this.instance.settings.table);
  holder.appendChild(this.slider);

  this.dragdealer = new Dragdealer(this.slider, {
    vertical: (type === 'vertical'),
    horizontal: (type === 'horizontal'),
    speed: 100,
    yPrecision: 100,
    animationCallback: function (x, y) {
      if (that.instance.drawn) {
        if (that.type === 'vertical') {
          that.instance.update({startRow: Math.round((that.instance.settings.data.length - that.instance.settings.displayRows) * y)});
        }
        else if (that.type === 'horizontal') {
          that.instance.update({startColumn: Math.round((that.instance.settings.data[0].length - that.instance.settings.displayColumns) * x)});
        }
        that.instance.draw();
      }
    }
  });
}

WalkontableScroll.prototype.refresh = function () {
  var ratio, handleSize;
  if (this.type === 'vertical') {
    this.slider.style.top = this.$table.position().top + 'px';
    this.slider.style.left = this.$table.outerWidth() - 1 + 'px'; //1 is sliders border-width
    this.slider.style.height = this.$table.outerHeight() - 2 + 'px'; //2 is sliders border-width

    ratio = this.instance.settings.displayRows / this.instance.settings.data.length;
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

    ratio = this.instance.settings.displayColumns / this.instance.settings.data[0].length;
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