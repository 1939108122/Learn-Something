webpack是什么？

WebPack可以看做是模块打包机：它做的事情是，分析你的项目结构，找到JavaScript模块以及其它的一些浏览器不能直接运行的拓展语言（Scss，TypeScript等），并将其转换和打包为合适的格式供浏览器使用。


### webpack热更新原理

webpack 通过 watch 可以监测代码的变化；webpack-dev-middleware 可以调用 webpack 暴露的 API 检测代码变化，并且告诉 webpack 将代码保存到内存中；webpack-dev-middleware 通过 sockjs 和 webpack-dev-server/client 建立 webSocket 长连接，将 webpack 打包阶段的各个状态告知浏览器端，最重要的是新模块的 hash 值。webpack-dev-server/client 通过 webpack/hot/dev-server 中的 HMR 去请求新的更新模块，HMR 主要借助 JSONP。先拿到 hash 的 json 文件，然后根据 hash 拼接出更新的文件 js，然后 HotModulePlugin 对比新旧模块和模块依赖完成更新。