// 泛型 类型不明确时适用
// 单个
function fn1<T>(a: T):T {
    return a;
}


fn1(10); //自动推断
fn1<string>('1'); ///指定类型


// 多个

function fn2<T, K>(a: T, b: K):T {
    return a;
}

fn2<number, string>(10, 'hey');


// 泛型继承接口

interface inter {
    length: number
}


function fn3<T extends inter>(a: T):T {
    return a;
}

fn3('12');



// 泛型应用于类


class Myclass<T> {
    name: T;
    constructor(name: T) {
        this.name = name;
    }
}

let mclass = new Myclass<string>('的撒上点');



// 泛型约束

// 1: 指定更加具体的类型

function fnn2<Type>(a: Type[]): Type[] {
    console.log(a.length);
    return a;
}

// 2: 添加约束

interface Length {
    length: number
}

function fnn3<Type extends Length>(a: Type): Type {
    console.log(a.length);
    return a;
}

fnn3([]);


// 变量之间约束

function getProp<Type, Key extends keyof Type>(obj: Type, key: Key){
    return obj[key];
}

getProp({name: '的撒的', string: 18}, 'name') //的撒的


getProp(18, 'toFixed');



// 接口中使用泛型

interface GenericInInterface<Type> {
    id: (value: Type) => Type;
    ids: () => Type[]
}

let genericInInterface: GenericInInterface<number> = {
    id(value) {return value},
    ids() {return [1]}
}



// 泛型工具类型  Partial、 Readonly

interface Props {
    id: string,
    age: number
}

type PartialProps = Partial<Props>

let partialProps: PartialProps = {} //Partial关键词让所有属性都变为可选



// Pick 挑选出指定属性
interface Props1 {
    id: string,
    age: number
}

type PickProps = Pick<Props1, 'age'>

let pickProps: PickProps = {
    age: 16
}




type RecordType = Record<'a' | 'b' | 'c', string> 


let recordType: RecordType = {
    a: '1',
    b: '2',
    c: '3'
}

// 索引签名类型

interface MyArr22 {
    [key: number]: number
}

let myarr22: MyArr22 = {
    1: 1
}

let arr33 :MyArr22 = [1]



// 映射类型  只能在类型别名中使用

type PropKeys = 'x' | 'y' | 'z';

type Type6 = {x: number, y: number, z: number};


type Type7 =  { [key in PropKeys]:number}



type PropKeys1 = {x: number, y: string, z: boolean};

type Type8 = {[key in keyof PropKeys1]:string }


