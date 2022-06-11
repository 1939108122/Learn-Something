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
