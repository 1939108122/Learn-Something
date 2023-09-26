// 箭头函数的特点
// 箭头函数表达式比普通函数表达式更简洁，指向性更强，可读性更好。

// 箭头函数属于表达式函数，因此不存在函数提升。

// 箭头函数相当于匿名函数，不能作为构造函数，不可以使用new命令。

// 箭头函数没有prototype属性。

// 箭头函数不绑定this，它只会从自己的作用域链的上一层继承 this。

var user3 = {
    name: 'jack',
    sleep: function() {
        console.log(this);
        var fn = () => {
            console.log(this, 'fn');
        }
        fn()
    }
}
user3.sleep(); // 都是 user3





var user3 = {
    name: 'jack',
    sleep: function() {
        console.log(this);
        var fn = function() {
            console.log(this, 'fn');
        }
        fn();
    }
}

user3.sleep(); // user3   window



// 上面等效于下面
function a () {
    console.log(this, 'a');
    var b = function() {
        console.log(this, 'b');
    }
    b();
}





var user3 = {
    name: 'jack',
    a: {
        name: 'rose',
        sleep: function() {
            console.log(this);
            var fn = function() {
                console.log(this, 'fn');
            }
            fn();
        }
    }
}


user3.a.sleep(); // rose   window