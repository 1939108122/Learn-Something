import clickoutside from './clickoutside';
import input from './input';
import customTxt from './customTxt.js';

export default {
    customTxt,
    clickoutside,
    input,
    //自动聚焦
    focus:{
        inserted (el) {
            let ele = el.tagName === 'INPUT' ? el : el.querySelector('input');
            ele.focus();
        }
    }
};
