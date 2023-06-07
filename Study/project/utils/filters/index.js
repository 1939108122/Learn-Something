import { formatDate } from '@/utils/tools/util';

export default {
    // 银行卡号左对齐 如：1234 5678 9
    bankNo (val, separator = ' ', placeholder = '--') {
        var rule = /(\d{4})(?=\d)/g;
        return (val === '' || val === null) ?  placeholder : val.replace(rule, '$1' + separator);
    },
    //货币符号右对齐 如：1,234,567.01
    currency (val, type = '￥', placeholder = '--') {
        if (!val && val !== 0) return '';
        var rule = /\B(?=(?:\d{3})+(?!\d))/g;
        if(val !== '' && val !== null){
            val = (val*1).toFixed(2);
            var result = val.toString().replace(rule, ',');
        }
        return (val === '' || val === null) ?  placeholder : type + result;
    },
    //百分比
    percentage (val = '', placeholder = '--') {
        return (val === '' || val === null) ? placeholder : val + '%';
    },
    //占位符
    placeholder (val, placeholder = '--') {
//      return (val === '' || val === null) ? placeholder : val;

        if (!val && val !== 0) return placeholder;
        return val;
    },
    //溢出显示省略号
    subStr(val, length) {
        return val.length <= length ? val : val.substr(0, length) + '…';
    },
    numFormat1000(num) {
        return (num + '').replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,');
    },
    formatDate(val, format) { // 转换时间格式
        if (!val) return '';
        if (typeof val == 'string') { // 字符类型
            return formatDate(new Date(val.replace(/-/g, '/') ), format);
        }
        if (typeof val == 'number') { // 时间戳
            return formatDate(new Date(val), format);
        }
        return formatDate(val, format);
    }
};