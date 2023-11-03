### Object.is 与 === 区别

区别在于处理NaN和带符号的0

### 在===中： 

NaN === NaN (false)

-0 === 0 (true)

+0 === -0 (true)

### 在Object.is()中：

Object.is(NaN, NaN) (true)

Object.is(0, -0) (false)

Object.is(+0, -0) (false)





### Object.Prototype.toString.call()能判断类型的原理

Object.prototype.toString()方法返回值[object Object]中第二个Object就是Symbol.toStringTag属性的返回值，利用的是 Symbol.toStringTag 属性来判断类型

```js

const myDate = new Date();
Object.prototype.toString.call(myDate); // [object Date]

myDate[Symbol.toStringTag] = "myDate";
Object.prototype.toString.call(myDate); // [object myDate]

Date.prototype[Symbol.toStringTag] = "prototype polluted";
Object.prototype.toString.call(new Date()); // [object prototype polluted]


// 假如你修改了Symbol.toStringTag 属性的值，那么通过Object.prototype.toString.call()方法返回的结果可能是其它类型。

```



### 判断文本框输入内容的类型

https://blog.csdn.net/qq_53810245/article/details/125880463



### typescript使用类型里面制定的属性

```js


Omit< key:value,key> 基于已经声明的类型进行属性剔除获得新类型

type User = {
    id: string,
    age: number,
    name: string
}

type UserWithoutName = Omit<User, 'name'> // UserWithoutName ={id: string; age: number;}


Pick< key:value,key > 从KeyValue中挑选出部分Key对应的类型当作新类型使用（与omit相反，omit是剔除声明项，pick是挑选声明项）


interface Todo {
    title: string;
    description: string;
    completed: boolean;
}

type TodoPreview = Pick<Todo,  'title' | 'completed'>;

const todo: TodoPreview = {
    title: 'Clean room',
    completed: false
};


Exclude< T, U >  T中取T、U交集的补集

    type T0 = Exclude<"a" | "b" | "c", "a">;      
    // "b" | "c"
    type T1 = Exclude<"a" | "b" | "c", "a" | "b">;     
    // "c"
    type T2 = Exclude<string | number | (() => void), Function>; 
    // string | number




```



### splitChunk路由分包

chunks: 'async'

### 前端白屏时间过久可以怎么分析

埋点、断点、 谷歌浏览器的performance
