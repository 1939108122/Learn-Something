#### Es5的继承


##### 介绍原型链中的继承
```js
function SuperType() {
    this.name = 'jack';
    this.colors = ['blue', 'red'];
}

SuperType.prototype.sayName = function() {
    console.log(this.name);
}


SubType.prototype = new SuperType();

function SubType() {
    
}


let subType = new SubType();

console.log(subType.sayName()); // jack

console.log(subType.colors); // ['blue', 'red']


// 这种继承的缺点是所有实例对象会共享原型上的引用值，且子类型在实例化不能给父类型的构造函数传参
let let subType1 = new SubType();
subType1.colors.push('yellow');

console.log(subType.colors); // ['blue', 'red', 'yellow']
console.log(subType1.colors); // ['blue', 'red', 'yellow']
```



##### 盗用构造函数

```js
// 盗用构造函数
// 为了解决原型包含引用值导致继承的问题而出现的“盗用构造函数”
// 缺点是不能继承原型上的属性和方法

function SuperType() {
    this.colors = ['blue', 'red'];
}


function SubType() {
    SuperType.call(this);
}


let instance = new SubType();
instance.colors.push('black');

console.log(instance.colors); // ['blue', 'red', 'black']

let instance1 = new SubType();

console.log(instance1.colors); // ['blue', 'red']


```





##### 组合继承
```js
// 结合了原形链和盗用构造函数

function SuperType(name) {
    this.name = name;
    this.colors = ['blue', 'red'];
}

SuperType.prototype.sayName = function() {
    console.log(this.name);
}


SubType.prototype = new SuperType();

SubType.prototype.sayAge = function() {
    console.log(this.age);
}

function SubType(name, age) {

    SuperType.call(this, name);
    this.age = age;
}


let type = new SubType('jack', 18);
type.colors.push('black');


console.log(type.colors); // ['blue', 'red', 'black']

console.log(type.sayName()); // jack
console.log(type.sayAge()); // 18



let type1 = new SubType('rose', 17);


console.log(type.colors); // ['blue', 'red']

type.sayName(); // rose
type.sayAge(); // 17
```