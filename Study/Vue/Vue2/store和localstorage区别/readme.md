### vuex 和 localstorage区别


1: vuex存储在内存里，localstorage存储在本地，内存会比本地读取更快些。
2: vuex刷新后就会清除（相当于清除内存）,localStorage不手动清除永远都在。
3: vuex可以实现响应式，localStorage不行。