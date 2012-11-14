describe('Walkontable', function () {
  var $table;

  beforeEach(function () {
    $table = $('<table><td></td></table>'); //create a table that is not even attached to document
  });

  afterEach(function () {
    $table.remove();
  });

  it("should start with empty current selection", function () {
    var wt = new Walkontable($table[0]);
    expect(wt.currentSelection).toBeDefined();
    expect(wt.currentSelection.getSelected().length).toBe(0);
  });

  it("should start with empty area selection", function () {
    var wt = new Walkontable($table[0]);
    expect(wt.areaSelection).toBeDefined();
    expect(wt.areaSelection.getSelected().length).toBe(0);
  });

  it("should start with merge class", function () {
    var wt = new Walkontable($table[0]);
    expect(wt.merge).toBeDefined();
  });
});