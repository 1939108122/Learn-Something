/*Cookie */
const Cookie = {
    get: function(name) {
        var arr,
            reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
        if ((arr = document.cookie.match(reg))) {
            return unescape(arr[2]);
        } else {
            return null;
        }
    },
    getObj: function() {
        var arr = document.cookie.split(';');
        var jsonStr = '{';
        for (var i = 0; i < arr.length; i++) {
            var cookie = arr[i].split('=');
            jsonStr += '"' + cookie[0].replace(/\s+/g, '') + '":"' + decodeURIComponent(cookie[1]) + '",';
        }
        jsonStr = jsonStr.slice(0, -1);
        jsonStr += '}';
        return JSON.parse(jsonStr);
    },
    set: function(name, value, time, domain, path) {
        var str = name + '=' + encodeURIComponent(value);
        if (time) {
            var date = new Date(time).toGMTString();
            str += ';expires=' + date;
        }
        str = domain ? str + ';domain=' + domain : str;
        str = path ? str + ';path=' + path : str;
        document.cookie = str;
    },
    //删除一个cookie，必须域名和path都跟已有的cookie相同
    del: function(name, domain, path) {
        var date = new Date('1970-01-01');
        var str = name + '=null;expires=' + date.toGMTString();
        str = domain ? str + ';domain=' + domain : str;
        str = path ? str + ';path=' + path : str;
        document.cookie = str;
    }
};

export default Cookie;
