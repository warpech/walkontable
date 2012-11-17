function Walkontable(TABLE) {
  var that = this;

  this.wtDom = new WalkontableDom();

  this.wtMerge = new WalkontableMerge();

  this.wtCourtain = new WalkontableCourtain(TABLE);

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

  this.wtDom.addEvent(TABLE, 'click', function (event) {
    var TD = that.wtDom.closest(event.target, ['TD', 'TH']);
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

  function removeTextNodes(elem, parent) {
    if (elem.nodeType === 3) {
      parent.removeChild(elem); //bye text nodes!
    }
    else if (['TABLE', 'THEAD', 'TBODY', 'TFOOT', 'TR'].indexOf(elem.nodeName) > -1) {
      var childs = elem.childNodes;
      for (var i = childs.length - 1; i >= 0; i--) {
        removeTextNodes(childs[i], elem);
      }
    }
  }

  removeTextNodes(TABLE);
}