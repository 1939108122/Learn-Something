**闭包是指那些能够访问独立(自由)变量的函数 (变量在本地使用，但定义在一个封闭的作用域中)。换句话说，这些函数可以“记忆”它被创建时候的环境。**

**内部函数访问了外部函数的变量，当外部函数执行后，会对外部函数进行垃圾回收，但是内部函数仍然可以保持对外部函数作用域的引用，在定时器、事件监听器、ajax请求等，只要使用了回调函数，就是在使用闭包**


```javascript
var a = 2;

(function IIFE(){
    console.log(a);
})();
```

**严格来说，IIFE模式并不是闭包,因为该函数并不是在它本身的词法作用域之外执行的，a是通过普通的词法作用域查找而非闭包查找而被发现的**




```javascript
function Foo() {
    let a = 2;
    return function bar() {
        console.log(a);
    }
}

let baz = Foo();
baz(); // 2
```






https://www.ruanyifeng.com/blog/2009/08/learning_javascript_closures.html









#### 闭包作用

1: 可以读取函数内部的变量

2: 隐藏变量，避免全局污染



缺点1：导致变量不会被垃圾回收机制回收，造成内存消耗
缺点2：不恰当的使用闭包可能会造成内存泄漏的问题（https://www.ruanyifeng.com/blog/2009/08/learning_javascript_closures.html）





**JS规定在一个函数作用域内，程序执行完以后变量就会被销毁，这样可节省内存；使用闭包时，按照作用域链的特点，闭包（函数）外面的变量不会被销毁，因为函数会一直被调用，所以一直存在，如果闭包使用过多会造成内存销毁。**




#### 闭包应用场景


1: 数据封装和私有性

```js

function operateCount() {
    let count = 0;
    return {
        incrementCount: function () {
            count++;
        },
        decrementCount: function() {
            count--;
        },
        getCount: function() {
            return count;
        }
    };
}

```



2: 回调函数和事件处理

```js
function wait(message) {
    setTimeout(function() {
        console.log(message);
    }, 100);
}

wait('iam message');
```



```js
// 防抖
function debounce(fn, delay = 100) {
    let timerId = null;
    return function () {
        const context = this;
        if (timerId) {
            window.clearTimeout(timerId);
        }
        timerId = setTimeout(() => {
            fn.apply(context, arguments);
            timerId = null;
        }, delay);
    };
}
```


3: 循环中的IIFE：实现私有作用域，避免污染全局作用域。
```js
for(var i = 0; i < 5; i++) {
    (function(i) {
        setTimeout(function timer(){
            console.log(i);
        }, i*1000);
    })(i)
}
```
