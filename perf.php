<!DOCTYPE html>
<html>
  <head>
    <title>Walkontable</title>
    <meta charset="UTF-8">

    <!-- required only for events -->
    <script type="text/javascript" src="test/jasmine/lib/jquery.min.js"></script>

    <script src="src/core.js"></script>
    <script src="src/polyfill.js"></script>
    <script src="src/table.js"></script>
    <script src="src/event.js"></script>
    <script src="src/selection.js"></script>
    <script src="src/dom.js"></script>

    <script src="perf.js"></script>
    <link href="css/bootstrap.css" rel="stylesheet">
    <link href="css/walkontable.css" rel="stylesheet">
  </head>
  <body>

    <h1>Walkontable</h1>

    <script>
<?php
$arr = array();
for ($i = 0; $i < 10000; $i++) {
  $arr[] = array($i, 2, 3, 4, 5, 6, 7);
}
echo "var arr = " . json_encode($arr);
?>
    </script>

    <table class="table table-bordered">
      <thead>
        <tr>
          <th>Description</th>
          <th>2007</th>
          <th>2008</th>
          <th>2009</th>
          <th>2010</th>
          <th>2011</th>
          <th>2012 (progn.)</th>
        </tr>
      </thead>
      <tbody>

      </tbody>
    </table>

    <h2>Features</h2>

    <ul>
      <li>Can take on any table that already exists in DOM or construct a new one</li>
      <li>Supports merged cols and rows</li>
      <li>Supports cols and rows blocked from scrolling (at 4 sides)</li>
      <li>Supports multiple selection (also nonconsecutive)</li>
      <li>Supports walking with keyboard, mouse and API</li>
      <li>Supports tabindex</li>
    </ul>

    <h2>Technical</h2>

    <ul>
      <li>Works in IE7+, FF3.6+, latest Opera, Safari and Chrome</li>
      <li>TDD</li>
      <li>Library agnostic</li>
    </ul>

    <h2>Design</h2>

    <ul>
      <li>Walkontable</li>
      <li>WalkontableSelection</li>
      <li>WalkontableMerge</li>
      <li>WalkontableCache - cache for hidden (scrolled) cells. Can be switched for external provider like Handsontable</li>
    </ul>

  </body>
</html>