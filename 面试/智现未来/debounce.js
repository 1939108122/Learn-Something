function debounce(fn, delay = 1000) {
    let timeId = null;
    return function (...args) {
        if(timeId) {
            clearTimeout(timeId);
        }
        timeId = setTimeout(() => {
            fn.apply(this, args);
            timeId = null;
        }, delay);
        
    }
}



function a() {
    let timeId;
    timeId = setTimeout(() => {
        console.log(1121);
    }, 5000);

    if(timeId) {
        clearTimeout(timeId);
    }
    
    // console.log(timeId, '1231');
}
a();

