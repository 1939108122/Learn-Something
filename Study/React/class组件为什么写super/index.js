class Person {
    constructor(name) {
        this.name = name;
    }
}

class Man extends Person {
    constructor(name) {
        this.sayName();
    }
    sayName() {
        console.log(321312);
    }
}

const man = new Man();