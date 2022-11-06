// 转义

// .除换行外任何字符  或者表示普通的小数点

let price1 = '1234';
let price2 = '12.34';

//  "+"表示匹配前面的表达式一次或者多次、 \d表示0-9的数字
console.log(/\d+.\d+/.test(price1)); // 此处的“.”代表 除换行外任何字符

console.log(/\d+\.\d+/.test(price2)); // 此处的“.”代表 普通的小数点


let reg1 = /\d+\.\d+/;

console.log(reg1, 'reg1');  //    /\d+\.\d+/

let reg2 = new RegExp('\d+\.\d+');

console.log(reg2, 'reg2'); //    /d+.d+/

console.log('\d+\.\d+', '我是转义过后的');

// 这里字面量和构造函数创建正则结果不一样，因为构造函数将字符串进行了转义
//   \d+\.\d+  -> d+.d+



// 要想一致需多加上一个转义字符“\”
let reg3 = new RegExp('\\d+\\.\\d+');

console.log(reg3, 'reg3');



