#### 介绍
apply、call、bind都是改变this指向的方法，为什么要改变this指向呢，看这个例子:

```js
var a = 2;
var obj = {
    a: 1,
    foo: function () {
        console.log(this.a);
    }
};

setTimeout(obj.foo, 1000); // 2


// 改变this

setTimeout(obj.foo.bind(obj), 1000); // 1



// 
```


#### apply

apply() 方法调用一个具有给定 this 值的函数，将this指向apply的第一个参数。apply接受两个参数，第一个参数是this的指向对象，第二个参数是函数接受的参数，以数组的形式传入

改变this指向后原函数会立即执行，且此方法只是临时改变this指向一次

```js
let obj = {
    a: 1
};

let foo = function (...args) {
    console.log(this.a, args); // 1， [1,2,3,4]
}

obj.foo = foo;
obj.foo.apply(obj, [1,2,3,4]);
```




#### call

call方法的第一个参数也是this的指向，后面传入的是一个参数列表

跟apply一样，改变this指向后原函数会立即执行，且此方法只是临时改变this指向一次




```js
let arr = [1, 5, 11, 2, 13];

Math.max.call(null, ...arr); // 13
```


#### bind


bind方法和call很相似，第一参数也是this的指向，后面传入的也是一个参数列表(但是这个参数列表可以分多次传入)

改变this指向后不会立即执行，而是返回一个永久改变this指向的函数

```js
function fn(...args){
    console.log(this, args);
}
let obj = {
    myname: '张三'
}

const bindFn = fn.bind(obj, 3, 4); // this 也会变成传入的obj ，bind不是立即执行需要执行一次
bindFn(1,2) // this指向obj 
fn(1,2) // this指向window

```


#### 总结

从上面可以看到，apply、call、bind三者的区别在于：

> 三者都可以改变函数的this对象指向
三者第一个参数都是this要指向的对象，如果如果没有这个参数或参数为undefined或null，则默认指向全局window
三者都可以传参，但是apply是数组，而call是参数列表，且apply和call是一次性传入参数，而bind可以分为多次传入
bind是返回绑定this之后的函数，apply、call 则是立即执行



### 实现call

```js
// 第一版
// 1: 将函数的this绑定在指定对象上
// 2: 执行该函数

Function.prototype.myCall = function(context) {
    // 获取调用myCall的函数，用this可以获取
    context.fn = this;
    context.fn();
    delete context.fn;
}

var foo = {
    value: 1
}


function bar() {
    console.log(this.value);
}

bar.myCall(foo);
```




```js
// 第二版
// 在原有基础上，考虑到以下三点
// 1：执行的函数会return结果
// 2：传进来的参数多个时
// 传进来的第一个参数是null 或 undefined时需要将this指向window

Function.prototype.myCall = function(context, ...args) {

    context = context || window;
    context.fn = this;
    let result = context.fn(...args);
    delete context.fn;
    return result;

}

var foo = {
    value: 1
}


function bar(...args) {
    console.log(this.value, ...args);
}

bar.myCall(foo, 1, 3, 4); // 1 1 3 4
```


### 实现apply 

```js
// apply和call的差距在于第二个参数是数组仅此而已
Function.prototype.myApply = function(context, args) {

    context = context || window;
    context.fn = this;
    let result = context.fn(...args);
    delete context.fn;
    return result;

}

var foo = {
    value: 1
}


function bar(...args) {
    console.log(this.value, ...args);
}

bar.myApply(foo, [1, 3, 4]); // 1 1 3 4

```


### 实现bind

```js
// 只有一个参数的简单版本

// 1
Function.prototype.myBind = function (context) {
    context.fn = this;
    return function() {
        return context.fn();
    }
}


// 2 

Function.prototype.myBind = function (context) {
    var self = this;
    return function() {
        return self.apply(context);
    }
}


let foo = {
    value: 1
}

function bar () {
    console.log(this.value);
}

let bind = bar.myBind(foo);
bind();



```




```js
// 传入参数的版本

Function.prototype.myBind = function (context) {
    var self = this;
    // 获取传给函数的第二个到最后一个参数
    var args = Array.prototype.slice.call(arguments, 1);
    return function() {
        //  这个时候的arguments是指bind返回的函数传入的参数
        var bindArgs = Array.prototype.slice.call(arguments);
        return self.apply(context, args.concat(bindArgs));
    }
}


let foo = {
    value: 1
}

function bar (...args) {
    console.log(this.value, ...args);
}

let bindFn = bar.myBind(foo, 1, 2);
bindFn(3, 4); // 1 1 2 3 4
```




