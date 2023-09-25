var needProxyObj = { name: 'jack', age: 18};

var proxyObj = new Proxy(needProxyObj, {
    set() {
        return Reflect.set(...arguments);
    }
});


proxyObj.name = 'rose';

console.log(proxyObj);

console.log(needProxyObj);



