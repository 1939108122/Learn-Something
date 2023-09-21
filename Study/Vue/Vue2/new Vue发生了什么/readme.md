new Vue 过程发生了什么？


1: init()

2: $mount 

3: compile(没有render函数情况下)

4: 生成 vnode

5: update



#### 一： init()

new Vue之后，会调用挂载在原型上的init方法进行初始化，此方法会初始化生命周期、props、data、methods、watch、computed等。最重要的是通过Object.defineProperty设置setter与getter，实现响应式及依赖收集。


#### 二： $mount

初始化最后阶段会调用$mount进行挂载组件，如果是没有定义render方法，则进行一个编译的过程，将el 或者 template 字符串转换成 render 方法。


#### 三： Compile

编译分为三个过程：parse(转化)、optimize（优化）、generate（生成）

1: Parse。 Parse 会用正则等方式解析 template 模版中的指令、class、style 等数据，形成 AST。它是一种抽象语法树，是对源代码的抽象语法结构的树状表现形式。


```js
<ul :class="bindCls" class="list" v-if="isShow">
    <li v-for="(item,index) in data" @click="clickItem(index)">{{item}}:{{index}}</li>
</ul>


经过parse过程后，生成的 AST 如下：
ast = {
  'type': 1,
  'tag': 'ul',
  'attrsList': [],
  'attrsMap': {
    ':class': 'bindCls',
    'class': 'list',
    'v-if': 'isShow'
  },
  'if': 'isShow',
  'ifConditions': [{
    'exp': 'isShow',
    'block': // ul ast element
  }],
  'parent': undefined,
  'plain': false,
  'staticClass': 'list',
  'classBinding': 'bindCls',
  'children': [{
    'type': 1,
    'tag': 'li',
    'attrsList': [{
      'name': '@click',
      'value': 'clickItem(index)'
    }],
    'attrsMap': {
      '@click': 'clickItem(index)',
      'v-for': '(item,index) in data'
     },
    'parent': // ul ast element
    'plain': false,
    'events': {
      'click': {
        'value': 'clickItem(index)'
      }
    },
    'hasBindings': true,
    'for': 'data',
    'alias': 'item',
    'iterator1': 'index',
    'children': [
      'type': 2,
      'expression': '_s(item)+":"+_s(index)'
      'text': '{{item}}:{{index}}',
      'tokens': [
        {'@binding':'item'},
        ':',
        {'@binding':'index'}
      ]
    ]
  }]
}
```




2: Optimize。vue是数据驱动，是响应式的，但不是所有的数据都是响应式的，也有很多数据是首次渲染后就永远不会变化的，那么我们会在optimize过程中，遍历 AST 树，将不会变化的节点进行标记成静态节点，以便在数据变化对比过程中跳过这些节点，提高性能。


3: Generate。Generate 是将 AST 转化成 render function 字符串的过程，得到结果是 render 的字符串以及 staticRenderFns 字符串。



#### 四： 生成VNode

执行render函数会返回一个 Vnode节点也就是 虚拟树（Virtual DOM），Virtual DOM 就是用一个原生的 JS 对象去描述一个 DOM 节点，比创建一个 DOM 的代价要小很多。


#### 五： update

首次渲染直接创建真实dom, 不是首次渲染就采用 patch 算法进行必要的 DOM 操作，更新DOM.