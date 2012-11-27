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
      columnHeaders: function(column) {
        return headers[column];
      }
    });
    wt.draw();
    expect($table.find('thead tr:first th').length).toBe(2);
    expect($table.find('thead tr:first th:last')[0].innerHTML).toBe('2012');
  });
});