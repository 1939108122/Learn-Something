// 变量和函数声明都会移动到各自作用域的最顶端，这个过程称为 提升 

foo();

function foo() {
    console.log(a);
    var a = 2; // undefined

}

// 实际变为

function foo() {
    var a;
    console.log(a);

    a  = 2;
}

foo();


// 函数声明会被提升，函数表达式不会提升


foo(); // TypeError

var foo = function bar() {
    console.log(12313);
}



// 函数声明优先级大于变量


foo(); // 1 忽略 var foo的变量声明

var foo;

function foo() {
    console.log(1);
}

foo = function () {
    console.log(2);
}





function foo1() {
    console.log(a);
    var a = 2;
}


function foo2() {
    console.log(a);
    let a = 2;
}

foo1();
foo2();