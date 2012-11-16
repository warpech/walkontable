function WalkontableCourtain(TABLE) {
  this.TABLE = TABLE;

  this.courtains = {
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
}

WalkontableCourtain.prototype.detachColumn = function (side) {
  var underbed = [];
  var TSECTIONs = this.TABLE.childNodes;
  for (var i = 0, ilen = TSECTIONs.length; i < ilen; i++) {
    underbed[i] = [];
    var TRs = TSECTIONs[i].childNodes;
    for (var j = 0, jlen = TRs.length; j < jlen; j++) {
      var TD = this.courtains[side].detach(TRs[j]);
      TRs[j].removeChild(TD);
      underbed[i].push(TD);
    }
  }
  this.courtains[side].box.push(underbed);
};

WalkontableCourtain.prototype.attachColumn = function (side) {
  var underbed = this.courtains[side].box.pop();
  if (underbed) {
    for (var i = 0, ilen = underbed.length; i < ilen; i++) {
      for (var j = 0, jlen = underbed[i].length; j < jlen; j++) {
        this.courtains[side].attach(this.TABLE.childNodes[i].childNodes[j], underbed[i][j]);
      }
    }
  }
};

WalkontableCourtain.prototype.detachRow = function (side) {
  var underbed = [];
  var TSECTIONs = this.TABLE.childNodes;
  for (var i = 0, ilen = TSECTIONs.length; i < ilen; i++) {
    underbed[i] = null;
    var TRs = TSECTIONs[i].childNodes;
    if (TRs.length) {
      var TR = this.courtains[side].detach(TSECTIONs[i]);
      TSECTIONs[i].removeChild(TR);
      underbed[i] = TR;
      break;
    }
  }
  this.courtains[side].box.push(underbed);
};

WalkontableCourtain.prototype.attachRow = function (side) {
  var underbed = this.courtains[side].box.pop();
  if (underbed) {
    for (var i = 0, ilen = underbed.length; i < ilen; i++) {
      if (underbed[i]) {
        this.courtains[side].attach(this.TABLE.childNodes[i], underbed[i]);
      }
    }
  }
};

WalkontableCourtain.prototype.detachRowReverse = function (side) {
  var underbed = [];
  var TSECTIONs = this.TABLE.childNodes;
  var done = false;
  for (var i = TSECTIONs.length - 1; i >= 0; i--) {
    underbed[i] = null;
    if (!done) {
      var TRs = TSECTIONs[i].childNodes;
      if (TRs.length) {
        var TR = this.courtains[side].detach(TSECTIONs[i]);
        TSECTIONs[i].removeChild(TR);
        underbed[i] = TR;
        done = true;
      }
    }
  }
  this.courtains[side].box.push(underbed);
};