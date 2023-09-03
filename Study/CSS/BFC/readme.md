#### BFC(Block Formatting Context)

**BFC(区块格式化上下文),是块级盒子布局过程发生的区域，是一个独立渲染的区域，特点是BFC里面的子元素不会对外面的元素产生影响。**


##### 如何创建BFC

1: 文档的根元素（HTML）
2: 浮动元素（float不为none的元素）
3: 绝对定位元素：position (absolute、fixed)
4: overflow不为 visible 或者 clip的块级元素
5: display 为 inline-block、flow-root、flex的元素

##### BFC的特点

1: BFC可以包含浮动元素（闭合浮动）
2: BFC所确定的区域不会与外部浮动元素发生重叠
3: 位于同一BFC下的相邻块级子元素在垂直方向上会发生margin重叠
4: 位于不同BFC下的相邻元素之间不会发生margin重叠


##### BFC的作用

1: 包含内部浮动（清除浮动）
2: 排除外部浮动
3: 防止外边距重叠

