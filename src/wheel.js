function WalkontableWheel(instance) {
  var that = this;

  //reference to instance
  this.instance = instance;
  var wheelTimeout;
  $(this.instance.settings.table).on('mousewheel', function (event, delta, deltaX, deltaY) {
    clearTimeout(wheelTimeout);
    wheelTimeout = setTimeout(function () { //timeout is needed because with fast-wheel scrolling mousewheel event comes dozen times per second
      if (deltaY) {
        that.instance.scrollVertical(-deltaY).draw();
      }
      else if (deltaX) {
        that.instance.scrollHorizontal(deltaX).draw();
      }
    }, 0);
    event.preventDefault();
  });
}