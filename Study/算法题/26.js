var removeDuplicates = function(nums) {
    let obj = {};

    for(var i = 0; i < nums.length; i++) {
      if(obj[nums[i]]) {
        nums.splice(i, 1);
        i--;
      } else {
        obj[nums[i]] = true;
      }
    }

    return nums.length;
};



// 双指针法


var removeDuplicates = function(nums) {
    const size = nums.length;
    let slowP = 0;

    for (let fastP = 0; fastP < size; fastP++) {
        if(nums[slowP] !== nums[fastP]) {
            slowP++;
            nums[slowP] = nums[fastP];
        }
    }
    return slowP + 1;
};