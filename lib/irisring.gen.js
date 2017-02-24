var IrisringFn;
(function (IrisringFn) {
  var Color = (function () {
    function Color(v) {
      this.Set(v);
    }
    Color.prototype.Set = function (v) {
      if (v instanceof Color) {
        this.r = v.r;
        this.g = v.g;
        this.b = v.b;
        this.h = v.h;
        this.s = v.s;
        this.l = v.l;
        this.hex = v.hex;
      }
      else {
        if (v.h || v.s || v.l) {
          this.SetHSL(v).SetRGB(Color.HSLtoRGB(v));
        }
        else {
          this.SetRGB(v).SetHSL(Color.RGBtoHSL(v));
        }
        if (this.r <= 0)
          this.r = 0;
        if (this.g <= 0)
          this.g = 0;
        if (this.b <= 0)
          this.b = 0;
        this.hex = Color.ToHex(this.r) + Color.ToHex(this.g) + Color.ToHex(this.b);
      }
      return this;
    };
    Color.ToHex = function (n) {
      var s = n.toString(16);
      if (!s[1])
        s = '0' + s;
      return s;
    };
    Color.RGBtoHSL = function (v) {
      var o = {}, r = v.r, g = v.g, b = v.b, Max, Min, Diff, Sum, q;
      if (r > g) {
        Max = r;
        Min = g;
      }
      else {
        Max = g;
        Min = r;
      }
      if (b > Max)
        Max = b;
      else if (b < Min)
        Min = b;
      o.l = Max * p255;
      Diff = Max - Min;
      Sum = Max + Min;
      if (Max == 0)
        o.s = 0;
      else
        o.s = Diff / Max;
      if (Diff == 0)
        q = 0;
      else
        q = 60 / Diff;
      if (Max == r) {
        if (g < b)
          o.h = 360 + q * (g - b);
        else
          o.h = q * (g - b);
      }
      else if (Max == g)
        o.h = 120 + q * (b - r);
      else if (Max == b)
        o.h = 240 + q * (r - g);
      else
        o.h = 0;
      return o;
    };
    Color.HSLtoRGB = function (v) {
      var H = v.h, S = v.s, V = v.l, r = 0, g = 0, b = 0, Max, Mid, Min, q;
      H *= p360;
      Max = Math.round(V * 255);
      Min = Math.round((1.0 - S) * V * 255.0);
      q = (Max - Min) * p255;
      if (H >= 0 && H <= p6) {
        Mid = Math.round(H * q * 1530 + Min);
        r = Max;
        g = Mid;
        b = Min;
      }
      else if (H <= p3) {
        Mid = Math.round((p6 - H) * q * 1530 + Max);
        r = Mid;
        g = Max;
        b = Min;
      }
      else if (H <= 0.5) {
        Mid = Math.round((H - p3) * q * 1530 + Min);
        r = Min;
        g = Max;
        b = Mid;
      }
      else if (H <= p23) {
        Mid = Math.round((0.5 - H) * q * 1530 + Max);
        r = Min;
        g = Mid;
        b = Max;
      }
      else if (H <= p56) {
        Mid = Math.round((H - p23) * q * 1530 + Min);
        r = Mid;
        g = Min;
        b = Max;
      }
      else if (H <= 1.0) {
        Mid = Math.round((p56 - H) * q * 1530 + Max);
        r = Max;
        g = Min;
        b = Mid;
      }
      return { r: r, g: g, b: b };
    };
    Color.FromPoi = function (p, l, c) {
      var v = Point.ToHL(p), h = v[0] * pHtoJ;
      h = Color.WarpH(h);
      if (c)
        c.Set({ h: h, s: v[1], l: l });
      else
        c = new Color({ h: h, s: v[1], l: l });
      return c;
    };
    Color.WarpH = function (h) {
      var o = (h - Palette.rinHL[0]) * p360;
      o = Rhv(o);
      o = Palette.rinBez.poi(o) * 360 + Palette.rinHL[0];
      o = Rhv(o, 360);
      return o;
    };
    Color.prototype.SetRGB = function (v) {
      this.r = v.r;
      this.g = v.g;
      this.b = v.b;
      return this;
    };
    Color.prototype.SetHSL = function (v) {
      this.h = v.h;
      this.s = v.s;
      this.l = v.l;
      return this;
    };
    return Color;
  }());
  IrisringFn.Color = Color;
  var p3 = 1 / 3, p6 = 1 / 6, p23 = 2 / 3, p56 = 5 / 6, p255 = 1 / 255, p360 = 1 / 360, pJtoH = Math.PI / 180, pHtoJ = 180 / Math.PI, P2 = Math.PI * 2;
  function Rhv(v, max) {
    max = max || 1;
    while (v > max)
      v -= max;
    while (v < 0)
      v += max;
    return v;
  }
  var HarmonyData = (function () {
    function HarmonyData(obj) {
      this.obj = obj;
      this.hueMap = new Bezer1DCtrl(obj.ss);
      this.lightMap = new Bezer1DCtrl(obj.sl);
      Object.seal(this);
    }
    Object.defineProperty(HarmonyData.prototype, "zip", {
      get: function () { return this.obj.GetStrId(); },
      enumerable: true,
      configurable: true
    });
    ;
    Object.defineProperty(HarmonyData.prototype, "colors", {
      get: function () { this.obj.PSinCS(); return this.obj.cs; },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(HarmonyData.prototype, "baseHue", {
      get: function () { return this.obj.lh * (Palette.radMean ? Math.PI / 60 : 3); },
      set: function (v) { this.obj.lh = Palette.radMean ? v * 60 / Math.PI : v / 3; },
      enumerable: true,
      configurable: true
    });
    ;
    Object.defineProperty(HarmonyData.prototype, "seg", {
      get: function () { return this.obj.dn; },
      set: function (v) { this.obj.SetSeg(v); },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(HarmonyData.prototype, "cenPoint", {
      get: function () { return this.obj.bz.k; },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(HarmonyData.prototype, "endPoint", {
      get: function () { return this.obj.bz.i; },
      enumerable: true,
      configurable: true
    });
    return HarmonyData;
  }());
  IrisringFn.HarmonyData = HarmonyData;
  var Harmony = (function () {
    function Harmony(k, hue, ip, seg, iss, isl, isj) {
      var pale = k === undefined || (hue === undefined && isj === undefined) ? new Palette() : undefined;
      var kp = k instanceof Array ? new Point(k) : new Point([pale.px, pale.py]);
      this.lh = isj || isj === 0 ? isj : +(hue || pale.hue) / 3 * pHtoJ;
      hue = this.lh * 3 * pJtoH;
      this.dn = seg || Math.round((Math.random() * Math.random() + Math.random() * 0.5) * 4) + 1;
      var ipoi = new Point(ip || [0, 0]);
      this.bz = new Bezier([ipoi, kp, new Point([Math.cos(hue), Math.sin(hue)])]);
      this.ps = [];
      this.cs = [];
      var minsl = Math.random() * 0.3 + 0.2, ksl = minsl + (1 - minsl) * (1 - Math.random() * Math.random());
      this.sl = isl ? new Bezier1D(isl[0], isl[2], isl[1], true) : new Bezier1D(Palette.ligRev ? 1 : minsl, Palette.ligRev ? minsl : 1, ksl, true);
      var dr = 0.5 / (this.dn + 1);
      this.ss = iss ? new Bezier1D(iss[0], iss[2], iss[1], false) : new Bezier1D(dr, 1 - dr, Palette.ligRev ? 0.5 : 0.8, false);
      this.dr = 0.9 / (this.dn - 1);
      this.PSinCS();
    }
    Harmony.prototype.GetStrId = function () {
      var s = '';
      s = NT32(this.lh + 60 >> 0);
      s += NT32(this.bz.k.x * 300 + 500 >> 0);
      s += NT32(this.bz.k.y * 300 + 500 >> 0);
      s += NT32(this.bz.i.x * 300 + 500 >> 0);
      s += NT32(this.bz.i.y * 300 + 500 >> 0);
      s += NT32(this.ss.min * 1000 >> 0);
      s += NT32(this.ss.k * 1000 >> 0);
      s += NT32(this.ss.max * 1000 >> 0);
      s += NT32(this.sl.min * 1000 >> 0);
      s += NT32(this.sl.k * 1000 >> 0);
      s += NT32(this.sl.max * 1000 >> 0);
      s += this.dn.toString();
      function NT32(n) {
        var s = n.toString(32);
        if (!s[1])
          return '0' + s;
        return s;
      }
      return s;
    };
    Harmony.NewFromStrId = function (s) {
      var i = 0, kx, ky, ix, iy, si, sk, sa, li, lk, la;
      var lh = parseInt(s.substr(i, 2), 32) - 60;
      i += 2;
      kx = (parseInt(s.substr(i, 2), 32) - 500) / 300;
      i += 2;
      ky = (parseInt(s.substr(i, 2), 32) - 500) / 300;
      i += 2;
      ix = (parseInt(s.substr(i, 2), 32) - 500) / 300;
      i += 2;
      iy = (parseInt(s.substr(i, 2), 32) - 500) / 300;
      i += 2;
      si = parseInt(s.substr(i, 2), 32) * 0.001;
      i += 2;
      sk = parseInt(s.substr(i, 2), 32) * 0.001;
      i += 2;
      sa = parseInt(s.substr(i, 2), 32) * 0.001;
      i += 2;
      li = parseInt(s.substr(i, 2), 32) * 0.001;
      i += 2;
      lk = parseInt(s.substr(i, 2), 32) * 0.001;
      i += 2;
      la = parseInt(s.substr(i, 2), 32) * 0.001;
      i += 2;
      var dn = +s.substr(i, 1);
      var p = [kx, ky];
      var bs = [si, sk, sa];
      var bl = [li, lk, la];
      return new Harmony(p, undefined, [ix, iy], dn, bs, bl, lh);
    };
    Object.defineProperty(Harmony.prototype, "data", {
      get: function () { return new HarmonyData(this); },
      enumerable: true,
      configurable: true
    });
    Harmony.prototype.PSinCS = function () {
      if (this.dn < 2) {
        var pp = this.bz.Poi(this.ss.poi(0.7), this.ps[0]);
        this.ps[0] = pp;
        this.cs[0] = Color.FromPoi(pp, this.sl.poi(0.3), this.cs[0]);
        return;
      }
      var dv = 0;
      for (var i = 0; i < this.dn; i++) {
        var pp = this.bz.Poi(this.ss.poi(0.05 + dv), this.ps[i]);
        this.ps[i] = pp;
        this.cs[i] = Color.FromPoi(pp, this.sl.poi(0.95 - dv), this.cs[i]);
        dv += this.dr;
      }
    };
    Harmony.prototype.SetBezI = function (p) {
      if (p) {
        if (p instanceof Point)
          this.bz.i = p;
        else {
          this.bz.i.x = p[0];
          this.bz.i.y = p[1];
        }
      }
      else
        this.bz.i = new Point([0, 0]);
      this.PSinCS();
    };
    Harmony.prototype.SetBezK = function (k) {
      if (k) {
        if (k instanceof Point)
          this.bz.k = k;
        else {
          this.bz.k.x = k[0];
          this.bz.k.y = k[1];
        }
      }
      this.PSinCS();
    };
    Harmony.prototype.SetBezO = function (h) {
      this.bz.o.x = Math.cos(h);
      this.bz.o.y = Math.sin(h);
      this.PSinCS();
    };
    Harmony.prototype.SetSeg = function (n) {
      this.dn = n > 0 ? n : 1;
      this.dr = 0.9 / (this.dn - 1);
      this.ps.splice(0);
      this.cs.splice(0);
      this.PSinCS();
    };
    return Harmony;
  }());
  IrisringFn.Harmony = Harmony;
  var Bezier = (function () {
    function Bezier(Points) {
      if (Points) {
        this.i = Points[0];
        this.k = Points[1];
        this.o = Points[2];
      }
    }
    Bezier.prototype.Poi = function (t, p) {
      var v, x = 0, y = 0;
      if (this.i.x || this.i.y) {
        v = 1 - t;
        v *= v;
        x = v * this.i.x;
        y = v * this.i.y;
      }
      v = t * t;
      x += v * this.o.x;
      y += v * this.o.y;
      v = t - v;
      v += v;
      x += v * this.k.x;
      y += v * this.k.y;
      if (p) {
        p.x = x;
        p.y = y;
      }
      else
        p = new Point([x, y]);
      return p;
    };
    return Bezier;
  }());
  var Bezier1D = (function () {
    function Bezier1D(min, max, k, is2p) {
      this.is2p = is2p;
      this.Set(min, max, k);
    }
    Bezier1D.prototype.getForNum = function (n) {
      switch (n) {
        case 0: return this.min;
        case 1: return this.k;
        case 2: return this.max;
      }
    };
    Bezier1D.prototype.setForNum = function (n, v) {
      switch (n) {
        case 0:
          this.Set(v, this.max, this.k);
          break;
        case 1:
          this.Set(this.min, this.max, v);
          break;
        case 2:
          this.Set(this.min, v, this.k);
          break;
      }
    };
    Bezier1D.prototype.poi = function (t) {
      if (this.is2p) {
        var a = 1 - t, a3 = a * 3;
        a = this.min + t * ((this.k1 - this.min) * a * a3 +
          t * ((this.k2 - this.min) * a3 + (this.max - this.min) * t));
        return Math.min(Math.max(a, 0), 1);
      }
      else
        return this.min + t * (2 * (1 - t) * (this.k - this.min) + t * (this.max - this.min));
    };
    Bezier1D.prototype.Copy = function () { return new Bezier1D(this.min, this.max, this.k, this.is2p); };
    Bezier1D.prototype.Set = function (min, max, k) {
      if (min || min === 0)
        this.min = min;
      if (max || max === 0)
        this.max = max;
      if (k || k === 0)
        this.k = k;
      this.k1 = this.k + (this.min - this.k) * (1 - this.k);
      this.k2 = this.k + (this.max - this.k) * this.k;
    };
    Bezier1D.prototype.Zpower = function (z) {
      z *= 1.5;
      var z1 = 1 / 3, z2 = 2 / 3;
      this.k1 = z1 - z1 * z;
      this.k2 = z2 + (1 - z2) * z;
    };
    return Bezier1D;
  }());
  var Bezer1DCtrl = (function () {
    function Bezer1DCtrl(obj) {
      this.obj = obj;
    }
    Object.defineProperty(Bezer1DCtrl.prototype, "i", {
      get: function () { return this.obj.min; },
      set: function (v) { this.obj.setForNum(0, v); },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(Bezer1DCtrl.prototype, "k", {
      get: function () { return this.obj.k; },
      set: function (v) { this.obj.setForNum(1, v); },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(Bezer1DCtrl.prototype, "o", {
      get: function () { return this.obj.max; },
      set: function (v) { this.obj.setForNum(2, v); },
      enumerable: true,
      configurable: true
    });
    return Bezer1DCtrl;
  }());
  var Point = (function () {
    function Point(p) {
      if (p) {
        this.x = p[0];
        this.y = p[1];
      }
      else {
        this.x = this.y = 0;
      }
    }
    Point.prototype.rotate = function (v, o) {
      var px = this.x, py = this.y;
      if (o) {
        o[0] = o[0] || o.x || 0;
        o[1] = o[1] || o.y || 0;
      }
      else
        o = [0, 0];
      var r = Point.AToHL([px - o[0], py - o[1]]);
      r[0] += Palette.radMean ? v : v * Math.PI / 180;
      this.x = Math.cos(r[0]) * r[1] + o[0];
      this.y = Math.sin(r[0]) * r[1] + o[1];
      return this;
    };
    Point.ToHL = function (p) {
      var l = Point.GetLenth(p), h = Math.acos(p.x / l) || 0;
      if (p.y < 0)
        h = P2 - h;
      return [h, l];
    };
    Point.AToL = function (p) { return Math.sqrt(p[0] * p[0] + p[1] * p[1]); };
    Point.AToHL = function (p) {
      var l = Math.sqrt(p[0] * p[0] + p[1] * p[1]), h = Math.acos(p[0] / l) || 0;
      if (p[1] < 0)
        h = P2 - h;
      return [h, l];
    };
    Point.GetLenth = function (p) { return Math.sqrt(p.x * p.x + p.y * p.y); };
    return Point;
  }());
  var Palette = (function () {
    function Palette() {
      var h = this.hue = Palette.psyH, kh = Palette.psyKH, ofstKL = Math.sin(Palette.psyKL), ustKL = Math.abs(ofstKL), rKL = 1 - Math.random() * Math.random(), tL = ustKL * rKL * 0.6 + 0.3, x = this.px = Math.cos(kh) * tL, y = this.py = Math.sin(kh) * tL;
      Palette.psyH += ofstKL;
      Palette.psyKH += Math.random();
      Palette.psyKL += Math.random() * Math.random();
      Palette.psyH = Rhv(Palette.psyH, P2);
      if (Palette.randLig)
        Palette.ligRev = Math.random() > 0.5;
    }
    Palette.Init = function () {
      Palette.psyH = Math.random() * P2;
      Palette.psyKH = Palette.psyH + Math.random() * 3 - 1.5;
      Palette.psyKL = Math.random() * P2;
      Palette.ligRev = Math.random() < 0.5;
      Palette.rinHL = [0, 0];
      Palette.rinBez = new Bezier1D(0, 1, 0.5, true);
      Palette.rinBez.k1 = 0.15;
      Palette.rinBez.k2 = 0.5;
      Palette.randLig = Palette.randLig === undefined ? true : Palette.randLig;
    };
    Palette.Config = function (opt) {
      Palette.randLig = opt.light === null;
      Palette.ligRev = !opt.light;
      if (opt.radians !== undefined)
        Palette.radMean = !!opt.radians;
    };
    return Palette;
  }());
  IrisringFn.Palette = Palette;
})(IrisringFn || (IrisringFn = {}));
window['irisring'] = (function () {
  IrisringFn.Palette.Init();
  var iri;
  iri = function (opt) {
    if (opt) {
      if (typeof opt === 'string' && opt.length == 23)
        return IrisringFn.Harmony.NewFromStrId(opt).data;
      else
        return new IrisringFn.Harmony(opt.cenPoint ? (opt.cenPoint.length ? opt.cenPoint : [opt.cenPoint.x, opt.cenPoint.y]) : undefined, IrisringFn.Palette.radMean ? opt.baseHue : undefined, opt.endPoint ? (opt.endPoint.length ? opt.endPoint : [opt.endPoint.x, opt.endPoint.y]) : undefined, opt.seg, opt.hueMap ? (opt.hueMap.length ? opt.hueMap : [opt.hueMap.i, opt.hueMap.k, opt.hueMap.o]) : undefined, opt.lightMap ? (opt.lightMap.length ? opt.lightMap : [opt.lightMap.i, opt.lightMap.k, opt.lightMap.o]) : undefined, IrisringFn.Palette.radMean ? undefined : (opt.baseHue || opt.baseHue === 0 ? opt.baseHue / 3 : undefined)).data;
    }
    else
      return new IrisringFn.Harmony().data;
  };
  iri.setup = function (opt) {
    if (opt)
      IrisringFn.Palette.Config(opt);
    else
      IrisringFn.Palette.Init();
    return iri;
  };
  return iri;
})();
