var spec = function () {
  return jasmine.getEnv().currentSpec;
};

var createDataArray = function () {
  spec().data = [];
  for (var i = 0; i < 100; i++) {
    spec().data.push([i, "a", "b", "c"]);
  }
};

var getData = function (row, col) {
  return spec().data[row][col];
};

var getTotalRows = function () {
  return spec().data.length;
};

var getTotalColumns = function () {
  return spec().data[0].length;
};