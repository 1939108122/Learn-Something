"use strict";

function sleep(duration) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      return resolve("done!");
    }, duration);
  });
}

function order() {
  var result;
  return regeneratorRuntime.async(function order$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(sleep(2000));

        case 2:
          result = _context.sent;
          console.log(result);
          console.log(2);

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
} // order();


function test() {
  var a;
  return regeneratorRuntime.async(function test$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            setTimeout(function () {
              resolve('settimeout');
            }, 1000);
          }));

        case 2:
          a = _context2.sent;
          console.log(a, 'a');
          return _context2.abrupt("return", a);

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
} // test();


test().then(function (data) {
  console.log(data, 'data');
}, function (reject) {
  return console.log(reject, 'reject');
})["catch"](function (err) {
  console.log(err, 'err');
});