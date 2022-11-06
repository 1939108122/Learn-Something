// 对象创建正则表达式

let reg = new RegExp('u', 'g'); // /u/g
console.log(reg);

// 使用变量

let a = 'u';
console.log(new RegExp(a, 'g'));



// 这两个出来的正则匹配都一样 /a/g
new RegExp(/a/, 'g')  

new RegExp('a', 'g')




