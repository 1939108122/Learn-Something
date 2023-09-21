### Vue响应式原理

Vue采用**数据劫持**和**发布订阅模式**来进行数据的响应式。


1: 首先将需要实现响应式的对象传入Observer(数据监听类)进行实例化，如果是数组的话，将会修改该该数据类型原型上 7 个原生数组方法，达到监听数组数据变化进行响应的效果；

2: 如果数据是对象的话，遍历对象的每个键值，通过Object.defineProperty做数据劫持，将每个属性都 getter、setter，在get方法中会实例化一个发布者类Dep, 它会收集订阅者Watcher, 和触发Watcher的依赖收集，当数据变化的时候，调用set方法， 就会通过dep.notify方法通知所有订阅者去派发更新，Watcher就会去调用更新函数去更新视图。



##### 知识点

MVVM


MVVM 是 Model-View-ViewModel 的简写，即 模型-视图-视图 模型。Model 指的是后端传递的数据。View 指的是所看到的页面。ViewModel 是 MVVM 模式的核心，它是连接 View 和 Model 的桥梁。

将 Model 转化成 View，即将后端传递的数据转化成所看到的页面。实现方式：数据绑定
将 View 转化成 Model，即将所看到的页面转化成后端的数据。实现方式：DOM 事件监听
这两个方向都实现的，称之为数据的双向绑定
在 MVVM 框架下 View 和 Model 是不能直接通信的，它们通过 ViewModel 来通信，ViewModel 通常要实现一个 Observer 观察者，当数据发生变化，ViewModel 能够监听到数据的这种变化，然后通知对应的视图做自动更新，而当用户操作视图，ViewModel 也能监听到视图的变化，然后通知数据做改动，这实际上就实现了数据的双向绑定。并且 MVVM 中的 View 和 ViewModel 可以互相通信。





```js
Compile：指令解析系统，对每个元素节点的指令进行扫描和解析，根据指令模板替换数据，以及绑定相应的更新函数

Observer：数据监听系统，能够对数据对象的所有属性进行监听，如有变动可拿到最新值并通知订阅者

Dep+Watcher：发布订阅模型，作为连接 Observer 和 Compile 的桥梁，能够订阅并收到每个属性变动的通知，执行指令绑定的相应回调函数，从而更新视图
```




不足： 
使用 Object.defineProperty 定义响应式的数据对象的访问器属性 getter 和 setter 进行数据劫持时存在以下问题

1: 对象属性的增加与删除无法监听

例如 data = { foo: 'bar' }，如果我们设置 data.test = 'test'，Observer 是无法监控到的，因为在 observe 的时候（初始化 Vue 构造函数的配置对象时），会遍历已有的每个属性（比如 foo），并添加 getter 和 setter，而后面设置的 test 属性并没有设置 getter 和 setter 的机会，因而无法监控变化。同样地，删除对象属性时候，getter 和 setter 会跟着属性一起被删除，拦截不到变化。

2: 数组的修改



同样地，数组类型作为最常用的引用数据类型之一，使用 push、pop、shift、unshift、splice 等方法操作数组元素时，数组的 getter 和 setter 同样无法监控到变化。Vue 通过重写 Array 默认方法的方式，在调用这些方法的时候发布更新消息，一般无需关注，但是对于如下两种情况。


直接利用索引 arr[1] = 'test'  (Vue不设置监听原因，假设数组长度过长，非常消耗性能)

修改数组长度无法监听


