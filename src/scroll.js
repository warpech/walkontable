function WalkontableScroll(instance) {
  this.instance = instance;
  this.wtScrollbarV = new WalkontableScrollbar(instance, 'vertical');
  this.wtScrollbarH = new WalkontableScrollbar(instance, 'horizontal');
}

WalkontableScroll.prototype.refreshScrollbars = function () {
  this.wtScrollbarV.refresh();
  this.wtScrollbarH.refresh();
};

WalkontableScroll.prototype.scrollVertical = function (delta) {
  var offsetRow = this.instance.getSetting('offsetRow')
    , newOffsetRow
    , max = this.instance.getSetting('totalRows') - this.instance.getSetting('viewportRows');
  if (max < 0) {
    max = 0;
  }
  newOffsetRow = offsetRow + delta;
  if (newOffsetRow < 0) {
    newOffsetRow = 0;
  }
  else if (newOffsetRow >= max) {
    newOffsetRow = max;
  }
  if (newOffsetRow !== offsetRow) {
    this.instance.update('offsetRow', newOffsetRow);
  }
  return this.instance;
};

WalkontableScroll.prototype.scrollHorizontal = function (delta) {
  var viewportColumns = this.instance.getSetting('viewportColumns');
  if (viewportColumns !== null) {
    var offsetColumn = this.instance.getSetting('offsetColumn')
      , newOffsetColumn
      , max = this.instance.getSetting('totalColumns') - viewportColumns;
    if (max < 0) {
      max = 0;
    }
    newOffsetColumn = offsetColumn + delta;
    if (newOffsetColumn < 0) {
      newOffsetColumn = 0;
    }
    else if (newOffsetColumn >= max) {
      newOffsetColumn = max;
    }
    if (newOffsetColumn !== offsetColumn) {
      this.instance.update('offsetColumn', newOffsetColumn);
    }
  }
  return this.instance;
};

/**
 * Scrolls viewport to a cell by minimum number of cells
 */
WalkontableScroll.prototype.scrollViewport = function (coords) {
  var offsetRow = this.instance.getSetting('offsetRow')
    , offsetColumn = this.instance.getSetting('offsetColumn')
    , viewportRows = this.instance.getSetting('viewportRows')
    , viewportColumns = this.instance.getSetting('viewportColumns')
    , totalRows = this.instance.getSetting('totalRows')
    , totalColumns = this.instance.getSetting('totalColumns');

  if (coords[0] < 0 || coords[0] > totalRows - 1) {
    throw new Error('row ' + coords[0] + ' does not exist');
  }
  else if (coords[1] < 0 || coords[1] > totalColumns - 1) {
    throw new Error('column ' + coords[1] + ' does not exist');
  }

  if (viewportRows < totalRows) {
    if (coords[0] > offsetRow + viewportRows - 1) {
      this.scrollVertical(coords[0] - (offsetRow + viewportRows - 1));
    }
    else if (coords[0] < offsetRow) {
      this.scrollVertical(coords[0] - offsetRow);
    }
    else {
      this.scrollVertical(0); //Craig's issue: remove row from the last scroll page should scroll viewport a row up if needed
    }
  }
  else {
    this.scrollVertical(0); //Craig's issue
  }

  if (viewportColumns > 0 && viewportColumns < totalColumns) {
    if (coords[1] > offsetColumn + viewportColumns - 1) {
      this.scrollHorizontal(coords[1] - (offsetColumn + viewportColumns - 1));
    }
    else if (coords[1] < offsetColumn) {
      this.scrollHorizontal(coords[1] - offsetColumn);
    }
    else {
      this.scrollHorizontal(0); //Craig's issue
    }
  }
  else {
    this.scrollHorizontal(0); //Craig's issue
  }

  return this.instance;
};