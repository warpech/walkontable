describe('WalkontableCell', function () {
  var $table;

  var tpl = '<table border="1">\
    <thead>\
    <tr>\
      <th>A</th>\
      <td>B</td>\
      <td>C</td>\
      <td>D</td>\
      <td>E</td>\
      <td id="alpha">F</td>\
      <td>G</td>\
      <td>H</td>\
    </tr>\
    <tr>\
      <th colspan="2">Description</th>\
      <th>2007</th>\
      <th>2008</th>\
      <th>2009</th>\
      <th id="beta">2010</th>\
      <th>2011</th>\
      <th>2012 (progn.)</th>\
    </tr>\
    </thead>\
  <tbody>\
    <tr>\
      <th rowspan="2">Income</th>\
      <th>Passive</th>\
      <td colspan="3"><em>not measured</em></td>\
      <td>4</td>\
      <td>5</td>\
      <td>6</td>\
    </tr>\
    <tr>\
      <th>Active</th>\
      <td>1</td>\
      <td>2</td>\
      <td>3</td>\
      <td id="gamma">4</td>\
      <td>5</td>\
      <td>6</td>\
    </tr>\
  </tbody>\
  </table>';

  beforeEach(function () {
    $table = $(tpl); //create a table that is not even attached to document
  });

  afterEach(function () {
    $table.remove();
  });

  it("should get colIndex when no colspan is used", function () {
    var wtCell = new WalkontableCell();
    var TD = $table.find('#alpha').get(0);
    expect(wtCell.colIndex(TD)).toBe(5);
  });

  it("should get colIndex when colspan is used", function () {
    var wtCell = new WalkontableCell();
    var TD = $table.find('#beta').get(0);
    expect(wtCell.colIndex(TD)).toBe(5);
  });

  it("should get colIndex when rowspan is used in previous row", function () {
    var wtCell = new WalkontableCell();
    var TD = $table.find('#gamma').get(0);
    expect(wtCell.colIndex(TD)).toBe(5);
  });
});