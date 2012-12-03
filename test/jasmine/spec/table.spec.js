describe('WalkontableTable', function () {
  var $table
    , debug = false;

  beforeEach(function () {
    $table = $('<table></table>'); //create a table that is not attached to document
    $table.appendTo('body');
    createDataArray();
  });

  afterEach(function () {
    if (!debug) {
      $('.wtHolder').remove();
    }
  });

  it("should create as many rows as in `displayRows`", function () {
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
    expect($table.find('tbody tr').length).toBe(10);
  });

  it("should create as many rows as in `totalRows` if it is smaller than `displayRows`", function () {
    this.data.splice(5, this.data.length - 1);

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
    expect($table.find('tbody tr').length).toBe(5);
  });

  it("first row should have as many columns as in THEAD", function () {
    var wt = new Walkontable({
      table: $table[0],
      data: getData,
      totalRows: getTotalRows,
      totalColumns: getTotalColumns,
      columnHeaders: 'A',
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
      data: getData,
      totalRows: getTotalRows,
      totalColumns: getTotalColumns,
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
      data: getData,
      totalRows: getTotalRows,
      totalColumns: getTotalColumns,
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
      data: getData,
      totalRows: getTotalRows,
      totalColumns: getTotalColumns,
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

  it("rowHeaders and colHeaders should respect the offset", function () {
    function plusOne(i) {
      return i + 1;
    }

    var wt = new Walkontable({
      table: $table[0],
      data: getData,
      totalRows: getTotalRows,
      totalColumns: getTotalColumns,
      offsetRow: 1,
      offsetColumn: 1,
      displayRows: 10,
      displayColumns: 2,
      columnHeaders: plusOne,
      rowHeaders: plusOne
    });
    wt.draw();
    expect($table.find('tr:eq(0) th:eq(1)')[0].innerHTML).toBe('2');
    expect($table.find('tr:eq(1) th:eq(0)')[0].innerHTML).toBe('2');
  });

  it("getCell should only return cells that are visible", function () {
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
    wt.draw();

    wt.update('offsetColumn', 1).draw();

    var $td1 = $table.find('tbody tr:eq(0) td:eq(0)');
    var $td2 = $table.find('tbody tr:eq(0) td:eq(1)');
    expect(wt.wtTable.getCell([0, 0])).toBe(null);
    expect(wt.wtTable.getCell([0, 1])).toBe($td1[0]);
    expect(wt.wtTable.getCell([0, 2])).toBe($td2[0]);
    expect(wt.wtTable.getCell([0, 3])).toBe(null);
  });

  it("getCell should only return cells that are visible (with row header)", function () {
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
      rowHeaders: plusOne
    });
    wt.draw();

    wt.update('offsetColumn', 1).draw();

    var $td1 = $table.find('tbody tr:eq(0) td:eq(0)');
    expect(wt.wtTable.getCell([0, 0])).toBe(null);
    expect(wt.wtTable.getCell([0, 1])).toBe($td1[0]);
    expect(wt.wtTable.getCell([0, 2])).toBe(null);
  });

  it("getCoords should return coords of TD", function () {
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
    wt.draw();

    wt.update({
      offsetRow: 1,
      offsetColumn: 1
    }).draw();

    var $td2 = $table.find('tbody tr:eq(1) td:eq(1)');
    expect(wt.wtTable.getCoords($td2[0])).toEqual([2, 2]);
  });

  it("getCoords should return coords of TD (with row header)", function () {
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
      rowHeaders: plusOne
    });
    wt.draw();

    wt.update({
      offsetRow: 1,
      offsetColumn: 1
    }).draw();

    var $td2 = $table.find('tbody tr:eq(1) td:eq(0)');
    expect(wt.wtTable.getCoords($td2[0])).toEqual([2, 1]);
  });

  it("should use custom cell renderer if provided", function () {
    var wt = new Walkontable({
      table: $table[0],
      data: getData,
      totalRows: getTotalRows,
      totalColumns: getTotalColumns,
      offsetRow: 0,
      displayRows: 10,
      displayColumns: 2,
      cellRenderer: function (row, column, TD) {
        var cellData = getData(row, column);
        if (cellData !== void 0) {
          TD.innerHTML = cellData;
        }
        else {
          TD.innerHTML = '';
        }
        TD.className = '';
        TD.style.backgroundColor = 'yellow';
      }
    });
    wt.draw();
    expect($table.find('td:first')[0].style.backgroundColor).toBe('yellow');
  });
});