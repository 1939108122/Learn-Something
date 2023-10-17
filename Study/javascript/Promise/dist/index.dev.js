"use strict";

function drive(fn) {
  setTimeout(fn, 2000);
}

function shopping(fn) {
  setTimeout(fn, 1000);
}

drive(function () {
  console.log('drive');
  shopping(function () {
    console.log('shopping');
  });
}); //为了保证先drive 再 shopping，嵌套了回调函数
// promise为了解决回调地狱，es6制定了标准

function promiseDrive() {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve('drive');
    }, 2000);
  });
}

function promiseShopping() {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve('shopping');
    }, 1000);
  });
} // 链式调用


promiseDrive().then(function (data) {
  console.log(data);
  return promiseShopping();
}).then(function (data) {
  console.log(data);
});
var promise = new Promise(function (resolve, reject) {
  // resolve('resolve');
  reject('reject'); // throw new Error('错误');
});
promise.then(function (data) {
  console.log(data, '成功');
}, function (data) {
  console.log(data, '失败');
})["catch"](function (err) {
  console.log(err);
});