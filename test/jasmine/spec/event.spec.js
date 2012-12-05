describe('WalkontableEvent', function () {
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

  it("should call `onCellMouseDown` callback", function () {
    var myCoords
      , myTD
      , wt = new Walkontable({
        table: $table[0],
        data: getData,
        totalRows: getTotalRows,
        totalColumns: getTotalColumns,
        offsetRow: 10,
        offsetColumn: 2,
        displayRows: 10,
        displayColumns: 2,
        onCellMouseDown: function (event, coords, TD) {
          myCoords = coords;
          myTD = TD;
        }
      });
    wt.draw();

    var $td = $table.find('tbody tr:first td:first');
    $td.trigger('mousedown');

    expect(myCoords).toEqual([10, 2]);
    expect(myTD).toEqual($td[0]);
  });

  it("should call `onCellMouseOver` callback", function () {
    var myCoords
      , myTD
      , wt = new Walkontable({
        table: $table[0],
        data: getData,
        totalRows: getTotalRows,
        totalColumns: getTotalColumns,
        offsetRow: 10,
        offsetColumn: 2,
        displayRows: 10,
        displayColumns: 2,
        onCellMouseOver: function (event, coords, TD) {
          myCoords = coords;
          myTD = TD;
        }
      });
    wt.draw();

    var $td = $table.find('tbody tr:first td:first');
    $td.trigger('mouseover');

    expect(myCoords).toEqual([10, 2]);
    expect(myTD).toEqual($td[0]);
  });
});