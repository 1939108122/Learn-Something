// // https://juejin.cn/post/7134970746580762637

// // https://juejin.cn/post/7072528644739956773


// // 浅拷贝

// var obj1 = {
//     name: 'xxx',
//     info: {
//         name: 'aaa',
//         age: 18
//     }
// };

// var obj2 = Object.assign({}, obj1); // 浅拷贝

// console.log(obj1 === obj2);  // false


// obj2.name = 'kkk'; // 属性为基础类型，不会影响源对象
// obj2.info.name = 'bbb'; // 改变引用类型的属性，共享内存的源对象 info的属性也受其影响

// console.log(obj1); // { name: 'xxx', info: { name: 'bbb', age: 18 } }
// console.log(obj2); // { name: 'kkk', info: { name: 'bbb', age: 18 } }




// 赋值

var obj1 = {
    name: 'xxx',
    info: {
        name: 'aaa',
        age: 18
    }
};

var obj2 = obj1; // 赋值

console.log(obj1 === obj2);  // true 指向同一个堆内存对象


obj2.name = 'kkk'; // 共享同一个对象数据，都受影响
obj2.info.name = 'bbb'; // 共享同一个对象数据，都受影响
console.log(obj1); // { name: 'kkk', info: { name: 'bbb', age: 18 } }
console.log(obj2); // { name: 'kkk', info: { name: 'bbb', age: 18 } }









// 实现一个浅拷贝

// 1
function shallowCopy(obj) {
    let target = {};
    for(let key in obj) {
        if(obj.hasOwnProperty(key)) { // 自身属性
            target[key] = obj[key]
        }
    }
    return target;
}


// 2
let obj1 = { name: 'jack', inner: {a: 1, b: 2}};

let obj2 = {...obj1};





// 实现一个深拷贝

function deepCopy1(obj) {

    if(!isObjectOrArray(obj)) return obj;

    let target = Array.isArray(obj) ? [] : {};

    for(let key in obj) {
        if(obj.hasOwnProperty(key)) { // 自身属性

            if(isObjectOrArray(obj[key])) {
                target[key] = deepCopy1(obj[key]);
            } else {
                target[key] = obj[key];
            }
        }
    }
    return target;
}


function isObjectOrArray(target) { // 是数组或者对象就继续递归赋值
    return typeof target !== null && typeof target === 'object';
}




