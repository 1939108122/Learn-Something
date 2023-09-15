var removeDuplicates = function(nums) {
    let obj = {};

    for(let i = 0; i < nums.length; i++) {
        if (!obj[nums[i]]){
            obj[nums[i]] = 1;
        } else {
            obj[nums[i]] += 1;
            if(obj[nums[i]] > 2) {
                nums.splice(i, 1);
                i--;
            }
        }
    }
    return nums.length;
};