
var thirdMax = function(arr) {
    arr = Array.from(new Set(arr));
    let len = arr.length;
    if(len <= 3) {
        return len === 1 ? arr[0] : len === 2 ? Math.max(arr[0], arr[1]) : Math.min.apply(null, arr);
    }
    
    
    while(arr.length > 3) {
        let val = Math.min.apply(null, arr);
        let index = arr.indexOf(val);
        arr.splice(index, 1);
    }

    return Math.min.apply(null, arr);
    
    
};


console.log(thirdMax([1,1,1,3,3,8,8,7,6,6,7]));


// 找出数组第二大的数
function secondMax(arr) {
    let len = arr.length;

    if(!len) return false;
    if(len < 3) {
        return len === 1 ? arr[0] : Math.min(arr[0], arr[1]);
    }

    let resultArr = [-Infinity, -Infinity];
    for(let i = 0; i < len; i++) {
        if(arr[i] > resultArr[1]) {
            let temp = resultArr[1];
            resultArr[1] = arr[i];
            resultArr[0] = temp;
        } else {
            if(arr[i] > resultArr[0] && arr[i] !== resultArr[1]) {
                resultArr[0] = arr[i];
            }
        }
    }
    return Math.min(resultArr[0], resultArr[1]);
}

console.log(secondMax([1,2,3,4,5,5,6,6]));