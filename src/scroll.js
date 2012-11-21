function WalkontableScroll(instance) {
  var that = this;

  //reference to instance
  this.instance = instance;

  var holder = document.createElement('DIV');
  holder.className = 'wtHolder';

  this.slider = document.createElement('DIV');
  this.slider.className = 'dragdealer';

  this.handle = document.createElement('DIV');
  this.handle.className = 'handle';

  this.instance.settings.table.parentNode.insertBefore(holder, this.instance.settings.table);
  this.slider.appendChild(this.handle);
  holder.appendChild(this.slider);
  holder.appendChild(this.instance.settings.table);

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
  this.dragdealer.setWrapperOffset();
  //this.dragdealer.setBoundsPadding();
  this.dragdealer.setBounds();
  //this.dragdealer.setSteps();
};