var CCC;
(function (CCC) {
    var Ref = (function () {
        function Ref(v) {
            this.v = v;
        }
        Ref.prototype.valueOf = function () { return this.v; };
        Ref.prototype.toString = function () { return this.v.toString(); };
        return Ref;
    }());
    CCC.Ref = Ref;
    var Set = (function () {
        function Set() {
            this.a = [];
            this.n = 0;
        }
        Set.prototype.Has = function (id) { return this.a[id] && (this.a[id].valueOf() !== 0); };
        Set.prototype.Get = function (id) { return this.a[id]; };
        Set.prototype.Add = function (id, obj) {
            if (this.Has(id))
                return false;
            else {
                this.a[id] = obj;
                this.n++;
                return true;
            }
        };
        Set.prototype.Rep = function (id, obj) {
            if (this.Has(id)) {
                this.a[id] = obj;
                return true;
            }
            else
                return false;
        };
        Set.prototype.AddOrRep = function (id, obj) {
            if (!this.Has(id))
                this.n++;
            this.a[id] = obj;
        };
        Set.prototype.Remove = function (id) {
            if (this.Has(id)) {
                delete this.a[id];
                this.n--;
                return true;
            }
            else
                return false;
        };
        Set.prototype.Count = function () { return this.n; };
        Set.prototype.ForAt = function (f) { for (var i in this.a)
            f(i); };
        return Set;
    }());
    var Color = (function () {
        function Color(v, RGBorHSL) {
            this.Set(v, RGBorHSL);
        }
        Color.prototype.Set = function (v, RGBorHSL) {
            if (RGBorHSL) {
                this.SetRGB(v);
                this.SetHSL(Color.RGBtoHSL(v));
            }
            else {
                this.SetHSL(v);
                this.SetRGB(Color.HSLtoRGB(v));
            }
            if (this.r < 0)
                this.r = 0;
            if (this.g < 0)
                this.g = 0;
            if (this.b < 0)
                this.b = 0;
            this.bit = this.NT16(this.r) + this.NT16(this.g) + this.NT16(this.b);
        };
        Color.prototype.NT16 = function (n) {
            var s = n.toString(16);
            if (!s[1])
                s = '0' + s;
            return s.toUpperCase();
        };
        Color.RGBtoHSL = function (v) {
            var o = new Array(), r = v[0], g = v[1], b = v[2], Max, Min, Diff, Sum, q;
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
            o[2] = Max * CCC.p255;
            Diff = Max - Min;
            Sum = Max + Min;
            if (Max == 0)
                o[1] = 0;
            else
                o[1] = Diff / Max;
            if (Diff == 0)
                q = 0;
            else
                q = 60 / Diff;
            if (Max == r) {
                if (g < b)
                    o[0] = 360 + q * (g - b);
                else
                    o[0] = q * (g - b);
            }
            else if (Max == g)
                o[0] = 120 + q * (b - r);
            else if (Max == b)
                o[0] = 240 + q * (r - g);
            else
                o[0] = 0;
            return o;
        };
        Color.HSLtoRGB = function (v) {
            var H = v[0], S = v[1], V = v[2], r = 0, g = 0, b = 0, Max, Mid, Min, q;
            H *= CCC.p360;
            Max = Math.round(V * 255);
            Min = Math.round((1.0 - S) * V * 255.0);
            q = (Max - Min) * CCC.p255;
            if (H >= 0 && H <= CCC.p6) {
                Mid = Math.round(H * q * 1530 + Min);
                r = Max;
                g = Mid;
                b = Min;
            }
            else if (H <= CCC.p3) {
                Mid = Math.round((CCC.p6 - H) * q * 1530 + Max);
                r = Mid;
                g = Max;
                b = Min;
            }
            else if (H <= 0.5) {
                Mid = Math.round((H - CCC.p3) * q * 1530 + Min);
                r = Min;
                g = Max;
                b = Mid;
            }
            else if (H <= CCC.p23) {
                Mid = Math.round((0.5 - H) * q * 1530 + Max);
                r = Min;
                g = Mid;
                b = Max;
            }
            else if (H <= CCC.p56) {
                Mid = Math.round((H - CCC.p23) * q * 1530 + Min);
                r = Mid;
                g = Min;
                b = Max;
            }
            else if (H <= 1.0) {
                Mid = Math.round((CCC.p56 - H) * q * 1530 + Max);
                r = Max;
                g = Min;
                b = Mid;
            }
            return [r, g, b];
        };
        Color.FromPoi = function (p, l, c) {
            var v = Point.ToHL(p), h = v[0] * CCC.pHtoJ;
            h = Color.WarpH(h);
            if (c)
                c.Set([h, v[1], l], false);
            else
                c = new Color([h, v[1], l], false);
            return c;
        };
        Color.WarpH = function (h) {
            var o = (h - Palette.rinHL[0]) * CCC.p360;
            o = Rhv(o);
            o = Palette.rinBez.poi(o) * 360 + Palette.rinHL[0];
            o = Rhv(o, 360);
            return o;
        };
        Color.prototype.SetRGB = function (v) { this.r = v[0]; this.g = v[1]; this.b = v[2]; };
        Color.prototype.SetHSL = function (v) { this.h = v[0]; this.s = v[1]; this.l = v[2]; };
        return Color;
    }());
    CCC.Color = Color;
    CCC.p3 = 1 / 3, CCC.p6 = 1 / 6, CCC.p23 = 2 / 3, CCC.p56 = 5 / 6, CCC.p255 = 1 / 255, CCC.p360 = 1 / 360, CCC.pJtoH = Math.PI / 180, CCC.pHtoJ = 180 / Math.PI, CCC.P2 = Math.PI * 2;
    function Rhv(v, max) {
        max = max || 1;
        while (v > max)
            v -= max;
        while (v < 0)
            v += max;
        return v;
    }
    CCC.Rhv = Rhv;
    var Harmony = (function () {
        function Harmony(k, hue, ip, seg, iss, isl, isj) {
            this.AddToLib();
            this.lh = isj || Math.round(hue / 3 * CCC.pHtoJ);
            if (Palette.OpLock)
                hue = this.lh * 3 * CCC.pJtoH;
            this.dn = seg || Math.round((Math.random() * Math.random() + Math.random() * 0.5) * 4) + 1;
            k.ph = this;
            var ipoi = new Point(ip || [0, 0], this, true);
            this.bz = new Bezier([ipoi, k, new Point([Math.cos(hue), Math.sin(hue)], this, true)]);
            this.ps = new Array();
            this.cs = new Array();
            this.bs = this.bz.Sub(this.dn);
            var minsl = Math.random() * 0.3 + 0.2, ksl = minsl + (1 - minsl) * (1 - Math.random() * Math.random());
            this.sl = isl || new Bezier1D(Palette.ligRev ? 1 : minsl, Palette.ligRev ? minsl : 1, ksl, true);
            var dr = 0.5 / (this.dn + 1);
            this.ss = iss || new Bezier1D(dr, 1 - dr, Palette.ligRev ? 0.5 : 0.8, false);
            this.dr = 0.9 / (this.dn - 1);
            this.PSinCS();
        }
        Harmony.Remove = function (id) {
            if (Harmony.all[id]) {
                delete Harmony.all[id];
                Harmony.Count--;
            }
        };
        Harmony.GetFromID = function (id) { return Harmony.all[id]; };
        Harmony.ForTag = function (f, obj) {
            for (var i in Harmony.all) {
                var o = f(i, Harmony.all[i], obj);
                if (o && o[0])
                    return o;
            }
        };
        Harmony.prototype.AddToLib = function () {
            Harmony.aid++;
            this.id = Harmony.aid;
            Harmony.all[this.id] = this;
            Harmony.Count++;
        };
        Harmony.prototype.GetStrId = function (iss) {
            var s = '';
            if (iss) {
                s = NT32(this.lh + 60 >> 0);
                s += Math.round(this.bz.k.x * 11 + 18).toString(36);
                s += Math.round(this.bz.k.y * 11 + 18).toString(36);
                s += Math.round(this.bz.i.x * 11 + 18).toString(36);
                s += Math.round(this.bz.i.y * 11 + 18).toString(36);
                s += Math.round(this.ss.min * 35).toString(36);
                s += Math.round(this.ss.k * 35).toString(36);
                s += Math.round(this.ss.max * 35).toString(36);
                s += Math.round(this.sl.min * 35).toString(36);
                s += Math.round(this.sl.k * 35).toString(36);
                s += Math.round(this.sl.max * 35).toString(36);
                s += this.dn.toString();
                return s;
            }
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
            var i = 0, kx, ky, ix, iy, si, sk, sa, li, lk, la, iss = s.length == 13;
            function randmix(mainum, per, maxin) {
                var p = per * 0.5;
                var v = mainum / per;
                if (v > 0.001)
                    v += (Math.random() - 0.5) / p;
                return maxin ? Math.min(1, Math.max(0, v)) : v;
            }
            var lh = parseInt(s.substr(i, 2), 32) - 60;
            i += 2;
            if (iss) {
                kx = randmix(parseInt(s.substr(i, 1), 36) - 18, 11);
                i += 1;
                ky = randmix(parseInt(s.substr(i, 1), 36) - 18, 11);
                i += 1;
                ix = randmix(parseInt(s.substr(i, 1), 36) - 18, 11);
                i += 1;
                iy = randmix(parseInt(s.substr(i, 1), 36) - 18, 11);
                i += 1;
                si = randmix(parseInt(s.substr(i, 1), 36), 35, 1);
                i += 1;
                sk = randmix(parseInt(s.substr(i, 1), 36), 35, 1);
                i += 1;
                sa = randmix(parseInt(s.substr(i, 1), 36), 35, 1);
                i += 1;
                li = randmix(parseInt(s.substr(i, 1), 36), 35, 1);
                i += 1;
                lk = randmix(parseInt(s.substr(i, 1), 36), 35, 1);
                i += 1;
                la = randmix(parseInt(s.substr(i, 1), 36), 35, 1);
                i += 1;
            }
            else {
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
            }
            var dn = +s.substr(i, 1);
            var p = new CCC.Point([kx, ky], undefined, true);
            var bs = new CCC.Bezier1D(si, sa, sk, false);
            var bl = new CCC.Bezier1D(li, la, lk, true);
            return new CCC.Harmony(p, undefined, [ix, iy], dn, bs, bl, lh);
        };
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
                if (typeof p === 'Point')
                    this.bz.i = p;
                else {
                    this.bz.i.x = p[0];
                    this.bz.i.y = p[1];
                }
            }
            else
                this.bz.i = new Point([0, 0], this, true);
            this.bz.TranSub(this.bs);
        };
        Harmony.prototype.SetBezK = function (k) {
            if (k) {
                if (typeof k === 'Point')
                    this.bz.k = k;
                else {
                    this.bz.k.x = k[0];
                    this.bz.k.y = k[1];
                }
            }
            this.bz.TranSub(this.bs);
        };
        Harmony.prototype.SetBezO = function (h) {
            if (Palette.OpLock) {
                h = Math.round(h / 3 * CCC.pHtoJ);
                if (this.lh != h) {
                    this.lh = h;
                    h *= 3 * CCC.pJtoH;
                }
                else
                    return;
            }
            this.bz.o.x = Math.cos(h);
            this.bz.o.y = Math.sin(h);
            this.bz.TranSub(this.bs);
        };
        Harmony.prototype.SetDN = function (add) {
            this.dn += add ? 1 : -1;
            this.dr = 0.9 / (this.dn - 1);
            this.bs = this.bz.Sub(this.dn);
            this.PSinCS();
        };
        Harmony.aid = 0;
        Harmony.all = new Array();
        Harmony.Count = 0;
        return Harmony;
    }());
    CCC.Harmony = Harmony;
    var Bezier = (function () {
        function Bezier(Points) {
            if (Points) {
                this.i = Points[0];
                this.k = Points[1];
                this.o = Points[2];
            }
        }
        Bezier.prototype.GetTag = function (k) {
            switch (k) {
                case 'i': return this.i;
                case 'k': return this.k;
                case 'o': return this.o;
            }
        };
        Bezier.prototype.SetTag = function (k, v) {
            switch (k) {
                case 'i':
                    this.i = v;
                    return;
                case 'k':
                    this.k = v;
                    return;
                case 'o':
                    this.o = v;
                    return;
            }
        };
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
        Bezier.prototype.Cut = function (t1, t2, ip, op, bz) {
            var i = ip || this.Poi(t1), o = op || this.Poi(t2), k = this.k.Copy(false), ix = k.x, iy = k.y, ox = k.x, oy = k.y, b = bz || new Bezier([i, k, o]);
            if (t1) {
                ix = k.x + (this.o.x - k.x) * t1;
                iy = k.y + (this.o.y - k.y) * t1;
            }
            if (t2 < 1) {
                ox = this.i.x + (k.x - this.i.x) * t2;
                oy = this.i.y + (k.y - this.i.y) * t2;
            }
            var area_abc = (i.x - ox) * (iy - oy) - (i.y - oy) * (ix - ox), area_abd = (i.x - o.x) * (iy - o.y) - (i.y - o.y) * (ix - o.x), area_cda = (ox - i.x) * (o.y - i.y) - (oy - i.y) * (o.x - i.x), t = area_cda / (area_abd - area_abc);
            k.x = i.x + t * (ix - i.x);
            k.y = i.y + t * (iy - i.y);
            if (bz) {
                b.i = i;
                b.k = k;
                b.o = o;
            }
            return b;
        };
        Bezier.prototype.Sub = function (d) {
            var ps = new Array();
            if (d < 2) {
                var nb = new Bezier();
                nb.i = this.i.Copy(false);
                nb.k = this.k.Copy(false);
                nb.o = this.o.Copy(false);
                ps[0] = nb;
            }
            else {
                var v = 1 / d, vs = v, n = d - 1;
                ps[0] = this.Cut(0, vs, this.i);
                var pt = ps[0].o;
                for (var i = 1; i < n; i++) {
                    ps[i] = this.Cut(vs, vs + v, pt);
                    pt = ps[i].o;
                    vs += v;
                }
                ps[n] = this.Cut(vs, vs + v, pt, this.o);
            }
            return ps;
        };
        Bezier.prototype.TranSub = function (ps) {
            if (ps.length < 2) {
                ps[0].i = this.i.Copy(false);
                ps[0].k = this.k.Copy(false);
                ps[0].o = this.o.Copy(false);
            }
            else {
                var d = ps.length, v = 1 / d, vs = v, n = d - 1;
                this.Cut(0, vs, this.i, undefined, ps[0]);
                var pt = ps[0].o;
                for (var i = 1; i < n; i++) {
                    this.Cut(vs, vs + v, pt, undefined, ps[i]);
                    pt = ps[i].o;
                    vs += v;
                }
                this.Cut(vs, vs + v, pt, this.o, ps[n]);
            }
        };
        Bezier.prototype.ToSVG = function () {
            return Bezier.ToSvg3([this.i.x, this.i.y, this.k.x, this.k.y, this.o.x, this.o.y], Page.padWdt, Page.padLen);
        };
        Bezier.ToSvg3 = function (v, ml, sl) {
            var s = 'M';
            ml = ml || Page.padWdt;
            sl = sl || Page.padLen;
            v[0] = ml + (v[0] ? v[0] * sl : 0);
            v[1] = ml - (v[1] ? v[1] * sl : 0);
            v[2] = ml + v[2] * sl;
            v[3] = ml - v[3] * sl;
            v[4] = ml + (v[4] !== 1 ? (v[4] * sl) : sl);
            v[5] = ml - (v[5] !== 1 ? (v[5] * sl) : sl);
            s += v[0] + ' ' + v[1] + ' ' + 'Q' +
                v[2] + ' ' + v[3] + ' ' + v[4] + ' ' + v[5];
            return s;
        };
        Bezier.ToSvgL = function (v) {
            var s = 'M', n = v.length >> 1, ml = Page.padWdt, sl = Page.padLen;
            for (var i = 0; i < n; i++) {
                var j = i << 1;
                s += (ml + v[j] * sl) + ' ';
                j += 1;
                s += (ml - v[j] * sl) + ' L';
            }
            return s.substring(0, s.length - 2);
        };
        return Bezier;
    }());
    CCC.Bezier = Bezier;
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
    CCC.Bezier1D = Bezier1D;
    var Point = (function () {
        function Point(p, h, isReal) {
            if (isReal) {
                Point.aid++;
                this.id = Point.aid;
            }
            if (p) {
                this.x = p[0];
                this.y = p[1];
            }
            else {
                this.x = this.y = 0;
            }
            this.ph = h;
        }
        Point.prototype.NewId = function () { Point.aid++; this.id = Point.aid; };
        Point.prototype.FindUniTest = function (ik, idst) {
            var _this = this;
            Point.minDst = idst || 0.03;
            var a = this.CheckUni();
            if (a) {
                var p = a[1], s = [], ot = false;
                if (!p.hs)
                    s[p.ph.id] = true;
                else
                    p.hs.ForAt(function (k) {
                        p.hs.Get(k).ForAt(function (i) {
                            if (s[i]) {
                                ot = true;
                                return;
                            }
                            else
                                s[i] = true;
                        });
                        if (ot)
                            return;
                    });
                if (!this.hs) {
                    if (s[this.ph.id]) {
                        ot = true;
                        return;
                    }
                    else
                        s[this.ph.id] = true;
                }
                else
                    this.hs.ForAt(function (k) {
                        _this.hs.Get(k).ForAt(function (i) {
                            if (s[i]) {
                                ot = true;
                                return;
                            }
                            else
                                s[i] = true;
                        });
                        if (ot)
                            return;
                    });
                if (ot)
                    return false;
                if (ik != 'o' || ik == a[2] || (p.hs && p.hs.Has('o')))
                    p.Union(this, a[2], ik);
                else
                    return false;
                return true;
            }
            else if (Math.abs(this.x) < 0.02 && Math.abs(this.y) < 0.02) {
                this.x = 0;
                this.y = 0;
                return true;
            }
        };
        Point.prototype.Union = function (p, oname, iname) {
            if (!this.hs) {
                this.hs = new Set();
                this.hs.Add(oname, new Set());
                this.hs.Get(oname).Add(this.ph.id, this.ph);
                this.ph = undefined;
            }
            if (p.ph) {
                this.hs.Add(iname, new Set());
                this.hs.Get(iname).Add(p.ph.id, p.ph);
                p.ph.bz.SetTag(iname, this);
            }
            else if (p.hs) {
                this.UniKpoiTest('i', p);
                this.UniKpoiTest('k', p);
                this.UniKpoiTest('o', p);
            }
        };
        Point.prototype.UniKpoiTest = function (k, p) {
            var _this = this;
            if (p.hs.Has(k)) {
                this.hs.Add(k, new Set());
                var th = p.hs.Get(k);
                th.ForAt(function (i) {
                    var ih = th.Get(i);
                    _this.hs.Get(k).Add(i, ih);
                    ih.bz.SetTag(k, _this);
                });
            }
        };
        Point.prototype.RemoveUni = function (hn) {
            var _this = this;
            var p = this.hs.Get(hn[0]), ih, oc = new Ref(0);
            p.Remove(hn[1]);
            if (!p.Count())
                this.hs.Remove(hn[0]);
            this.hs.ForAt(function (i) {
                var hi = _this.hs.Get(i);
                oc.v += hi.Count();
                hi.ForAt(function (j) {
                    ih = hi.Get(j);
                    return;
                });
            });
            if (oc.v < 2) {
                this.hs = undefined;
                this.ph = ih;
            }
        };
        Point.prototype.CheckUni = function () {
            var o = Harmony.ForTag(this.CheckOne, new Ref(this));
            if (o) {
                for (var i in o[1]) {
                    switch (i) {
                        case '0': return [o[0], o[0].bz.o, 'o'];
                        case '1': return [o[0], o[0].bz.i, 'i'];
                        case '2': return [o[0], o[0].bz.k, 'k'];
                    }
                }
            }
        };
        Point.prototype.CheckOne = function (id, h, obj) {
            var ov = [obj.v.x, obj.v.y], v = [], n = 0;
            if (h.bz.o.id != obj.v.id) {
                v[0] = Point.Distan(h.bz.o.ToArr(), ov);
                n++;
            }
            if (h.bz.i.id != obj.v.id) {
                v[1] = Point.Distan(h.bz.i.ToArr(), ov);
                n++;
            }
            if (h.bz.k.id != obj.v.id) {
                v[2] = Point.Distan(h.bz.k.ToArr(), ov);
                n++;
            }
            if (v[0] > Point.minDst) {
                delete v[0];
                n--;
            }
            if (v[1] > Point.minDst) {
                delete v[1];
                n--;
            }
            if (v[2] > Point.minDst) {
                delete v[2];
                n--;
            }
            if (n > 0)
                return [h, v];
            else
                return undefined;
        };
        Point.Distan = function (a, b) {
            return Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]));
        };
        Point.prototype.Set = function (p) { this.x = p.x; this.y = p.y; };
        Point.prototype.Copy = function (isReal) { return new Point([this.x, this.y], this.ph, isReal); };
        Point.prototype.ToArr = function () { return [this.x, this.y]; };
        Point.ToHL = function (p) {
            var l = p.GetLenth(), h = Math.acos(p.x / l) || 0;
            if (p.y < 0)
                h = CCC.P2 - h;
            return [h, l];
        };
        Point.AToL = function (p) { return Math.sqrt(p[0] * p[0] + p[1] * p[1]); };
        Point.AToHL = function (p) {
            var l = Math.sqrt(p[0] * p[0] + p[1] * p[1]), h = Math.acos(p[0] / l) || 0;
            if (p[1] < 0)
                h = CCC.P2 - h;
            return [h, l];
        };
        Point.prototype.GetLenth = function () { return Math.sqrt(this.x * this.x + this.y * this.y); };
        Point.aid = 0;
        Point.minDst = 0.03;
        return Point;
    }());
    CCC.Point = Point;
    var Palette = (function () {
        function Palette() {
        }
        return Palette;
    }());
    CCC.Palette = Palette;
    var Page = (function () {
        function Page() {
        }
        Page.Ins = function () {
            Palette.psyH = Math.random() * CCC.P2;
            Palette.psyKH = Palette.psyH + Math.random() * 3 - 1.5;
            Palette.psyKL = Math.random() * CCC.P2;
            Palette.OpLock = true;
            Palette.ligRev = !+localStorage.getItem('ligsw');
            Palette.rinHL = [0, 0];
            Palette.rinBez = new Bezier1D(0, 1, 0.5, true);
            Palette.rinBez.k1 = 0.15;
            Palette.rinBez.k2 = 0.5;
        };
        Page.Start = function () {
            var n = Math.round(Math.random() * 3 + Math.random() * 2 + Math.random() * Math.random() + 1);
            for (var i = 0; i < n; i++) {
                var h = Page.AddBez();
                AddPath(h);
                AddColorBox(h);
            }
        };
        Page.AddBez = function () {
            var h = Palette.psyH, kh = Palette.psyKH, ofstKL = Math.sin(Palette.psyKL), ustKL = Math.abs(ofstKL), rKL = 1 - Math.random() * Math.random(), tL = ustKL * rKL * 0.6 + 0.3, x = Math.cos(kh) * tL, y = Math.sin(kh) * tL, p = new Point([x, y], undefined, true);
            Palette.psyH += ofstKL;
            Palette.psyKH += Math.random();
            Palette.psyKL += Math.random() * Math.random();
            Palette.psyH = Rhv(Palette.psyH, CCC.P2);
            var oh = new Harmony(p, h);
            oh.bz.i.FindUniTest('i', 0.0001);
            return oh;
        };
        Page.ChangeBez = function (id, p, x, y) {
            var h = Harmony.GetFromID(id), a = h.bz.GetTag(p);
            switch (p) {
                case 'i':
                    h.SetBezI([x, y]);
                    break;
                case 'k':
                    h.SetBezK([x, y]);
                    break;
                case 'o':
                    h.SetBezO(x);
                    break;
            }
            if (a.hs)
                Page.PoiSetAllBez(a);
            else {
                h.PSinCS();
                RePathBez(h, p);
                RePathColor(h);
            }
        };
        Page.ChangeBezOver = function (id, pn) {
            var h = Harmony.GetFromID(id), p = h.bz.GetTag(pn), hsFd = p.FindUniTest(pn);
            if (hsFd) {
                p = h.bz.GetTag(pn);
                if (p.hs)
                    Page.PoiSetAllBez(p);
                else {
                    h.PSinCS();
                    RePathBez(h, pn);
                    RePathColor(h);
                }
                GrpTagShow(p.ToArr());
            }
            RePathOver(h);
        };
        Page.PoiSetAllBez = function (a) {
            var aid = [];
            a.hs.ForAt(function (i) {
                var hid = a.hs.Get(i);
                hid.ForAt(function (j) {
                    if (!aid[j]) {
                        var ih = hid.Get(j);
                        ih.bz.TranSub(ih.bs);
                        ih.PSinCS();
                        RePathBez(ih, i);
                        RePathColor(ih);
                        aid[j] = true;
                    }
                });
            });
        };
        Page.padLen = 150;
        Page.padLP = 1 / Page.padLen;
        Page.padEdg = 230;
        Page.padWdt = 250;
        Page.padESQ = Page.padEdg * Page.padEdg;
        Page.padEpL = Page.padEdg / Page.padLen;
        return Page;
    }());
    CCC.Page = Page;
})(CCC || (CCC = {}));
function ip(v) {
    PEditOver();
    if (v == 'n') {
        unup = true;
        return;
    }
    if (aip)
        v = 'u';
    var e = e || window.event, isIKO;
    switch (v[0]) {
        case 'u':
            if (!aip) {
                desel();
                return;
            }
            up(aip);
            aip = undefined;
            return;
        case 'i':
        case 'k':
        case 'o':
            isIKO = true;
            break;
    }
    if (isIKO) {
        aip = new Array();
        aip[0] = v[0];
        aip[1] = P[0] - padXY[0] - parseFloat(ctrPoi[v[0]].getAttribute('cx'));
        aip[2] = P[1] - padXY[1] - parseFloat(ctrPoi[v[0]].getAttribute('cy'));
        aip[3] = v[1];
    }
}
function mv(e) {
    if (!P)
        return;
    var e = e || window.event;
    P[0] = e.pageX || e.offsetX;
    P[1] = e.pageY || e.offsetY;
    if (eip)
        PEdit();
    else if (aip) {
        switch (aip[0]) {
            case 'i':
            case 'k':
            case 'o':
                if (!unlockPoi)
                    RePathBegin();
                var X = MouseCX(aip[1]), Y = MouseCY(aip[2]), L = X * X + Y * Y;
                if (aip[0] !== 'o') {
                    if (L < CCC.Page.padESQ) {
                        X *= CCC.Page.padLP;
                        Y *= CCC.Page.padLP;
                    }
                    else {
                        X /= Math.sqrt(L);
                        L = Math.sin(Math.acos(X)) * CCC.Page.padEpL;
                        Y = Y > 0 ? L : -L;
                        X *= CCC.Page.padEpL;
                    }
                    CCC.Page.ChangeBez(selID[0], aip[0], X, Y);
                }
                else {
                    X /= Math.sqrt(L);
                    L = Y > 0 ? Math.acos(X) : -Math.acos(X);
                    CCC.Page.ChangeBez(selID[0], aip[0], L, undefined);
                }
                return;
        }
    }
}
function up(a) {
    switch (a[0]) {
        case 'i':
        case 'k':
        case 'o':
            CCC.Page.ChangeBezOver(selID[0], a[0]);
            return;
    }
}
function toNor(v) {
    switch (v[0]) {
        case 'i':
            CCC.Page.ChangeBez('i', v[1], 0, 0);
            break;
    }
}
function selc(id, pname) {
    var sid = id.toString().split('_');
    if (selID && selID[0] != sid[0])
        desel();
    var h = CCC.Harmony.GetFromID(sid[0]);
    if (!h)
        return;
    if (pname && h.bz.GetTag(pname).hs) {
        ctrPoi[pname].setAttribute('cx', PtoCX(h.bz.GetTag(pname).x).toString());
        ctrPoi[pname].setAttribute('cy', PtoCY(h.bz.GetTag(pname).y).toString());
        selID = sid;
        ip(pname + 'g');
    }
    else {
        selVwPath.setAttribute('d', h.bz.ToSVG());
        selVwPath.setAttribute('stroke-width', '10');
        ctrPoi['i'].setAttribute('style', '');
        ctrPoi['i'].setAttribute('cx', PtoCX(h.bz.i.x).toString());
        ctrPoi['i'].setAttribute('cy', PtoCY(h.bz.i.y).toString());
        ctrPoi['k'].setAttribute('style', '');
        ctrPoi['k'].setAttribute('cx', PtoCX(h.bz.k.x).toString());
        ctrPoi['k'].setAttribute('cy', PtoCY(h.bz.k.y).toString());
        ctrPoi['o'].setAttribute('style', '');
        ctrPoi['o'].setAttribute('cx', PtoCX(h.bz.o.x).toString());
        ctrPoi['o'].setAttribute('cy', PtoCY(h.bz.o.y).toString());
        vwbPad[1].removeChild(vwbPoi[sid[0]][1]);
        vwbPad[1].appendChild(vwbPoi[sid[0]][1]);
        vwbPoi[sid[0]][1].setAttribute('stroke', '#888');
        coGrPad[sid[0]][0].classList.add('gcpada');
        selID = sid;
        if (pname)
            ip(pname);
    }
}
function desel() {
    if (unup) {
        unup = false;
        return;
    }
    if (!selID)
        return;
    DeSetC();
    selVwPath.setAttribute('stroke-width', '0');
    ctrPoi['i'].setAttribute('style', 'display:none;');
    ctrPoi['k'].setAttribute('style', 'display:none;');
    ctrPoi['o'].setAttribute('style', 'display:none;');
    vwbPoi[selID[0]][1].setAttribute('stroke', 'inherit');
    coGrPad[selID[0]][0].classList.remove('gcpada');
    selID = undefined;
}
function addColors() {
    var h = CCC.Page.AddBez();
    AddPath(h);
    AddColorBox(h);
    selc(h.id, '');
}
function PtoCX(n) { return CCC.Page.padWdt + n * CCC.Page.padLen; }
function PtoCY(n) { return CCC.Page.padWdt - n * CCC.Page.padLen; }
function MouseCX(ofst) { return P[0] - padXY[0] - CCC.Page.padWdt - ofst; }
function MouseCY(ofst) { return -(P[1] - padXY[1] - CCC.Page.padWdt - ofst); }
function MouseCPX(ofst) { return MouseCX(ofst) * CCC.Page.padLP; }
function MouseCPY(ofst) { return MouseCY(ofst) * CCC.Page.padLP; }
function MouseCHL(ofst) { return CCC.Point.AToHL([MouseCX(ofst[0]), MouseCY(ofst[1])]); }
function setPadXY() { padXY[0] = document.getElementById('pad').offsetLeft; }
function AddColorBox(h) {
    var cos = document.createElement('div');
    cos.id = 'gcp_' + h.id;
    cos.setAttribute('class', 'gcpad');
    cos.setAttribute('onclick', 'selc("' + h.id + '", "");');
    if (true)
        cosPad.appendChild(cos);
    coGrPad[h.id] = new Array();
    coGrPad[h.id][0] = cos;
    cololi[h.id] = new Array();
    var comenu = document.createElement('div');
    comenu.setAttribute('class', 'comenu');
    comenu.setAttribute('title', 'Adjust\n调整');
    comenu.setAttribute('onclick', 'SetC(' + h.id + ');');
    cos.appendChild(comenu);
    var comenui = document.createElement('div');
    comenui.setAttribute('class', 'comenui');
    comenu.appendChild(comenui);
    var coseti = document.createElement('div');
    coseti.setAttribute('class', 'cosetpad');
    cos.appendChild(coseti);
    coSets[h.id] = coseti;
    var copv = document.createElement('ol');
    copv.setAttribute('class', 'colovw');
    cos.appendChild(copv);
    coGrPad[h.id][1] = copv;
    for (var i in h.bs) {
        var ci = document.createElement('li');
        ci.style.backgroundColor = '#' + h.cs[i].bit;
        ci.innerHTML = GetColoName(h, i);
        ci.setAttribute('onclick', 'selc("' + h.id + '_' + i + '", "");');
        if (h.cs[i].l > 0.5)
            ci.setAttribute('class', 'cololi');
        else
            ci.setAttribute('class', 'cololi cololib');
        copv.appendChild(ci);
        cololi[h.id][i] = ci;
    }
}
function InitColoSetPad() {
    coSetPad = document.createElement('div');
    var cosetbts = document.createElement('div');
    cosetbts.setAttribute('class', 'cosetbts');
    coSetPad.appendChild(cosetbts);
    var coadd = document.createElement('div');
    coadd.id = 'coadd';
    coadd.title = 'Add Color\n添加色块';
    coadd.setAttribute('class', 'cosetbt');
    coadd.setAttribute('onclick', 'AddSeg()');
    cosetbts.appendChild(coadd);
    var cosub = document.createElement('div');
    cosub.id = 'cosub';
    cosub.title = 'Reduce Color\n减少色块';
    cosub.setAttribute('class', 'cosetbt');
    cosub.setAttribute('onclick', 'RedSeg()');
    cosetbts.appendChild(cosub);
    var comak = document.createElement('div');
    comak.id = 'comak';
    comak.title = 'Mark\n标记色系';
    comak.setAttribute('class', 'cosetbt');
    comak.setAttribute('onclick', 'MarkColors()');
    cosetbts.appendChild(comak);
    var codel = document.createElement('div');
    codel.id = 'codel';
    codel.title = 'Remove Colors\n移除色系';
    codel.setAttribute('class', 'cosetbt');
    codel.setAttribute('onclick', 'RemovePath()');
    cosetbts.appendChild(codel);
    var coeditpad = document.createElement('div');
    coeditpad.setAttribute('class', 'coeditpad');
    coSetPad.appendChild(coeditpad);
    coeditpad.appendChild(GetColoEditor(0));
    coeditpad.appendChild(GetColoEditor(1));
}
function GetColoEditor(L) {
    var sn = L ? 'l' : 's';
    var coeditbox = document.createElement('div');
    coeditbox.setAttribute('class', 'coeditbox');
    var coeditbg = document.createElement('div');
    coeditbg.setAttribute('class', 'coeditbg');
    coeditbg.id = 'coeditbg_' + sn;
    coeditbox.appendChild(coeditbg);
    var coedit = document.createElementNS(svgName, 'svg');
    coSetSLPad[sn] = coedit;
    coedit.setAttribute('class', 'coedit');
    coedit.setAttribute('xmlns', svgName);
    coedit.setAttributeNS(svgName, 'version', '1.1');
    coeditbox.appendChild(coedit);
    var rc = document.createElementNS(svgName, 'rect');
    rc.setAttribute('x', '10');
    rc.setAttribute('y', '10');
    rc.setAttribute('width', '50');
    rc.setAttribute('height', '230');
    rc.setAttribute('stroke', 'gray');
    rc.setAttribute('stroke-width', '2');
    rc.setAttribute('fill', 'black');
    rc.setAttribute('style', 'opacity:0.2');
    coedit.appendChild(rc);
    rc = document.createElementNS(svgName, 'rect');
    rc.setAttribute('width', '70');
    rc.setAttribute('height', '250');
    rc.setAttribute('stroke', 'black');
    rc.setAttribute('fill', 'none');
    rc.setAttribute('style', 'opacity:0.3');
    rc.setAttribute('stroke-dasharray', '1 4');
    coedit.appendChild(rc);
    for (var i = 0; i < 3; i++) {
        rc = document.createElementNS(svgName, 'rect');
        rc.id = 'coedtp_' + sn + i;
        rc.setAttribute('class', 'coeditp');
        var x = L ? i : 2 - i;
        rc.setAttribute('x', '' + (11 + x * 16));
        rc.setAttribute('width', '16');
        rc.setAttribute('height', '16');
        rc.setAttribute('onmousedown', 'PEditBegin(\'' + sn + i + '\');');
        coSetPoi[sn][i] = rc;
        coedit.appendChild(rc);
    }
    return coeditbox;
}
function PEditBegin(s) {
    eip = s.split('');
    var h = CCC.Harmony.GetFromID(setID);
    var v;
    if (eip[0] == 's')
        v = 1 - h.ss.getForNum(+eip[1]);
    else
        v = h.sl.getForNum(+eip[1]);
    eip[2] = P[1] + v * 213;
}
function PEdit() {
    if (!eip)
        return;
    var iss = eip[0] == 's';
    var h = CCC.Harmony.GetFromID(setID);
    var sl;
    if (iss)
        sl = h.ss;
    else
        sl = h.sl;
    var v = (eip[2] - P[1]) / 213;
    if (v > 1)
        v = 1;
    else if (v < 0)
        v = 0;
    sl.setForNum(+eip[1], iss ? 1 - v : v);
    var rc = coSetPoi[eip[0]][eip[1]];
    rc.setAttribute('y', (224 - v * 213).toString());
    rc.setAttribute('height', (v * 213 + 15).toString());
    h.PSinCS();
    RePathColor(h);
}
function PEditOver() {
    if (!eip)
        return;
    eip = undefined;
}
function AddPath(h) {
    var pn = h.id.toString(), g = document.createElementNS(svgName, 'g'), laspt;
    g.id = 'pn_' + pn;
    g.setAttribute('fill', 'none');
    pathg[h.id] = g;
    pathPad.appendChild(g);
    paths[h.id] = new Array();
    for (var i in h.bs) {
        var pt = document.createElementNS(svgName, 'path');
        pt.setAttribute('d', h.bs[i].ToSVG());
        laspt = '#' + h.cs[i].bit;
        pt.setAttribute('stroke', laspt);
        pt.setAttribute('class', 'pth');
        var idn = '' + h.id + '_' + i;
        pt.setAttribute('onclick', 'selc("' + h.id + '_' + i + '", "");');
        g.appendChild(pt);
        paths[h.id][i] = pt;
    }
    var po = document.createElementNS(svgName, 'circle');
    po.setAttribute('cx', PtoCX(h.bz.o.x).toString());
    po.setAttribute('cy', PtoCY(h.bz.o.y).toString());
    po.setAttribute('r', '7');
    po.setAttribute('fill', laspt);
    po.setAttribute('class', 'ctrp_cs');
    po.setAttribute('onmousedown', 'selc(' + h.id + ', "o");');
    vwPoiPad.appendChild(po);
    vwPoi[h.id] = po;
    vwbPoi[h.id] = new Array();
    var bi = document.createElementNS(svgName, 'circle');
    bi.setAttribute('cx', PtoCX(h.bz.i.x).toString());
    bi.setAttribute('cy', PtoCY(h.bz.i.y).toString());
    bi.setAttribute('r', '7');
    bi.setAttribute('fill', 'white');
    bi.setAttribute('class', 'sel_pbi');
    bi.setAttribute('onmousedown', 'selc(' + h.id + ', "i");');
    vwbPad[2].appendChild(bi);
    vwbPoi[h.id][2] = bi;
    var bl = document.createElementNS(svgName, 'path');
    bl.setAttribute('d', CCC.Bezier.ToSvgL([h.bz.i.x, h.bz.i.y, h.bz.k.x, h.bz.k.y, h.bz.o.x, h.bz.o.y]));
    bl.setAttribute('fill', 'none');
    bl.setAttribute('stroke', 'inherit');
    bl.setAttribute('stroke-width', '1');
    bl.setAttribute('class', 'sel_pbl');
    vwbPad[1].appendChild(bl);
    vwbPoi[h.id][1] = bl;
    var bp = document.createElementNS(svgName, 'circle');
    bp.setAttribute('cx', PtoCX(h.bz.k.x).toString());
    bp.setAttribute('cy', PtoCY(h.bz.k.y).toString());
    bp.setAttribute('r', '4');
    bp.setAttribute('class', 'sel_pbp');
    bp.setAttribute('onmousedown', 'selc(' + h.id + ', "k");');
    vwbPad[0].appendChild(bp);
    vwbPoi[h.id][0] = bp;
}
function RePathBegin() {
    var h = CCC.Harmony.GetFromID(selID[0]), tp = h.bz.GetTag(aip[0]);
    gtag.setAttribute('style', 'display:none;');
    if (aip[3] == 'g') {
        unlockPoi = tp;
        tp.NewId();
    }
    else {
        if (tp.hs)
            tp.RemoveUni([aip[0], h.id]);
        tp.NewId();
        unlockPoi = new CCC.Point(tp.ToArr(), h, true);
        h.bz.SetTag(aip[0], unlockPoi);
    }
}
function RePathBez(h, pn) {
    for (var i in h.bs)
        paths[h.id][i].setAttribute('d', h.bs[i].ToSVG());
    vwbPoi[h.id][1].setAttribute('d', CCC.Bezier.ToSvgL([h.bz.i.x, h.bz.i.y, h.bz.k.x, h.bz.k.y, h.bz.o.x, h.bz.o.y]));
    ctrPoi[aip[0]].setAttribute('cx', PtoCX(h.bz.GetTag(aip[0]).x).toString());
    ctrPoi[aip[0]].setAttribute('cy', PtoCY(h.bz.GetTag(aip[0]).y).toString());
    switch (pn) {
        case 'i':
            vwbPoi[h.id][2].setAttribute('cx', PtoCX(h.bz.i.x).toString());
            vwbPoi[h.id][2].setAttribute('cy', PtoCY(h.bz.i.y).toString());
            break;
        case 'k':
            vwbPoi[h.id][0].setAttribute('cx', PtoCX(h.bz.k.x).toString());
            vwbPoi[h.id][0].setAttribute('cy', PtoCY(h.bz.k.y).toString());
            break;
        case 'o':
            vwPoi[h.id].setAttribute('cx', PtoCX(h.bz.o.x).toString());
            vwPoi[h.id].setAttribute('cy', PtoCY(h.bz.o.y).toString());
            break;
    }
}
function RePathColor(h) {
    var laspt = '';
    for (var i in h.bs) {
        laspt = '#' + h.cs[i].bit;
        paths[h.id][i].setAttribute('stroke', laspt);
        var ci = cololi[h.id][i];
        ci.style.backgroundColor = laspt;
        ci.innerHTML = GetColoName(h, i);
        if (h.cs[i].l > 0.5)
            ci.setAttribute('class', 'cololi');
        else
            ci.setAttribute('class', 'cololi cololib');
    }
    vwbPoi[h.id][2].setAttribute('fill', '#' + h.cs[0].bit);
    vwPoi[h.id].setAttribute('fill', laspt);
}
function RePathOver(h) {
    unlockPoi = undefined;
}
function SetC(id) {
    if (id != setID)
        DeSetC();
    setID = id;
    cosPad.style.width = '' + (document.body.clientWidth * 0.8 + 155) + 'px';
    coGrPad[id][0].classList.add('gcpadedt');
    coGrPad[id][0].setAttribute('onmouseup', 'ip(\'n\');');
    coSets[id].appendChild(coSetPad);
    coloPadTag.setAttribute('style', 'display:none;');
    cosPad.insertBefore(coloPadTag, coGrPad[id][0]);
    coSetPadY = coGrPad[id][0].offsetTop + 45;
    var h = CCC.Harmony.GetFromID(id);
    for (var i in coSetPoi['s']) {
        var v = 1 - h.ss.getForNum(+i);
        coSetPoi['s'][i].setAttribute('y', 224 - v * 213);
        coSetPoi['s'][i].setAttribute('height', v * 213 + 15);
    }
    for (var i in coSetPoi['l']) {
        var v = h.sl.getForNum(+i);
        coSetPoi['l'][i].setAttribute('y', 224 - v * 213);
        coSetPoi['l'][i].setAttribute('height', v * 213 + 15);
    }
}
function DeSetC() {
    if (!setID)
        return;
    cosPad.style.width = '';
    coGrPad[setID][0].classList.remove('gcpadedt');
    coGrPad[setID][0].setAttribute('onmouseup', '');
    coSetPadSave.appendChild(coSetPad);
    setID = undefined;
}
function RemovePath(id) {
    id = id || setID;
    desel();
    var h = CCC.Harmony.GetFromID(id);
    var tp = h.bz.i;
    if (tp.hs)
        tp.RemoveUni(['i', id]);
    tp = h.bz.k;
    if (tp.hs)
        tp.RemoveUni(['k', id]);
    tp = h.bz.o;
    if (tp.hs)
        tp.RemoveUni(['o', id]);
    pathPad.removeChild(pathg[id]);
    delete pathg[id];
    delete paths[id];
    vwPoiPad.removeChild(vwPoi[id]);
    delete vwPoi[id];
    for (var i in vwbPad) {
        vwbPad[i].removeChild(vwbPoi[id][i]);
    }
    delete vwbPoi[id];
    cosPad.removeChild(coGrPad[id][0]);
    coloPadTag.setAttribute('style', '');
    delete coGrPad[id];
    delete cololi[id];
    delete coSets[id];
    CCC.Harmony.Remove(id);
    setID = null;
}
function AddSeg(id) {
    var h = CCC.Harmony.GetFromID(id || setID);
    if (h.dn > 6)
        return;
    var dnd = h.dn;
    h.SetDN(true);
    var pt = document.createElementNS(svgName, 'path');
    pt.setAttribute('stroke', '#' + h.cs[dnd].bit);
    pt.setAttribute('class', 'pth');
    var idn = '' + h.id + '_' + dnd;
    pt.setAttribute('onclick', 'selc("' + h.id + '_' + dnd + '", "");');
    pathg[h.id].appendChild(pt);
    paths[h.id].push(pt);
    for (var i in h.bs)
        paths[h.id][i].setAttribute('d', h.bs[i].ToSVG());
    var ci = document.createElement('li');
    ci.style.backgroundColor = '#' + h.cs[dnd].bit;
    ci.innerHTML = GetColoName(h, dnd);
    ci.setAttribute('onclick', 'selc("' + h.id + '_' + dnd + '", "");');
    if (h.cs[dnd].l > 0.5)
        ci.setAttribute('class', 'cololi');
    else
        ci.setAttribute('class', 'cololi cololib');
    coGrPad[h.id][1].appendChild(ci);
    cololi[h.id][dnd] = ci;
    RePathColor(h);
}
function RedSeg(id) {
    var h = CCC.Harmony.GetFromID(id || setID);
    if (h.dn <= 1)
        return;
    h.SetDN(false);
    var pt = paths[h.id].pop();
    pathg[h.id].removeChild(pt);
    for (var i in h.bs)
        paths[h.id][i].setAttribute('d', h.bs[i].ToSVG());
    var ci = cololi[h.id].pop();
    coGrPad[h.id][1].removeChild(ci);
    RePathColor(h);
}
function MarkColors(id) {
    var h = CCC.Harmony.GetFromID(id || setID);
    var d = h.GetStrId();
    d = d.substring(0, d.length - 1);
    if (coMarkData[d]) {
        var coli = svCoList[d];
        if (!loadKV('#' + d))
            coli.classList.remove('desvcoli');
        save('#' + d, h.dn);
        coli.classList.add('svtip');
        return;
    }
    save('#' + d, h.dn);
    MarkAddTag(d, h.dn);
}
function MarkAddTag(data, dn) {
    coMarkData[data] = dn;
    var h = CCC.Harmony.NewFromStrId(data + 7);
    var cs = h.cs;
    CCC.Harmony.Remove(h.id);
    var coli = document.createElement('div');
    coli.setAttribute('class', 'svcoli');
    coli.addEventListener('animationend', function () {
        coli.classList.remove('svtip');
    });
    svCoList[data] = coli;
    var menu = document.createElement('div');
    menu.setAttribute('class', 'svmenu');
    var sdel = document.createElement('div');
    sdel.setAttribute('class', 'svmenui svdel');
    sdel.setAttribute('onclick', 'MarkDel(\"' + data + '\");');
    menu.appendChild(sdel);
    coli.appendChild(menu);
    var svg = document.createElementNS(svgName, 'svg');
    svg.setAttribute('xmlns', svgName);
    svg.setAttribute('version', '1.1');
    svg.setAttribute('class', 'svcosvg');
    svg.setAttribute('onclick', 'MarkAdd(\"' + data + '\");');
    MarkCrt(svg, cs);
    coli.appendChild(svg);
    svCoPad.appendChild(coli);
}
function MarkCrt(svg, cs) {
    var fp = cs[0].l < cs[2].l ? 1 : -1, hmx = CCC.P2, hl = fp > 0 ? 330 * CCC.pJtoH : 30 * CCC.pJtoH, len = 12;
    for (var i in cs) {
        var co = cs[i], dv1 = 25, dv7 = 17.67767, dt = document.createElementNS(svgName, 'circle');
        dt.setAttribute('class', 'svcosvgdot');
        dt.setAttribute('r', '3');
        dt.setAttribute('fill', '#' + co.bit);
        dt.setAttribute('stroke', '#' + co.bit);
        svg.appendChild(dt);
        switch (i) {
            case '0':
                dt.setAttribute('cx', '' + dv7 * fp);
                dt.setAttribute('cy', '-' + dv7);
                break;
            case '1':
                dt.setAttribute('cx', '' + dv1 * fp);
                dt.setAttribute('cy', '0');
                continue;
            case '2':
                dt.setAttribute('cx', '' + dv7 * fp);
                dt.setAttribute('cy', '' + dv7);
                continue;
            case '3':
                dt.setAttribute('cx', '0');
                dt.setAttribute('cy', '' + dv1);
                i = '1';
                break;
            case '4':
                dt.setAttribute('cx', '' + dv7 * -fp);
                dt.setAttribute('cy', '' + dv7);
                continue;
            case '5':
                dt.setAttribute('cx', '' + dv1 * -fp);
                dt.setAttribute('cy', '0');
                continue;
            case '6':
                dt.setAttribute('cx', '' + dv7 * -fp);
                dt.setAttribute('cy', '-' + dv7);
                i = '2';
                break;
        }
        dt.setAttribute('r', '5');
        var rv = 1 / 3 * hmx, hh = CCC.Rhv(hl + +i * rv, hmx), x = Math.cos(hh) * len, y = Math.sin(hh) * len * fp, s = 'M0 0L' + x + ' ' + y;
        hh = CCC.Rhv(hl + rv * +i + rv * 0.5, hmx);
        x = Math.cos(hh) * len;
        y = Math.sin(hh) * len * fp;
        s += 'L' + x + ' ' + y;
        hh = CCC.Rhv(hl + rv * +i + rv, hmx);
        x = Math.cos(hh) * len;
        y = Math.sin(hh) * len * fp;
        s += 'L' + x + ' ' + y + 'Z';
        var pth = document.createElementNS(svgName, 'path');
        pth.setAttribute('d', s);
        pth.setAttribute('fill', '#' + co.bit);
        svg.appendChild(pth);
    }
}
function MarkAdd(data) {
    var dn = +loadKV('#' + data);
    var h = CCC.Harmony.NewFromStrId(data + dn);
    h.bz.i.FindUniTest('i', 0.0001);
    h.bz.k.FindUniTest('k', 0.0001);
    h.bz.o.FindUniTest('o', 0.0001);
    AddPath(h);
    AddColorBox(h);
}
function MarkDel(data) {
    var xd = '#' + data;
    if (loadKV(xd)) {
        remoKey(xd);
        svCoList[data].classList.add('desvcoli');
    }
    else {
        save(xd, coMarkData[data]);
        svCoList[data].classList.remove('desvcoli');
    }
}
function SetRingColor() {
    for (var i in rins) {
        rinCo[i].Set([CCC.Color.WarpH(+i), 0.8, 0.8], false);
        rins[i].setAttribute('stroke', '#' + rinCo[i].bit);
    }
}
function RefreshColors() {
    CCC.Harmony.ForTag(function (i) { RemovePath(i); });
    CCC.Palette.psyH = Math.random() * CCC.P2;
    CCC.Palette.psyKH = CCC.Palette.psyH + Math.random() * 3 - 1.5;
    CCC.Palette.psyKL = Math.random() * CCC.P2;
    CCC.Page.Start();
}
var ligOn;
function SwiLig() {
    if (ligOn) {
        ligOn = false;
        CCC.Palette.ligRev = true;
        document.body.style.backgroundColor = '#1a1a1a';
        vwbPad[0].setAttribute('fill', 'unset');
        vwbPad[1].setAttribute('stroke', '#000');
        selVwPath.setAttribute('stroke', '#111');
        document.getElementById('swilig').style.backgroundPosition = 'left';
    }
    else {
        ligOn = true;
        CCC.Palette.ligRev = false;
        document.body.style.backgroundColor = '#eee';
        vwbPad[0].setAttribute('fill', '#ccc');
        vwbPad[1].setAttribute('stroke', '#ccc');
        selVwPath.setAttribute('stroke', '#fff');
        document.getElementById('swilig').style.backgroundPosition = 'right';
    }
    save('ligsw', +ligOn);
}
var CoBoxVw = true;
function SwiCoBoxVw() {
    if (CoBoxVw) {
        CoBoxVw = false;
        cosPad.setAttribute('style', 'display:none;');
        document.getElementById('swicobox').style.backgroundPosition = 'bottom';
    }
    else {
        CoBoxVw = true;
        coloPadTag.setAttribute('style', 'display:none;');
        cosPad.setAttribute('style', '');
        document.getElementById('swicobox').style.backgroundPosition = 'top';
    }
}
var CoNameVw = 1;
function SwiCoNameVw() {
    switch (CoNameVw) {
        case 0:
            CoNameVw = 1;
            cosPad.style.lineHeight = '55px';
            for (var i in cololi) {
                var h = CCC.Harmony.GetFromID(i);
                for (var j in cololi[i]) {
                    cololi[i][j].innerHTML = GetColoName(h, j);
                }
            }
            break;
        case 1:
            CoNameVw = 2;
            cosPad.style.lineHeight = '18px';
            for (var i in cololi) {
                var h = CCC.Harmony.GetFromID(i);
                for (var j in cololi[i]) {
                    cololi[i][j].innerHTML = GetColoName(h, j);
                }
            }
            break;
        case 2:
            CoNameVw = 0;
            for (var i in cololi) {
                for (var j in cololi[i]) {
                    cololi[i][j].innerHTML = '';
                }
            }
            break;
    }
    save('conamesw', CoNameVw);
}
function GetColoName(h, cid) {
    var s = '';
    switch (CoNameVw) {
        case 1:
            s = '#' + h.cs[cid].bit;
            break;
        case 2:
            s = 'R:' + h.cs[cid].r + '</br>G:' + h.cs[cid].g + '</br>B:' + h.cs[cid].b;
            break;
    }
    return s;
}
function GrpTagShow(p) {
    gtag.setAttribute('style', 'left:' + Math.round(PtoCX(p[0])).toString() +
        'px;top:' + Math.round(PtoCY(p[1])).toString() + 'px;');
}
function DownloadColor() {
    var cont = GetColorEPS();
    var fn = 'owocolor.eps';
    var bb = new Blob([cont], { type: "text/plain;charset=gb2312" });
    saveAs(bb, fn);
}
function GetColorsSVG() {
    var cont = document.createElement('div');
    var svg = document.createElementNS(svgName, 'svg');
    svg.setAttribute('xmlns', svgName);
    svg.setAttribute('version', '1.1');
    cont.appendChild(svg);
    var dd = '';
    var yn = 0;
    for (var i in CCC.Harmony.all) {
        var h = CCC.Harmony.all[i];
        var g = document.createElementNS(svgName, 'g');
        svg.appendChild(g);
        var xn = 0;
        for (var j = 0; j < h.dn; j++) {
            var c = h.cs[j];
            var rc = document.createElementNS(svgName, 'rect');
            rc.setAttribute('fill', '#' + c.bit);
            rc.setAttribute('x', xn + '');
            rc.setAttribute('y', yn + '');
            rc.setAttribute('width', '95');
            rc.setAttribute('height', '95');
            g.appendChild(rc);
            xn += 100;
        }
        yn += 110;
        dd += h.GetStrId() + ',';
    }
    dd = dd.substring(0, dd.length - 1);
    svg.setAttribute('ddata', dd);
    return cont.innerHTML;
}
function GetColorEPS() {
    var hc = Math.max(CCC.Harmony.Count, 8), yn = 700 / hc, xn = yn * 0.95, n = xn * 0.95, x, y = CCC.Harmony.Count * yn, dd = '', s = '\n/box{moveto ' + n + ' 0 rlineto 0 ' + n + ' rlineto -' + n + ' 0 rlineto closepath}def/fil{setrgbcolor fill}def ';
    for (var i in CCC.Harmony.all) {
        x = 0;
        var h = CCC.Harmony.all[i];
        for (var j = 0; j < h.dn; j++) {
            var c = h.cs[j];
            s += '\nnewpath ' + x + ' ' + y + ' box ' + c.r / 255 + ' ' + c.g / 255 + ' ' + c.b / 255 + ' fil ';
            x += xn;
        }
        y -= yn;
        dd += h.GetStrId() + ',';
    }
    return '%!PS-owo-color1.9:' + dd.substring(0, dd.length - 1) + ';' + s + 'showpage';
}
function ReDataToSVG(data) {
    var ds;
    if (data.substring(0, 14) == '\%!PS-owo-color') {
        ds = data.split(':')[1].split(';')[0];
    }
    else {
        var dm = document.createElement('div');
        dm.innerHTML = data;
        var svg = dm.getElementsByTagName('svg')[0];
        if (!svg)
            return;
        ds = svg.getAttribute('ddata');
    }
    if (!ds)
        return;
    var c = ds.split(',');
    for (var i in c) {
        var h = CCC.Harmony.NewFromStrId(c[i]);
        h.bz.i.FindUniTest('i', 0.0001);
        h.bz.k.FindUniTest('k', 0.0001);
        h.bz.o.FindUniTest('o', 0.0001);
        AddPath(h);
        AddColorBox(h);
    }
}
function UploadSVG(input) {
    var win = window;
    if (win.FileReader) {
        var file = input.files[0];
        var filename = file.name.split(".")[0];
        var reader = new FileReader();
        reader.onload = function () {
            ReDataToSVG(this.result);
        };
        reader.readAsText(file);
    }
    else if (typeof win.ActiveXObject != 'undefined') {
        var xmlDoc;
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = false;
        xmlDoc.load(input.value);
        ReDataToSVG(xmlDoc.xml);
    }
    else if (document.implementation && document.implementation.createDocument) {
        var xmlDoc;
        xmlDoc = document.implementation.createDocument("", "", null);
        xmlDoc.async = false;
        xmlDoc.load(input.value);
        ReDataToSVG(xmlDoc.xml);
    }
    else {
        alert('Upload Error');
    }
}
function save(k, v) {
    if (!localStorage)
        return;
    localStorage.setItem(k, v);
}
function loadKV(k) {
    if (!localStorage)
        return;
    return localStorage.getItem(k);
}
function remoKey(k) {
    if (!localStorage)
        return;
    localStorage.removeItem(k);
}
function LoadPageSTG() {
    if (!localStorage)
        return;
    var ligsw = localStorage.getItem('ligsw');
    if (!(ligsw === undefined || ligsw === null)) {
        ligOn = !+ligsw;
        SwiLig();
    }
    var conamesw = localStorage.getItem('conamesw');
    if (!(conamesw === undefined || conamesw === null)) {
        conamesw--;
        if (conamesw < 0)
            conamesw = 2;
        CoNameVw = conamesw;
        SwiCoNameVw();
    }
    for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k[0] == '#')
            MarkAddTag(k.substring(1), localStorage.getItem(k));
    }
    setTimeout(function () { document.body.setAttribute('class', 'bodytr'); }, 100);
}
function cSTG() {
    if (!localStorage)
        return;
    localStorage.clear();
}
var svgName = "http://www.w3.org/2000/svg", aip, eip, P, selID, padXY, unup, unlockPoi, pathPad, pathg, paths, vwPoiPad, vwPoi, vwbPad, vwbPoi, ctrPoi, selVwPath, gtag, ring, rins, rinCo, rinPoi, rinCtr, rinTag, rinEdg, cosPad, coGrPad, cololi, coloPadTag, setID, coSetPadSave, coSetPad, coSetPadY, coSets, coSetSLPad, coSetPoi, coMarkData, svCoPad, svCoList;
window.onload = function () {
    CCC.Page.Ins();
    P = new Array();
    padXY = [document.getElementById('pad').offsetLeft, 20];
    pathPad = document.getElementById('pths');
    pathg = new Array();
    paths = new Array();
    vwPoiPad = document.getElementById('ctrps');
    vwPoi = new Array();
    vwbPad = new Array();
    vwbPad[0] = document.getElementById('bps');
    vwbPad[1] = document.getElementById('bpsl');
    vwbPad[2] = document.getElementById('bpsi');
    vwbPoi = new Array();
    ctrPoi = new Array();
    ctrPoi['m'] = document.getElementById('ctr_ml');
    ctrPoi['w'] = document.getElementById('ctr_wg');
    ctrPoi['i'] = document.getElementById('ctr_ip');
    ctrPoi['k'] = document.getElementById('ctr_kp');
    ctrPoi['o'] = document.getElementById('ctr_op');
    selVwPath = document.getElementById('sel_pth');
    gtag = document.getElementById('gtag');
    ring = document.getElementById('ring');
    rins = new Array();
    rinCo = new Array();
    rinPoi = new Array();
    rinPoi[0] = [0, 0];
    rinCtr = document.getElementById('rinctr');
    rinTag = document.getElementById('rintag');
    rinEdg = document.getElementById('rinedg');
    for (var i = 0; i < 120; i++) {
        var rin = document.createElementNS(svgName, 'path');
        var h = i * 3 * CCC.pJtoH;
        var pd = CCC.Bezier.ToSvgL([0, 0, Math.cos(h), Math.sin(h)]);
        rin.setAttribute('d', pd);
        rin.setAttribute('class', 'ringl');
        rin.setAttribute('stroke', '#888');
        ring.appendChild(rin);
        var v = i * 3 + 1;
        rins[v] = rin;
        rinCo[v] = new CCC.Color([0, 0, 0], true);
    }
    for (var i = 0; i < 120; i++) {
        var rin = document.createElementNS(svgName, 'circle');
        var h = i * 3 * CCC.pJtoH;
        rin.setAttribute('cx', PtoCX(Math.cos(h)).toString());
        rin.setAttribute('cy', PtoCY(Math.sin(h)).toString());
        if (i % 5) {
            rin.setAttribute('r', '0.5');
            rin.setAttribute('class', 'ringo');
        }
        else {
            rin.setAttribute('r', '1.5');
            rin.setAttribute('class', 'ring0');
        }
        rin.setAttribute('stroke', '#888');
        ring.appendChild(rin);
        var v = i * 3;
        rins[v] = rin;
        rinCo[v] = new CCC.Color([0, 0, 0], true);
    }
    cosPad = document.getElementById('cospad');
    coGrPad = new Array();
    cololi = new Array();
    coloPadTag = document.getElementById('coloPadTag');
    coSets = new Array();
    coSetPadSave = document.createElement('div');
    coSetPadSave.style.display = 'none';
    coSetSLPad = new Array();
    coSetPoi = new Array();
    coSetPoi['l'] = new Array();
    coSetPoi['s'] = new Array();
    SetRingColor();
    InitColoSetPad();
    coMarkData = new Array();
    svCoPad = document.getElementById('svcopad');
    svCoList = new Array();
    CCC.Page.Start();
    LoadPageSTG();
};
document.onselectstart = function (event) { if (P[1] < 540 || setID) {
    event.returnValue = false;
    return false;
} };
window.onmouseup = "getSelection" in window ?
    function () { if (P[1] < 540 || setID)
        window.getSelection().removeAllRanges(); } :
    function () { if (P[1] < 540 || setID)
        document.getSelection().empty(); };
function log(i) { console.log(i); }
