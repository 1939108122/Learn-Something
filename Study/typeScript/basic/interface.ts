interface person {
    a: string;
    [propName: string]: any
}

let b:person = {
    a: '2',
    b: true,
    c: 1
}

// 接口定义函数类型
interface teacherFunc {
    (id: string, age: number) : boolean
}

let iamFunc: teacherFunc = function (id: string, age: number) {return  age > -1}


// 索引
interface StringArray {
    [index: number]: string;
  }
  
  let myArray: StringArray;
  myArray = ["Bob", "Fred"];
  
  let myStr: string = myArray['0'];
  console.log(myStr);


  class Animal1 {
    name: string;
}
class Dog extends Animal1 {
    breed: string;
}

// 错误：使用数值型的字符串索引，有时会得到完全不同的Animal!
// interface NotOkay {
//     [x: number]: Animal;
//     [x: string]: Dog;
// }




interface Counter {
    (start: number): string;
}

let counter = <Counter>function (start: number) { };
