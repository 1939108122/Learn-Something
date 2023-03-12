window.innerHeight、window.innerWidth  （https://www.cnblogs.com/my466879168/p/12291360.html）

innerHeight 和 innerWidth 都是window 的属性
表示文档显示区域的宽高，不包括工具栏等

这个属性ie9+支持，其他的不支持
可以这样获取：
console.log(document.documentElement.clientHeight)
或者这样：
console.log(document.body.clientHeight)

与clientHeight的区别
window.innerHeight属于BOM（浏览器对象模型），而document.documentElement.clientHeight属于文档对象模型
window.innerHeight获取的高度包含横向滚动条，而document.documentElement.clientHeight不包含横向滚动条



window.outerHeight

Window.outerHeight 只读属性返回整个浏览器窗口的高度（以像素为单位），包括侧边栏（如果存在）、窗口镶边（window chrome）和窗口调正边框



HTMLElement.clientHeight

含义：元素的像素高度，包含元素的高度+内边距，不包含水平滚动条，边框和外边距



HTMLElement.offsetHeight

HTMLElement.offsetHeight 是一个只读属性，它返回该元素的像素高度，高度包含该元素的垂直内边距和边框，且是一个整数。

通常，元素的 offsetHeight 是一种元素 CSS 高度的衡量标准，包括元素的边框、内边距和元素的水平滚动条（如果存在且渲染的话），不包含:before 或:after 等伪类元素的高度。


HTMLElement.offsetTop

HTMLElement.offsetTop 为只读属性，它返回当前元素相对于其 offsetParent 元素的顶部内边距的距离。


offsetParent: 

HTMLElement.offsetParent 是一个只读属性，返回一个指向最近的（指包含层级上的最近）包含该元素的定位元素或者最近的 table, td, th, body 元素。当元素的 style.display 设置为 "none" 时，offsetParent 返回 null。offsetParent 很有用，因为 offsetTop 和 offsetLeft 都是相对于其内边距边界的。





判断滚动条是否滚动到底部： 

dom.scrollHeight = dom.scrollTop + dom.clientHeight



判断目标元素是否在视窗之内

1:  el.offsetTop - document.documentElement.scrollTop <= viewPortHeight（window.innerHeight ||  document.documentElement.clientHeight || document.body.clientHeight）


2: getBoundingClientRect

返回值是一个 DOMRect对象，拥有left, top, right, bottom, x, y, width, 和 height属性

当页面发生滚动的时候，top与left属性值都会随之改变

如果一个元素在视窗之内的话，那么它一定满足下面四个条件：

top 大于等于 0
left 大于等于 0
bottom 小于等于视窗高度
right 小于等于视窗宽度



判断目标元素正好完全出现在视口

target.offsetTop - dom.scrollTop + target.clientHeight(有border 或者 水平滚动条 用 offsetHeight) = window.innerHeight 














