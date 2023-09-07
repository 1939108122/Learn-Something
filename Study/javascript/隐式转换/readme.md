### 隐式转换

#### 数学运算中的类型转换

```js

// 减乘除规则
// 我们在对各种非Number类型运用数学运算符(- * /)时，会先将非Number类型转换为Number类型（原始类型直接调用Number转换，引用类型先调用 valueOf ,没转化为原始值再调用 toString）

1 - null // 1,  null 转成 number类型 0， 1 - 0 = 1

2 * [5] // 10, [5].toString() = 5, 2 * 5 = 10

1 / '2' // 0.5,  '2' -> 2   1/2 = 0.5

1 - {} //NaN,  Object.prototype.toString({}) = '[object Object]', 1 - '[object Object]' = NaN

1 - undefined //  Number(undefined) = NaN NaN

{} - 1 // -1, {}放在最前面，那么它仅仅代表的代码块，会直接忽略不计

1 - [] // 1, [].toSring() = ''

[] - 1 // -1, 同上

{} - {} // NaN

[] - [] // 0




// 加法的特殊性

// js里加法可以用来拼接字符串，有加号应用以下规则：
// 1: 当一侧为String类型时，被识别成字符串拼接，会优先将另一侧转换为字符串类型。
// 2: 当一侧为Number类型，另一侧为原始类型，则将原始类型转换为Number类型
// 3: 当一侧为Number类型，另一侧为引用类型，将引用类型和Number类型转换为字符串后拼接
// 4: 除了第一种情况，如果都为原始类型，都转成Number类型

1 + 'abc' // '1abc' 规则1

[] + 5, // '5'  规则3

1 + undefined // NaN  规则2

{} + '5' // 5,  {}前置为代码块，+'5'为5

({} + '5') // '[object Object]5', 规则1

undefined + null // NaN， 规则4

true + null  // 1

```






#### 逻辑语句中的类型转换

```js
// == 中的规则

// 规则 1：NaN 和其他任何类型比较永远返回false（包括和他自己）。

// 规则 2: Boolean 和其他任何类型比较，Boolean 首先被转换为 Number 类型。

// 规则 3：String和Number比较，先将String转换为Number类型。

// 规则 4：null == undefined比较结果是true，除此之外，null、undefined和其他任何结果的比较值都为false。

// 规则 5： 原始类型和引用类型做比较时，引用类型会依照ToPrimitive规则（先valueOf后toString的模式）转换为原始类型。

//  规则6: 引用类型相比，比较两个引用是不是指向同一地址

'true' == true // false, 先规则2， 在规则3

[] == 0  // true, 规则5

NaN == NaN // false, 规则1

null == [] // 规则4 



[] == [] // 规则6
undefined == null   // 规则 4



```