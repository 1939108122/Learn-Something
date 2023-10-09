### 随着父元素的拉伸，怎么实现子元素宽高同比例拉伸?
1: aspect-ratio属性 10 / 1

2: 利用vw, 比如 width: 50vw; height: 25vw;

3: 利用padding-top: 50%



### css3特性

flex 
grid 
transform
transition 和 animation
background-size （cover: 覆盖元素的尺寸、 contain：保持图像的宽高比例）
border-radius
box-shadow
word-wrap 
text-overflow






### vue3和2区别
1: 响应式原理（defineproperty 和 proxy）

2: composition api 和 options api

3: 全局api 应用实例（createApp） 和 全局 api treeShaking

4: vue diff算法优化

5: v-model 可以使用多个 

6: 生命周期函数名称变更

7: v-for 和 v-if优先级
8: 移除 过滤器、 keyCode按键修饰符、 $on $off $once移除

9: 新特性 teleport

### vue父组件更新，子组件无依赖父组件的属性，会更新吗

不会。vue更新的粒度是到组件级别的。每个组件都有自己的watcher，子组件没有依赖父组件的属性的话，只会造成父组件的更新。

### ES6有哪些新特性
let const 箭头函数 promise  扩展运算符 解构 Proxy Set Map Class


### 设计模式

### 手写promise.all


### 首页的性能优化




