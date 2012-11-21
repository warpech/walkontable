function Walkontable(settings) {
  //reference to settings
  this.settings = settings;

  //bootstrap from settings
  this.wtDom = new WalkontableDom();
  this.wtDom.removeTextNodes(this.settings.table);
  this.TABLE = this.settings.table;
  this.THEAD = this.settings.table.childNodes[0];
  this.TBODY = this.settings.table.childNodes[1];
  this.displayColumns = this.THEAD.childNodes[0].childNodes.length;

  this.availableTRs = 0;
}

Walkontable.prototype.adjustAvailableNodes = function () {
  while (this.availableTRs < this.settings.displayRows) {
    var TR = document.createElement('TR');
    for (var c = 0; c < this.displayColumns; c++) {
      var TD = document.createElement('TD');
      TR.appendChild(TD);
    }
    this.TBODY.appendChild(TR);
    this.availableTRs++;
  }
};

Walkontable.prototype.draw = function () {
  this.adjustAvailableNodes();
  for (var r = 0; r < this.settings.displayRows; r++) {
    var TR = this.TBODY.childNodes[r];
    for (var c = 0; c < this.displayColumns; c++) {
      var TD = TR.childNodes[c];
      TD.innerHTML = this.settings.data[this.settings.startRow + r][c];
    }
  }
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