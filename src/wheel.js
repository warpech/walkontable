function WalkontableWheel(instance) {
  var that = this;

  //reference to instance
  this.instance = instance;
  $(this.instance.settings.table).on('mousewheel', function (event, delta, deltaX, deltaY) {
    if (deltaY) {
      that.instance.scrollVertical(-deltaY).draw();
    }
    else if (deltaX) {
      that.instance.scrollHorizontal(deltaX).draw();
    }
    event.preventDefault();
  });
}