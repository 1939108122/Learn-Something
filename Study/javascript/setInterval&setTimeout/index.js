function delay(duration) {
    let start = Date.now();

    while(Date.now() - start < duration) { // 延时 duration ms
        
    }
}

 let timerId = setInterval(() => {
    console.log(1);
    delay(1000);
}, 500);