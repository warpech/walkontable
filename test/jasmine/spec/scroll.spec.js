describe('WalkontableScroll', function () {
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
    wt.scrollVertical(999); //this will scroll to the last column
    wt.draw();
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
    wt.scrollHorizontal(999); //this will scroll to the last column
    wt.draw();
    expect(wt.wtTable.getCoords($table.find('tbody tr:eq(0) td:eq(0)')[0])).toEqual([0, 0]);
  });
});