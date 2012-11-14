function WalkontableSelection(onAdd, onRemove) {
  this.selected = [];
  this.onAdd = onAdd;
  this.onRemove = onRemove;
}

WalkontableSelection.prototype.add = function (TD) {
  this.selected.push(TD);
  this.onAdd(TD);
};

WalkontableSelection.prototype.remove = function (TD) {
  var index = this.isSelected(TD);
  if (index > -1) {
    this.selected.splice(index, 1);
    this.onRemove(TD);
  }
};

WalkontableSelection.prototype.clear = function () {
  for (var i = 0, ilen = this.selected.length; i < ilen; i++) {
    this.remove(this.selected[i]);
  }
};

WalkontableSelection.prototype.isSelected = function (TD) {
  return this.selected.indexOf(TD);
};

WalkontableSelection.prototype.getSelected = function () {
  return this.selected;
};