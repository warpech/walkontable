function WalkontableTable(instance) {
  //reference to instance
  this.instance = instance;

  //bootstrap from settings
  this.wtDom = new WalkontableDom();
  this.wtDom.removeTextNodes(this.instance.settings.table);
  this.TABLE = this.instance.settings.table;
  this.THEAD = this.instance.settings.table.childNodes[0];
  this.TBODY = this.instance.settings.table.childNodes[1];

  this.availableTRs = 0;
}

WalkontableTable.prototype.adjustAvailableNodes = function () {
  while (this.availableTRs < this.instance.settings.displayRows) {
    var TR = document.createElement('TR');
    for (var c = 0; c < this.instance.displayColumns; c++) {
      var TD = document.createElement('TD');
      TR.appendChild(TD);
    }
    this.TBODY.appendChild(TR);
    this.availableTRs++;
  }
};

WalkontableTable.prototype.draw = function () {
  this.adjustAvailableNodes();
  for (var r = 0; r < this.instance.settings.displayRows; r++) {
    var TR = this.TBODY.childNodes[r];
    for (var c = 0; c < this.instance.displayColumns; c++) {
      var TD = TR.childNodes[c];
      TD.innerHTML = this.instance.settings.data[this.instance.settings.startRow + r][c];
    }
  }
  return this;
};