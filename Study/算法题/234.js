/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {boolean}
 */
var isPalindrome = function(head) {
    function listNodeToArray(node) {
        let arr = [];
        while(node) {
            arr.push(node.val);
            node = node.next;
        }
        return arr;
    }

    let arr = listNodeToArray(head);
    
    let len = arr.length;
    let j = len - 1;
    for(let i = 0; i < Math.floor(len / 2); i++) {
        if (arr[i] !== arr[j]) {
            return false;
        }
        j--;
    }
    return true;
};