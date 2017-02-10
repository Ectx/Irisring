module CCC {

  // 值引用
  export class Ref<T> {
    v: T;
    constructor(v: T) { this.v = v; }
    private valueOf(): T { return this.v; }
    private toString(): string { return this.v.toString(); }
  }

  // 集合
  class Set<T> {
    private a: T[];
    private n: number;
    constructor() {
      this.a = [];
      this.n = 0;
    }
    Has(id): boolean { return this.a[id] && (this.a[id].valueOf() !== 0); }
    Get(id): T { return this.a[id]; }
    Add(id, obj: T): boolean {
      if (this.Has(id)) return false;
      else {
        this.a[id] = obj;
        this.n++;
        return true;
      }
    }
    Rep(id, obj: T): boolean {
      if (this.Has(id)) {
        this.a[id] = obj;
        return true;
      } else return false;
    }
    AddOrRep(id, obj: T) {
      if (!this.Has(id)) this.n++;
      this.a[id] = obj;
    }
    Remove(id): boolean {
      if (this.Has(id)) {
        delete this.a[id];
        this.n--;
        return true;
      } else return false;
    }
    Count(): number { return this.n; }
    ForAt(f: Function) { for (var i in this.a) f(i); }
  }

  // 颜色
  export class Color {
    r: number; g: number; b: number;
    h: number; s: number; l: number;
    bit: string;
    constructor(v: Array<number>, RGBorHSL: boolean) {
      this.Set(v, RGBorHSL);
    }
    Set(v: Array<number>, RGBorHSL: boolean) {
      if (RGBorHSL) {
        this.SetRGB(v);
        this.SetHSL(Color.RGBtoHSL(v));
      } else {
        this.SetHSL(v);
        this.SetRGB(Color.HSLtoRGB(v));
      }
      if (this.r < 0) this.r = 0;
      if (this.g < 0) this.g = 0;
      if (this.b < 0) this.b = 0;
      this.bit = this.NT16(this.r) + this.NT16(this.g) + this.NT16(this.b);
    }
    private NT16(n: number): string {
      var s = n.toString(16);
      if (!s[1]) s = '0' + s;
      return s.toUpperCase();
    }
    static RGBtoHSL(v: Array<number>): Array<number> {
      var o = new Array(),
        r = v[0], g = v[1], b = v[2],
        Max, Min, Diff, Sum, q;
      if (r > g) { Max = r; Min = g; }
      else { Max = g; Min = r; }
      if (b > Max) Max = b;
      else if (b < Min) Min = b;
      o[2] = Max * p255;
      Diff = Max - Min;
      Sum = Max + Min;
      if (Max == 0) o[1] = 0;
      else o[1] = Diff / Max;
      if (Diff == 0) q = 0;
      else q = 60 / Diff;
      if (Max == r) {
        if (g < b) o[0] = 360 + q * (g - b);
        else o[0] = q * (g - b);
      }
      else if (Max == g) o[0] = 120 + q * (b - r);
      else if (Max == b) o[0] = 240 + q * (r - g);
      else o[0] = 0;
      return o;
    }
    static HSLtoRGB(v: Array<number>): Array<number> {
      var H = v[0], S = v[1], V = v[2],
        r = 0, g = 0, b = 0,
        Max, Mid, Min, q;
      H *= p360;
      Max = Math.round(V * 255);
      Min = Math.round((1.0 - S) * V * 255.0);
      q = (Max - Min) * p255;
      if (H >= 0 && H <= p6)
      { Mid = Math.round(H * q * 1530 + Min); r = Max; g = Mid; b = Min; }
      else if (H <= p3)
      { Mid = Math.round((p6 - H) * q * 1530 + Max); r = Mid; g = Max; b = Min; }
      else if (H <= 0.5)
      { Mid = Math.round((H - p3) * q * 1530 + Min); r = Min; g = Max; b = Mid; }
      else if (H <= p23)
      { Mid = Math.round((0.5 - H) * q * 1530 + Max); r = Min; g = Mid; b = Max; }
      else if (H <= p56)
      { Mid = Math.round((H - p23) * q * 1530 + Min); r = Mid; g = Min; b = Max; }
      else if (H <= 1.0)
      { Mid = Math.round((p56 - H) * q * 1530 + Max); r = Max; g = Min; b = Mid; }
      return [r, g, b];
    }
    // 将坐标空间转为颜色（色轮坐标, 亮度值, 非新建而修改的原型）
    static FromPoi(p: Point, l: number, c?: Color): Color {
      var v = Point.ToHL(p),
        h = v[0] * pHtoJ;
      h = Color.WarpH(h);
      if (c) c.Set([h, v[1], l], false);
      else c = new Color([h, v[1], l], false);
      return c;
    }
    // 扭曲色相空间（色相角）
    static WarpH(h) {
      var o = (h - Palette.rinHL[0]) * p360;
      o = Rhv(o);
      o = Palette.rinBez.poi(o) * 360 + Palette.rinHL[0];
      o = Rhv(o, 360);
      return o;
    }
    SetRGB(v: Array<number>) { this.r = v[0]; this.g = v[1]; this.b = v[2]; }
    SetHSL(v: Array<number>) { this.h = v[0]; this.s = v[1]; this.l = v[2]; }
  }
  export var p3 = 1 / 3, p6 = 1 / 6, p23 = 2 / 3, p56 = 5 / 6, p255 = 1 / 255, p360 = 1 / 360,
    pJtoH = Math.PI / 180, pHtoJ = 180 / Math.PI, P2 = Math.PI * 2;
  export function Rhv(v, max?) {
    max = max || 1;
    while (v > max) v -= max;
    while (v < 0) v += max;
    return v;
  }

  // 完整函数色
  export class Harmony {
    id: number;
    strID: string;
    private static aid = 0;
    static all: Harmony[] = new Array();
    static Count = 0;
    static Remove(id: number) {
      if (Harmony.all[id]) {
        delete Harmony.all[id];
        Harmony.Count--;
      }
    }
    static GetFromID(id): Harmony { return Harmony.all[id]; }
    /**
     * 遍历所有色组: 返回[0:确实返回值,...arg]
     * @param f 对每个色组执行(键, 色组, 传参OBJ): 返回[0:确实返回值,...arg]
     * @param obj 传参OBJ
     */
    static ForTag(f: Function, obj?: Ref<any>): Array<any> {
      for (var i in Harmony.all) {
        var o = f(i, Harmony.all[i], obj);
        if (o && o[0]) return o;
      }
    }
    AddToLib() {
      Harmony.aid++;
      this.id = Harmony.aid;
      Harmony.all[this.id] = this;
      Harmony.Count++;
    }
    // 获取颜色组压缩编码ID
    GetStrId(iss?): string {
      var s = '';
      if (iss) {
        // 短编码
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
      // 长编码
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
      function NT32(n: number): string {
        var s = n.toString(32);
        if (!s[1]) return '0' + s;
        return s;
      }
      return s;
    }
    // 从压缩编码获取色组
    static NewFromStrId(s: string) {
      var i = 0, kx, ky, ix, iy, si, sk, sa, li, lk, la;
      function randmix(mainum, per, maxin?): number {
        var p = per * 0.5;
        var v = mainum / per;
        if (v > 0.001) v += (Math.random() - 0.5) / p;
        return maxin ? Math.min(1, Math.max(0, v)) : v;
      }
      var lh = parseInt(s.substr(i, 2), 32) - 60; i += 2;
      if (s.length == 13) {
        kx = randmix(parseInt(s.substr(i, 1), 36) - 18, 11); i += 1;
        ky = randmix(parseInt(s.substr(i, 1), 36) - 18, 11); i += 1;
        ix = randmix(parseInt(s.substr(i, 1), 36) - 18, 11); i += 1;
        iy = randmix(parseInt(s.substr(i, 1), 36) - 18, 11); i += 1;
        si = randmix(parseInt(s.substr(i, 1), 36), 35, 1); i += 1;
        sk = randmix(parseInt(s.substr(i, 1), 36), 35, 1); i += 1;
        sa = randmix(parseInt(s.substr(i, 1), 36), 35, 1); i += 1;
        li = randmix(parseInt(s.substr(i, 1), 36), 35, 1); i += 1;
        lk = randmix(parseInt(s.substr(i, 1), 36), 35, 1); i += 1;
        la = randmix(parseInt(s.substr(i, 1), 36), 35, 1); i += 1;
      } else if (s.length == 23) {
        kx = (parseInt(s.substr(i, 2), 32) - 500) / 300; i += 2;
        ky = (parseInt(s.substr(i, 2), 32) - 500) / 300; i += 2;
        ix = (parseInt(s.substr(i, 2), 32) - 500) / 300; i += 2;
        iy = (parseInt(s.substr(i, 2), 32) - 500) / 300; i += 2;
        si = parseInt(s.substr(i, 2), 32) * 0.001; i += 2;
        sk = parseInt(s.substr(i, 2), 32) * 0.001; i += 2;
        sa = parseInt(s.substr(i, 2), 32) * 0.001; i += 2;
        li = parseInt(s.substr(i, 2), 32) * 0.001; i += 2;
        lk = parseInt(s.substr(i, 2), 32) * 0.001; i += 2;
        la = parseInt(s.substr(i, 2), 32) * 0.001; i += 2;
      } else return;
      var dn = +s.substr(i, 1);
      var p = new CCC.Point([kx, ky], undefined, true);
      var bs = new CCC.Bezier1D(si, sa, sk, false);
      var bl = new CCC.Bezier1D(li, la, lk, true);
      return new CCC.Harmony(p, undefined, [ix, iy], dn, bs, bl, lh);
    }
    bz: Bezier;             // 主线段
    bs: Array<Bezier>;      // 线段组
    ps: Array<Point>;       // 吸取点
    cs: Array<Color>;       // 函数色组
    dn: number;             // 分段数
    dr: number;             // 分段均分长度
    lh: number;             // 线末端对齐整环值/3（角度）
    ss: Bezier1D;           // 纯度映射曲线
    sl: Bezier1D;           // 纯度到亮度的映射曲线
    // （K点坐标，末端环值弧度，分段数）
    constructor(k: Point, hue: number, ip?: number[], seg?: number, iss?: Bezier1D, isl?: Bezier1D, isj?) {
      this.AddToLib();
      this.lh = isj || Math.round(hue / 3 * pHtoJ);
      if (Palette.OpLock) hue = this.lh * 3 * pJtoH;
      this.dn = seg || Math.round((Math.random() * Math.random() + Math.random() * 0.5) * 4) + 1;
      // 建立
      k.ph = this;
      var ipoi = new Point(ip || [0, 0], this, true);
      this.bz = new Bezier([ipoi, k, new Point([Math.cos(hue), Math.sin(hue)], this, true)]);
      this.ps = new Array();
      this.cs = new Array();
      this.bs = this.bz.Sub(this.dn);
      // 纯度分配
      var minsl = Math.random() * 0.3 + 0.2,
        ksl = minsl + (1 - minsl) * (1 - Math.random() * Math.random());
      this.sl = isl || new Bezier1D(Palette.ligRev ? 1 : minsl, Palette.ligRev ? minsl : 1, ksl, true);
      var dr = 0.5 / (this.dn + 1);
      this.ss = iss || new Bezier1D(dr, 1 - dr, Palette.ligRev ? 0.5 : 0.8, false);
      this.dr = 0.9 / (this.dn - 1);
      this.PSinCS();
    }
    // 更新吸取点和色组
    PSinCS() {
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
    }
    // 修改贝塞尔原点（标准化的点）（或重置设undefin）
    SetBezI(p: Array<number> | Point) {
      if (p) {
        if (typeof p === 'Point') this.bz.i = (p as Point);
        else {
          this.bz.i.x = p[0];
          this.bz.i.y = p[1];
        }
      } else this.bz.i = new Point([0, 0], this, true);
      this.bz.TranSub(this.bs);
    }
    // 修改贝塞尔K点（标准化的点）
    SetBezK(k: Array<number> | Point) {
      if (k) {
        if (typeof k === 'Point') this.bz.k = (k as Point);
        else {
          this.bz.k.x = k[0];
          this.bz.k.y = k[1];
        }
      }
      this.bz.TranSub(this.bs);
    }
    // 修改末端操纵点（弧度）
    SetBezO(h: number) {
      if (Palette.OpLock) {
        h = Math.round(h / 3 * pHtoJ);
        if (this.lh != h) {
          this.lh = h;
          h *= 3 * pJtoH;
        } else return;
      }
      this.bz.o.x = Math.cos(h);
      this.bz.o.y = Math.sin(h);
      this.bz.TranSub(this.bs);
    }
    // 变换控制点O到角度lh
    BezOtoHL() {
      var v = Point.ToHL(this.bz.o),
        h = Math.round(v[0] * pHtoJ / 3);
      this.lh = h;
    }
    // 修改分段数（T:添加 F:减少）
    SetDN(add: boolean) {
      this.dn += add ? 1 : -1;
      this.dr = 0.9 / (this.dn - 1);
      this.bs = this.bz.Sub(this.dn);
      this.PSinCS();
    }
  }

  // 线段（i:起点 o:终点 k:节点）
  export class Bezier {
    i: Point; o: Point; k: Point;
    constructor(Points?: Array<Point>) {
      if (Points) {
        this.i = Points[0];
        this.k = Points[1];
        this.o = Points[2];
      }
    }
    GetTag(k) {
      switch (k) {
        case 'i': return this.i;
        case 'k': return this.k;
        case 'o': return this.o;
      }
    }
    SetTag(k, v: Point) {
      switch (k) {
        case 'i': this.i = v; return;
        case 'k': this.k = v; return;
        case 'o': this.o = v; return;
      }
    }
    // 获取某t段位的点
    Poi(t: number, p?: Point): Point {
      var v, x = 0, y = 0;
      if (this.i.x || this.i.y) {
        v = 1 - t; v *= v;
        x = v * this.i.x;
        y = v * this.i.y;
      }
      v = t * t;
      x += v * this.o.x;
      y += v * this.o.y;
      v = t - v; v += v;
      x += v * this.k.x;
      y += v * this.k.y;
      if (p) { p.x = x; p.y = y; }
      else p = new Point([x, y]);
      return p;
    }
    // 在指定位置提取分段曲线
    Cut(t1: number, t2: number, ip?: Point, op?: Point, bz?: Bezier): Bezier {
      var i = ip || this.Poi(t1),
        o = op || this.Poi(t2),
        k = this.k.Copy(false), ix = k.x, iy = k.y, ox = k.x, oy = k.y,
        b = bz || new Bezier([i, k, o]);
      if (t1) {
        ix = k.x + (this.o.x - k.x) * t1;
        iy = k.y + (this.o.y - k.y) * t1;
      }
      if (t2 < 1) {
        ox = this.i.x + (k.x - this.i.x) * t2;
        oy = this.i.y + (k.y - this.i.y) * t2;
      }
      var area_abc = (i.x - ox) * (iy - oy) - (i.y - oy) * (ix - ox),
        area_abd = (i.x - o.x) * (iy - o.y) - (i.y - o.y) * (ix - o.x),
        area_cda = (ox - i.x) * (o.y - i.y) - (oy - i.y) * (o.x - i.x),
        t = area_cda / (area_abd - area_abc);
      k.x = i.x + t * (ix - i.x);
      k.y = i.y + t * (iy - i.y);
      if (bz) {
        b.i = i;
        b.k = k;
        b.o = o;
      }
      return b;
    }
    // 将主线分为指定段数 返回线段组
    Sub(d: number): Array<Bezier> {
      var ps = new Array<Bezier>();
      if (d < 2) {
        var nb = new Bezier();
        nb.i = this.i.Copy(false);
        nb.k = this.k.Copy(false);
        nb.o = this.o.Copy(false);
        ps[0] = nb;
      } else {
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
    }
    // 适配线段组"ps"到当前主线
    TranSub(ps: Array<Bezier>) {
      if (ps.length < 2) {
        ps[0].i = this.i.Copy(false);
        ps[0].k = this.k.Copy(false);
        ps[0].o = this.o.Copy(false);
      } else {
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
    }
    // 获取SVG
    ToSVG(): string {
      return Bezier.ToSvg3([this.i.x, this.i.y, this.k.x, this.k.y, this.o.x, this.o.y],
        Page.padWdt, Page.padLen);
    }
    // 将曲线3点坐标群转为SVG（规格化的相对坐标, 位移修正, 放大比例, 归档点集）
    static ToSvg3(v: Array<number>, ml, sl): string {
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
    }
    // 将直线坐标群转为SVG
    static ToSvgL(v: Array<number>): string {
      var s = 'M',
        n = v.length >> 1,
        ml = Page.padWdt,
        sl = Page.padLen;
      for (var i = 0; i < n; i++) {
        var j = i << 1;
        s += (ml + v[j] * sl) + ' ';
        j += 1;
        s += (ml - v[j] * sl) + ' L';
      }
      return s.substring(0, s.length - 2);
    }
  }

  // 一维贝塞尔映射
  export class Bezier1D {
    min: number; max: number; is2p: boolean;
    k: number; k1: number; k2: number;
    constructor(min: number, max: number, k: number, is2p: boolean) {
      this.is2p = is2p; this.Set(min, max, k);
    }
    getForNum(n: number) {
      switch (n) {
        case 0: return this.min;
        case 1: return this.k;
        case 2: return this.max;
      }
    }
    setForNum(n: number, v: number) {
      switch (n) {
        case 0: this.Set(v, this.max, this.k); break;
        case 1: this.Set(this.min, this.max, v); break;
        case 2: this.Set(this.min, v, this.k); break;
      }
    }
    poi(t: number): number {
      if (this.is2p) {
        var a = 1 - t, a3 = a * 3;
        a = this.min + t * ((this.k1 - this.min) * a * a3 +
          t * ((this.k2 - this.min) * a3 + (this.max - this.min) * t));
        return Math.min(Math.max(a, 0), 1);
      }
      else return this.min + t * (2 * (1 - t) * (this.k - this.min) + t * (this.max - this.min));
    }
    Copy() { return new Bezier1D(this.min, this.max, this.k, this.is2p); }
    Set(min: number, max: number, k: number) {
      if (min || min === 0) this.min = min;
      if (max || max === 0) this.max = max;
      if (k || k === 0) this.k = k;
      this.k1 = this.k + (this.min - this.k) * (1 - this.k);
      this.k2 = this.k + (this.max - this.k) * this.k;
    }
    Zpower(z: number) {
      z *= 1.5;
      var z1 = 1 / 3, z2 = 2 / 3;
      this.k1 = z1 - z1 * z;
      this.k2 = z2 + (1 - z2) * z;
    }
  }

  // 点
  export class Point {
    private static aid = 0;
    id: number;
    NewId() { Point.aid++; this.id = Point.aid; }

    ph: Harmony;                // 父组件
    hs: Set<Set<Harmony>>;      // 关联控制的色组[i/k/o][色组ID]
    static minDst = 0.03;       // 最小点距
    // 直接检索点后合并（当前操作的k名，检测距离）
    FindUniTest(ik: string, idst?: number): boolean {
      Point.minDst = idst || 0.03;
      var a = this.CheckUni();
      if (a) {
        var p = a[1] as Point,
          s = [], ot = false;
        if (!p.hs) s[p.ph.id] = true;
        else p.hs.ForAt((k) => {
          p.hs.Get(k).ForAt((i) => {
            if (s[i]) { ot = true; return; }
            else s[i] = true;
          });
          if (ot) return;
        });
        if (!this.hs) {
          if (s[this.ph.id]) { ot = true; return; }
          else s[this.ph.id] = true;
        } else this.hs.ForAt((k) => {
          this.hs.Get(k).ForAt((i) => {
            if (s[i]) { ot = true; return; }
            else s[i] = true;
          });
          if (ot) return;
        });
        if (ot) return;
        if (ik != 'o' || ik == a[2] || (p.hs && p.hs.Has('o')))
          p.Union(this, a[2], ik);
        else return;
        return true;
      } else if (Math.abs(this.x) < 0.02 && Math.abs(this.y) < 0.02) {
        this.x = 0; this.y = 0;
        return true;
      }
    }
    // 将点并入（将并入的点，原点k名，并入点k名）
    Union(p: Point, oname: string, iname: string) {
      if (!this.hs) {
        this.hs = new Set<Set<Harmony>>();
        this.hs.Add(oname, new Set<Harmony>());
        this.hs.Get(oname).Add(this.ph.id, this.ph);
        this.ph = undefined;
      }
      if (p.ph) {
        this.hs.Add(iname, new Set<Harmony>());
        this.hs.Get(iname).Add(p.ph.id, p.ph);
        p.ph.bz.SetTag(iname, this);
      } else if (p.hs) {
        this.UniKpoiTest('i', p);
        this.UniKpoiTest('k', p);
        this.UniKpoiTest('o', p);
      }
    }
    // 检测并入过程组件拆分
    private UniKpoiTest(k: string, p: Point) {
      if (p.hs.Has(k)) {
        this.hs.Add(k, new Set<Harmony>());
        var th = p.hs.Get(k);
        th.ForAt((i: number) => {
          var ih = th.Get(i);
          this.hs.Get(k).Add(i, ih);
          ih.bz.SetTag(k, this);
        });
      }
    }
    // 拆离控制点（被拆离点[i/k/o，色组ID]）
    RemoveUni(hn: Array<any>) {
      var p = this.hs.Get(hn[0]),
        ih: Harmony,
        oc = new Ref<number>(0);
      p.Remove(hn[1]);
      if (!p.Count()) this.hs.Remove(hn[0]);
      this.hs.ForAt((i) => {
        var hi = this.hs.Get(i);
        oc.v += hi.Count();
        hi.ForAt((j) => {
          ih = hi.Get(j);
          return;
        });
      });
      if (oc.v < 2) {
        this.hs = undefined;
        this.ph = ih;
      }
    }
    // 检测合并：返回与之碰撞的点[色组，点实例，i/k/o]
    CheckUni(): Array<any> {
      // 检测所有色组
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
    }
    // 检测单元（色组ID，色组，当前点实例）：[返回色组，[i/k/o点距]]
    private CheckOne(id: number, h: Harmony, obj: Ref<Point>): Array<Harmony | number[]> {
      var ov = [obj.v.x, obj.v.y], v = [], n = 0;
      if (h.bz.o.id != obj.v.id)
      { v[0] = Point.Distan(h.bz.o.ToArr(), ov); n++; }
      if (h.bz.i.id != obj.v.id)
      { v[1] = Point.Distan(h.bz.i.ToArr(), ov); n++; }
      if (h.bz.k.id != obj.v.id)
      { v[2] = Point.Distan(h.bz.k.ToArr(), ov); n++; }
      if (v[0] > Point.minDst) { delete v[0]; n--; }
      if (v[1] > Point.minDst) { delete v[1]; n--; }
      if (v[2] > Point.minDst) { delete v[2]; n--; }
      if (n > 0) return [h, v];
      else return undefined;
    }
    // 计算点距离
    private static Distan(a: Array<number>, b: Array<number>): number {
      return Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]));
    }

    x: number; y: number;
    // 创建点实例
    constructor(p: Array<number>, h?: Harmony, isReal?: boolean) {
      if (isReal) {
        Point.aid++;
        this.id = Point.aid;
      }
      if (p) { this.x = p[0]; this.y = p[1]; }
      else { this.x = this.y = 0; }
      this.ph = h;
    }
    // 赋值
    Set(p: Point) { this.x = p.x; this.y = p.y; }
    // 复制
    Copy(isReal: boolean): Point { return new Point([this.x, this.y], this.ph, isReal); }
    // 复制为数组
    ToArr(): Array<number> { return [this.x, this.y]; }
    // 获取点的角度和长度
    static ToHL(p: Point): Array<number> {
      var l = p.GetLenth(),
        h = Math.acos(p.x / l) || 0;
      if (p.y < 0) h = P2 - h;
      return [h, l];
    }
    // 获取向量长度
    static AToL(p: Array<number>): number { return Math.sqrt(p[0] * p[0] + p[1] * p[1]); }
    // 获取向量的角度和长度
    static AToHL(p: Array<number>): Array<number> {
      var l = Math.sqrt(p[0] * p[0] + p[1] * p[1]),
        h = Math.acos(p[0] / l) || 0;
      if (p[1] < 0) h = P2 - h;
      return [h, l];
    }
    // 获取点的长度
    GetLenth(): number { return Math.sqrt(this.x * this.x + this.y * this.y); }
  }

  // 调色盘
  export class Palette {
    static cenHam: Harmony[];   // 中心锁定色组
    static psyH: number;        // 趋势边界
    static psyKH: number;       // 趋势K点环值
    static psyKL: number;       // 趋势K点升值
    static OpLock: boolean;     // 是否O点对齐
    static ligRev: boolean;     // 是否反转随机生成亮度
    static rinHL: number[];     // 参照环控制角和长度
    static rinBez: Bezier1D;    // 参考环变换曲线
  }

  // 页面
  export class Page {
    static padLen = 150;            // 轴点到色轮的长度
    static padLP = 1 / Page.padLen;
    static padEdg = 230;            // 轴点到边界的长度
    static padWdt = 250;            // 轴点到面板框的长度
    static padESQ = Page.padEdg * Page.padEdg;
    static padEpL = Page.padEdg / Page.padLen;
    // 初始化数据
    static Ins() {
      Page.RandPaleDef();
      Palette.OpLock = true;
      Palette.ligRev = !+localStorage.getItem('ligsw');
      Palette.rinHL = [0, 0];
      Palette.rinBez = new Bezier1D(0, 1, 0.5, true);
      Palette.rinBez.k1 = 0.15;
      Palette.rinBez.k2 = 0.5;
    }
    // 随机调色盘初始值
    static RandPaleDef() {
      Palette.psyH = Math.random() * P2;
      Palette.psyKH = Palette.psyH + Math.random() * 3 - 1.5;
      Palette.psyKL = Math.random() * P2;
    }
    // 开始渲染
    static Start(data?: string[]) {
      if (data && data.length) {
        // 根据数据建立色群
        for (var d in data) {
          var h = CCC.Harmony.NewFromStrId(data[d]);
          if (!h) continue;
          h.bz.i.FindUniTest('i', 0.0001);
          h.bz.k.FindUniTest('k', 0.0001);
          h.bz.o.FindUniTest('o', 0.0001);
          AddPath(h);
          AddColorBox(h);
        }
      } else {
        // 随机建立色群
        var n = Math.round(Math.random() * 3 + Math.random() * 2 + Math.random() * Math.random() + 1);
        for (var i = 0; i < n; i++) {
          var h = Page.AddBez();
          AddPath(h);
          AddColorBox(h);
        }
      }
      RefreshUrl();
    }
    // 添加随机色组 返回整体
    static AddBez(): Harmony {
      var h = Palette.psyH,
        kh = Palette.psyKH,
        ofstKL = Math.sin(Palette.psyKL),
        ustKL = Math.abs(ofstKL),
        rKL = 1 - Math.random() * Math.random(),
        tL = ustKL * rKL * 0.6 + 0.3,
        x = Math.cos(kh) * tL,
        y = Math.sin(kh) * tL,
        p = new Point([x, y], undefined, true);
      Palette.psyH += ofstKL;
      Palette.psyKH += Math.random();
      Palette.psyKL += Math.random() * Math.random();
      Palette.psyH = Rhv(Palette.psyH, P2);
      var oh = new Harmony(p, h);
      oh.bz.i.FindUniTest('i', 0.0001);
      return oh;
    }
    // 修改色组曲线
    static ChangeBez(id, p, x, y) {
      var h = Harmony.GetFromID(id),
        a = h.bz.GetTag(p);
      switch (p) {
        case 'i': h.SetBezI([x, y]); break;
        case 'k': h.SetBezK([x, y]); break;
        case 'o': h.SetBezO(x); break;
      }
      if (a.hs) Page.PoiSetAllBez(a);
      else {
        h.PSinCS();
        RePathBez(h, p);
        RePathColor(h);
      }
    }
    // 修改色组结束（色组ID，k名）
    static ChangeBezOver(id, pn) {
      var h = Harmony.GetFromID(id),
        p = h.bz.GetTag(pn),
        hsFd = p.FindUniTest(pn);
      if (hsFd) {
        p = h.bz.GetTag(pn);
        if (p.hs) Page.PoiSetAllBez(p, true);
        else {
          h.PSinCS();
          RePathBez(h, pn);
          RePathColor(h);
        }
        GrpTagShow(p.ToArr());
      }
      RePathOver(h, pn);
      // 遍历点结束调整
      if (p.hs) {
        var aid = [];
        p.hs.ForAt((i) => {
          var hid = p.hs.Get(i);
          hid.ForAt((j) => {
            if (!aid[j]) {
              var ih = hid.Get(j);
              if (i == 'o') ih.BezOtoHL();
              ReColorOver(ih, 'g' + i);
              aid[j] = true;
            }
          });
        });
      }
      RefreshUrl();
    }
    // 设置点下的所有关联色组到面板
    static PoiSetAllBez(a: Point, isover?) {
      var aid = [];
      a.hs.ForAt((i) => {
        var hid = a.hs.Get(i);
        hid.ForAt((j) => {
          if (!aid[j]) {
            var ih = hid.Get(j);
            ih.bz.TranSub(ih.bs);
            ih.PSinCS();
            RePathBez(ih, i);
            RePathColor(ih);
            if (isover) ReColorOver(ih, 'g' + i);
            aid[j] = true;
          }
        });
      });
    }
  }
}

