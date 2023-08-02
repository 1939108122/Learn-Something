**声明变量三个关键字var、let、const**

var在ECMAScript任何一个版本都能使用，let和const在ECMAScript6及其以后能使用




### var和let区别

#### 一: 声明提升

```js

// var
function foo() {
    console.log(age);
    var age = 12;
}

foo(); // undefined

这段代码不会报错就是因为 var关键字会将所有变量声明都拉到函数作用域顶部，上面的代码等价于下面：

function foo() {
    var age;
    console.log(age);
    age = 12;
}

foo(); // undefined

而let声明不会，在let声明之前的执行瞬间叫做“暂时性死区”

console.log(name); // ReferenceError: name没有定义

let name = 'matt';

```

#### 二: 声明范围

```js
var声明的范围是函数作用域，而let声明的范围是块级作用域
 
function foo() {
    var age = 12;
    console.log(age);
}

console.log(age); // ReferenceError: age is not defined


if(true) {
    var message = 'matt';
    console.log(message); // matt
}

console.log(message);  // matt

if(true) {
    let age = 18;
    console.log(age); // 18
}

console.log(age);  // ReferenceError: name没有定义
```


#### 三: 全局声明 

```js
与var关键字不同，使用let在全局作用域中声明的不会成为window对象的属性,(var声明的则会)

var name = 'matt';

console.log(window.name); // matt


let age = 12;

console.log(window.age); // undefined


```



#### 四: for循环中的let声明

```js
// for循环定义的var迭代变量会到循环体外部

for(var i = 0; i < 5; i++) {
    // 
}

console.log(i); // 5


// let不会，因为迭代变量的作用域仅限于循环块作用域内部

for(let i = 0; i < 5; i++) {
    // 
}

console.log(i); // // ReferenceError: i没有定义
```





```js
for(var i = 0; i < 5; i++) {
    setTimeout(()=> {
        console.log(i);
    },0);
}

// 5，5，5，5，5

// 在退出循环时，迭代变量保存的是导致循环退出的值：5。在之后执行超时逻辑时，所有的i都是同一个变量，因为输出的都是同一个最终值。（和setTimeout有关系，不加setTimeout，输出0，1，2，3，4）



for(let i = 0; i < 5; i++) {
    setTimeout(()=> {
        console.log(i);
    },0);
}

// 0,1,2,3,4

// 用let声明时，每个迭代循环会声明一个新的迭代变量，每个setTimeout都是引用的不同的变量实例


```



#### 五: const声明

const与let基本一致，唯一一个重要的区别是声明变量时必须同时初始化变量，且尝试修改const声明的变量会报错