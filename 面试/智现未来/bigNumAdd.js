// 两数相加

function bigNumberAdd(n1, n2) {
    let max = Math.max(n1.length, n2.length);

    n1 = n1.padStart(max, 0); // 补0
    n2 = n2.padStart(max, 0); // 补0

    let count = 0, res = '';
    for(let i = max - 1; i >= 0; i--) {
        let sum = +n1[i] + +n2[i] + count;
        count = Math.floor(sum / 10);
        res = (sum % 10) + res;
    }

    

    return count === 1 ? res + '1' : res;
    
}


let n1 = '1234567';
let n2 = '867934';

console.log(bigNumberAdd(n1, n2));