function ip(v: string) {
  PEditOver();
  if (v == 'n') { unup = true; return; }
  if (aip) v = 'u';
  var e = e || window.event,
    isIKO: boolean;
  switch (v[0]) {
    case 'u':
      // 释放
      if (!aip) {
        desel();
        return;
      }
      up(aip);
      aip = undefined;
      return;
    case 'i': case 'k': case 'o':
      isIKO = true;
      break;
  }
  if (isIKO) {
    // 按下引力点的情况 设定标记和鼠标相对点的位置
    aip = new Array();
    aip[0] = v[0];
    aip[1] = P[0] - padXY[0] - parseFloat((ctrPoi[v[0]] as Element).getAttribute('cx'));
    aip[2] = P[1] - padXY[1] - parseFloat((ctrPoi[v[0]] as Element).getAttribute('cy'));
    aip[3] = v[1];
  }
}

function mv(e) {
  if (!P) return;
  var e = e || window.event;
  P[0] = e.pageX || e.offsetX;
  P[1] = e.pageY || e.offsetY;
  if (eip) PEdit();
  else if (aip) {
    switch (aip[0]) {
      // 移动曲线操纵点
      case 'i': case 'k': case 'o':
        if (!unlockPoi) RePathBegin();
        var X = MouseCX(aip[1]), Y = MouseCY(aip[2]), L = X * X + Y * Y;
        if (aip[0] !== 'o') {
          if (L < CCC.Page.padESQ) { X *= CCC.Page.padLP; Y *= CCC.Page.padLP; }
          else {
            X /= Math.sqrt(L);
            L = Math.sin(Math.acos(X)) * CCC.Page.padEpL;
            Y = Y > 0 ? L : -L; X *= CCC.Page.padEpL;
          }
          CCC.Page.ChangeBez(selID[0], aip[0], X, Y);
        } else {
          X /= Math.sqrt(L);
          L = Y > 0 ? Math.acos(X) : -Math.acos(X);
          CCC.Page.ChangeBez(selID[0], aip[0], L, undefined);
        }
        return;
    }
  }
}

