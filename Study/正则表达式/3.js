// 选择符的使用

 // 1: ’｜‘ 或者符号

let s = 'learning';

 console.log(/aaaa|l/.test(s));

//  匹配 北京/上海 电话号码

let tel = '010-1234567';

console.log(/010\-\d{7,8}|020\-\d{7,8}/.test(tel));

// 或者用’（）‘提取共有的

console.log(/(010|020)\-\d{7,8}/.test(tel));





// 原子表与原子组中的选择符

// 原子表
let reg3 = /[123456]/; //匹配的是 1｜2｜3｜4｜5｜6

console.log(reg3.test('1'), '原子表');


// 原子组
let reg4 = /(123|456)/; //匹配的是 123｜456

console.log(reg4.test('123'), '原子组');
