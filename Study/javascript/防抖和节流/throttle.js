// 节流

function throttle(fn, delay = 100) {
    let previous = 0;

    return function(...args) {
        let now = Date.now();

        if(now - previous > delay) {
            previous = now;
            fn.apply(this, args);
        }
    }
}