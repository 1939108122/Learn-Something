// 类型兼容性


// 类的兼容性 （参数多的可以赋值参数少的）
class P1 {
    x: number;
    y: string
}

class P2 {
    x: number;
    y: string;
    z: boolean
}

let pp: P1 = new P2();



// 接口兼容性 （参数多的可以赋值参数少的）
interface Named {
    name: string;
}

interface Named2 {
    name: string;
    age: number
}

let xxx: Named = {name: '1'};
// y's inferred type is { name: string; location: string; }
let y: Named2 = { name: 'Alice', age: 18};
xxx = y;
// y = xxx;




// 函数兼容性(参数少的可以赋值参数多的)

const arrr = ['1', '2', '3'];
// arrr.forEach();
arrr.forEach(item => console.log(item));

// 函数参数

let xx = (a: number) => 0;
let yy = (b: number, s: string) => 0;

yy = xx; // OK
// xx = yy; // Error





interface PointD {
    a: number
    b: number
}

interface Point2D {
    a: number
    b: number
    c: number
}

type F2 = (p: PointD) => string;
type F3 = (p: Point2D) => string;

let f2: F2;
let f3: F3

// f3 = f2
// f2 = f3


// 函数返回值

// type D2 = () => {a: number, b: string};
// type D3 = () => {a: number};

// let d2: D2;
// let d3: D3;

// d2 = d3;