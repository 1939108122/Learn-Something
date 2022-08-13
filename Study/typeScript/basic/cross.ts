// 交叉类型： 将多个类型合并成一个类型。

interface Person6 {
    name: string
}

interface Person7 {
    age: number
}

// type cross = Person6 & Person7

let oo: Person6 & Person7 = {
    name: 'oo',
    age: 15
}


// 交叉类型 & 与 接口 （extends）的对比

// 相同点： 都可以实现对象类型的组合
// 不同点： 两种方式实现类型组合时，对同名属性之间，处理类型冲突的方式不同。

// eg:

interface A {
    fn: (value: number) => string
}

// interface B extends A {
//     fn: (value: string) => string
// }


interface B {
    fn: (value: string) => string
}

type AB = A & B
// 可以理解为 fn: (value: string | number) => string


let CC: AB
// CC.fn(1)

