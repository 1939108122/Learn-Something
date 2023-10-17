function sleep(duration) {
    return new Promise((resolve, reject) => {
            setTimeout(() => resolve("done!"), duration)
        });

}


async function order() {
    let result = await sleep(2000);
    console.log(result);

    console.log(2);
}

// order();


async function test() {
    let a =  await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('settimeout')
        }, 1000);
    });

    console.log(a, 'a');
    return a;
}
// test();
test().then(data => {
    console.log(data, 'data')
}, (reject) => console.log(reject, 'reject')).catch((err) => {
    console.log(err, 'err');
})







