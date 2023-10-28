
var tree = {
    value: '-',
    left: {
        value: '+',
        left: {
            value: 'a'
        },
        right: {
            value: '*',
            left: {
                value: 'b'
            },
            right: {
                value: '-',
                left: {
                    value: 'c'
                },
                right: {
                    value: 'd'
                }
            }
        }
    },
    right: {
        value: '/',
        left: {
            value: 'e'
        },
        right: {
            value: 'f'
        }
    }
}


let arr = [];

function InOrder(treeNode) {
    if(treeNode) {
        InOrder(treeNode.left);
        arr.push(treeNode.value);
        InOrder(treeNode.right);
    }
}

InOrder(tree);
console.log(arr);




console.log('aaa');

setTimeout(() => {
    console.log(111);
}, 0);

async function run() {
    await console.log();
}