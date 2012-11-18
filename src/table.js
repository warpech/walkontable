function WalkontableTable(TABLE) {
  this.TABLE = TABLE;
  this.rebuild();
}

WalkontableTable.prototype.rebuild = function () {
  this.rebuildColumns();
  this.rebuildRows();
};

WalkontableTable.prototype.rebuildRows = function () {
  this.rows = [];
  var row
    , i = 0;
  while ((row = new WalkontableRow(this, i)).cells !== null) {
    i++;
    this.rows.push(row);
  }
};

WalkontableTable.prototype.rebuildColumns = function () {
  this.columns = [];
  var column
    , i = 0;
  while ((column = new WalkontableColumn(this, i)).cells !== null) {
    i++;
    this.columns.push(column);
  }
};

WalkontableTable.prototype.getRow = function (index) {
  return this.rows[index];
};

WalkontableTable.prototype.getColumn = function (index) {
  return this.columns[index];
};