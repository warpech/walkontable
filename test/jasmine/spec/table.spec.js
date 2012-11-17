describe('WalkontableTable', function () {
  var $table;

  var debug = false;

  beforeEach(function () {
    $table = $('<table border=1><tr><td></td><td></td><td rowspan="2"></td><td></td></tr><tr><td colspan="2"></td><td></td></tr><tr><td></td><td></td><td></td><td></td></tr><tr><td colspan="2"></td><td></td><td></td></tr></table>'); //create a table that is not even attached to document
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
   * getColumn
   */

  it("should get first column", function () {
    var wtTable = new WalkontableTable($table[0]);
    var TDs = wtTable.getColumn(0);
    expect(TDs[0]).toBe($table.find('tr:eq(0) td:eq(0)')[0]);
    expect(TDs[1]).toBe($table.find('tr:eq(1) td:eq(0)')[0]);
    expect(TDs[2]).toBe($table.find('tr:eq(2) td:eq(0)')[0]);
    expect(TDs[3]).toBe($table.find('tr:eq(3) td:eq(0)')[0]);
  });

  it("should get last column", function () {
    var wtTable = new WalkontableTable($table[0]);
    var TDs = wtTable.getColumn(3);
    expect(TDs[0]).toBe($table.find('tr:eq(0) td:eq(3)')[0]);
    expect(TDs[1]).toBe($table.find('tr:eq(1) td:eq(1)')[0]);
    expect(TDs[2]).toBe($table.find('tr:eq(2) td:eq(3)')[0]);
    expect(TDs[3]).toBe($table.find('tr:eq(3) td:eq(2)')[0]);
  });

  it("should get column with rowSpan", function () {
    var wtTable = new WalkontableTable($table[0]);
    var TDs = wtTable.getColumn(2);
    expect(TDs[0]).toBe($table.find('tr:eq(0) td:eq(2)')[0]);
    expect(TDs[1]).toBe($table.find('tr:eq(0) td:eq(2)')[0]);
    expect(TDs[2]).toBe($table.find('tr:eq(2) td:eq(2)')[0]);
    expect(TDs[3]).toBe($table.find('tr:eq(3) td:eq(1)')[0]);
  });

  /**
   * getRow
   */

  it("should get first row", function () {
    var wtTable = new WalkontableTable($table[0]);
    var TDs = wtTable.getRow(0);
    expect(TDs[0]).toBe($table.find('tr:eq(0) td:eq(0)')[0]);
    expect(TDs[1]).toBe($table.find('tr:eq(0) td:eq(1)')[0]);
    expect(TDs[2]).toBe($table.find('tr:eq(0) td:eq(2)')[0]);
    expect(TDs[3]).toBe($table.find('tr:eq(0) td:eq(3)')[0]);
  });

  it("should get last row with colSpan", function () {
    var wtTable = new WalkontableTable($table[0]);
    var TDs = wtTable.getRow(3);
    console.log("TDS", TDs);
    expect(TDs[0]).toBe($table.find('tr:eq(3) td:eq(0)')[0]);
    expect(TDs[1]).toBe($table.find('tr:eq(3) td:eq(0)')[0]);
    expect(TDs[2]).toBe($table.find('tr:eq(3) td:eq(1)')[0]);
    expect(TDs[3]).toBe($table.find('tr:eq(3) td:eq(2)')[0]);
  });
});