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