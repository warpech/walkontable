describe('WalkontableRow', function () {
  var $table;

  var debug = true;

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
   * detach
   */

  it("detach row with rowSpan", function () {
    //$table.clone().appendTo('body');

    var wtTable = new WalkontableTable($table[0]);
    var wtRow = wtTable.getRow(1);
    wtRow.detach();

    var TDs = wtTable.getRow(2).cells;
    expect(TDs[0]).toBe($table.find('tr:eq(1) td:eq(0)')[0]);
    expect(TDs[1]).toBe($table.find('tr:eq(1) td:eq(1)')[0]);
    expect(TDs[2]).toBe($table.find('tr:eq(1) td:eq(2)')[0]);
    expect(TDs[3]).toBe($table.find('tr:eq(1) td:eq(3)')[0]);
  });

  /**
   * attach
   */

  it("attach row with rowSpan", function () {
    //$table.clone().appendTo('body');

    var wtTable = new WalkontableTable($table[0]);
    var wtRow = wtTable.getRow(1);
    wtRow.detach();
    wtRow.attach();

    var TDs = wtTable.getRow(1).cells;
    expect(TDs[0]).toBe($table.find('tr:eq(1) td:eq(0)')[0]);
    expect(TDs[1]).toBe($table.find('tr:eq(1) td:eq(0)')[0]);
    expect(TDs[2]).toBe($table.find('tr:eq(0) td:eq(2)')[0]);
    expect(TDs[3]).toBe($table.find('tr:eq(1) td:eq(1)')[0]);
  });

  it("attach row at the bottom", function () {
    //$table.clone().appendTo('body');

    var wtTable = new WalkontableTable($table[0]);
    var wtRow = wtTable.getRow(3);
    wtRow.detach();
    wtRow.attach();

    var TDs = wtTable.getRow(3).cells;
    expect(TDs[0]).toBe($table.find('tr:last-child td:eq(0)')[0]);
    expect(TDs[1]).toBe($table.find('tr:last-child td:eq(0)')[0]);
    expect(TDs[2]).toBe($table.find('tr:last-child td:eq(1)')[0]);
    expect(TDs[3]).toBe($table.find('tr:last-child td:eq(2)')[0]);
  });

  it("attach row with rowSpan when there was THEAD", function () {
    var $thead = $('<thead><tr><td>A</td><td>B</td><td>C</td><td>D</td></tr></thead>');
    $table.prepend($thead);

    //$table.clone().appendTo('body');

    var wtTable = new WalkontableTable($table[0]);
    var wtRow = wtTable.getRow(1);
    wtRow.detach();
    wtRow.attach();

    var TDs = wtTable.getRow(2).cells;
    expect(TDs[0]).toBe($table.find('tbody tr:eq(1) td:eq(0)')[0]);
    expect(TDs[1]).toBe($table.find('tbody tr:eq(1) td:eq(0)')[0]);
    expect(TDs[2]).toBe($table.find('tbody tr:eq(0) td:eq(2)')[0]);
    expect(TDs[3]).toBe($table.find('tbody tr:eq(1) td:eq(1)')[0]);
  });

  it("attach row when it was the only one in THEAD", function () {
    var $thead = $('<thead><tr><td>A</td><td>B</td><td>C</td><td>D</td></tr></thead>');
    $table.prepend($thead);

    //$table.clone().appendTo('body');

    var wtTable = new WalkontableTable($table[0]);
    var wtRow = wtTable.getRow(0);
    wtRow.detach();
    wtRow.attach();

    var TDs = wtTable.getRow(1).cells;
    expect(TDs[0]).toBe($table.find('tr:eq(1) td:eq(0)')[0]);
    expect(TDs[1]).toBe($table.find('tr:eq(1) td:eq(1)')[0]);
    expect(TDs[2]).toBe($table.find('tr:eq(1) td:eq(2)')[0]);
    expect(TDs[3]).toBe($table.find('tr:eq(1) td:eq(3)')[0]);
  });

  it("detach and attach all rows starting from the bottom", function () {
    //$table.clone().appendTo('body');

    var wtTable = new WalkontableTable($table[0]);
    var wtRow3 = wtTable.getRow(3);
    var wtRow2 = wtTable.getRow(2);
    var wtRow1 = wtTable.getRow(1);
    var wtRow0 = wtTable.getRow(0);
    wtRow3.detach();
    wtRow2.detach();
    wtRow1.detach();
    wtRow0.detach();
    wtRow0.attach();
    wtRow1.attach();
    wtRow2.attach();
    wtRow3.attach();

    var TDs = wtTable.getRow(3).cells;
    expect(TDs[0]).toBe($table.find('tr:eq(3) td:eq(0)')[0]);
    expect(TDs[1]).toBe($table.find('tr:eq(3) td:eq(0)')[0]);
    expect(TDs[2]).toBe($table.find('tr:eq(3) td:eq(1)')[0]);
    expect(TDs[3]).toBe($table.find('tr:eq(3) td:eq(2)')[0]);
  });

  it("detach and attach all rows - 1 starting from TBODY top", function () {
    var $thead = $('<thead><tr><td>A</td><td>B</td><td>C</td><td>D</td></tr></thead>');
    $table.prepend($thead);

    $table.clone().appendTo('body');

    var wtTable = new WalkontableTable($table[0]);
    var wtRow1 = wtTable.getRow(1);
    var wtRow2 = wtTable.getRow(2);
    var wtRow3 = wtTable.getRow(3);
    wtRow1.detach();
    wtRow2.detach();
    wtRow3.detach();
    wtRow3.attach();
    wtRow2.attach();

    var TDs = wtTable.getRow(2).cells;
    expect(TDs[0]).toBe($table.find('tbody tr:eq(0) td:eq(0)')[0]);
    expect(TDs[1]).toBe($table.find('tbody tr:eq(0) td:eq(0)')[0]);
    expect(TDs[2]).toBe($table.find('tbody tr:eq(0) td:eq(1)')[0]);
    expect(TDs[3]).toBe($table.find('tbody tr:eq(0) td:eq(2)')[0]);

    TDs = wtTable.getRow(3).cells;
    expect(TDs[0]).toBe($table.find('tbody tr:eq(1) td:eq(0)')[0]);
    expect(TDs[1]).toBe($table.find('tbody tr:eq(1) td:eq(1)')[0]);
    expect(TDs[2]).toBe($table.find('tbody tr:eq(1) td:eq(2)')[0]);
    expect(TDs[3]).toBe($table.find('tbody tr:eq(1) td:eq(3)')[0]);
  });

  it("detach and attach all rows starting from TBODY top", function () {
    var $thead = $('<thead><tr><td>A</td><td>B</td><td>C</td><td>D</td></tr></thead>');
    $table.prepend($thead);

    $table.clone().appendTo('body');

    var wtTable = new WalkontableTable($table[0]);
    var wtRow1 = wtTable.getRow(1);
    var wtRow2 = wtTable.getRow(2);
    var wtRow3 = wtTable.getRow(3);
    wtRow1.detach();
    wtRow2.detach();
    wtRow3.detach();
    wtRow3.attach();
    wtRow2.attach();
    wtRow1.attach();

    var TDs = wtTable.getRow(1).cells;
    expect(TDs[0]).toBe($table.find('tbody tr:eq(0) td:eq(0)')[0]);
    expect(TDs[1]).toBe($table.find('tbody tr:eq(0) td:eq(1)')[0]);
    expect(TDs[2]).toBe($table.find('tbody tr:eq(0) td:eq(2)')[0]);
    expect(TDs[3]).toBe($table.find('tbody tr:eq(0) td:eq(3)')[0]);

    TDs = wtTable.getRow(3).cells;
    expect(TDs[0]).toBe($table.find('tbody tr:eq(2) td:eq(0)')[0]);
    expect(TDs[1]).toBe($table.find('tbody tr:eq(2) td:eq(1)')[0]);
    expect(TDs[2]).toBe($table.find('tbody tr:eq(2) td:eq(2)')[0]);
    expect(TDs[3]).toBe($table.find('tbody tr:eq(2) td:eq(3)')[0]);
  });
});