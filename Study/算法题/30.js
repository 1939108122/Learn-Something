/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var searchInsert = function(nums, target) {
    let n = nums.length;
    let left = 0, right = n -1;
    while(left <= right) {
        let mid = Math.floor((left + right) / 2); 
        if(nums[mid] < target) {
            left = mid + 1;
        } else if(nums[mid] > target) {
            right = mid - 1;
        } else {
            return mid;
        }
    }
    return right + 1;
    // return left;

};