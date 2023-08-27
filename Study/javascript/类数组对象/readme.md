### 类数组对象

**拥有一个length属性和若干索引属性的对象**

```js
let arrayLike = {
    length: 3,
    0: 'name',
    1: 'age',
    2: 'sex'
}
```


类数组对象和数组一样，可以读写，遍历，调用数组方法（间接）

```js
// 类数组对象变成数组的方法
let arrayLike = {
    length: 3,
    0: 'name',
    1: 'age',
    2: 'sex'
};

arrayLike.length // 3

arrayLike[0] // name

for(let i = 0; i <= arrayLike.length; i++) {
    console.log(arrayLike[i]);
}

// name
// age
// sex

arrayLike.push('4') // 报错




```

```js
// 类数组对象变成数组的方法
let arrayLike = {
    length: 3,
    0: 'name',
    1: 'age',
    2: 'sex'
};

Array.prototype.slice.call(arrayLike); // call

Array.prototype.slice.apply(arrayLike); // apply

Array.prototype.slice.bind(arrayLike)(); // bind

Array.prototype.splice.call(arrayLike, 0); // apply


Array.from(arrayLike); // ES6
``` 
