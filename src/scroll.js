function WalkontableScroll(instance) {
  var that = this;

  //reference to instance
  this.instance = instance;
  this.$table = $(this.instance.settings.table);

  //create elements
  var holder = document.createElement('DIV');
  holder.style.position = 'relative';
  holder.className = 'wtHolder';

  this.slider = document.createElement('DIV');
  this.slider.style.position = 'absolute';
  this.slider.style.top = '0';
  this.slider.className = 'dragdealer';

  this.handle = document.createElement('DIV');
  this.handle.className = 'handle';

  this.instance.settings.table.parentNode.insertBefore(holder, this.instance.settings.table);
  this.slider.appendChild(this.handle);
  holder.appendChild(this.instance.settings.table);
  holder.appendChild(this.slider);

  this.dragdealer = new Dragdealer(this.slider, {
    vertical: true,
    horizontal: false,
    speed: 100,
    yPrecision: 100,
    animationCallback: function (x, y) {
      if (that.instance.drawn) {
        that.instance.update({startRow: Math.round((that.instance.settings.data.length - that.instance.settings.displayRows) * y)});
        that.instance.draw();
      }
    }
  });
}

WalkontableScroll.prototype.refresh = function () {
  var ratio = this.instance.settings.displayRows / this.instance.settings.data.length;
  var handleHeight = Math.round($(this.slider).height() * ratio);
  if (handleHeight < 10) {
    handleHeight = 30;
  }

  this.handle.style.height = handleHeight + 'px';
  this.slider.style.top = this.$table.position().top + 'px';
  this.slider.style.left = this.$table.outerWidth() - 1 + 'px'; //1 is sliders border-width
  this.slider.style.height = this.$table.outerHeight() - 2 + 'px'; //2 is sliders border-width

  this.dragdealer.setWrapperOffset();
  //this.dragdealer.setBoundsPadding();
  this.dragdealer.setBounds();
  //this.dragdealer.setSteps();
};