function up(a: Array<any>) {
  switch (a[0]) {
    // 释放曲线操纵点
    case 'i': case 'k': case 'o':
      CCC.Page.ChangeBezOver(selID[0], a[0]);
      return;
  }
}

function toNor(v: any[]) {
  switch (v[0]) {
    case 'i':
      CCC.Page.ChangeBez('i', v[1], 0, 0);
      break;
  }
}

// 选择色组（色组id_色位，k名）
function selc(id, pname) {
  var sid = id.toString().split('_');
  if (selID && selID[0] != sid[0]) desel();
  var h: CCC.Harmony = CCC.Harmony.GetFromID(sid[0]);
  if (!h) return;
  if (pname && h.bz.GetTag(pname).hs) {
    // 选择点组
    ctrPoi[pname].setAttribute('cx', PtoCX(h.bz.GetTag(pname).x).toString());
    ctrPoi[pname].setAttribute('cy', PtoCY(h.bz.GetTag(pname).y).toString());
    selID = sid;
    ip(pname + 'g');
  } else {
    // 点亮曲线
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
    // 点亮色块
    coGrPad[sid[0]][0].classList.add('gcpada');
    // 选择单点
    selID = sid;
    if (pname) ip(pname);
  }
}
// 取消选择
function desel() {
  if (unup) { unup = false; return; }
  if (!selID) return;
  DeSetC();
  selVwPath.setAttribute('stroke-width', '0');
  ctrPoi['i'].setAttribute('style', 'display:none;');
  ctrPoi['k'].setAttribute('style', 'display:none;');
  ctrPoi['o'].setAttribute('style', 'display:none;');
  vwbPoi[selID[0]][1].setAttribute('stroke', 'inherit');
  coGrPad[selID[0]][0].classList.remove('gcpada');
  selID = undefined;
}
// 添加色组
function addColors() {
  var h = CCC.Page.AddBez();
  AddPath(h);
  AddColorBox(h);
  RefreshUrl();
  selc(h.id, '');
}

