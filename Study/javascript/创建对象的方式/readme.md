#### 创建对象的方式


##### 工厂模式

```js
function factor(name, age) {
    let o = new Object();
    o.name = name;
    o.age = age;
    o.sayName = function() {
        console.log(this.name);
    }
    return o;
};

let obj = factor('jack', 18);
```

##### 构造函数模式

```js
function Person() {
    this.name = 'jack';
    this.age = 18;
    this.sayName = function() {
        console.log(this.name); 
    }
}

let person = new Person();
```


##### 原型模式

```js

function Foo() {
    Foo.prototype.name = 'jack';
    Foo.prototype.age = 18;
    Foo.prototype.sayName = function() {
        console.log(this.name);
    }
}

let foo = new Foo();
```



