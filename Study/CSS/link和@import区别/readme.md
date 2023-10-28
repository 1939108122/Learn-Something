1: 加载顺序。link引入的样式，页面加载时同时加载，@import引入的样式等页面加载完成后再加载。

2: 兼容性。link没有兼容性问题，@import不兼容ie5以下。

3: 操作DOM。 link可以通过js操作DOM动态引入样式表改变样式，而@import不可以。