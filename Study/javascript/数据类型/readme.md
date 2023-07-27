### 类型

#### 内置类型

javascript 有七种内置类型：

1: 空值（null）

2: 未定义（undefinded）

3: 数字（number）

4: 字符串（string）

5: 布尔值（boolean）

6: 对象（object）

7: 符号 （symbol ES6新增）

**除了对象以外，其他都称为“基本类型”**


**typeof** 
可以查看值的类型 返回的是对应类型的字符串值

除了 null 类型比较特殊

**typeof null === "object"  // true**



历史遗留问题（机器码标识和object一致）

（https://juejin.cn/post/6844903895177805837）


```javascript

// 可以用复合条件判断数据类型为 null 的值

let a = null;

!a && typeof a === 'object'

```

```javascript

// typeof function的值

function a (x, y) {
    //
};


typeof a // 'fuction'

// 函数其实是 object的一个子类型，具体来说，函数是“可调用对象”
// 比如 a.length为2，其实就是形参个数

```


***javascript的变量是没有类型的，只有值才有，变量可以随时持有任何类型的值***


```js
// undefined 和 undeclared

undefined - 已在作用域声明过但是没有赋值过的变量
undeclared - 没在作用域声明过的变量

var a;
a // undefined
b // ReferenceError: b is not defined

但是 typeof a、typeof b 结果都是 'undefined'
```


```javascript
// NaN是javascript中唯一一个不等于自身的值

NaN === NaN // false
```