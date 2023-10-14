
/**
 * 题目 1
 * 实现监听对象函数 observer
 */

// Observer

function observer(obj, path, cb) {
    // 实现
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
  }
  
  var o = {
    a: 1,
    b: 2,
    c: {
      x: {
        z: 1
      },
      y: 2
    }
  }
  
  observer(o, [ 'a', 'c.y','c.x.z'], (v, prev) => {
        console.log(v);
       console.log(prev);
  });
  
  o.a = 2;// 2,1
  o.b = 3;// 不打印

  o.c.y = 3;// 3,2
  o.c.x.z = 3;// 3,1