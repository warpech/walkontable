describe('WalkontableSelection', function () {
  var $table;

  beforeEach(function () {
    $table = $('<table><tr><td></td><td></td><td rowspan="2"></td><td></td></tr><tr><td colspan="2"></td><td></td></tr></table>'); //create a table that is not even attached to document
  });

  afterEach(function () {
    $table.remove();
  });

  it("should add TD to selection", function () {
    var wtSelection = new WalkontableSelection();
    wtSelection.add($table.find('tr:eq(0) td:eq(0)')[0]);

    expect(wtSelection.getSelected().length).toBe(1);
  });

  it("should remove TD from selection", function () {
    var wtSelection = new WalkontableSelection();
    var TD = $table.find('tr:eq(0) td:eq(0)')[0];
    wtSelection.add(TD);
    wtSelection.remove(TD);

    expect(wtSelection.getSelected().length).toBe(0);
  });

  it("clear should remove all TDs from selection", function () {
    var wtSelection = new WalkontableSelection();
    wtSelection.add($table.find('tr:eq(0) td:eq(0)')[0]);
    wtSelection.clear();

    expect(wtSelection.getSelected().length).toBe(0);
  });

  it("should recognize rectangular selection with colspan", function () {
    var wtSelection = new WalkontableSelection();
    wtSelection.add($table.find('tr:eq(0) td:eq(0)')[0]);
    wtSelection.add($table.find('tr:eq(0) td:eq(1)')[0]);
    wtSelection.add($table.find('tr:eq(1) td:eq(0)')[0]);

    var rect = wtSelection.rectangleSize();
    expect(rect.width).toBe(2);
    expect(rect.height).toBe(2);
  });

  it("should recognize rectangular selection with rowspan", function () {
    var wtSelection = new WalkontableSelection();
    wtSelection.add($table.find('tr:eq(0) td:eq(2)')[0]);
    wtSelection.add($table.find('tr:eq(0) td:eq(3)')[0]);
    wtSelection.add($table.find('tr:eq(1) td:eq(1)')[0]);

    var rect = wtSelection.rectangleSize();
    expect(rect.width).toBe(2);
    expect(rect.height).toBe(2);
  });

  it("should recognize non-rectangular selection", function () {
    var wtSelection = new WalkontableSelection();
    wtSelection.add($table.find('tr:eq(0) td:eq(0)')[0]);
    wtSelection.add($table.find('tr:eq(1) td:eq(0)')[0]);

    expect(wtSelection.rectangleSize()).toBe(null);
  });
});