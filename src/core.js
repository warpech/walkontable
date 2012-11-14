function Walkontable(TABLE) {
  var that = this;
  this.merge = new WalkontableMerge(function (TD) {
    that.areaSelection.remove(TD);
  });
  this.currentSelection = new WalkontableSelection(function (TD) {
    TD.style.backgroundColor = "blue";
  }, function (TD) {
    TD.style.backgroundColor = "white";
  });
  this.areaSelection = new WalkontableSelection(function (TD) {
    TD.style.border = "1px solid red";
  }, function (TD) {
    TD.style.border = "1px solid white";
  });

  function inArray(val, arr) {
    for (var i = 0, ilen = arr.length; i < ilen; i++) {
      if (arr[i] === val) return true;
    }
    return false;
  }

  function findParentUntil(element, nodeNames, ultimateElement) {
    if (element === ultimateElement) {
      return void 0;
    }
    else if (inArray(element.nodeName, nodeNames)) {
      return element;
    }
    else {
      return findParentUntil(element.parentNode, nodeNames, ultimateElement);
    }
  }

  TABLE.addEventListener('click', function (event) {
    var TD = findParentUntil(event.target, ['TD', 'TH'], TABLE);
    if (TD) { //if not table border
      if (that.areaSelection.isSelected(TD) > -1) {
        that.areaSelection.remove(TD);
      }
      else {
        that.areaSelection.add(TD);
      }

      that.currentSelection.clear();
      that.currentSelection.add(TD);
    }
  });
}
