###  浏览器的进程模型

**何为进程**
是指电脑中已执行的程序，曾经是分时系统的基本运作单位。在面向进程设计的系统（如早期的UNIX，Linux 2.4及更早的版本）中，是程序的基本执行实体；在面向线程设计的系统（如当代多数操作系统、Linux 2.6及更新的版本）中，进程本身不是基本执行单位，而是执行线程的容器。

**简单来说 程序运行需要有内存空间，这块内存空间简单的理解为进程**

**每个应用至少有一个进程，进程之间相互独立，即使要通信，也需要双方同意**


**何为线程**

运行程序的一个基本执行单位，一个进程包括一个或多个线程。进程开启后会自动创建一个线程来执行代码，该线程称为主线程。

如果程序需要同时执行多块代码，主线程就会启动更多的线程来执行代码，所以一个进程中可以包含多个线程。



#### 浏览器有哪些进程和线程？

**浏览器是一个多进程多线程的应用程序**

谷歌浏览器三大进程

1: 浏览器进程
2: 网络进程
3: 渲染进程


**浏览器进程**

主要负责界面显示，用户交互，子进程管理等，浏览器进程内部会启动多个线程处理不同的任务。

**网络进程**

负责加载网络资源，网络进程内部会启动多个线程来处理不同的网络任务。

**渲染进程**

渲染进程启动后，会开启一个渲染主线程，主线程负责执行 HTML、JS、CSS代码


### 渲染主线程是如何工作的？

解析HTML

解析CSS

计算样式

布局

执行JS

....



### js事件循环

```js
事件循环又叫消息循环（源码写的message loop），把浏览器当作js的运行环境，那么事件循环是浏览器渲染主线程的工作方式。


由于JS是单线程语言，又要做到不阻塞线程，便引入了事件循环这个概念，在解释事件循环之前，先介绍几个名词：

1: 执行栈。执行栈又称调用栈，里面堆叠的是执行上下文， JS同一时间只能执行一项任务，每次执行任务都会从执行栈的栈顶取出任务执行。

2: 宏任务&微任务队列。在JS代码中遇到异步任务时，并不会等待其执行完再去执行下一个任务，会将异步任务分类，待其事件触发或者定时器到时间了，再将回调函数包装成任务放入对应的队列中进行排队，待执行栈为空（准确来说是只剩全局执行上下文），再根据优先级去队列里取任务放入执行栈执行。过去把事件队列分为宏队列和微队列，这种说法目前已经无法满足复杂的浏览器环境，取而代之的是将宏任务拆分开。根据W3C官方的解释，每个任务有不同的类型，同类型的任务必须在同一个队列，不同的任务可以属于不同的队列，不同任务队列有不同的优先级，谷歌的v8引擎将任务分为很多种，但我们需要了解的是以下三种队列：

1：定时任务（setTimeout、setInterval），优先级低
2: 交互任务,优先级适中
3: 微任务（Promise.resolve().then、MutationObserver、async/await）,优先级最高

因为浏览器认为交互任务会比定时器任务更高，应该更快响应


当浏览器遇到script标签时，JS引擎会创建一个全局执行上下文推入执行栈底部，同时script（整体代码是一个宏任务）放入宏任务队列
那么事件循环的具体细节如下：

1: 在谷歌源码中，会开启一个不会结束的循环，首先会从宏任务将第一个任务取出放到执行栈栈顶执行（执行一个宏任务）
2: 检查微任务队列是否有任务，有的话会全部依次放入执行栈执行，直至清空微队列
3: 浏览器视情况更新UI（可能把几次循环一块渲染）

接下来就是不断循环往复的从任务队列读取任务去执行，便是事件循环

```




#### 如何理解JS的异步

```js

JS是一门单线程语言，这是因为它运行在浏览器的渲染主线程中，渲染主线程只有一个，
而渲染主线程承担着诸多的工作，渲染页面、执行JS都在其中运行。

如果使用同步的方式，那么就很有可能造成主线程的阻塞，从而导致事件队列里的很多其他任务都无法执行。

这样一来，一方面会导致主线程白白的浪费时间，一方面导致页面不能及时更新，给用户造成卡死现象。

所以浏览器采用异步的方式来避免。具体做法是当某些任务（计时器、网络、事件监听）发生时，主线程将任务交给其他线程去处理，自身立即结束任务的执行，转而执行其他后续任务，当其他线程完成后，将事先传递的回调函数包装成任务放入事件队列的末尾，排队等待主线程调度执行。

所以异步的话，浏览器将永不阻塞，流畅运行。

```
 


#### JS的计时器可以做到精准计时吗？

```js
不行，因为：

1: 受事件循环的影响，计时器的回调函数只能在主线程空闲时间运行，会带来偏差。

2: 按照W3C的标准，浏览器实现计时器时，如果嵌套层数超过5层，则会带有4ms的最少时间，这样有偏差

3: 计算机硬件没有原子钟，无法做到精准计时
```





```js
async function async1() {
    console.log('async1 start');
    await async2();
    console.log('async1 end');
}
// 上面的代码等价于 ==>
async function async1() {
    console.log('async1 start');
    Promise.resolve(async2()).then(() => {
        console.log('async1 end')
    })
}
```




```js
console.log("start");
setTimeout(() => {
    console.log("children2")
    Promise.resolve().then(() =>{
        console.log("children3")
    })
}, 0)

new Promise(function(resolve, reject){
    console.log("children4")
    setTimeout(function(){
        console.log("children5")
        resolve("children6")
    }, 0)
}).then(res =>{
    console.log("children7")
    setTimeout(() =>{
        console.log(res)
    }, 0)
})
```


```js
async function async1() {
    console.log('async1 start')
    await async2()
    console.log('async1 end')
}
async function async2() {
    console.log('async2')
}
console.log('script start')
setTimeout(function () {
    console.log('setTimeout')
}, 0)
async1()
new Promise((resolve) => {
    console.log('promise1')
    resolve()
}).then(function () {
    console.log('promise2')
})
console.log('script end')
```




```js
async function async1() {
    console.log('async1 start');
    await async2();
    setTimeout(function() {
        console.log('setTimeout1')  // 这一部分代码会放入到 promise 的微任务队列中。
    },0)
}
async function async2() {
    setTimeout(function() {
        console.log('setTimeout2')
    },0)
}
console.log('script start');
setTimeout(function() {
    console.log('setTimeout3');
}, 0)
async1();
new Promise(function(resolve) {
    console.log('promise1');
    resolve();
}).then(function() {
    console.log('promise2');
});
console.log('script end');
```
