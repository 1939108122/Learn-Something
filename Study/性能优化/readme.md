#### 目的
1: 优化webpack构建速度
2: 首页加载时间

### Wepack方面优化


#### webpack构建速度的优化（搜索时间、解析时间）


分析webpack的包体积以及loader、plugin耗时时间。安装 webpack-bundle-analyzer（包体积大小）、
speed-measure-webpack-plugin（loader和 plugin 耗费时间）。

一: 优化Loader配置

由于Loader对文件的转换操作很耗时（比如 vue-loader、babel-loader），所以需要让尽可能少的文件被Loader处理.

1: 优化正则匹配

2: 通过include、exclude来减少被处理的文件



二: 合理配置resolves

1: resolve.modules。resolve.modules用于配置去哪些目录下寻找第三方模块。可以指明存放第三方模块的绝对路径，以减少寻找时间。
```js
resolve: {
// 使用绝对路径指明第三方模块存放的位置，以减少搜索步骤
modules: [path.resolve(__dirname,'node_modules')]
}
```

2: resolve.alias。

```js
'@': utils.resolve('src'),
'#': utils.resolve('src/assets')
```

3: resolve.extensions。

```js
extensions: ['.js', '.vue', '.css', '.less', 'json'],
```



三: 利用多线程提升构建速度（thread-loader, 为loader的解析开启多线程） 

thread-loader会将来自webpack的任务分配给不同的线程并行执行（放到worker进程中），以减少构建的时间。



四： noParse（忽略不需要依赖分析的模块，一般是已经打包好的库，这些库如果没有依赖模块，就可以忽略）

  module: {   
    noParse: /jquery|lodash/
  }

五: 缩短二次构建时间。 
使用cache loader, 开销较大的loader 开启缓存（babel-loader cacheDirectory为true） hard-source-webpck-plugin




#### 首页加载的性能优化（包的体积、按需引入）

一: 拆包优化（splitChunks）

目的是防止加载重复资源，按需加载

所有的 chunks 代码公共的部分分离出来成为⼀个单独的⽂件

二： css和图片压缩

css： optimize-css-assets-webpack-plugin(压缩css) mini-css-extract-plugin(分离JS中的CSS样式，生成单独的 CSS 文件，消除重复的css)

图片： image-webpack-loader 压缩

​js: ​terser-webpack-plugin​​( 删除空格 注释等无用代码，开启多线程压缩，可以进一步优化我们的打包速度 )


三： treeShaking








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




### vue方面

1: v-for 用key便于复用

2: v-if 和 v-show的使用场景切换

3: keep-alive缓存组件实例

4: 路由懒加载、插件按需引入

5: computed 和 watch的使用区分

6: 事件的销毁


