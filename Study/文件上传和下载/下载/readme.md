使用 a 标签的 download 属性
● 只能同源URL
● 尽管 HTTP URL 需要位于同一源中，但是可以使用 blob:URL 和 data:URL 

Blob 将文件流转换成字符串，再用createObjectUrl将这个Blob类型与当前页面绑定，存储在内存
```js
//普通下载
export function fileDownload(url, name) {
    let _a = document.createElement('a');
    _a.hidden = 'hidden';
    _a.download = name || new Date.getTime();
    _a.target = '_blank';
    _a.href = (url || '').replace('http:', 'https:');
    document.body.appendChild(_a);
    _a.click();
    document.body.removeChild(_a);
}
```

疑问点：
## download 只能同源URL
## pdf没有执行预览 原因：后端设置了Content-Disposition
## 下载的时候为什么把http换成https？
## crm fileDownlod 和 exportFile  区别： 有无a标签的download属性
## window.open