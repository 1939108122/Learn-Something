Flex 计算元素宽度分为两步：

第一步：各个子元素根据 flex-basis 的值，填充父元素 第二步： 根据填充后的剩余空间大小根据flex-grow和flex-shrink伸缩

第一步中：

​auto​：使用子元素的尺寸
长度：使用此固定长度
百分比：根据其包含块（即伸缩父容器）的主尺寸计算。如果包含块的主尺寸未定义（即父容器的主尺寸取决于子元素），则计算结果和设为 ​auto​ 一样
第二步中：

如果经过第一步填充之后，父元素还有剩余宽度，则执行 flex-grow 计算，如果内容超出，则根据 flex-shrink 计算。

```js
.parent {
    display: flex;
    width: 600px;
}

.parent > div {
    height: 100px;
}

.item-1 {
    width: 100px;
    flex: 2 1 auto;
    background: blue;
}

.item-2 {
    width: 600px;
    flex: 2 2 auto;
    background: lightcyan;
}

超出 100 + 600 - 600 = 100px
item1的width: 100 - (100 / 100 * 1 + 600 * 2) * 100 = 92.3;
item2的width: 600 - (1200 / 100 * 1 + 600 * 2) * 100 = 507.7;
```

