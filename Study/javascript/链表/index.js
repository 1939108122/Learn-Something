// 为每一项创建链表节点
function listNode(data, next) {
    this.data = data;
    this.next = next;
}


// 数组转成链表
function ArrayToListNode(arr) {
    let nxt = null;
    arr.reverse().forEach(item => {
        nxt = new listNode(item, nxt);
    });
    return nxt;
}


// 链表转成数组
function listNodeToArray(head) {
    let arr = [];
    while(head) {
        arr.push(head.data);
        head = head.next;
    }

    return arr;
}

ArrayToListNode([1, 2, 3, 4]);