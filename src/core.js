function Walkontable(TABLE) {
  var that = this;

  this.wtDom = new WalkontableDom();

  this.wtMerge = new WalkontableMerge();

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

  var rightBox = [];

  var BUTTON = document.getElementById('detach');
  this.wtDom.addEvent(BUTTON, 'click', function () {
    var underbed = [];
    var TSECTIONs = TABLE.childNodes;
    for (var i = 0, ilen = TSECTIONs.length; i < ilen; i++) {
      underbed[i] = [];
      var TRs = TSECTIONs[i].childNodes;
      for (var j = 0, jlen = TRs.length; j < jlen; j++) {
        var TDs = TRs[j].childNodes;
        var TD = TRs[j].removeChild(TDs[TDs.length - 1]);
        underbed[i].push(TD);
      }
    }
    rightBox.push(underbed);
  });

  BUTTON = document.getElementById('attach');
  this.wtDom.addEvent(BUTTON, 'click', function () {
    var underbed = rightBox.pop();
    if(underbed) {
      console.log("idzie", underbed);
      for (var i = 0, ilen = underbed.length; i < ilen; i++) {
        for (var j = 0, jlen = underbed[i].length; j < jlen; j++) {
          TABLE.childNodes[i].childNodes[j].appendChild(underbed[i][j]);
        }
      }
    }
  });
}
