describe('WalkontableScrollbar', function () {
  var $table
    , debug = false;

  beforeEach(function () {
    $table = $('<table></table>'); //create a table that is not attached to document
    createDataArray();
  });

  afterEach(function () {
    if (debug) {
      $table.parent().appendTo('body');
    }
  });

  it("should table in DIV.wtHolder that contains 2 scrollbars", function () {
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

    expect($table.parents('div.wtHolder').length).toEqual(1);
    expect($table.parents('div.wtHolder:eq(0)').children('div.dragdealer').length).toEqual(2);
  });
});