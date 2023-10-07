1px问题 https://zhuanlan.zhihu.com/p/535456539



1: 伪元素 + CSS3缩放



.scale-1px{
  position: relative;
  border:none;
}
.scale-1px::after{
  content: '';
  position: absolute;
  bottom: 0;
  background: #000;
  width: 100%;
  height: 1px;
  /*核心是利用transform缩放边框*/
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
}


// dpr适配可以这样写
@media (-webkit-min-device-pixel-ratio: 2)  {
    .line::after {
    	...
     	height: 1px;
        transform: scale(0.5);
        transform-origin: 0 0;
    }
}

@media (-webkit-min-device-pixel-ratio: 3)  {
    .line::after {
        ...
     	height: 1px;
        transform: scale(0.333);
        transform-origin: 0 0;
    }
}





box-shadow 写 0.5

