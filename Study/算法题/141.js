/**
 * 环形链表
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} head
 * @return {boolean}
 */


var hasCycle = function(head) {
    while(head) {
        if(head.tag) {
            return true;
        } else {
            head.tag = true;
            head = head.next;
        }
    }
    return false;
};





// 快慢指针
var hasCycle = function(head) {

    let slow = head;
    let fast = head;
    while(slow && fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;

        if(slow === fast) {
            return true;
        }
    }
    return false;
};