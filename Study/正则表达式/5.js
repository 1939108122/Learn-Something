// 字符边界约束

// '^' 表示 起始字符， '$'表示结束字符

console.log(/^\d/.test('1dasdsa'));

console.log(/^\d$/.test('1'));  //只有一个数字的正则

// 匹配一个三到六位的字母字符串

console.log(/^[a-z]{3,6}$/.test('abcdef'));   //true