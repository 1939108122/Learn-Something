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