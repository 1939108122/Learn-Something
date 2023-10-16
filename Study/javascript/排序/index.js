
var nums = [1, 7, 6, 10, 5, 9, 2, 3, 8];

// 冒泡排序 O(n2)


function bubbling(nums) {
    let len = nums.length;
    if(len <= 1) return nums;

    for(let i = 0; i < len; i++) {
        for(let j = 0; j < len - i - 1; j++) {
            if(nums[j] > nums[j + 1]) {
                [nums[j + 1], nums[j]] = [nums[j], nums[j + 1]];
            }
        }
    }
    return nums;
}

console.log(bubbling(nums));



// 快速排序 O(nlogn)


function quickSort(nums) {
    let len = nums.length;
    if(len <= 1) return nums;

    let midIndex = Math.floor(len / 2);

    let left = [], right = [];
    
    let privot = nums.splice(midIndex, 1)[0];

    for(let i = 0; i < nums.length; i++) {
        if(nums[i] < privot) {
            left.push(nums[i]);
        } else {
            right.push(nums[i]);
        }
    }

    return quickSort(left).concat([privot], quickSort(right));
    
    

}


console.log(quickSort(nums));