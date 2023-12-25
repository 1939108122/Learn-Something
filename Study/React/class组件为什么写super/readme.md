### class 组件为什么在constructor首先调用super()

javascript的规定，子类继承父类，子类的constructor在使用this之前需要调用 super(), 避免在this的属性没赋值便调用

