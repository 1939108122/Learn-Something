// 二分查找


// 简单的的二分查找


function binarySearch(nums, target) {
    let len = nums.length;
    if(!len) return -1;
    
    let left = 0, right = len - 1;
    while(left <= right) {
        let middle = Math.floor((left + right) / 2);
        if(nums[middle] === target) {
            return middle;
        }

        if(target > nums[middle]) {
            left = middle + 1;
        } else {
            right = middle - 1;
        }

    }

    return -1;
}

console.log(binarySearch([0, 1, 2, 3, 4, 5, 6, 7], 2));





// 搜索旋转排序数组

function search(nums, target) {
    let len = nums.length;
    if(!len) return -1;
    
    let left = 0, right = len - 1;
    while(left <= right) {
        let middle = Math.floor((left + right) / 2);
        if(nums[middle] === target) {
            return middle;
        }

        if(nums[middle] < nums[right]) { // 说明[middle, right]为升序
            if(nums[middle] < target && target <= nums[right]) {
                left = middle + 1;
            } else {
                right = middle - 1;
            }
        } else { // [left, middle] 为升序
            if(nums[left] <= target && target < nums[middle]) {
                right = middle - 1;
            } else {
                left = middle + 1;
            }
        }
        

    }

    return -1;
};

console.log(search([0, 1], 2));