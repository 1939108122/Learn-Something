function drive(fn) {
    setTimeout(fn, 2000);
}


function shopping(fn) {
    setTimeout(fn, 1000);
}


drive(() => {
    console.log('drive');
    shopping(() => {
        console.log('shopping');
    })
})  //为了保证先drive 再 shopping，嵌套了回调函数





// promise为了解决回调地狱，es6制定了标准


function promiseDrive() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('drive');
        }, 2000);
    });
}


function promiseShopping() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('shopping');
        }, 1000);
    });
}


// 链式调用
promiseDrive().then((data) => {
        console.log(data);

        return promiseShopping();
    }).then((data) => {
        console.log(data);
    });





let promise = new Promise((resolve, reject) => {
    // resolve('resolve');
    reject('reject');
    // throw new Error('错误');
})

promise.then((data) => {
    console.log(data, '成功');
}, (data) => {
    console.log(data, '失败');
}).catch((err) => {
    console.log(err);
})


function foo() {

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(11);
        })
    })
}

foo().then((data) => {
    console.log(data);
    return data;
}).then(data => {
    console.log(data);
    return data;
}).then((data) => {
    console.log(data);
})