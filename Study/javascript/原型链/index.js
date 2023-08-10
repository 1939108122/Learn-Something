function Person () {
    // 
}

Person.prototype.name = 'jack';
let person = new Person();

console.log(person.name);  // jack

console.log(person.__proto__ === Person.prototype); // true

