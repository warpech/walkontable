function Walkontable(settings) {
  //reference to settings
  this.settings = settings;

  //bootstrap from settings
  this.wtTable = new WalkontableTable(this);
  this.wtEvent = new WalkontableEvent(this);
  this.displayColumns = this.wtTable.THEAD.childNodes[0].childNodes.length;
}

Walkontable.prototype.draw = function () {
  this.wtTable.draw();
  return this;
};

Walkontable.prototype.update = function (settings) {
  for (var i in settings) {
    if (settings.hasOwnProperty(i)) {
      this.settings[i] = settings[i];
    }
  }
  return this;
};