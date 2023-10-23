
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




  // 题目3: JS实现一个带并发限制的异步调度器Scheduler，
// 保证同时运行的任务最多有两个。
// 完善代码中Scheduler类，
// 使得以下程序能正确输出

class Scheduler {
	constructor() {
        // 最大并发数
		this.max = 2;
        // 当前并发任务数
        this.count = 0;
        // 阻塞的任务队列
		this.queue = [];
	}

	async add(fn) {
        if (this.count >= this.max) {
            // 若当前正在执行的任务，达到最大容量max
            // 阻塞在此处，等待前面的任务执行完毕后将resolve弹出并执行
            await new Promise(resolve => this.queue.push(resolve));
        }
        // 当前并发任务数++
        this.count++;
        // 使用await执行此函数
        const res = await fn();
        // 执行完毕，当前并发任务数--
        this.count--;
        // 若队列中有值，将其resolve弹出，并执行
        // 以便阻塞的任务，可以正常执行
        this.queue.length && this.queue.shift()();
        // 返回函数执行的结果
        return res;
    }
}


const timeout = (time) => new Promise(resolve => {
	setTimeout(resolve, time)
})

const scheduler = new Scheduler()
const addTask = (time, order) => {
	scheduler.add(() => timeout(time)).then(() => console.log(order))
}

addTask(1000, '1')
addTask(500, '2')
addTask(300, '3')
addTask(400, '4')
// output: 2 3 1 4

// 一开始，1、2两个任务进入队列
// 500ms时，2完成，输出2，任务3进队
// 800ms时，3完成，输出3，任务4进队
// 1000ms时，1完成，输出1
// 1200ms时，4完成，输出4