
// 暴力双重for循环 
/**
 * @param {number} target
 * @param {number[]} nums
 * @return {number}
 */
var minSubArrayLen = function(target, nums) {
    let len = nums.length;
    let ans = Number.MAX_VALUE;

    for(let i = 0; i < len; i++) {
        let sum = 0;
        for(let j = i; j < len; j++) {
            sum += nums[j];
            if(sum >= target) {
                ans = Math.min(ans, j - i + 1);
                break;
            }
        }
    }

    return ans === Number.MAX_VALUE ? 0 : ans;
};




// 滑动窗口

/**
 * @param {number} target
 * @param {number[]} nums
 * @return {number}
 */
var minSubArrayLen = function(target, nums) {
    let i = 0, ans = Number.MAX_VALUE, sum = 0;

    for(let j = 0; j < nums.length; j++) {
        sum += nums[j];

        while(sum >= target) {
            ans = Math.min(ans, j - i + 1);
            sum -= nums[i];
            i++;
        }
    }
    return ans === Number.MAX_VALUE ? 0 : ans;

};