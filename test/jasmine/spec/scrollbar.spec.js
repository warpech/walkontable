describe('WalkontableScrollbar', function () {
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

  it("handle should have the size of scrollbar if totalRows is smaller or equal displayRows", function () {
    this.data.splice(5, this.data.length - 1);

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

    var slider = $table.parent().find('.dragdealer.vertical');
    var handle = slider.find('.handle');
    expect(slider.height()).toBeGreaterThan(0);
    expect(slider.height()).toEqual(handle.height());
  });
});