// 设置色轮左边距 <窗口大小变化时>
function PtoCX(n: number) { return CCC.Page.padWdt + n * CCC.Page.padLen; }
function PtoCY(n: number) { return CCC.Page.padWdt - n * CCC.Page.padLen; }
function MouseCX(ofst: number) { return P[0] - padXY[0] - CCC.Page.padWdt - ofst; }
function MouseCY(ofst: number) { return -(P[1] - padXY[1] - CCC.Page.padWdt - ofst); }
function MouseCPX(ofst: number) { return MouseCX(ofst) * CCC.Page.padLP; }
function MouseCPY(ofst: number) { return MouseCY(ofst) * CCC.Page.padLP; }
function MouseCHL(ofst: number[]) { return CCC.Point.AToHL([MouseCX(ofst[0]), MouseCY(ofst[1])]); }
function setPadXY() { padXY[0] = document.getElementById('pad').offsetLeft; }

// 添加色组面板
function AddColorBox(h: CCC.Harmony) {
  var cos = document.createElement('div');
  cos.id = 'gcp_' + h.id;
  cos.setAttribute('class', 'gcpad');
  cos.setAttribute('onclick', 'selc("' + h.id + '", "");');
  cosPad.insertBefore(cos, cosPad.lastChild.previousSibling);
  coGrPad[h.id] = new Array();
  coGrPad[h.id][0] = cos;
  cololi[h.id] = new Array();
  // 色组菜单
  var comenu = document.createElement('div');
  comenu.setAttribute('class', 'comenu');
  comenu.setAttribute('title', 'Adjust\n调整');
  comenu.setAttribute('onclick', 'SetC(' + h.id + ');');
  cos.appendChild(comenu);
  var comenui = document.createElement('div');
  comenui.setAttribute('class', 'comenui');
  comenu.appendChild(comenui);
  // 色组编辑器
  var coseti = document.createElement('div');
  coseti.setAttribute('class', 'cosetpad');
  cos.appendChild(coseti);
  coSets[h.id] = coseti;
  // 色组版块
  var copv = document.createElement('ol');
  copv.setAttribute('class', 'colovw');
  cos.appendChild(copv);
  coGrPad[h.id][1] = copv;
  // 色单元
  for (var i in h.bs) {
    var ci = document.createElement('li');
    ci.style.backgroundColor = '#' + h.cs[i].bit;
    ci.innerHTML = GetColoName(h, i);
    ci.setAttribute('onclick', 'selc("' + h.id + '_' + i + '", "");');
    if (h.cs[i].l > 0.5) ci.setAttribute('class', 'cololi');
    else ci.setAttribute('class', 'cololi cololib');
    copv.appendChild(ci);
    cololi[h.id][i] = ci;
  }
  // 标记颜色添加记录
  ReColorOver(h, 'c');
}

