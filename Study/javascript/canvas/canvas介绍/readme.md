一： canvas 简介  （https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API）

​<canvas> 是 HTML5 新增的，一个可以使用脚本(通常为 JavaScript) 在其中绘制图像的 HTML 元素。它可以用来制作照片集或者制作简单的动画，甚至可以进行实时视频处理和渲染。



二、Canvas基本使用

<canvas> 看起来和 <img> 标签一样，只是 <canvas> 只有两个可选的属性 width、heigth 属性，而没有 src、alt 属性。

由于某些较老的浏览器（尤其是 IE9 之前的 IE 浏览器）或者浏览器不支持 HTML 元素 <canvas>，在这些浏览器上你应该总是能展示替代内容。

​支持 <canvas> 的浏览器会只渲染 <canvas> 标签，而忽略其中的替代内容。不支持 <canvas> 的浏览器则 会直接渲染替代内容。

用文本替换

<canvas>
    你的浏览器不支持 canvas，请升级你的浏览器。
</canvas>

用 <img> 替换：

<canvas>
    <img src="./a.jpg" alt=""> 
</canvas>




HTMLCanvasElement.getContext()

HTMLCanvasElement.getContext() 方法返回canvas 的上下文，如果上下文没有定义则返回 null .

在同一个 canvas 上以相同的 contextType 多次调用此方法只会返回同一个上下文。




CanvasRenderingContext2D.fillStyle


CanvasRenderingContext2D.fillStyle 是 Canvas 2D API 使用内部方式描述颜色和样式的属性。默认值是 #000 （黑色）。

```js
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

ctx.fillStyle = "blue";
ctx.fillRect(10, 10, 100, 100);
```


