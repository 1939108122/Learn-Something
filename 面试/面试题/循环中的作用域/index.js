// 有几种方式让其输出0 1 2 3 4

for(var i = 0; i < 5; i++) {
    setTimeout(() => {
        console.log(i);
    })
}



// let 创建块作用域

for(let i = 0; i < 5; i++) {
    setTimeout(() => {
        console.log(i);
    })
}


// IIFE创建函数作用域

for(var i = 0; i < 5; i++) {
    (function(i) {
        setTimeout(() => {
            console.log(i);
        })
    })(i)
}


for(var i = 0; i < 5; i++) {
    (function() {
        var j = i;
        setTimeout(() => {
            console.log(j);
        })
    })()
}
