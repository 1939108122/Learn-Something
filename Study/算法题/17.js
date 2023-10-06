/**
 * @param {string} digits
 * @return {string[]}
 */
var letterCombinations = function(digits) {
    const map = ["","","abc","def","ghi","jkl","mno","pqrs","tuv","wxyz"];
    const len = digits.length;
    if(len === 0) {
        return [];
    }
    if (len === 1) {
        return map[digits[0]].split('');
    }
    let res = [];
    let path = [];
    backTracking(len, digits, 0);
    return res;

    function backTracking(len, s, index) {
        if(path.length === len) {
            res.push(path.join(''));
            return;
        }
        for(let v of map[s[index]]) {
            path.push(v);
            backTracking(len, s, index + 1);
            path.pop();
        }

    }

};