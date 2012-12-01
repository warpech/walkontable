describe('WalkontableSelection', function () {
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

  it("should add/remove class to selection when cell is clicked", function () {
    var wt = new Walkontable({
      table: $table[0],
      data: getData,
      totalRows: getTotalRows,
      totalColumns: getTotalColumns,
      offsetRow: 0,
      offsetColumn: 0,
      displayRows: 10,
      displayColumns: 2,
      selections: {
        current: {
          className: 'current'
        }
      },
      onCellMouseDown: function (event, coords, TD) {
        wt.selections.current.clear();
        wt.selections.current.add(coords, TD);
      }
    });
    wt.draw();

    var $td1 = $table.find('tbody td:eq(0)');
    var $td2 = $table.find('tbody td:eq(1)');
    $td1.mousedown();
    expect($td1.hasClass('current')).toEqual(true);

    $td2.mousedown();
    expect($td1.hasClass('current')).toEqual(false);
    expect($td2.hasClass('current')).toEqual(true);
  });
});