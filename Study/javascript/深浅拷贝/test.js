function foo(x) {
    x.push(4);
    x = [4, 5, 6, 7];
    console.log(x); // [4, 5, 6, 7]

};

let a = [1, 2, 3];
foo(a.slice());

console.log(a); // [1, 2, 3]


