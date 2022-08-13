
1: 类实现接口时，只对其实例部分进行类型检查。

2: 当创建了一个接口继承了一个拥有私有或受保护的成员的类时，这个接口类型只能被这个类或其子类所实现（implement）

3: 当成员被标记成 private时，它就不能在声明它的类的外部访问
4: protected修饰符与 private修饰符的行为很相似，但有一点不同， protected成员在派生类中仍然可以访问

5: 抽象方法的语法与接口方法相似， 两者都是定义方法签名但不包含方法体，抽象类不能被实例化

6: 枚举可正反向映射  要注意的是 不会为字符串枚举成员生成反向映射

7: 接口只能为对象指定类型，别名不仅可以为对象指定类型，实际上可以为任意类型指定别名。













<!-- 疑问 -->
<!-- (start: number): string; ？？ -->
interface Counter {
    (start: number): string;
}

let counter = <Counter>function (start: number) { };


<!-- 元组 -->
let ttt: [string, number];

ttt = ['1', 2];

ttt.push(1);
console.log(ttt);

declare