describe('WalkontableMerge', function () {
  var $table;

  var doNothing = function () {
  };

  beforeEach(function () {
    $table = $('<table><tr><td></td><td></td></tr><tr><td></td><td></td></tr></table>'); //create a table that is not even attached to document
  });

  afterEach(function () {
    $table.remove();
  });

  it("should merge two cells horizontally when given in reverse order", function () {
    var wtMerge = new WalkontableMerge(doNothing);
    var TD_1 = $table.find('tr:eq(0)').find('td:eq(0)')[0];
    var TD_2 = $table.find('tr:eq(0)').find('td:eq(1)')[0];
    wtMerge.merge([TD_2, TD_1]);

    expect($table.find('tr:eq(0)').find('td').length).toBe(1);
    expect($table.find('tr:eq(0)').find('td').attr('colspan')).toBe('2');
  });

  it("should merge two cells vertically when given in reverse order", function () {
    var wtMerge = new WalkontableMerge(doNothing);
    var TD_1 = $table.find('tr:eq(0)').find('td:eq(0)')[0];
    var TD_2 = $table.find('tr:eq(1)').find('td:eq(0)')[0];
    wtMerge.merge([TD_2, TD_1]);

    expect($table.find('td').length).toBe(3);
    expect($table.find('td:eq(0)').attr('rowspan')).toBe('2');
    expect($table.find('tr:eq(0)').find('td').length).toBe(2);
    expect($table.find('tr:eq(1)').find('td').length).toBe(1);
  });
});