// debounce

// 简单版

function debounce(fn, delay = 100) {
    let timerId = null;

    return function(...args) {
        if(timerId) clearTimeout(timerId);

        timerId = setTimeout(() => {
            fn.apply(this, args); // 保证fn的this和外层匿名function的this指向一致
        }, delay)
    }
}


// 第一次立即执行，后面只执行最后一次

function debounce(fn, delay = 100, immediate = false) {
    let timerId = null;

    return function(...args) {
        if(timerId) clearTimeout(timerId);
        
        if(immediate && !timerId) {
            fn.apply(this, args);
        }

        timerId = setTimeout(() => {
            fn.apply(this, args); // 保证fn的this和外层匿名function的this指向一致
        }, delay)
    }
}


// 第一次立即执行， 再次触发第一次也能执行

function debounce(fn, delay = 100, immediate = false) {
    let timerId = null;

    return function(...args) {
        if(timerId) clearTimeout(timerId);
        
        if(immediate && !timerId) {
            fn.apply(this, args);
        }

        timerId = setTimeout(() => {
            timerId = null;
            fn.apply(this, args); // 保证fn的this和外层匿名function的this指向一致
        }, delay)
    }
}