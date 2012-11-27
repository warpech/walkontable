describe('WalkontableTable', function () {
  var $table
    , data;

  var debug = false;

  beforeEach(function () {
    $table = $('<table><thead><th></th><th></th></thead><tbody></tbody></table>'); //create a table that is not attached to document
    data = [];
    for (var i = 0; i < 100; i++) {
      data.push([i, "a", "b", "c"]);
    }
  });

  afterEach(function () {
    if (debug) {
      $table.appendTo('body');
    }
  });

  it("should create as many rows as in `displayRows`", function () {
    var wt = new Walkontable({
      table: $table[0],
      data: data,
      offsetRow: 0,
      displayRows: 10,
      displayColumns: 2
    });
    wt.draw();
    expect($table.find('tbody tr').length).toBe(10);
  });

  it("first row should have as many columns as in THEAD", function () {
    var wt = new Walkontable({
      table: $table[0],
      data: data,
      offsetRow: 0,
      displayRows: 10,
      displayColumns: 2
    });
    wt.draw();
    expect($table.find('tbody tr:first td').length).toBe($table.find('thead th').length);
  });

  it("should use columnHeaders function to generate column headers", function () {
    var headers = ["Description", 2012, 2013, 2014, 2015];
    var wt = new Walkontable({
      table: $table[0],
      data: data,
      offsetRow: 0,
      displayRows: 10,
      displayColumns: 2,
      columnHeaders: function (column) {
        return headers[column];
      }
    });
    wt.draw();
    expect($table.find('thead tr:first th').length).toBe(2);
    expect($table.find('thead tr:first th:last')[0].innerHTML).toBe('2012');
  });

  it("should use rowHeaders function to generate row headers", function () {
    var wt = new Walkontable({
      table: $table[0],
      data: data,
      offsetRow: 0,
      displayRows: 10,
      displayColumns: 2,
      rowHeaders: function (row) {
        return row + 1;
      }
    });
    wt.draw();
    expect($table.find('tbody th, tbody td').length).toBe(20); //10*2=20 displayed cells
    expect($table.find('tbody th').length).toBe(10); //10*2=20 displayed cells, half of which are td
    expect($table.find('tbody tr:first th').length).toBe(1); //only one th per row
    expect($table.find('tbody tr:first th')[0].innerHTML).toBe('1'); //this should be the first row header
  });

  it("should put a blank cell in the corner if both rowHeaders and colHeaders are set", function () {
    var wt = new Walkontable({
      table: $table[0],
      data: data,
      offsetRow: 0,
      displayRows: 10,
      displayColumns: 2,
      columnHeaders: "Column",
      rowHeaders: "Row"
    });
    wt.draw();
    expect($table.find('tr:eq(0) th').length).toBe(2); //2 columns in THEAD
    expect($table.find('tr:eq(0) th:eq(0)')[0].innerHTML).toBe(''); //corner row is empty
    expect($table.find('tr:eq(0) th:eq(1)')[0].innerHTML).toBe('Column');
    expect($table.find('tr:eq(1) th:eq(0)')[0].innerHTML).toBe('Row');
  });
});