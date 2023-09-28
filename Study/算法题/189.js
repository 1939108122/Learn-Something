/**
 * @param {number[]} nums
 * @param {number} k
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var rotate = function(nums, k) {
    let len = nums.length;
    let arr = new Array(len);
    for(let i = 0; i < len; i++) {
      let j = (i + k) % len;
      arr[j] = nums[i];
    }
    for(let i = 0; i < len; i++) {
        nums[i] = arr[i];
    }
    
};







var rotate = function(nums, k) {
    for(let i = 0; i < k; i++) {
        nums.unshift(nums.pop())
    }  
};