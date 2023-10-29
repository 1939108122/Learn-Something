esm 和 commonjs区别：

1: 输出拷贝（cjs）和输出引用(esm)

2: 解决循环引用方式不一样

common js借助模块缓存，遇到require函数会先检查是否有缓存，已经有的则不会进入执行。

ES Module借助模块地图，已经进入过的模块标注为获取中，遇到import语句会去检查这个地图，已经标注为获取中的则不会进入。



3: esm module将所有import 会提升到作用域顶层

