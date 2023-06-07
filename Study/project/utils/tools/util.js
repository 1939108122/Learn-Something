import Vue from 'vue';

// 将毫秒数转换为时间差hh：mm:ss
export function MillisecondToTime(msd) {
    if (!msd) {
        return;
    }
    var second = parseInt(msd) / 1000; // second
    var minute = 0; // minute
    var hour = 0; // hour
    if (second > 60) {
        minute = parseInt(second / 60);
        second = parseInt(second % 60);
        if (minute > 60) {
            hour = parseInt(minute / 60);
            minute = parseInt(minute % 60);
        }
    }
    var result;
    if (second >= 10) {
        result = '' + parseInt(second);
    } else {
        result = '' + '0' + parseInt(second);
    }
    if (minute >= 10) {
        result = '' + parseInt(minute) + ':' + result;
    } else {
        result = '' + '0' + parseInt(minute) + ':' + result;
    }
    if (hour >= 10) {
        result = '' + parseInt(hour) + ':' + result;
    } else {
        result = '' + '0' + parseInt(hour) + ':' + result;
    }
    return result;
}

// 将文件原始单位b转换为KB,MB, GB
export function formatFileSize(fileSize) {
    if (fileSize < 1024) {
        return fileSize + 'B';
    } else if (fileSize < 1024 * 1024) {
        var temp = fileSize / 1024;
        temp = temp.toFixed(2);
        return temp + 'KB';
    } else if (fileSize < 1024 * 1024 * 1024) {
        var temp = fileSize / (1024 * 1024);
        temp = temp.toFixed(2);
        return temp + 'MB';
    } else {
        var temp = fileSize / (1024 * 1024 * 1024);
        temp = temp.toFixed(2);
        return temp + 'GB';
    }
}

/**
 * 高亮转换
 * @param str String
 * @param match Object [{startIndex:2,endIndex:6}]
 * @param option Object,转换 键值 {start:startIndex,end:endIndex,color:'red'}
 */
