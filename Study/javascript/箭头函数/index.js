// 箭头函数的特点
// 1: 箭头函数表达式比普通函数表达式更简洁，指向性更强，可读性更好。

// 2: 箭头函数属于表达式函数，因此不存在函数提升。

// 3: 箭头函数相当于匿名函数，不能作为构造函数，不可以使用new命令。

// 4: 箭头函数没有prototype属性。

//5: 无法使用 call, apply对箭头函数的this进行绑定，因为this在箭头函数中已经按照词法作用域绑定了。

//6: 箭头函数不绑定this，它只会从自己的作用域链的上一层继承 this（箭头函数的this是词法作用域）。

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





// 第五点

var obj = {
    birth: 1990,
    getAge: function (year) {
        var b = this.birth; // 1990
        var fn = (y) => y - this.birth; // this.birth仍是1990
        return fn.call({birth:2000}, year);
    }
};
obj.getAge(2015); // 25