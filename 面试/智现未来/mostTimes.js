function findMostTimes(str) {
    if(!str) {
        return;
    }
    if(str.length === 1) {
        return str[0];
    }

    let countObj = {};
    let arr = str.split('');
    let max = 0, s;
    for(let i = 0; i < arr.length; i++) {
        if(!countObj[arr[i]]) {
            countObj[arr[i]] = 1;
        } else {
            countObj[arr[i]]++;
        }
        if(countObj[arr[i]] > max) {
            max = countObj[arr[i]];
            s = arr[i];
        }
        
    }
    return s;
}

console.log(findMostTimes('fffffffaaaaaaaaaa'));
