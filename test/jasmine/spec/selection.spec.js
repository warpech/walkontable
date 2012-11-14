describe('WalkontableSelection', function () {
  var $table;

  var doNothing = function () {
  };

  beforeEach(function () {
    $table = $('<table><tr><td></td></tr></table>'); //create a table that is not even attached to document
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
});