export function highlight(str, match, option) {
    if (!str || str === '') {
        return '';
    }

    const XSSEscapeHTML = {
        // html 转成 字符
        escapeHTML: function (a) {
            a = '' + a;
            return a
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&apos;');
        },
        // 字符 转成 html
        unescapeHTML: function (a) {
            a = '' + a;
            return a
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&amp;/g, '&')
                .replace(/&quot;/g, '"')
                .replace(/&apos;/g, "'");
        },
        selfDefineStr: function (a) {
            a = '' + a;
            return a
                .replace(/\[\[\|/g, '</')
                .replace(/\[\[/g, '<')
                .replace(/\]\]/g, '>')
                .replace(/&quot;/g, '"');
        },
    };

    const strAry = str.split('');
    // 解决 xss 和 自身转义问题
    const startFont = `[[font class="font-hightlight ${option.className || ''}" ]]`; // 中间空格不能丢
    const endFont = '[[|font]]';
    const start = option && option.start ? option['start'] : 'startIndex';
    const end = option && option.end ? option['end'] : 'endIndex';
    match &&
        match.forEach(d => {
            const _start = d[start],
                _end = d[end] - 1;
            strAry[_start] = startFont + (strAry[_start] || '');
            strAry[_end] = (strAry[_end] || '') + endFont;
        });

    const xssStr = XSSEscapeHTML.escapeHTML(strAry.join(''));
    // 自定义字符
    const result = XSSEscapeHTML.selfDefineStr(xssStr);
    return result;
}

/**
 * parseURL
 * @param {String} window.location.href || url
 */

export const parseURL = url => {
    var a = document.createElement('a');
    a.href = url;
    return {
        origin: a.origin,
        pathname: a.pathname,
        source: url,
        protocol: a.protocol.replace(':', ''),
        host: a.hostname,
        port: a.port,
        query: a.search,
        params: (function () {
            var params = {},
                seg = a.search.replace(/^\?/, '').split('&'),
                len = seg.length,
                p;
            for (var i = 0; i < len; i++) {
                if (seg[i]) {
                    p = seg[i].split('=');
                    params[p[0]] = p[1];
                }
            }
            return params;
        })(),
        hash: a.hash.replace('#', ''),
        path: a.pathname.replace(/^([^\/])/, '/$1'),
    };
};

var addZero = function addZero(val) {
    if (isNaN(val)) {
        return val;
    }
    return val > 9 ? val : '0' + val;
};
var isDate = function isDate(date) {
    if (!date) {
        return false;
    }
    if (isNaN(new Date(date).getTime())) {
        return false;
    }
    return true;
};

// 对象序列化
export const formatParams = function (obj) {
    let str = '';
    for (let key in obj) {
        if (obj[key] !== undefined) {
            // 忽略值为undefined的属性
            str += str.length ? `&${key}=${obj[key]}` : `${key}=${obj[key]}`;
        }
    }
    return str;
};

// 日期格式转换
export const formatDate = function (date, formatStr) {
    if (!isDate(date)) {
        return NaN;
    }
    var str = formatStr || 'yyyy-MM-dd';
    str = str.replace(/yyyy|YYYY/, date.getFullYear());
    str = str.replace(
        /yy|YY/,
        date.getYear() % 100 > 9 ? (date.getYear() % 100).toString() : '0' + (date.getYear() % 100)
    );
    str = str.replace(/MM/, addZero(date.getMonth() + 1));
    str = str.replace(/M/g, date.getMonth() + 1);
    str = str.replace(/dd|DD/, addZero(date.getDate()));
    str = str.replace(/d|D/g, date.getDate());
    str = str.replace(/hh|HH/, addZero(date.getHours()));
    str = str.replace(/h|H/g, date.getHours());
    str = str.replace(/mm/, addZero(date.getMinutes()));
    str = str.replace(/m/g, date.getMinutes());
    str = str.replace(/ss|SS/, addZero(date.getSeconds()));
    str = str.replace(/s|S/g, date.getSeconds());
    return str;
};

export const highlighter = function (str, query) {
    var regx,
        keyword = query.replace(/(^\s*)|(\s*$)/g, ''); //删除前后空格
    if (keyword == '') {
        return str;
    }
    keyword = keyword.replace(/[\(\)\/\.\*\+\?\[\]]/g, function (mat) {
        return '\\' + mat;
    });
    try {
        regx = new RegExp('(' + keyword + ')', 'ig');
    } catch (e) {}
    return str.replace(regx, '<span class="hlight">$1</span>');
};

export const getFormateDurationStr = function (ms) {
    let totalS = parseInt(ms / 1000);
    let hour = parseInt(totalS / 3600);
    let min = parseInt((totalS % 3600) / 60);
    let s = (totalS % 3600) % 60;
    return addZero(hour) + ':' + addZero(min) + ':' + addZero(s);
};

/**
 * 非空判断
 * @param v
 * @returns {boolean}
 */
export const isNotEmpty = v => {
    let bol = false;
    v = Object.prototype.toString.call(v) === '[object String]' ? v.trim() : v;

    if (v !== null && v !== undefined && v !== '') {
        bol = true;
    }

    return bol;
};

/**
 * 函数防抖
 * @param fn 要执行防抖的函数
 * @param delay 延迟时间
 * @returns {(function(): void)|*}
 */
export function debounce(fn, delay = 100) {
    let timerId = null;
    return function () {
        const context = this;
        if (timerId) {
            window.clearTimeout(timerId);
        }
        timerId = setTimeout(() => {
            fn.apply(context, arguments);
            timerId = null;
        }, delay);
    };
}

/**
 * 函数节流
 * @param fn 要执行的节流函数
 * @param delay 节流时间
 * @returns {(function(): void)|*}
 */
export function throttle(fn, delay = 300) {
    let timer = null;
    return function () {
        if (timer) return;
        const context = this;
        const args = arguments;
        timer = setTimeout(() => {
            fn.apply(context, args);
            clearTimeout(timer);
            timer = null;
        }, delay);
    };
}

/**
 * 下载文件
 * @param hrefUrl 文件地址
 */
export function downLoadFile(hrefUrl) {
    const aLink = document.createElement('a');
    document.body.appendChild(aLink);
    aLink.style.display = 'none';
    aLink.hidden = true;
    aLink.href = hrefUrl;
    aLink.target = '_blank';
    aLink.click();
    document.body.removeChild(aLink);
}

/**
 * 下载文件（文件有名字）
 * @param url
 */
 export const fileDownload = (url, name) => {
    let _a = document.createElement('a');
    _a.hidden = 'hidden';
    _a.target = '_blank';
    _a.download = name || new Date().getTime();
    _a.href = (url || '').replace('http:', 'https:');
    document.body.appendChild(_a);
    _a.click();
    document.body.removeChild(_a);
};

/**
 * 下载文件流文件
 * 注意：使用此方法时，ajax请求配置需要加上这两个参数 【useAll: true, responseType: 'blob'】
 * @param fileStream
 * @param contentDispositionStr
 */
export function downloadStreamFile(fileStream, contentDispositionStr) {
    try {
        const aLink = document.createElement('a');
        document.body.appendChild(aLink);
        aLink.style.display = 'none';
        aLink.hidden = true;
        aLink.target = '_blank';
        // 使用获取到的blob对象创建的url
        const url = window.URL.createObjectURL(fileStream);
        aLink.href = url;
        // 过滤文件名称
        const filterFileName = str => {
            const keyword = 'filename=';
            const targetIndex = str.indexOf(keyword);
            return window.decodeURIComponent(str.slice(targetIndex + keyword.length + 1, -1));
        };
        // 指定下载的文件名
        aLink.download = filterFileName(contentDispositionStr);

        aLink.click();
        document.body.removeChild(aLink);
        // 移除blob对象的url
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.log(error);
    }
}

// 给题目的填空符加上 '、'
export function getTopic(topicStr) {
    const arr = topicStr.replace(/\n/g, '').split('');
    arr.forEach((item, index) => {
        if (item == '_' && arr[index - 1] == '_' && arr[index - 2] == '_'&& arr[index - 3] == '_' && arr[index + 1] == '_') {
            arr.splice(index + 1, 0, '、');
        }
    });

    return arr.join('');
}

// 关闭 录音/视频
export const closeAudio = () => {
    // 关闭录音
    if(Vue.prototype.$draggableAudio) {
        Vue.prototype.$draggableAudio.$destroy();
        document.body.removeChild(Vue.prototype.$draggableAudio.$el);
        Vue.prototype.$draggableAudio = null;
    }
    // 关闭视频
    if(Vue.prototype.$draggableVideo) {
        Vue.prototype.$draggableVideo.$destroy();
        document.body.removeChild(Vue.prototype.$draggableVideo.$el);
        Vue.prototype.$draggableVideo = null;
    }
}