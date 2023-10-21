## 深拷贝和浅拷贝是只针对Object和Array这样的引用数据类型的


### 浅拷贝

**对象的浅拷贝是其属性与拷贝源对象的属性一份精确的拷贝**

**如果源对象的属性是基本类型，那么拷贝的就是基础类型的值，如果属性是引用类型，那么拷贝的就是指向存储在堆内存的一个指针地址（共享同一块内存），所以只要有一个对象改变了地址，则另一个也会受影响**

tips: **可以用a===b来判断两个对象是否指向同一个地址**

```js
const obj = {}
const newObj = obj

console.log(obj == newObj) // true


const obj = {}
const newObj = {}

console.log(obj == newObj) // false
```


**在 JavaScript 中，所有标准的内置对象复制操作（展开语法、Array.prototype.concat()、Array.prototype.slice()、Array.from()、Object.assign() 和 Object.create()）创建的是浅拷贝而不是深拷贝。**

```js
// 浅拷贝

var obj1 = {
    name: 'xxx',
    info: {
        name: 'aaa',
        age: 18
    }
};

var obj2 = Object.assign({}, obj1); // 浅拷贝

console.log(obj1 === obj2);  // false


obj2.name = 'kkk'; // 属性为基础类型，不会影响源对象
obj2.info.name = 'bbb'; // 改变引用类型的属性，共享内存的源对象 info的属性也受其影响

console.log(obj1); // { name: 'xxx', info: { name: 'bbb', age: 18 } }
console.log(obj2); // { name: 'kkk', info: { name: 'bbb', age: 18 } }
```


```js
// 实现一个浅拷贝

// 1
function shallowCopy(obj) {
    let target = {};
    for(let key in obj) {
        if(obj.hasOwnProperty(key)) { // 自身属性
            target[key] = obj[key]
        }
    }
    return target;
}


// 2
let obj1 = { name: 'jack', inner: {a: 1, b: 2}};

let obj2 = {...obj1};
```

### 浅拷贝与引用类型赋值的区别

**引用类型赋值：当我们把一个对象赋值给一个新的变量时，赋的其实是该对象的在栈中的地址，而不是堆中的数据。也就是两个对象指向的是同一个存储空间，无论哪个对象发生改变，其实都是改变的存储空间的内容，因此，两个对象是联动的**

**浅拷贝：它会创建一个新对象，这个对象有着原始对象属性值的一份精确拷贝，如果属性是基本类型，则拷贝的是基本类型的值，如果是引用类型，则拷贝的是指向堆内存的数据的一份指针地址，所以如果其中一个对象改变了这个地址，就会影响到另一个对象**




### 深拷贝

**深拷贝是将一个对象从内存中完整的拷贝一份出来,从堆内存中开辟一个新的区域存放新对象（新旧对象不共享同一块内存）,且修改新对象不会影响原对象**

#### 深拷贝的几种实现方式

**1:JSON.parse(JSON.stringify())** 

JSON.parse(JSON.stringify()) 有几个缺点

1: 会忽略 undefined
2: 会忽略 symbol
3: 不能序列化函数
4: 不能解决循环引用的对象
5: 不能正确处理new Date()
6: 不能处理正则

比如：

```js

let obj = {
    name: 'muyiy',
    a: undefined,
    b: Symbol('muyiy'),
    c: function() {}
}

var a = JSON.parse(JSON.stringify(obj));
console.log(a); // {name: muyiy}

```


