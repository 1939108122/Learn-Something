// 深度监听一个对象


// Object.defineProperty实现

let obj = {
    x: 1,
    y: 2,
    c: {
        a: 3,
        b: 4
    }
}


function observe(obj) {
    for(let key in obj) {
        defineObserve(obj, key);
    }
}

function defineObserve(obj, key) {
    let value = obj[key];

    if(typeof value === 'object') {
        observe(value);
    } else {
        Object.defineProperty(obj, key, {
            configurable: true,
            enumerable: true,
            get: function() {
                console.log('我获取了' + value);
                return value;
            },
            set: function(newVal) {
                value = newVal;
                console.log('我设置了' + newVal);
            }
        });
    }
}

observe(obj);


obj.c.a = 8;

console.log(obj.c.a);






// proxy实现

var handler = {
    get: function(target, property) {
        return property in target ? target[property] : 'no prop';
    },
    set: function(target, property, value) {
        target[property] = value;
        console.log('sdadsda');
        return true;
        // return Reflect.set(...arguments);
    }
};
let originUser = {};

let user = new Proxy(originUser, handler);

user.name = 'jack';
console.log(user);
console.log(originUser);