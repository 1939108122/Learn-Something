function SuperType() {
    this.name = 'jack';
}

SuperType.prototype.sayName = function() {
    console.log(this.name);
}


SubType.prototype = new SuperType();

function SubType() {
    
}


let subType = new SubType();

console.log(subType.sayName()); // jack




// 盗用构造函数

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





// 组合继承


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





// 原型式继承(引用值在每个对象之间共享)
function object(o) {
    function F() {}
    F.prototype = o;
    return new F();
}


let person = {
    name: 'jack',
    arr: [1, 2, 3] 
}


let person1 = object(person);

person1.arr.push(4);

let person2 = object(person);

person1.arr.push(5);

console.log(person.arr); // 1 2 3 4 5

