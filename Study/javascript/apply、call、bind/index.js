var a = 2;
var obj = {
    a: 1,
    foo: function () {
        console.log(this.a);
    }
};











// // 实现call



// 简版
Function.prototype.myCall = function(context) {
    
    context.fn = this;
    context.fn();
    delete context.fn;
}

var foo = {
    value: 1
}


function bar() {
    console.log(this.value);
}

bar.myCall(foo, 1, 2, 3);


// 第二版
// 在原有基础上，考虑到以下三点
// 1：执行的函数会return结果
// 2：传进来的参数多个时
// 传进来的第一个参数是null 或 undefined时需要将this指向window

Function.prototype.myCall = function(context, ...args) {

    context = context || window;
    context.fn = this;
    let result = context.fn(...args);
    delete context.fn;
    return result;

}

var value = 2;

var foo = {
    value: 1
}


function bar(...args) {
    console.log(this.value, ...args);
    return 'iam bar';
}

bar.myCall(null); // 231

bar.myCall(foo, 1, 2, 3); // 1 1 2 3




// apply实现

// apply和call的差距在于第二个参数是数组仅此而已
Function.prototype.myApply = function(context, args) {

    context = context || window;
    context.fn = this;
    let result = context.fn(...args);
    delete context.fn;
    return result;

}

var foo = {
    value: 1
}


function bar(...args) {
    console.log(this.value, ...args);
}

bar.myApply(foo, [1, 3, 4]); // 1 1 3 4






// bind


// 只有一个参数的简单版本

// 1
Function.prototype.myBind = function (context) {
    context.fn = this;
    return function() {
        return context.fn();
    }
}


// 2 

Function.prototype.myBind = function (context) {
    var self = this;
    return function() {
        return self.apply(context);
    }
}


let foo = {
    value: 1
}

function bar () {
    console.log(this.value);
}

let bind = bar.myBind(foo);
bind();




// 传入参数的版本

Function.prototype.myBind = function (context) {
    var self = this;
    // 获取传给函数的第二个到最后一个参数
    var args = Array.prototype.slice.call(arguments, 1);
    return function() {
        //  这个时候的arguments是指bind返回的函数传入的参数
        var bindArgs = Array.prototype.slice.call(arguments);
        return self.apply(context, args.concat(bindArgs));
    }
}


let foo = {
    value: 1
}

function bar (...args) {
    console.log(this.value, ...args);
}

let bindFn = bar.myBind(foo, 1, 2);
bindFn(3, 4); // 1 1 2 3 4
