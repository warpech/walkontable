describe('WalkontableScroll', function () {
  var $table
    , debug = 1;

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
    wt.scrollHorizontal(999).draw();
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
    wt.scrollHorizontal(999).draw();
    expect($table.find('tbody tr:eq(0) td:last')[0].innerHTML).toBe('c');
  });

  it("scroll vertical should take totalRows if it is smaller than displayRows", function () {
    this.data.splice(5);

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
    wt.scrollVertical(999).draw();
    expect(wt.wtTable.getCoords($table.find('tbody tr:eq(0) td:eq(0)')[0])).toEqual([0, 0]);
  });

  it("scroll horizontal should take totalColumns if it is smaller than displayColumns", function () {
    var wt = new Walkontable({
      table: $table[0],
      data: getData,
      totalRows: getTotalRows,
      totalColumns: getTotalColumns,
      offsetRow: 0,
      offsetColumn: 0,
      displayRows: 10,
      displayColumns: 10
    });
    wt.scrollHorizontal(999).draw();
    expect(wt.wtTable.getCoords($table.find('tbody tr:eq(0) td:eq(0)')[0])).toEqual([0, 0]);
  });

  it("scroll vertical should scroll to first row if given number smaller than 0", function () {
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
    wt.scrollVertical(-1).draw();
    expect(wt.wtTable.getCoords($table.find('tbody tr:first td:first')[0])).toEqual([0, 0]);
  });

  it("scroll vertical should scroll to last row if given number bigger than totalRows", function () {
    this.data.splice(20);

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
    wt.scrollVertical(999).draw();
    expect(wt.wtTable.getCoords($table.find('tbody tr:last td:first')[0])).toEqual([19, 0]);
  });

  it("scroll horizontal should scroll to first row if given number smaller than 0", function () {
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
    wt.scrollHorizontal(-1).draw();
    expect(wt.wtTable.getCoords($table.find('tbody tr:first td:first')[0])).toEqual([0, 0]);
  });

  it("scroll horizontal should scroll to last row if given number bigger than totalRows", function () {
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
    wt.scrollHorizontal(999).draw();
    expect(wt.wtTable.getCoords($table.find('tbody tr:first td:last')[0])).toEqual([0, 3]);
  });

  it("scroll viewport to a cell that is visible should do nothing", function () {
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
    wt.scrollViewport([0, 1]).draw();
    expect(wt.wtTable.getCoords($table.find('tbody tr:first td:last')[0])).toEqual([0, 1]);
  });

  it("scroll viewport to a cell on far left should make it visible on left edge", function () {
    var wt = new Walkontable({
      table: $table[0],
      data: getData,
      totalRows: getTotalRows,
      totalColumns: getTotalColumns,
      offsetRow: 0,
      offsetColumn: 2,
      displayRows: 10,
      displayColumns: 2
    });
    wt.scrollViewport([0, 1]).draw();
    expect(wt.wtTable.getCoords($table.find('tbody tr:first td:first')[0])).toEqual([0, 1]);
  });

  it("scroll viewport to a cell on far right should make it visible on right edge", function () {
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
    wt.scrollViewport([0, 2]).draw();
    expect(wt.wtTable.getCoords($table.find('tbody tr:first td:last')[0])).toEqual([0, 2]);
  });

  it("scroll viewport to a cell on far left should make it visible on left edge (with row header)", function () {
    var wt = new Walkontable({
      table: $table[0],
      data: getData,
      totalRows: getTotalRows,
      totalColumns: getTotalColumns,
      offsetRow: 0,
      offsetColumn: 2,
      displayRows: 10,
      displayColumns: 2,
      rowHeaders: "Row"
    });
    wt.scrollViewport([0, 1]).draw();
    expect(wt.wtTable.getCoords($table.find('tbody tr:first td:first')[0])).toEqual([0, 1]);
  });

  it("scroll viewport to a cell on far right should make it visible on right edge (with row header)", function () {
    var wt = new Walkontable({
      table: $table[0],
      data: getData,
      totalRows: getTotalRows,
      totalColumns: getTotalColumns,
      offsetRow: 0,
      offsetColumn: 0,
      displayRows: 10,
      displayColumns: 2,
      rowHeaders: "Row"
    });
    wt.scrollViewport([0, 2]).draw();
    expect(wt.wtTable.getCoords($table.find('tbody tr:first td:last')[0])).toEqual([0, 2]);
  });

  it("scroll viewport to a cell on far bottom should make it visible on bottom edge", function () {
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
    wt.scrollViewport([12, 0]).draw();
    expect(wt.wtTable.getCoords($table.find('tbody tr:last td:first')[0])).toEqual([12, 0]);
  });

  it("scroll viewport to a cell on far top should make it visible on top edge", function () {
    var wt = new Walkontable({
      table: $table[0],
      data: getData,
      totalRows: getTotalRows,
      totalColumns: getTotalColumns,
      offsetRow: 20,
      offsetColumn: 2,
      displayRows: 10,
      displayColumns: 2
    });
    wt.scrollViewport([12, 0]).draw();
    expect(wt.wtTable.getCoords($table.find('tbody tr:first td:first')[0])).toEqual([12, 0]);
  });

  it("scroll viewport to a cell that does not exist (vertically) should throw an error", function () {
    this.data.splice(20);

    var err = 0;
    try {
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
      wt.scrollViewport([40, 0]).draw();
    }
    catch (e) {
      err++;
    }

    expect(err).toEqual(1);
  });

  it("scroll viewport to a cell that does not exist (horizontally) should throw an error", function () {
    var err = 0;
    try {
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
      wt.scrollViewport([0, 40]).draw();
    }
    catch (e) {
      err++;
    }

    expect(err).toEqual(1);
  });
});