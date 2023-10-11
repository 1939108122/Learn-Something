#### 目的
1: 减小打包后的文件大小
2: 首页加载快
3: 优化webpack打包时间

### Wepack方面优化


1: stat.json（webpack版本，打包时间，模块数量，chunk数量等） webpack-bundle-analyzer（包体积大小） speed-measure-webpack-plugin（loader和 plugin构建耗费时间）

2: 利用多线程提升构建速度（HappyPack）

每次 webapck 解析一个模块，HappyPack 会将它及它的依赖分配给 worker 线程中。处理完成之后，再将处理好的资源返回给 HappyPack 的主进程，从而加快打包速度

3: 优化Loader配置

由于Loader对文件的转换操作很耗时，所以需要让尽可能少的文件被Loader处理.

优化正则匹配（2）通过cacheDirectory选项开启缓存（3）通过include、exclude来减少被处理的文件




4: css和图片压缩， js代码压缩



css： optimize-css-assets-webpack-plugin(压缩css) mini-css-extract-plugin(分离JS中的CSS样式，生成单独的 CSS 文件)

图片： image-webpack-loader 压缩

​js: ​terser-webpack-plugin​​


5: splitChunks 所有的 chunks 代码公共的部分分离出来成为⼀个单独的⽂件

7: 缩短二次构建时间，开销较大的loader 开启缓存 hard-source-webpck-plugin 切换分支




### 项目方面

减小入口文件体积
静态资源本地缓存
UI框架按需加载
图片资源的压缩
组件重复打包
开启GZip压缩
使用SSR

1: 路由按需引入加载

2: 第三方组件和插件。按需加载需引入第三方组件

3: 外部引入的js 使用defer

4: GZip压缩 compression-webpack-plugin
