for(let i = 0; i< 2; i++) {

}

console.log(i); // 报错




for(var i = 0; i< 2; i++) {

}

console.log(i); // 2



// // 典型的javascript是词法作用域而不是动态作用域的例子

function foo () {
    console.log(a); // 输出2 不是 3
}

function bar () {
    var a = 3;
    foo();
}
var a = 2;

bar();