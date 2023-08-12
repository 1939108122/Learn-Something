// // 闭包
// var age = 12;

// function closures() {
//     var age = 20;

//     function foo() {
//         return age;
//     }
//     return foo;

// }

// var fn1 = closures();

// console.log(fn1());


// // 实现变量a自增



// function add1() {
//     var a = 1;

//     function add2() {
//         a++;
//         console.log(a);
        
//     }
//     return add2;

// }

// var add3 = add1();

// console.log(add3());
// console.log(add3());
// console.log(add3());






// 循环中的IIFE：实现私有作用域，避免污染全局作用域。

for(var i = 0; i < 5; i++) {
    (function(i) {
        setTimeout(function timer(){
            console.log(i);
        }, i*1000);
    })(i)
}





// 数据封装，变量私有
function operateCount() {
    let count = 0;
    return {
        incrementCount: function () {
            count++;
        },
        decrementCount: function() {
            count--;
        },
        getCount: function() {
            return count;
        }
    };
}

let foo = operateCount();

foo.incrementCount();
foo.getCount();




// 回调函数、事件处理

// 回调函数

function wait(message) {
    setTimeout(function() {
        console.log(message);
    }, 100);
}

wait('iam message');
// 防抖

function debounce(fn, delay = 100) {
    let timerId = null;
    return function () {
        const context = this;
        if (timerId) {
            window.clearTimeout(timerId);
        }
        timerId = setTimeout(() => {
            fn.apply(context, arguments);
            timerId = null;
        }, delay);
    };
}



