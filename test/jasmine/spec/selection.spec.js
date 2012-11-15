describe('WalkontableSelection', function () {
  var $table;

  beforeEach(function () {
    $table = $('<table border=1><thead><tr><td></td><td></td><td></td><td></td></tr></thead><tbody><tr><td></td><td></td><td rowspan="2"></td><td></td></tr><tr><td colspan="2"></td><td></td></tr><tr><td></td><td></td><td></td><td></td></tr></tbody></table>'); //create a table that is not attached to document
    /*$table.find('td').each(function () {
      this.innerHTML = 'x';
    });*/
  });

  afterEach(function () {
    //$table.appendTo('body');
  });

  it("should add TD to selection", function () {
    var wtSelection = new WalkontableSelection();
    wtSelection.add($table.find('tbody tr:eq(0) td:eq(0)')[0]);

    expect(wtSelection.getSelected().length).toBe(1);
  });

  it("should remove TD from selection", function () {
    var wtSelection = new WalkontableSelection();
    var TD = $table.find('tbody tr:eq(0) td:eq(0)')[0];
    wtSelection.add(TD);
    wtSelection.remove(TD);

    expect(wtSelection.getSelected().length).toBe(0);
  });

  it("clear should remove all TDs from selection", function () {
    var wtSelection = new WalkontableSelection();
    wtSelection.add($table.find('tbody tr:eq(0) td:eq(0)')[0]);
    wtSelection.clear();

    expect(wtSelection.getSelected().length).toBe(0);
  });

  it("should recognize rectangular selection with colspan", function () {
    var wtSelection = new WalkontableSelection();
    wtSelection.add($table.find('tbody tr:eq(0) td:eq(0)')[0]);
    wtSelection.add($table.find('tbody tr:eq(0) td:eq(1)')[0]);
    wtSelection.add($table.find('tbody tr:eq(1) td:eq(0)')[0]);

    var rect = wtSelection.rectangleSize();
    expect(rect.width).toBe(2);
    expect(rect.height).toBe(2);
  });

  it("should recognize rectangular selection with rowspan", function () {
    var wtSelection = new WalkontableSelection();
    wtSelection.add($table.find('tbody tr:eq(0) td:eq(2)')[0]);
    wtSelection.add($table.find('tbody tr:eq(0) td:eq(3)')[0]);
    wtSelection.add($table.find('tbody tr:eq(1) td:eq(1)')[0]);

    var rect = wtSelection.rectangleSize();
    expect(rect.width).toBe(2);
    expect(rect.height).toBe(2);
  });

  it("should recognize non-rectangular selection", function () {
    var wtSelection = new WalkontableSelection();
    wtSelection.add($table.find('tbody tr:eq(0) td:eq(0)')[0]);
    wtSelection.add($table.find('tbody tr:eq(1) td:eq(0)')[0]);

    expect(wtSelection.rectangleSize()).toBe(null);
  });

  it("should recognize diagonal selection as non-rectangular", function () {
    var wtSelection = new WalkontableSelection();
    wtSelection.add($table.find('tbody tr:eq(0) td:eq(0)')[0]);
    wtSelection.add($table.find('tbody tr:eq(1) td:eq(0)')[0]);

    expect(wtSelection.rectangleSize()).toBe(null);
  });

  it("should recognize non-consecutive horizontal selection as non-rectangular", function () {
    var wtSelection = new WalkontableSelection();
    wtSelection.add($table.find('tbody tr:eq(0) td:eq(0)')[0]);
    wtSelection.add($table.find('tbody tr:eq(1) td:eq(0)')[0]);

    expect(wtSelection.rectangleSize()).toBe(null);
  });

  it("should recognize non-consecutive horizontal selection as non-rectangular", function () {
    var wtSelection = new WalkontableSelection();
    wtSelection.add($table.find('tbody tr:eq(2) td:eq(0)')[0]);
    wtSelection.add($table.find('tbody tr:eq(2) td:eq(2)')[0]);

    expect(wtSelection.rectangleSize()).toBe(null);
  });

  it("should recognize non-consecutive vertical selection as non-rectangular", function () {
    var wtSelection = new WalkontableSelection();
    wtSelection.add($table.find('tbody tr:eq(0) td:eq(0)')[0]);
    wtSelection.add($table.find('tbody tr:eq(2) td:eq(0)')[0]);

    expect(wtSelection.rectangleSize()).toBe(null);
  });

  it("should recognize randomly unsorted consecutive selection as rectangular", function () {
    var wtSelection = new WalkontableSelection();
    wtSelection.add($table.find('tbody tr:eq(2) td:eq(0)')[0]);
    wtSelection.add($table.find('tbody tr:eq(2) td:eq(2)')[0]);
    wtSelection.add($table.find('tbody tr:eq(2) td:eq(1)')[0]);

    var rect = wtSelection.rectangleSize();
    expect(rect.width).toBe(3);
    expect(rect.height).toBe(1);
  });

  it("should recognize uneven rowspan in calculation", function () {
    var wtSelection = new WalkontableSelection();
    wtSelection.add($table.find('tbody tr:eq(1) td:eq(0)')[0]);
    wtSelection.add($table.find('tbody tr:eq(1) td:eq(1)')[0]);

    expect(wtSelection.rectangleSize()).toBe(null);
  });

  it("should include rowspan in rectangle calculation", function () {
    var wtSelection = new WalkontableSelection();
    wtSelection.add($table.find('tbody tr:eq(0) td:eq(2)')[0]);
    wtSelection.add($table.find('tbody tr:eq(2) td:eq(2)')[0]);

    var rect = wtSelection.rectangleSize();
    expect(rect.width).toBe(1);
    expect(rect.height).toBe(3);
  });

  it("should allow selection of the whole table body", function () {
    var wtSelection = new WalkontableSelection();
    $table.find('tbody td').each(function(){
      wtSelection.add(this);
    });

    var cols = $table.find('tbody tr:eq(0) td').length;
    var rows = $table.find('tbody tr').length;

    var rect = wtSelection.rectangleSize();
    expect(rect.width).toBe(cols);
    expect(rect.height).toBe(rows);
  });

  it("should allow selection of the whole table head", function () {
    var wtSelection = new WalkontableSelection();
    $table.find('thead td').each(function(){
      wtSelection.add(this);
    });

    var cols = $table.find('thead tr:eq(0) td').length;
    var rows = $table.find('thead tr').length;

    var rect = wtSelection.rectangleSize();
    expect(rect.width).toBe(cols);
    expect(rect.height).toBe(rows);
  });

  it("should disallow selection of mixed elements from thead & tbody", function () {
    var wtSelection = new WalkontableSelection();
    wtSelection.add($table.find('thead tr:eq(0) td:eq(0)')[0]);
    wtSelection.add($table.find('tbody tr:eq(0) td:eq(0)')[0]);

    expect(wtSelection.rectangleSize()).toBe(null);
  });
});