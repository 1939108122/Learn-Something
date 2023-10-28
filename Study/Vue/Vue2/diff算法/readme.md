### vue2的diff算法

diff算法本质是找出两个对象之间的差异，目的是尽可能复用节点。


```js
function patch (oldVnode, vnode) {
	if (sameVnode(oldVnode, vnode)) {
		patchVnode(oldVnode, vnode)
	} else {
		const oEl = oldVnode.el
		let parentEle = api.parentNode(oEl)
		createEle(vnode)
		if (parentEle !== null) {
			api.insertBefore(parentEle, vnode.el, api.nextSibling(oEl))
			api.removeChild(parentEle, oldVnode.el)
			oldVnode = null
		}
	}
	return vnode
}



function sameVnode (a, b) {
  return (
    a.key === b.key &&  // key值
    a.tag === b.tag &&  // 标签名
    a.isComment === b.isComment &&  // 是否为注释节点
    // 是否都定义了data，data包含一些具体信息，例如onclick , style
    isDef(a.data) === isDef(b.data) &&  
    sameInputType(a, b) // 当标签是<input>的时候，type必须相同
  )
}

```

 
1：只比较同一层级，不跨级比较，diff的过程就是调用patch函数

2：sameNode方法对比，不同的话 旧节点有，新节点没有则删除旧节点，旧节点没有，新节点有则创建节点，都有且tag不同则删掉重建（不再进行深度比较）

3：如果 tag, key相同则复用（还需对比节点文本和子节点，patchVnode对比）

```js
patchVnode (oldVnode, vnode) {
    const el = vnode.el = oldVnode.el
    let i, oldCh = oldVnode.children, ch = vnode.children
    if (oldVnode === vnode) return
    if (oldVnode.text !== null && vnode.text !== null && oldVnode.text !== vnode.text) {
        api.setTextContent(el, vnode.text)
    }else {
        updateEle(el, vnode, oldVnode)
    	if (oldCh && ch && oldCh !== ch) {
	    	updateChildren(el, oldCh, ch)
	    }else if (ch){
	    	createEle(vnode) //create el's children dom
	    }else if (oldCh){
	    	api.removeChildren(el)
	    }
    }
}
```

4: 文本不一致则修改，子节点不同则进行双端比较（updateChildren）



vue2 双端比较

定义四个指针，oldStart, oldEnd, newStart, newOld

将oldStart和newStart、newOld对比，oldEnd和newStart、newOld对比，如果4种比较都没匹配，如果设置了key，就会用key进行比较，在比较的过程中，变量会往中间靠，一旦StartIdx>EndIdx表明oldCh和newCh至少有一个已经遍历完了，就会结束比较。

**设置key和不设置key的区别：
设置了key的话，在对比完首尾节点后，通过对旧节点列表建立一个 { key, oldVnode }的映射表，然后遍历新节点列表的剩余节点，根据newVnode.key在旧映射表中寻找可复用的节点，然后打补丁并且移动到正确的位置，所以为节点设置key可以更高效的利用dom。**

for(let i = 0; i < path.length; i++) {
        
        let arr = path[i].split('.');
        let value = obj[path[i]];
        if(typeof obj[arr[0]] === 'object') {
            observer(obj[arr[0]], [arr.slice(1).join('.')], cb);
        } else {
            Object.defineProperty(obj, path[i], {
                configurable: true,
                enumerable: true,
                get: function() {
                    return value;
                },
                set: function(newVal) {
                    cb(newVal, obj[path[i]]);
                }
            });
        }
    }






### vue3的diff算法（快速算法）的改进


1: vue2会对整个虚拟节点树遍历对比，vue3在模版编译（生成vnode）时增加静态标记，在diff的时候会跳过静态节点的对比。

2:  处理完首尾节点后（v3只会头和头比，尾和尾比），对剩余节点的处理方式。vue3是建立一个存储新节点数组中的剩余节点在旧节点数组上的索引的映射关系数组，建立完成这个数组后也即找到了可复用的节点，然后通过这个数组计算得到最长递增子序列，这个序列中的节点保持不动，然后将新节点数组中的剩余节点移动到正确的位置。（使用最长递增子序列优化对比流程，可以最大程度的减少 DOM 的移动，达到最少的 DOM 操作）


参考（https://segmentfault.com/a/1190000040808696）