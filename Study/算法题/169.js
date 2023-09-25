/**
 * @param {number[]} nums
 * @return {number}
 */
var majorityElement = function(nums) {
    var obj = {};

    for(let v of nums) {
        if(obj[v]) {
            obj[v]++;
        } else {
            obj[v] = 1;
        }
    }
    
    for(let key in obj) {
        if(obj[key] > nums.length /2 ) {
            return key;
        }
    }
};


var majorityElement = function(nums) {
    nums.sort((a, b) => a - b);

    return nums[Math.floor(nums.length / 2)];
};


