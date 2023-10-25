const data = [
    { id: '01', name: '张大大', pid: '', job: '项目经理' },
    { id: '02', name: '小亮', pid: '01', job: '产品leader' },
    { id: '03', name: '小美', pid: '01', job: 'UIleader' },
    { id: '04', name: '老马', pid: '01', job: '技术leader' },
    { id: '05', name: '老王', pid: '01', job: '测试leader' },
    { id: '06', name: '老李', pid: '01', job: '运维leader' },
    { id: '07', name: '小丽', pid: '02', job: '产品经理' },
    { id: '08', name: '大光', pid: '02', job: '产品经理' },
    { id: '09', name: '小高', pid: '03', job: 'UI设计师' },
    { id: '10', name: '小刘', pid: '04', job: '前端工程师' },
    { id: '11', name: '小华', pid: '04', job: '后端工程师' },
    { id: '12', name: '小李', pid: '04', job: '后端工程师' },
    { id: '13', name: '小赵', pid: '05', job: '测试工程师' },
    { id: '14', name: '小强', pid: '05', job: '测试工程师' },
    { id: '15', name: '小涛', pid: '06', job: '运维工程师' }
];


// 数组转树结构



// 1: 递归
function arrToTree1(arr){
    if(!Array.isArray(arr)) return arr;
    const len = arr.length;
    if(len < 2) return arr;
    

    let resultArr = [];

        arr.forEach(item => {
            item.children = [];
        });

        arr.forEach(item => {
            if(item.pid === '') {
                resultArr.push(item);
            } else {
                let pObj = getObjByPid(resultArr, item.pid);
                pObj && pObj.children.push(item);
            }
        })
        return resultArr;

    function getObjByPid(arr, pid) {
        for(let value of arr) {
            if (value.id === pid) {
                return value;
            } else if(value.children && value.children.length) {
                const temp = getObjByPid(value.children, pid);
                if(temp) {
                    return temp;
                }
            }
        }
    }


}

let tree = arrToTree1(data);




// 2 双重循环
function arrToTree2(list) {
    list.forEach(child => {
      const pid = child.pid
      if(pid) {
        list.forEach(parent => {
          if(parent.id === pid) {
            parent.children = parent.children || []
            parent.children.push(child)
          }
        })
      }
    })
    return list.filter(n => !n.pid)
  }





// 树结构转数组


// 1: 深度转换
function treeToArr1(tree) {
    let result = [];
    for(let item of tree) {
        result.push(item);
        if(item.children && item.children.length) {
            result = result.concat(treeToArr1(item.children));
        }
    }

    return result;
}



// 2: 广度转换

function treeToArr2(tree) {
    let result = [];
    while(tree.length) {
        const item = tree.shift();
        result.push(item);

        if(item.children && item.children.length) {
            tree = tree.concat(item.children);
        }
    }
    return result;
}


