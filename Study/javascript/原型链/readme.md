#### prototype&__proto__

```js
function Person () {
    // 
}

Person.prototype.name = 'jack';
let person = new Person();

console.log(person.name);  // jack
console.log(person.__proto__ === Person.prototype); // true

console.log(Person === Person.prototype.constructor); // true

```

**每一个函数都有一个prototype属性，Person.prototype是一个对象，Person.prototype就是构造函数实例化对象的原型，每个对象都有一个_proto_属性，在这里person.__proto__就指向它的原型Person.prototype。**
![原型-导出 (1)](/assets/原型-导出%20(1)_hxyo608ig.png)



#### 实例和原型

**当读取实例的属性时，如果找不到，就会去实例的原型上查找，如果还找不到，就会去实例原型的原型上查找，直到找不到为止**

```js
function Person() {

}

Person.prototype.name = 'Kevin';

var person = new Person();

person.name = 'Daisy';
console.log(person.name) // Daisy

delete person.name;
console.log(person.name) // Kevin
```


**在这个例子中，我们给实例对象 person 添加了 name 属性，当我们打印 person.name 的时候，结果自然为 Daisy。
// 但是当我们删除了 person 的 name 属性时，读取 person.name，从 person 对象中找不到 name 属性就会从 person 的原型也就是 person.__proto__ ，也就是 Person.prototype中查找，幸运的是我们找到了 name 属性，结果为 Kevin。**

**原型的原型是由Object构造函数实例化出来的对象，也就是Object.prototype**


![原型-导出 (2)](/assets/原型-导出%20(2).png)



#### 原型链


**原型链就是由相互关联的原型组成的链式结构（下图红色部分）**


![原型-导出 (3)](/assets/原型-导出%20(3).png)


