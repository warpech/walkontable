describe('WalkontableSelection', function () {
  var $table;

  var doNothing = function () {
  };

  beforeEach(function () {
    $table = $('<table><tr><td></td><td></td></tr><tr><td colspan="2"></td></tr></table>'); //create a table that is not even attached to document
  });

  afterEach(function () {
    $table.remove();
  });

  it("should add TD to selection", function () {
    var wtSelection = new WalkontableSelection(doNothing);
    var TD = $table.find('td')[0];
    wtSelection.add(TD);

    expect(wtSelection.getSelected().length).toBe(1);
  });

  it("should remove TD from selection", function () {
    var wtSelection = new WalkontableSelection(doNothing, doNothing);
    var TD = $table.find('td')[0];
    wtSelection.add(TD);
    wtSelection.remove(TD);

    expect(wtSelection.getSelected().length).toBe(0);
  });

  it("clear should remove all TDs from selection", function () {
    var wtSelection = new WalkontableSelection(doNothing, doNothing);
    var TD = $table.find('td')[0];
    wtSelection.add(TD);
    wtSelection.clear();

    expect(wtSelection.getSelected().length).toBe(0);
  });

  it("should recognize rectangular selection", function () {
    var wtSelection = new WalkontableSelection(doNothing, doNothing);
    var TDs = $table.find('td');
    wtSelection.add(TDs[0]);
    wtSelection.add(TDs[1]);
    wtSelection.add(TDs[2]);

    expect(wtSelection.isRectangular()).toBe(true);
  });

  it("should recognize non-rectangular selection", function () {
    var wtSelection = new WalkontableSelection(doNothing, doNothing);
    var TDs = $table.find('td');
    wtSelection.add(TDs[0]);
    wtSelection.add(TDs[2]);

    expect(wtSelection.isRectangular()).toBe(false);
  });
});