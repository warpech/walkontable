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

  var courtains = {
    right: {
      box: [],
      detach: function(TR){
        var TDs = TR.childNodes;
        return TDs[TDs.length - 1];
      },
      attach: function(TR, TD){
        TR.appendChild(TD);
      }
    }
  };

  function courtainDetach(side) {
    var underbed = [];
    var TSECTIONs = TABLE.childNodes;
    for (var i = 0, ilen = TSECTIONs.length; i < ilen; i++) {
      underbed[i] = [];
      var TRs = TSECTIONs[i].childNodes;
      for (var j = 0, jlen = TRs.length; j < jlen; j++) {
        var TD = courtains[side].detach(TRs[j]);
        TRs[j].removeChild(TD);
        underbed[i].push(TD);
      }
    }
    courtains[side].box.push(underbed);
  }

  function courtainAttach(side) {
    var underbed = courtains[side].box.pop();
    if(underbed) {
      for (var i = 0, ilen = underbed.length; i < ilen; i++) {
        for (var j = 0, jlen = underbed[i].length; j < jlen; j++) {
          courtains[side].attach(TABLE.childNodes[i].childNodes[j], underbed[i][j]);
        }
      }
    }
  }

  var BUTTON = document.getElementById('detach');
  this.wtDom.addEvent(BUTTON, 'click', function () {
    courtainDetach('right')
  });

  BUTTON = document.getElementById('attach');
  this.wtDom.addEvent(BUTTON, 'click', function () {
    courtainAttach('right')
  });
}