// 初始化通用色相编辑器
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
  codel.setAttribute('onclick', 'remoPath()');
  cosetbts.appendChild(codel);
  var coeditpad = document.createElement('div');
  coeditpad.setAttribute('class', 'coeditpad');
  coSetPad.appendChild(coeditpad);
  coeditpad.appendChild(GetColoEditor(0));
  coeditpad.appendChild(GetColoEditor(1));
}

// 创建色相编辑器
function GetColoEditor(L): HTMLElement {
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
  // 边框
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
  // 控制点
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

// 开始编辑色相
function PEditBegin(s: string) {
  eip = s.split('');
  var h = CCC.Harmony.GetFromID(setID);
  var v;
  if (eip[0] == 's') v = 1 - h.ss.getForNum(+eip[1]);
  else v = h.sl.getForNum(+eip[1]);
  eip[2] = P[1] + v * 213;
}
// 编辑色相过程
function PEdit() {
  if (!eip) return;
  var iss = eip[0] == 's';
  var h = CCC.Harmony.GetFromID(setID);
  var sl: CCC.Bezier1D;
  if (iss) sl = h.ss;
  else sl = h.sl;
  var v = (eip[2] - P[1]) / 213;
  if (v > 1) v = 1;
  else if (v < 0) v = 0;
  sl.setForNum(+eip[1], iss ? 1 - v : v);
  var rc = coSetPoi[eip[0]][eip[1]];
  rc.setAttribute('y', (224 - v * 213).toString());
  rc.setAttribute('height', (v * 213 + 15).toString());
  h.PSinCS();
  RePathColor(h);
}
// 编辑色相结束
function PEditOver() {
  if (!eip) return;
  var h = CCC.Harmony.GetFromID(setID), n = eip[0];
  if (n == 's') n += 2 - +eip[1];
  else n += eip[1];
  ReColorOver(h, n);
  RefreshUrl();
  eip = undefined;
}

// 添加色组路径
function AddPath(h: CCC.Harmony) {
  var pn = h.id.toString(),
    g = document.createElementNS(svgName, 'g'),
    laspt: string;
  g.id = 'pn_' + pn;
  g.setAttribute('fill', 'none');
  pathg[h.id] = g;
  pathPad.appendChild(g);
  paths[h.id] = new Array();
  // 分段彩线
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
  // 末端顶点
  var po = document.createElementNS(svgName, 'circle');
  po.setAttribute('cx', PtoCX(h.bz.o.x).toString());
  po.setAttribute('cy', PtoCY(h.bz.o.y).toString());
  po.setAttribute('r', '7');
  po.setAttribute('fill', laspt);
  po.setAttribute('class', 'ctrp_cs');
  po.setAttribute('onmousedown', 'selc(' + h.id + ', "o");');
  vwPoiPad.appendChild(po);
  vwPoi[h.id] = po;
  // I原点
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
  // 背景黑线
  var bl = document.createElementNS(svgName, 'path');
  bl.setAttribute('d', CCC.Bezier.ToSvgL([h.bz.i.x, h.bz.i.y, h.bz.k.x, h.bz.k.y, h.bz.o.x, h.bz.o.y]));
  bl.setAttribute('fill', 'none');
  bl.setAttribute('stroke', 'inherit');
  bl.setAttribute('stroke-width', '1');
  bl.setAttribute('class', 'sel_pbl');
  vwbPad[1].appendChild(bl);
  vwbPoi[h.id][1] = bl;
  // 背景K点
  var bp = document.createElementNS(svgName, 'circle');
  bp.setAttribute('cx', PtoCX(h.bz.k.x).toString());
  bp.setAttribute('cy', PtoCY(h.bz.k.y).toString());
  bp.setAttribute('r', '4');
  bp.setAttribute('class', 'sel_pbp');
  bp.setAttribute('onmousedown', 'selc(' + h.id + ', "k");');
  vwbPad[0].appendChild(bp);
  vwbPoi[h.id][0] = bp;
}
// 修改色组路径开始
function RePathBegin() {
  var h = CCC.Harmony.GetFromID(selID[0]),
    tp = h.bz.GetTag(aip[0]);
  gtag.setAttribute('style', 'display:none;');
  if (aip[3] == 'g') {
    unlockPoi = tp;
    tp.NewId();
  } else {
    if (tp.hs) tp.RemoveUni([aip[0], h.id]);
    tp.NewId();
    unlockPoi = new CCC.Point(tp.ToArr(), h, true);
    h.bz.SetTag(aip[0], unlockPoi);
  }
}
// 修改色组路径（过程）
function RePathBez(h: CCC.Harmony, pn: string) {
  for (var i in h.bs) paths[h.id][i].setAttribute('d', h.bs[i].ToSVG());
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
// 修改色组颜色（过程）
function RePathColor(h: CCC.Harmony) {
  var laspt = '';
  for (var i in h.bs) {
    // 修改彩条分段颜色
    laspt = '#' + h.cs[i].bit;
    paths[h.id][i].setAttribute('stroke', laspt);
    // 修改色块颜色
    var ci = cololi[h.id][i];
    ci.style.backgroundColor = laspt;
    ci.innerHTML = GetColoName(h, i);
    if (h.cs[i].l > 0.5) ci.setAttribute('class', 'cololi');
    else ci.setAttribute('class', 'cololi cololib');
  }
  // 修改节点颜色
  vwbPoi[h.id][2].setAttribute('fill', '#' + h.cs[0].bit);
  vwPoi[h.id].setAttribute('fill', laspt);
}
// 修改色组路径结束
function RePathOver(h: CCC.Harmony, pn) {
  unlockPoi = undefined;
  ReColorOver(h, pn);
}

/** 修改色组结束<色组, 操作 [iko]:曲线(g?) s|l[012]:色相 a|s:增减分段 c:创建 d:删除>（最终） */
function ReColorOver(h: CCC.Harmony, cnt: string) {
  h.strID = h.GetStrId();
}
// 刷新地址栏
function RefreshUrl() {
  var url = '?irco=';
  for (var i in CCC.Harmony.all) {
    var ha: CCC.Harmony = CCC.Harmony.all[i];
    url += ha.strID + ',';
  }
  url = url.substring(0, url.length - 1);
  if (window.location.search != url) window.history.pushState({}, undefined, url);
}

// 开始设置色组详细
function SetC(id) {
  if (id != setID) DeSetC();
  setID = id;
  cosPad.style.width = '' + (document.body.clientWidth * 0.8 + 155) + 'px';
  coGrPad[id][0].classList.add('gcpadedt');
  coGrPad[id][0].setAttribute('onmouseup', 'ip(\'n\');');
  coSets[id].appendChild(coSetPad);
  coloPadTag.setAttribute('style', 'display:none;');
  cosPad.insertBefore(coloPadTag, coGrPad[id][0]);
  // 同步色相控制点位置
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
// 结束设置
function DeSetC() {
  if (!setID) return;
  cosPad.style.width = '';
  coGrPad[setID][0].classList.remove('gcpadedt');
  coGrPad[setID][0].setAttribute('onmouseup', '');
  coSetPadSave.appendChild(coSetPad);
  setID = undefined;
}

// 移除路径按钮
function remoPath() {
  RemovePath();
  RefreshUrl();
}
// 移除色组路径
function RemovePath(id?) {
  id = id || setID;
  desel();
  var h = CCC.Harmony.GetFromID(id);
  var tp = h.bz.i;
  if (tp.hs) tp.RemoveUni(['i', id]);
  tp = h.bz.k;
  if (tp.hs) tp.RemoveUni(['k', id]);
  tp = h.bz.o;
  if (tp.hs) tp.RemoveUni(['o', id]);
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
  ReColorOver(h, 'd');
}

// 添加分段
function AddSeg(id?) {
  var h = CCC.Harmony.GetFromID(id || setID);
  if (h.dn > 6) return;
  var dnd = h.dn;
  h.SetDN(true);
  // 添加路径实体
  var pt = document.createElementNS(svgName, 'path');
  pt.setAttribute('stroke', '#' + h.cs[dnd].bit);
  pt.setAttribute('class', 'pth');
  var idn = '' + h.id + '_' + dnd;
  pt.setAttribute('onclick', 'selc("' + h.id + '_' + dnd + '", "");');
  pathg[h.id].appendChild(pt);
  paths[h.id].push(pt);
  for (var i in h.bs) paths[h.id][i].setAttribute('d', h.bs[i].ToSVG());
  // 添加色块实体
  var ci = document.createElement('li');
  ci.style.backgroundColor = '#' + h.cs[dnd].bit;
  ci.innerHTML = GetColoName(h, dnd);
  ci.setAttribute('onclick', 'selc("' + h.id + '_' + dnd + '", "");');
  if (h.cs[dnd].l > 0.5) ci.setAttribute('class', 'cololi');
  else ci.setAttribute('class', 'cololi cololib');
  coGrPad[h.id][1].appendChild(ci);
  cololi[h.id][dnd] = ci;
  RePathColor(h);
  ReColorOver(h, 'a');
  RefreshUrl();
}
// 减少分段
function RedSeg(id?) {
  var h = CCC.Harmony.GetFromID(id || setID);
  if (h.dn <= 1) return;
  h.SetDN(false);
  // 移除路径段
  var pt = paths[h.id].pop();
  pathg[h.id].removeChild(pt);
  for (var i in h.bs) paths[h.id][i].setAttribute('d', h.bs[i].ToSVG());
  // 移除色块
  var ci = cololi[h.id].pop();
  coGrPad[h.id][1].removeChild(ci);
  RePathColor(h);
  ReColorOver(h, 's');
  RefreshUrl();
}

// 标记色组
function MarkColors(id?) {
  var h = CCC.Harmony.GetFromID(id || setID);
  var d = h.strID;
  d = d.substring(0, d.length - 1);
  // 是否已存在
  if (coMarkData[d]) {
    var coli: HTMLElement = svCoList[d];
    // 是否被预消除
    if (!loadKV('#' + d)) coli.classList.remove('desvcoli');
    save('#' + d, h.dn);
    // 添加已存在标签提示动画
    coli.classList.add('svtip');
    // 结束返回
    return;
  }
  save('#' + d, h.dn);
  MarkAddTag(d, h.dn);
}
// 添加标记
function MarkAddTag(data: string, dn: number) {
  coMarkData[data] = dn;
  var h = CCC.Harmony.NewFromStrId(data + 7);
  var cs = h.cs;
  CCC.Harmony.Remove(h.id);
  // 开始创建马克标记
  var coli = document.createElement('div');
  coli.setAttribute('class', 'svcoli');
  coli.addEventListener('animationend', function () {
    coli.classList.remove('svtip');
  });
  svCoList[data] = coli;
  // 控制模块
  var menu = document.createElement('div');
  menu.setAttribute('class', 'svmenu');
  var sdel = document.createElement('div');
  sdel.setAttribute('class', 'svmenui svdel');
  sdel.setAttribute('onclick', 'MarkDel(\"' + data + '\");');
  menu.appendChild(sdel);
  coli.appendChild(menu);
  // 显示模块
  var svg = document.createElementNS(svgName, 'svg');
  svg.setAttribute('xmlns', svgName);
  svg.setAttribute('version', '1.1');
  svg.setAttribute('class', 'svcosvg');
  MarkCrt(svg, cs, data);
  coli.appendChild(svg);
  svCoPad.appendChild(coli);
}
// 生成标记体
function MarkCrt(svg: Element, cs: CCC.Color[], data) {
  var fp = cs[0].l < cs[2].l ? 1 : -1, rech = 35, ds = fp > 0 ? 8 : 0,
    hmx = CCC.P2, hl = fp > 0 ? 330 * CCC.pJtoH : 30 * CCC.pJtoH, len = 12;
  for (var i in cs) {
    var co = cs[i],
      dv1 = 25, dv7 = 17.67767,
      dt = document.createElementNS(svgName, 'circle');
    if (fp > 0) ds--; else ds++;
    // 设置彩色点
    dt.setAttribute('class', 'svcosvgdot');
    dt.setAttribute('r', '3');
    dt.setAttribute('fill', '#' + co.bit);
    dt.setAttribute('stroke', '#' + co.bit);
    svg.appendChild(dt);
    switch (i) {
      case '0':
        dt.setAttribute('cx', '' + (dv7 * fp + rech));
        dt.setAttribute('cy', '' + (-dv7 + rech));
        dt.setAttribute('onclick', 'MarkAdd(\'' + data + '\',' + ds + ');');
        break;
      case '1':
        dt.setAttribute('cx', '' + (dv1 * fp + rech));
        dt.setAttribute('cy', '' + rech);
        dt.setAttribute('onclick', 'MarkAdd(\'' + data + '\',' + ds + ');');
        continue;
      case '2':
        dt.setAttribute('cx', '' + (dv7 * fp + rech));
        dt.setAttribute('cy', '' + (dv7 + rech));
        dt.setAttribute('onclick', 'MarkAdd(\'' + data + '\',' + ds + ');');
        continue;
      case '3':
        dt.setAttribute('cx', '' + rech);
        dt.setAttribute('cy', '' + (dv1 + rech));
        i = '1';
        dt.setAttribute('onclick', 'MarkAdd(\'' + data + '\',' + ds + ');');
        break;
      case '4':
        dt.setAttribute('cx', '' + (dv7 * -fp + rech));
        dt.setAttribute('cy', '' + (dv7 + rech));
        dt.setAttribute('onclick', 'MarkAdd(\'' + data + '\',' + ds + ');');
        continue;
      case '5':
        dt.setAttribute('cx', '' + (dv1 * -fp + rech));
        dt.setAttribute('cy', '' + rech);
        dt.setAttribute('onclick', 'MarkAdd(\'' + data + '\',' + ds + ');');
        continue;
      case '6':
        dt.setAttribute('cx', '' + (dv7 * -fp + rech));
        dt.setAttribute('cy', '' + (-dv7 + rech));
        i = '2';
        dt.setAttribute('onclick', 'MarkAdd(\'' + data + '\',' + ds + ');');
        break;
    }
    dt.setAttribute('r', '4');
    // 设置彩色方块
    var rv = 1 / 3 * hmx,
      hh = CCC.Rhv(hl + +i * rv, hmx),
      x = Math.cos(hh) * len + rech,
      y = Math.sin(hh) * len * fp + rech,
      s = 'M' + rech + ' ' + rech + 'L' + x + ' ' + y;
    hh = CCC.Rhv(hl + rv * +i + rv * 0.5, hmx);
    x = Math.cos(hh) * len + rech;
    y = Math.sin(hh) * len * fp + rech;
    s += 'L' + x + ' ' + y;
    hh = CCC.Rhv(hl + rv * +i + rv, hmx);
    x = Math.cos(hh) * len + rech;
    y = Math.sin(hh) * len * fp + rech;
    s += 'L' + x + ' ' + y + 'Z';
    var pth = document.createElementNS(svgName, 'path');
    pth.setAttribute('d', s);
    pth.setAttribute('fill', '#' + co.bit);
    pth.setAttribute('onclick', 'MarkAdd(\"' + data + '\");');
    svg.appendChild(pth);
  }
}
// 载入标记到色板
function MarkAdd(data: string, dn?: number) {
  dn = dn || +loadKV('#' + data);
  var h = CCC.Harmony.NewFromStrId(data + dn);
  h.bz.i.FindUniTest('i', 0.0001);
  h.bz.k.FindUniTest('k', 0.0001);
  h.bz.o.FindUniTest('o', 0.0001);
  AddPath(h);
  AddColorBox(h);
  RefreshUrl();
}
// 删除标记/恢复标记
function MarkDel(data: string) {
  var xd = '#' + data;
  if (loadKV(xd)) {
    remoKey(xd);
    svCoList[data].classList.add('desvcoli');
  } else {
    save(xd, coMarkData[data]);
    svCoList[data].classList.remove('desvcoli');
  }
}

// 设置参照环颜色
function SetRingColor() {
  for (var i in rins) {
    rinCo[i].Set([CCC.Color.WarpH(+i), 0.8, 0.8], false);
    rins[i].setAttribute('stroke', '#' + rinCo[i].bit);
  }
}

// 清空色板
function ClearColors() {
  CCC.Harmony.ForTag((i) => { RemovePath(i); });
  RefreshUrl();
}
// 随机重建颜色群
function RefreshColors() {
  CCC.Harmony.ForTag((i) => { RemovePath(i); });
  CCC.Page.RandPaleDef();
  CCC.Page.Start();
}

// 开关灯 1开 2关
var ligOn: number;
function SwiLig() {
  var pathadder = document.getElementById('addpath');
  pathadder.classList.add('swiadd');
  if (ligOn == 1) {
    ligOn = 2;
    CCC.Palette.ligRev = true;
    document.body.style.backgroundColor = '#1a1a1a';
    vwbPad[0].setAttribute('fill', 'unset');
    vwbPad[1].setAttribute('stroke', '#000');
    selVwPath.setAttribute('stroke', '#111');
    document.getElementById('swilig').style.backgroundPosition = 'left';
    pathadder.title = 'Add Dark Colors\n添加暗色系';
  } else {
    ligOn = 1;
    CCC.Palette.ligRev = false;
    document.body.style.backgroundColor = '#eee';
    vwbPad[0].setAttribute('fill', '#ccc');
    vwbPad[1].setAttribute('stroke', '#ccc');
    selVwPath.setAttribute('stroke', '#fff');
    document.getElementById('swilig').style.backgroundPosition = 'right';
    pathadder.title = 'Add Bright Colors\n添加亮色系';
  }
  save('ligsw', +ligOn);
}

// 开关显示色板
var CoBoxVw: boolean = true;
function SwiCoBoxVw() {
  if (CoBoxVw) {
    CoBoxVw = false;
    cosPad.setAttribute('style', 'display:none;');
    document.getElementById('swicobox').style.backgroundPosition = 'bottom';
  } else {
    CoBoxVw = true;
    coloPadTag.setAttribute('style', 'display:none;');
    cosPad.setAttribute('style', '');
    document.getElementById('swicobox').style.backgroundPosition = 'top';
  }
}

// 开关切换色块简称 1:不显示 2:比特 3:RGB
var CoNameVw: number = 2;
function SwiCoNameVw() {
  switch (CoNameVw) {
    case 1:
      CoNameVw = 2;
      cosPad.style.lineHeight = '55px';
      for (var i in cololi) {
        var h = CCC.Harmony.GetFromID(i);
        for (var j in cololi[i]) {
          cololi[i][j].innerHTML = GetColoName(h, j);
        }
      }
      break;
    case 2:
      CoNameVw = 3;
      cosPad.style.lineHeight = '18px';
      for (var i in cololi) {
        var h = CCC.Harmony.GetFromID(i);
        for (var j in cololi[i]) {
          cololi[i][j].innerHTML = GetColoName(h, j);
        }
      }
      break;
    case 3:
      CoNameVw = 1;
      for (var i in cololi) {
        for (var j in cololi[i]) {
          cololi[i][j].innerHTML = '';
        }
      }
      break;
  }
  save('conamesw', CoNameVw);
}

// 获取颜色名
function GetColoName(h: CCC.Harmony, cid): string {
  var s = '';
  switch (CoNameVw) {
    case 2:
      s = '#' + h.cs[cid].bit;
      break;
    case 3:
      s = 'R:' + h.cs[cid].r + '</br>G:' + h.cs[cid].g + '</br>B:' + h.cs[cid].b;
      break;
  }
  return s;
}

// 标记控制点粘合（控制点标准化坐标）
function GrpTagShow(p: Array<number>) {
  gtag.setAttribute('style', 'left:' + Math.round(PtoCX(p[0])).toString() +
    'px;top:' + Math.round(PtoCY(p[1])).toString() + 'px;');
}

// 下载色组
declare var saveAs;
function DownloadColor() {
  var cont = GetColorEPS();
  var fn = 'Irisring-color.eps';
  var bb = new Blob([cont], { type: "application/postscript;charset=utf8" });
  saveAs(bb, fn);
}
// 获取色组压缩数据SVG .色组开始 ,分割色组
function GetColorsSVG(): string {
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
    dd += h.strID + ',';
  }
  dd = dd.substring(0, dd.length - 1);
  svg.setAttribute('ddata', dd);
  return cont.innerHTML;
}

// 获取色组压缩数据EPS
function GetColorEPS(): string {
  var hc = Math.max(CCC.Harmony.Count, 8),
    yn = 700 / hc, xn = yn * 0.95, n = xn * 0.95,
    x, y = CCC.Harmony.Count * yn, dd = '',
    s = '\n/box{moveto ' + n + ' 0 rlineto 0 ' + n + ' rlineto -' + n + ' 0 rlineto closepath}def/fil{setrgbcolor fill}def ';
  for (var i in CCC.Harmony.all) {
    x = 0;
    var h = CCC.Harmony.all[i];
    for (var j = 0; j < h.dn; j++) {
      var c = h.cs[j];
      s += '\nnewpath ' + x + ' ' + y + ' box ' + c.r / 255 + ' ' + c.g / 255 + ' ' + c.b / 255 + ' fil ';
      x += xn;
    }
    y -= yn;
    dd += h.strID + ',';
  }
  return '%!PS-Irisring-color2.0:' + dd.substring(0, dd.length - 1) + ';' + s + 'showpage';
}

// 解析数据添加到色板
function ReDataToSVG(data: string) {
  var ds;
  if (data.substring(0, 19) == '\%!PS-Irisring-color') {
    // 载入EPS
    ds = data.split(':')[1].split(';')[0];
  } else {
    // 载入SVG
    var dm = document.createElement('div');
    dm.innerHTML = data;
    var svg = dm.getElementsByTagName('svg')[0];
    if (!svg) return;
    ds = svg.getAttribute('ddata');
  }
  if (!ds) return;
  // 开始解析
  var c = ds.split(',');
  for (var i in c) {
    var h = CCC.Harmony.NewFromStrId(c[i]);
    if (!h) continue;
    h.bz.i.FindUniTest('i', 0.0001);
    h.bz.k.FindUniTest('k', 0.0001);
    h.bz.o.FindUniTest('o', 0.0001);
    AddPath(h);
    AddColorBox(h);
  }
  RefreshUrl();
}

// 上传色组文件
function UploadSVG(input) {
  var win = window as any;
  //支持chrome IE10
  if (win.FileReader) {
    var file = input.files[0];
    var filename = file.name.split(".")[0];
    var reader = new FileReader();
    reader.onload = function () {
      ReDataToSVG(this.result);
    }
    reader.readAsText(file);
  }
  //支持IE 7 8 9 10
  else if (typeof win.ActiveXObject != 'undefined') {
    var xmlDoc;
    xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
    xmlDoc.async = false;
    xmlDoc.load(input.value);
    ReDataToSVG(xmlDoc.xml);
  }
  //支持FF
  else if (document.implementation && document.implementation.createDocument) {
    var xmlDoc;
    xmlDoc = document.implementation.createDocument("", "", null);
    xmlDoc.async = false;
    xmlDoc.load(input.value);
    ReDataToSVG(xmlDoc.xml);
  } else {
    alert('Upload Error');
  }
}

// 储存单个数据
function save(k: string, v: any) {
  if (!localStorage) return;
  localStorage.setItem(k, v);
}

// 读取单个数据
function loadKV(k: string): any {
  if (!localStorage) return;
  return localStorage.getItem(k);
}

// 移除单个数据
function remoKey(k: string) {
  if (!localStorage) return;
  localStorage.removeItem(k);
}

// 载入储存的页面数据
function LoadPageSTG() {
  if (!localStorage) return;
  // 灯光
  var ligsw = localStorage.getItem('ligsw');
  if (ligsw) {
    ligOn = ligsw == '1' ? 2 : 1;
    SwiLig();
  } else {
    ligOn = Math.random() > 0.5 ? 1 : 2;
    SwiLig();
  }
  // 颜色标识
  var conamesw = +localStorage.getItem('conamesw');
  if (conamesw) {
    conamesw--;
    if (conamesw < 1 || conamesw > 3) conamesw = 3;
    CoNameVw = conamesw;
    SwiCoNameVw();
  }
  // 颜色收藏
  for (var i = 0; i < localStorage.length; i++) {
    var k = localStorage.key(i);
    if (k[0] == '#') MarkAddTag(k.substring(1), localStorage.getItem(k));
  }
  setTimeout(function () { document.body.setAttribute('class', 'bodytr'); }, 100);
}

// 清除储存的数据
function cSTG() {
  if (!localStorage) return;
  localStorage.clear();
}

var svgName = "http://www.w3.org/2000/svg",
  aip: any[],                 // 输入事件记录[0:名称 1/2:鼠标相对元素中心坐标]
  eip: any[],                 // 色相控制器输入记录[0:名称s/l 1:扭序0-2 2:鼠标相对元素中心Y坐标]
  P: number[],                // 鼠标当前坐标
  selID: any[],               // 当前选择的色组ID[0:色组 1:单色]
  padXY: number[],            // 色轮底板位移坐标
  unup: boolean,              // 非释放状态
  unlockPoi: CCC.Point,       // 每次位移开始时新建的解锁控制点
  pathPad: HTMLElement,       // 环内路径面板
  pathg: Element[],           // 环内路径组[色组ID]
  paths: Element[][],         // 环内路径[色组ID][线段ID]
  vwPoiPad: HTMLElement,      // 末端显示点面板
  vwPoi: Element[],           // 末端显示顶点[色组ID]
  vwbPad: HTMLElement[],      // 背景灰点显示面板[0:点面板 1:线面板 2:i白点面板]
  vwbPoi: Element[][],        // 背景灰点[色组ID][0:点 1:线 2:i白点]
  ctrPoi: HTMLElement[],      // 操作用控制点组[i/k/o]
  selVwPath: Element,         // 显示已选择的背景白线
  gtag: Element,              // 组点粘合标记

  ring: Element,              // 参照环组
  rins: Element[],            // 参照环点[序id]
  rinCo: CCC.Color[],         // 参照环色[序id]
  rinPoi: number[][],         // 参照环操纵点[0:源起点 1:鼠标起点 2:控制偏移坐标]
  rinCtr: Element,            // 参照环控制器
  rinTag: Element,            // 环控制器参考点
  rinEdg: Element,            // 环控制器参考边缘

  cosPad: HTMLElement,        // 全色板
  coGrPad: HTMLElement[][],   // 色组版[色组ID][0:整体板 1:排色板]
  cololi: HTMLElement[][],    // 色块单元[色组ID][线段序ID]
  coloPadTag: HTMLElement,    // 色板移除占位动画
  setID: number,              // 当前设置的面板ID
  coSetPadSave: HTMLElement,  // 通用设置面板存档
  coSetPad: HTMLElement,      // 通用设置面板
  coSetPadY: number,          // 设置面板偏移位
  coSets: HTMLElement[],      // 设置面板预留位[色组ID]
  coSetSLPad: Element[],      // 色相控制器面板[l:亮度 s:色度]
  coSetPoi: Element[][],      // 设置面板色相控制点[l:亮度 s:色度][012阶映射]

  coMarkData: number[],      // 标记色编码记录[编码ID]:分段数
  svCoPad: HTMLElement,       // 标记色储存面板
  svCoList: HTMLElement[];    // 标记色单元[无级数ID编码]

window.onload = () => {
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
    } else {
      rin.setAttribute('r', '1.5');
      rin.setAttribute('class', 'ring0');
    }
    rin.setAttribute('stroke', '#888');
    ring.appendChild(rin);
    var v = i * 3;
    rins[v] = rin;
    rinCo[v] = new CCC.Color([0, 0, 0], true);
  }
  document.getElementById('addpath').addEventListener('animationend', function () {
    document.getElementById('addpath').classList.remove('swiadd');
  });
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
  var udata: any = window.location.search.split('=')[1];
  if (udata) udata = udata.split(',');
  CCC.Page.Start(udata);
  LoadPageSTG();
};
// 防止鼠标拖动元素
document.onselectstart = (event) =>
{ if (P[1] < 540 || setID) { event.returnValue = false; return false; } }
window.onmouseup = "getSelection" in window ?
  function () { if (P[1] < 540 || setID) window.getSelection().removeAllRanges(); } :
  function () { if (P[1] < 540 || setID) document.getSelection().empty(); };

function log(i) { console.log(i); }