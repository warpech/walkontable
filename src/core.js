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
    left: {
      box: [],
      detach: function (TR) {
        return TR.firstChild;
      },
      attach: function (TR, TD) {
        TR.insertBefore(TD, TR.firstChild);
      }
    },
    right: {
      box: [],
      detach: function (TR) {
        var TDs = TR.childNodes;
        return TDs[TDs.length - 1];
      },
      attach: function (TR, TD) {
        TR.appendChild(TD);
      }
    },
    top: {
      box: [],
      detach: function (TSECTION) {
        return TSECTION.firstChild;
      },
      attach: function (TSECTION, TR) {
        TSECTION.insertBefore(TR, TSECTION.firstChild);
      }
    },
    bottom: {
      box: [],
      detach: function (TSECTION) {
        var TRs = TSECTION.childNodes;
        return TRs[TRs.length - 1];
      },
      attach: function (TSECTION, TR) {
        TSECTION.appendChild(TR);
      }
    }
  };

  function courtainDetachColumn(side) {
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

  function courtainAttachColumn(side) {
    var underbed = courtains[side].box.pop();
    if (underbed) {
      for (var i = 0, ilen = underbed.length; i < ilen; i++) {
        for (var j = 0, jlen = underbed[i].length; j < jlen; j++) {
          courtains[side].attach(TABLE.childNodes[i].childNodes[j], underbed[i][j]);
        }
      }
    }
  }

  function courtainDetachRow(side) {
    var underbed = [];
    var TSECTIONs = TABLE.childNodes;
    for (var i = 0, ilen = TSECTIONs.length; i < ilen; i++) {
      underbed[i] = null;
      var TRs = TSECTIONs[i].childNodes;
      if (TRs.length) {
        var TR = courtains[side].detach(TSECTIONs[i]);
        TSECTIONs[i].removeChild(TR);
        underbed[i] = TR;
        break;
      }
    }
    courtains[side].box.push(underbed);
  }

  function courtainAttachRow(side) {
    var underbed = courtains[side].box.pop();
    if (underbed) {
      for (var i = 0, ilen = underbed.length; i < ilen; i++) {
        if(underbed[i]) {
          courtains[side].attach(TABLE.childNodes[i], underbed[i]);
        }
      }
    }
  }

  function courtainDetachRowReverse(side) {
    var underbed = [];
    var TSECTIONs = TABLE.childNodes;
    var done = false;
    for (var i = TSECTIONs.length - 1; i >= 0; i--) {
      underbed[i] = null;
      if(!done) {
        var TRs = TSECTIONs[i].childNodes;
        if (TRs.length) {
          var TR = courtains[side].detach(TSECTIONs[i]);
          TSECTIONs[i].removeChild(TR);
          underbed[i] = TR;
          done = true;
        }
      }
    }
    courtains[side].box.push(underbed);
  }

  var BUTTON = document.getElementById('detachRight');
  this.wtDom.addEvent(BUTTON, 'click', function () {
    courtainDetachColumn('right')
  });

  BUTTON = document.getElementById('attachRight');
  this.wtDom.addEvent(BUTTON, 'click', function () {
    courtainAttachColumn('right')
  });

  BUTTON = document.getElementById('detachLeft');
  this.wtDom.addEvent(BUTTON, 'click', function () {
    courtainDetachColumn('left')
  });

  BUTTON = document.getElementById('attachLeft');
  this.wtDom.addEvent(BUTTON, 'click', function () {
    courtainAttachColumn('left')
  });

  BUTTON = document.getElementById('detachTop');
  this.wtDom.addEvent(BUTTON, 'click', function () {
    courtainDetachRow('top')
  });

  BUTTON = document.getElementById('attachTop');
  this.wtDom.addEvent(BUTTON, 'click', function () {
    courtainAttachRow('top')
  });

  BUTTON = document.getElementById('detachBottom');
  this.wtDom.addEvent(BUTTON, 'click', function () {
    courtainDetachRowReverse('bottom')
  });

  BUTTON = document.getElementById('attachBottom');
  this.wtDom.addEvent(BUTTON, 'click', function () {
    courtainAttachRow('bottom')
  });
}