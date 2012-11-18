describe('WalkontableCell', function () {
  var $table;

  var debug = false;

  beforeEach(function () {
    $table = $('<table border=1><tr><td></td><td></td><td rowspan="2"></td><td></td></tr><tr><td colspan="2"></td><td></td></tr><tr><td></td><td></td><td></td><td></td></tr><tr><td colspan="2"></td><td></td><td></td></tr></table>'); //create a table that is not even attached to document
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
   * rowIndex
   */

  it("should get rowIndex", function () {
    var wtCell = new WalkontableCell();
    var TD = $table.find('tr:eq(1) td:eq(1)')[0];
    expect(wtCell.rowIndex(TD)).toBe(1);
  });

  /**
   * colIndex
   */

  it("should get colIndex when no colspan is used", function () {
    var wtCell = new WalkontableCell();
    var TD = $table.find('tr:eq(2) td:eq(2)')[0];
    expect(wtCell.colIndex(TD)).toBe(2);
  });

  it("should get colIndex when colspan is used", function () {
    var wtCell = new WalkontableCell();
    var TD = $table.find('tr:eq(3) td:eq(2)')[0];
    expect(wtCell.colIndex(TD)).toBe(3);
  });

  it("should get colIndex when colspan & rowspan is used in previous row", function () {
    var wtCell = new WalkontableCell();
    var TD = $table.find('tr:eq(1) td:eq(1)')[0];
    expect(wtCell.colIndex(TD)).toBe(3);
  });
});