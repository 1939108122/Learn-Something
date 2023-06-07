**闭包就是函数可以记住并访问所在的词法作用域**

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