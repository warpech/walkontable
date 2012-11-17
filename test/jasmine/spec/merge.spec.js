describe('WalkontableMerge', function () {
  var $table;

  var debug = false;

  beforeEach(function () {
    $table = $('<table><tr><td></td><td></td></tr><tr><td></td><td></td></tr></table>'); //create a table that is not attached to document
    if (debug) {
      $table.find('td').each(function () {
        this.innerHTML = 'x';
      });
    }
  });

  afterEach(function () {
    if (debug) {
      $table.appendTo('body');
    }
  });

  /**
   * mergeSelection
   */

  it("should merge two cells horizontally when given in reverse order", function () {
    var wtSelection = new WalkontableSelection();
    var TD_1 = $table.find('tr:eq(0)').find('td:eq(0)')[0];
    var TD_2 = $table.find('tr:eq(0)').find('td:eq(1)')[0];
    wtSelection.add(TD_2);
    wtSelection.add(TD_1);

    var wtMerge = new WalkontableMerge();
    wtMerge.mergeSelection(wtSelection);

    expect($table.find('tr:eq(0)').find('td').length).toBe(1);
    expect($table.find('tr:eq(0)').find('td').attr('colspan')).toBe('2');
  });

  it("should merge two cells vertically when given in reverse order", function () {
    var wtSelection = new WalkontableSelection();
    var TD_1 = $table.find('tr:eq(0)').find('td:eq(0)')[0];
    var TD_2 = $table.find('tr:eq(1)').find('td:eq(0)')[0];
    wtSelection.add(TD_2);
    wtSelection.add(TD_1);

    var wtMerge = new WalkontableMerge();
    wtMerge.mergeSelection(wtSelection);

    expect($table.find('td').length).toBe(3);
    expect($table.find('td:eq(0)').attr('rowspan')).toBe('2');
    expect($table.find('tr:eq(0)').find('td').length).toBe(2);
    expect($table.find('tr:eq(1)').find('td').length).toBe(1);
  });

  it("should merge four cells vertically and horizontally", function () {
    var wtSelection = new WalkontableSelection();
    var TD_1 = $table.find('tr:eq(0)').find('td:eq(0)')[0];
    var TD_2 = $table.find('tr:eq(0)').find('td:eq(1)')[0];
    var TD_3 = $table.find('tr:eq(1)').find('td:eq(0)')[0];
    var TD_4 = $table.find('tr:eq(1)').find('td:eq(1)')[0];
    wtSelection.add(TD_4);
    wtSelection.add(TD_2);
    wtSelection.add(TD_1);
    wtSelection.add(TD_3);

    var wtMerge = new WalkontableMerge();
    wtMerge.mergeSelection(wtSelection);

    expect($table.find('td').length).toBe(1);
    expect($table.find('td:eq(0)')[0].rowSpan).toBe(2);
    expect($table.find('td:eq(0)')[0].colSpan).toBe(2);
    expect($table.find('tr:eq(0)').find('td').length).toBe(1);
    expect($table.find('tr:eq(1)').find('td').length).toBe(0);
  });

  it("should return false when non-rectangular selection is given", function () {
    var wtSelection = new WalkontableSelection();
    var TD_1 = $table.find('tr:eq(0)').find('td:eq(0)')[0];
    var TD_2 = $table.find('tr:eq(1)').find('td:eq(1)')[0];
    wtSelection.add(TD_1);
    wtSelection.add(TD_2);

    var wtMerge = new WalkontableMerge();
    var result = wtMerge.mergeSelection(wtSelection);

    expect(result).toBe(false);
  });

  it("should return true when rectangular selection is given (and merge was successful)", function () {
    var wtSelection = new WalkontableSelection();
    var TD_1 = $table.find('tr:eq(0)').find('td:eq(0)')[0];
    var TD_2 = $table.find('tr:eq(0)').find('td:eq(1)')[0];
    wtSelection.add(TD_1);
    wtSelection.add(TD_2);

    var wtMerge = new WalkontableMerge();
    var result = wtMerge.mergeSelection(wtSelection);

    expect(result).toBe(true);
  });
});