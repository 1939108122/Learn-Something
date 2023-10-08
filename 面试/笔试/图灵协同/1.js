var a = 1;

function b() {
    var a = 2;
    function a() { console.log(3); }
    return a;
    function a() { console.log(4); }
}

let c = b();

console.log(c);