var age = 12;

function closures() {
    var age = 20;

    function foo() {
        return age;
    }
    return foo;

}

var fn1 = closures();

console.log(fn1());


// 实现变量a自增



function add1() {
    var a = 1;

    function add2() {
        a++;
        console.log(a);
        
    }
    return add2;

}

var add3 = add1();

console.log(add3());
console.log(add3());
console.log(add3());