"use strict";

Promise._all = function (proms) {
  var res, rej;
  var p = new Promise(function (resolve, reject) {
    res = resolve;
    rej = reject;
  });
  var pcount = 0; //proms长度

  var result = []; // 结果数组

  var i = 0; // resolve 按顺序存放结果的下标

  var fullfilledCount = 0; // reslove数量

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    var _loop = function _loop() {
      var prom = _step.value;
      var index = i; // 创建块作用域，保存当前作用域的值

      i++;
      pcount++; // prom可能是普通变量 也有可能是promise对象

      Promise.resolve(prom).then(function (data) {
        result[index] = data;
        fullfilledCount++;

        if (fullfilledCount === pcount) {
          // for循环结束后才会判断，因为是异步
          res(result);
        }
      }, rej);
    };

    for (var _iterator = proms[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      _loop();
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  if (pcount === 0) {
    res(result);
  }

  return p;
};

var p1 = new Promise(function (resolve, reject) {
  resolve("p1");
});
var p2 = new Promise(function (resolve, reject) {
  setTimeout(function () {
    resolve("p2");
  }, 3000);
});
var p3 = new Promise(function (resolve, reject) {
  setTimeout(function () {
    resolve("p3");
  }, 1000);
});
var p4 = new Promise(function (resolve, reject) {
  resolve("p4");
});

Promise._all([p4, p3, p2, p1]).then(function (data) {
  console.log(data);
}, function (reject) {
  console.log(reject, 'reject');
}); // Promise.all([]).then(
//     (data) => {
//         console.log(data);
//     }, 
//     (reject) => {
//         console.log(reject, 'reject');
//     }
// );