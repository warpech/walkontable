describe('Walkontable', function () {
  var $table;

  var debug = false;

  beforeEach(function () {
    $table = $('<table><td></td></table>'); //create a table that is not attached to document
    var x = 0;
    if (debug) {
      $table.find('td').each(function () {
        this.innerHTML = x;
        x++;
      });
    }
  });

  afterEach(function () {
    if (debug) {
      $table.appendTo('body');
    }
  });

  /**
   * Walkontable (constructor)
   */

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
    expect(wt.wtMerge).toBeDefined();
  });
});