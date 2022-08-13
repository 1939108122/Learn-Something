enum Color {
    green = 2,
    blue = 4,
    red
}
// console.log(Color['green']);


enum initializer {
    A = getValue(),
    // B,
    B = 2
}

function getValue() {
    return 2;
}

enum FileAccess {
    // constant members
    None,
    Read    = 1 << 1,
    Write   = 1 << 2,
    ReadWrite  = Read | Write,
    // computed member
    G = "123".length
}


// 枚举变成类型

enum ShapeKind {
    Circle = 2,
    Square = 2,
}

interface Circle {
    kind: ShapeKind.Circle;
    radius: number;
}

interface Square {
    kind: ShapeKind.Square;  //此处 kind为类型
    sideLength: number;
}

let c: Circle = {
    kind: 1,
    //    ~~~~~~~~~~~~~~~~ Error!
    radius: 100,
}

// 枚举可正反向映射  要注意的是 不会为字符串枚举成员生成反向映射


// 数字
enum enumExp {
    A = 1,
    B = 2,
    C
}

// console.log(enumExp[1]);
// console.log(enumExp['A']);



// 字符串
enum enumExp1 {
    A = '1',
    B = '2'
}

console.log(enumExp1['A']);
console.log(enumExp1['1']); // 报错 字符串不能反向映射
