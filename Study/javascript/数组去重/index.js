let arr = [7, 6, 6, 3, 2, 1, 1, 3, 3, 9, 1, 7];

// 1： new Set 和 Array.from()

console.log(Array.from(new Set(arr)), 'Array.from');

console.log([...new Set(arr)], 'Array.from');



// 2: for + while + indexOf

function unique1(arr) {
    if(!Array.isArray(arr)) return false;

    for(let i = 0; i < arr.length; i++) {
        while(arr.indexOf(arr[i], i + 1) > -1) {
            arr.splice(arr.indexOf(arr[i], i + 1), 1);
        }
    }
    return arr;
}

console.log(unique1(arr), 'unique1');



// 3: for + indexOf(或者 includes，includes可检测 NaN的重复，indexOf不行)
function unique2(arr) {
    if(!Array.isArray(arr)) return false;

    let result = [];
    for(let i = 0; i < arr.length; i++) {
        if(result.indexOf(arr[i]) === -1) {
            result.push(arr[i]);
        }
    }
    
    return result;
}


console.log(unique2(arr), 'unique2');





// 4: for + sort
function unique3(arr) {
    if(!Array.isArray(arr)) return false;
    arr.sort((a, b) => a - b);

    let result = arr.length > 0 ? [arr[0]] : [];
    for(let i = 1; i < arr.length; i++) {
        if(arr[i] !== arr[i - 1]) {
            result.push(arr[i]);
        }
    }
    
    return result;
}

console.log(unique3(arr), 'unique3');



// 5: for + Map, map可检测NaN的重复


function unique4(arr) {
    if(!Array.isArray(arr)) return false;
    let map = new Map(), result = [];

    for(let i = 0; i < arr.length; i++) {
        if(!map.has(arr[i])) {
            map.set(arr[i], false);
            
            result.push(arr[i]);
        }
    }
    
    return result;
}

console.log(unique4(arr), 'unique4');



// 6: filter + indexOf


function unique5(arr) {
    return arr.filter((item, index) => {
        return arr.indexOf(item) === index;
    })
}

console.log(unique5(arr), 'unique5');
