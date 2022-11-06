// 字面量创建正则表达式
let reg = /a/; //全局匹配a
console.log(reg.test('fdsfdsa'));


let a = 'u';
console.log(/a/.test('uuuuuu')); // 这样意思是检测出带a的字符，并不能使用变量a

console.log(eval(`/${a}/`).test('uuuuu')); //eval可使用变量 （不安全）
