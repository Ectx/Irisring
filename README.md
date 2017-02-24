## Irisring
### Color-scheme

<br>

# 配色器

[https://ectx.github.io/Irisring](https://ectx.github.io/Irisring/?irco=2q7gaunnau5c90o0v8s4eb4,42fjp0nnau2k9nk3v8v8mq6,2qnnau7gau6tednrv8ssf94)

## !! :
- 新创建的色组，会根据背景明暗建立为亮色或暗色;

- 下载的eps文件中含有颜色坐标信息，可通过上传进行再次调整，其他上传文件暂时无法识别;

- 在颜色内部属性调整中，太阳图标的左框表示颜色明暗，相当于HSL中的L值；水滴图标的右框表示取色点在曲线中的位置(取色点越靠近色轮中心，颜色饱和度越低);

- 通过标记收藏的颜色仅保存在当前浏览器中;

<br>

# 颜色生成 API

[https://ectx.github.io/Irisring/lib/irisring.gen.js](https://ectx.github.io/Irisring/lib/irisring.gen.js)

[https://ectx.github.io/Irisring/lib/irisring.gen.min.js](https://ectx.github.io/Irisring/lib/irisring.gen.min.js)

## 使用方法

> ### 参考 -> [Demo](https://ectx.github.io/Irisring/lib/demo.html)

## irisring() 色组生成函数
#### 传入 object | string | null
#### 返回 IrisringFn.HarmonyData
生成并返回一个色组对象

- 自动随机生成
```javascript
irisring()
```

- 根据配置选项生成 （留空的选项将自动随机配置）
```javascript
irisring({
  // 基点色环角度（bezier曲线限制活动的一端 0 - 360）
  baseHue: 90,

  // 分段数 （1 - ∞）
  seg: 5,

  // 控制点坐标（二次bezier曲线的中间节点）
  cenPoint: {x: -0.86, y: -0.5},

  // 末端坐标（bezier曲线可自由活动的一端）
  endPoint: {x: 0.5, y: -0.1},

  // 取色点映射偏移
  hueMap: {i: 0.172, k: 0.288, o: 0.768},

  // 亮度映射偏移
  lightMap: {i: 1, k: 0.9, o: 0.46}
})

// 所有的坐标都可以用数组输入 例如
irisring({
  cenPoint: [-0.86, -0.5],
  hueMap: [0.172, 0.288, 0.768]
})
```

- 根据压缩编码生成
```javascript
irisring('2qnnau7gau6tednrv8ssf95')
```

## HarmonyData 色组对象
由 `irisring()` 返回的色组对象

### .colors
#### 类型 IrisringFn.Color
获取颜色对象数组
```javascript
// 通过 .colors 获取颜色数组
var ir = irisring({seg: 2}),
    color_0 = ir.colors[0],
    color_1 = ir.colors[1];

// 颜色对象可以获取rgb，也可以获取十六进制数，另外hsl也可以获取
document.body.style.backgroundColor = '#' + color_0.hex;
document.body.style.color = 'rgb(' + color_1.r + ',' + color_1.g + ',' + color_1.b + ')';
document.body.innerText = 'H:' color_1.h + ', S:' + color_1.s + ', L:' + color_1.l;
```

### .seg
#### 类型 number
设置和获取色组分段数
```javascript
var ir = irisring({seg: 7});

ir.seg;             //  7
ir.colors.length;   //  7

ir.seg = 3;
ir.colors.length;   //  3
```

### .baseHue
#### 类型 number
设置和获取色组基色（锁定在圆环边界的端点的角度值）
```javascript
var ir = irisring({baseHue: 90});

ir.baseHue;         //  90
```

### .cenPoint
#### 类型 IrisringFn.Point
设置和获取bezier曲线的中间节点（参数建议 小于 ±1.5）

### .endPoint
#### 类型 IrisringFn.Point
设置和获取bezier曲线的末端端点（参数建议 小于 ±1.5）
```javascript
var ir = irisring({
  cenPoint: [0.5, 0.1],
  endPoint: [0.2, 0.3]
});

ir.cenPoint.x;      //  0.5
ir.cenPoint.y;      //  0.1

ir.endPoint.x;      //  0.2
ir.endPoint.y;      //  0.3
```

### .hueMap
#### 类型 IrisringFn.Bezier1DCtrl
设置和获取bezier曲线上的取色点在色彩空间中的色相、饱和度偏移量（参数建议 0 ~ 1）

### .lightMap
#### 类型 IrisringFn.Bezier1DCtrl
设置和获取bezier曲线上的取色点在色彩空间中的亮度偏移量（参数建议 0 ~ 1）
```javascript
var ir = irisring({
  hueMap: [0.1, 0.7, 0.9],
  lightMap: [0.2, 0.3, 0.8],
});

ir.hueMap.i;        //  0.1
ir.hueMap.k;        //  0.7
ir.hueMap.o;        //  0.9

ir.lightMap.i;      //  0.2
ir.lightMap.k;      //  0.3
ir.lightMap.o;      //  0.8
```

### .zip
#### 类型 string
获取色组的压缩编码
```javascript
var ir = irisring({
  baseHue: 90,
  seg: 5,
  cenPoint: [-0.86, y: -0.5],
  endPoint: [0.5, y: -0.1],
  hueMap: [0.172, 0.288, 0.768],
  lightMap: [1, 0.9, 0.46]
});

ir.zip;             //  "2q7iaukaem5c90o0v8s4ec5"
```

## Point.prototype.rotate() 点坐标旋转函数
#### 传入 number, {x, y} | [x, y] | null
#### 返回 Point
根据中心点逆时针旋转坐标，作用于 `cenPoint` 和 `endPoint` 对象
```javascript
var ir = irisring({cenPoint: [0.5, 0.5]});

// 以圆点为中心逆时针旋转180度角
ir.cenPoint.rotate(180);

ir.cenPoint.x;      //  -0.5
ir.cenPoint.y;      //  -0.5

// 再以(0.25, 0.25)为中心逆时针旋转90度角
ir.cenPoint.rotate(90, [0.25, 0.25]);

ir.cenPoint.x;      //  1
ir.cenPoint.y;      //  -0.5
```

## irisring.setup() 全局配置函数
#### 传入 object | null
#### 返回 irisring
配置生成色组的全局参数
```javascript
irisring.setup({
  // 在未配置lightMap的情况下，色组的自动亮度映射控制，用以生成亮色或暗色系（默认为null: 随机）
  // true: 总是生成亮色
  // false: 总是生成暗色
  // null: 每次生成时随机亮色或暗色
  // undefined: 不修改
  light: false,

  // 是否将传入参数改为弧度制（默认为false: 角度制）
  // true: 弧度制
  // false: 角度制
  // undefined: 不修改
  radians: true
})
```

或者

```javascript
// 重新生成各项随机基础参数，已传入的配置属性不变
irisring.setup();
```