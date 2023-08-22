#### this实际上是在函数被调用时发生的绑定，它指向什么完全取决于函数在哪里被调用。

###绑定规则

**1:默认绑定**

```js
首先是最常用的函数调用类型：独立函数调用。可以把这条规则看作是无法应用其他规则时的默认规则

function foo() {
    console.log(this.a);
}

var a = 2;

foo(); // 2 

function foo() {
    'use strict';
    console.log(this.a);
}

var a = 2;

foo(); // TypeError: this is undefined

```



**2:隐式绑定**

```js
函数的调用位置是否有上下文对象，或者说是否被某个对象拥有或者包含

function foo() {
    console.log(this.a);
}

var obj = {
    a: 2,
    foo: foo
}

obj.foo(); // 2

隐式绑定规则会把函数中调用的this绑定到这个 obj 对象上。


对象属性引用链中只有上一层或者说最后一层在调用位置中起作用。
eg:

function foo() {
    console.log(this.a);
}


var obj2 = {
    a: 2,
    foo: foo
}

var obj1 = {
    a: 1,
    obj2: obj2
}

obj1.obj2.foo(); // 2

```



**3:显式绑定**

```js

利用 call、apply、bind、 forEach等进行显示绑定

function foo() {
    console.log(this.a);
}

var obj = {
    a: 2
}

foo.call(obj); // 2


function foo(el) {
    console.log(el, this.id);
}

var obj = {
    id: 'awesome'
}


[1, 2, 3].forEach(foo, obj); // 1 awesome 2 awesome 3 awesome



```

**4:new绑定**


```js
function foo (a) {
    this.a = a;
}

var bar = new foo(1);

bar.a // 1
```









#### this 使用常用场景

```js
var obj = {
    a: 1,
    b: function() {
        console.log(this);
    }
};

/*
    方式一： 对象调用：obj.b(), 指向obj对象
    方式二： 函数调用： var a = obj.b; a(), 指向全局window对象
    方式三： 作为构造函数调用：var a = new Fun(); this指向实例化对象
    方式四：作为call、apply调用 obj.b.apply(object, []); 指向当前的object
*/
```





#### 4: 箭头函数里的this

this在标准和箭头函数中有不同的行为。在标准函数中，**this引用的是把函数当方法的调用的上下文对象**, 例子：

```js
window.color = 'red';

let o = {
    color: 'blue'
}
function sayColor() {
    console.log(this.color);
}

sayColor(); // red

o.sayColor = sayColor;

o.sayColor(); // blue


```

在箭头函数中，this引用的是定义箭头函数的上下文

```js
window.color = 'red';

let o = {
    color: 'blue'
}
let sayColor = () => {
    console.log(this.color);
}

sayColor(); // red

o.sayColor = sayColor;

o.sayColor(); // red

// 在对sayColor的两次调用中，this引用的都是window对象，因为箭头函数是在window上下文中定义的

```




**在事件回调或者定时回调中调用某个函数时，this值指向的并非想要的对象，此时将回调函数写成箭头函数就可以解决问题，这是因为箭头函数中的this会保留定义该函数时的上下文：**

```js
function King() {
    this.royaltyname = 'jack';
    setTimeout(() => {
        console.log(this.royaltyname);
    }, 1000);
}

function Queen() {
    this.royaltyname = 'rose';
    setTimeout(function () {
        console.log(this.royaltyname);
    }, 1000);
}

new King(); // jack

new Queen(); //undefined
```