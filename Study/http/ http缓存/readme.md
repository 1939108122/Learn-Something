https://juejin.cn/post/6844904153043435533?from=search-suggest


http缓存分为强缓存和协商缓存。

强缓存由 expires、cache-control、Pragma三个值决定，优先级逐渐递增


expires：在响应头返回，是一个绝对时间，浏览器通过对比本地时间（修改本地时间导致不准确）和expires判断缓存是否过期。


cache-control： 请求头和响应头都可以设置，取值有以下：

max-age: 时长；
no-cache：表示客户端可以缓存资源，每次使用缓存资源前都必须重新验证其有效性。这意味着每次都会发起 HTTP 请求。（禁用强缓存）

no-store: 禁止所有缓存（包括协商缓存）


Pragma： 只有一个取值：no-cache，设置之后就不使用强缓存



协商缓存： etag和last-modified etag优先级高

etag是一个hash值，是对资源是否修改的唯一标识


last-modified是文件的最后修改时间（修改之后即使内容不变，也会视为修改了，所以用etag会好些），还有last-modified只能记录 秒级别的修改时间，毫秒级别的修改视为未修改。




前端可以通过在Nginx配置，将一些css 图片，js静态资源设置强缓存（cache-control）








