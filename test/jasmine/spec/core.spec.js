describe('Walkontable', function () {
  var $table
    , debug = false;

  beforeEach(function () {
    $table = $('<table><thead><th></th><th></th></thead><tbody></tbody></table>'); //create a table that is not attached to document
    createDataArray();
  });

  afterEach(function () {
    if (debug) {
      $table.appendTo('body');
    }
  });

  it("first row should have the same text as in data source", function () {
    var wt = new Walkontable({
      table: $table[0],
      data: getData,
      totalRows: getTotalRows,
      totalColumns: getTotalColumns,
      offsetRow: 0,
      displayRows: 10,
      displayColumns: 2
    });
    wt.draw();
    var TDs = $table.find('tbody tr:first td');
    expect(TDs[0].innerHTML).toBe('0');
    expect(TDs[1].innerHTML).toBe('a');
  });

  it("first row (scrolled to 10) should have the same text as in data source", function () {
    var wt = new Walkontable({
      table: $table[0],
      data: getData,
      totalRows: getTotalRows,
      totalColumns: getTotalColumns,
      offsetRow: 10,
      displayRows: 10,
      displayColumns: 2
    });
    wt.draw();
    var TDs = $table.find('tbody tr:first td');
    expect(TDs[0].innerHTML).toBe('10');
    expect(TDs[1].innerHTML).toBe('a');
  });

  it("update should change setting", function () {
    var wt = new Walkontable({
      table: $table[0],
      data: getData,
      totalRows: getTotalRows,
      totalColumns: getTotalColumns,
      offsetRow: 0,
      displayRows: 10,
      displayColumns: 2
    });
    wt.update({offsetRow: 10});
    wt.draw();
    var TDs = $table.find('tbody tr:first td');
    expect(TDs[0].innerHTML).toBe('10');
    expect(TDs[1].innerHTML).toBe('a');
  });

  it("should scroll to last column when rowHeaders is not in use", function () {
    var wt = new Walkontable({
      table: $table[0],
      data: getData,
      totalRows: getTotalRows,
      totalColumns: getTotalColumns,
      offsetRow: 0,
      offsetColumn: 0,
      displayRows: 10,
      displayColumns: 2
    });
    wt.scrollHorizontal(999); //this will scroll to the last column
    wt.draw();
    expect($table.find('tbody tr:eq(0) td:last')[0].innerHTML).toBe('c');
  });

  it("should scroll to last column when rowHeaders is in use", function () {
    function plusOne(i) {
      return i + 1;
    }

    var wt = new Walkontable({
      table: $table[0],
      data: getData,
      totalRows: getTotalRows,
      totalColumns: getTotalColumns,
      offsetRow: 0,
      offsetColumn: 0,
      displayRows: 10,
      displayColumns: 2,
      columnHeaders: plusOne,
      rowHeaders: plusOne
    });
    wt.scrollHorizontal(999); //this will scroll to the last column
    wt.draw();
    expect($table.find('tbody tr:eq(0) td:last')[0].innerHTML).toBe('c');
  });

  it("should bootstrap table if empty TABLE is given", function () {
    $table = $('<table>    </table>'); //should also clean the empty text nodes inside

    var wt = new Walkontable({
      table: $table[0],
      data: getData,
      totalRows: getTotalRows,
      totalColumns: getTotalColumns,
      offsetRow: 0,
      offsetColumn: 0,
      displayRows: 10,
      displayColumns: 4,
      columnHeaders: false,
      rowHeaders: false
    });
    wt.draw();
    expect($table.find('td').length).toBe(40);
  });
});