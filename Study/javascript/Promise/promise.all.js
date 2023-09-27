Promise._all = function(proms) {
    let res, rej;
    let p = new Promise((resolve, reject) => {
        res = resolve;
        rej = reject;
    });

    let pcount = 0; //proms长度
    let result = []; // 结果数组
    let i = 0; // resolve 按顺序存放结果的下标
    let fullfilledCount = 0; // reslove数量

    for (const prom of proms) {
        const index = i; // 创建块作用域，保存当前作用域的值
        i++;
        pcount++;
        // prom可能是普通变量 也有可能是promise对象
        Promise.resolve(prom).then((data) => {
            result[index] = data;
            fullfilledCount++;

            if(fullfilledCount === pcount) { // for循环结束后才会判断，因为是异步
                res(result);
            }
        }, rej);
        
    }

    
    if(pcount === 0) {
        res(result);
    }
    return p;
}










const p1 = new Promise((resolve, reject) => {
    resolve("p1");
});


const p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("p2");
    }, 3000);
});

const p3 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("p3");
    }, 1000);
});

const p4 = new Promise((resolve, reject) => {
    resolve("p4");
});


Promise._all([p4, p3, p2, p1]).then(
    (data) => {
        console.log(data);
    }, 

    (reject) => {
        console.log(reject, 'reject');
    }
)


// Promise.all([]).then(
//     (data) => {
//         console.log(data);
//     }, 

//     (reject) => {
//         console.log(reject, 'reject');
//     }
// );



