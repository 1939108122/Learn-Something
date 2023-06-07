/**
 * 对本地存贮对象
 */

const Storage = {
    get: function(key) {
        var storage = this._getStorage();
        var str = '';
        if (storage) {
            str = storage.getItem(key);
            return str && JSON.parse(str);
        }
    },
    set: function(key, value) {
        var storage = this._getStorage();
        if (key && 'undefined' !== typeof value) {
            storage.setItem(key, JSON.stringify(value));
        }
    },
    /**
     * 清除本地存贮数据
     * @param {String} isPrefix 可选，如果包含此参数，则删除的是包含key的所有项，如果什么都不传则清空
     */
    del: function(key, isPrefix) {
        var storage = this._getStorage();
        if (storage) {
            if (key && isPrefix) {
                for (var key in storage) {
                    if (0 === key.indexOf(prefix)) {
                        storage.removeItem(key);
                    }
                }
            } else if (key) {
                storage.removeItem(key);
            } else {
                storage.clear();
            }
        }
    },
    _getStorage: function() {
        var _localStorage;
        try {
            /* 在Android 4.0下，如果webview没有打开localStorage支持，在读取localStorage对象的时候会导致js运行出错，所以要放在try{}catch{}中 */
            _localStorage = window['localStorage'];
        } catch (e) {}

        return _localStorage;
    }
};

export default Storage;
