
/**
 * 题目 1
 * 实现监听对象函数 observer
 */

// Observer

function observer(obj, path, cb) {
  // 时下
}

var o = {
  a: 1,
  b: 2,
  c: {
    x: 1,
    y: 2
  }
}

observer(o, ['a', 'c.x'], (v, prev) => {
         console.log(v);
	 console.log(prev);
});

o.a = 2;// 1, 2
o.b = 3;// 不打印
o.c.x = 3;// 1, 3





/**
 * 题目 2
 *  金额数字的千分位展示
 * 提示： 注意负数场景
 */
function toPriceString(price) {
  //  你的代码
  let s = String(price).split('');
  let arr = s.reverse(), count = 0, resultArr = [];
  for(let i = 0; i < arr.length; i++) {
    count++;
    resultArr.push(arr[i]);
    if(count % 3 === 0) {
      resultArr.push(',');
    }
  }

  return resultArr.reverse().join(''); 

}
console.log(toPriceString(1234567)); // '1,234,567'





// 题目3: JS实现一个带并发限制的异步调度器Scheduler，
// 保证同时运行的任务最多有两个。
// 完善代码中Scheduler类，
// 使得以下程序能正确输出

class Scheduler {
	constructor() {
		this.count = 2
		this.queue = []
		this.run = []
	}

	add(task) {
  // ...
    
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


