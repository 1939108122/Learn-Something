/**
 * ex: v-customTxt="{reg:'\d'}" 只允许输入数字
 */
export default {
    bind: function(el, binding){
        let input = el.querySelector('input') || el.querySelector('textarea');

        let reg = (binding.value || {}).reg || '\d\u4e00-\u9fa5A-Za-z';
        // let replaceReg = new RegExp(`[^\\${reg}]`, 'g');
        // let testReg = new RegExp(`[\\${reg}]`, 'g');

        // 监听keypress，阻止用户输入不合法的字符
        var oldValue = '';
        let c = true;
        input.addEventListener('keypress', function (e) {
            
            let m = e.key;
            c = new RegExp(`[\\${reg}]`, 'g').test(m);
            // TODO 用存起来的正则第 2n 次触发keypress校验不通过
            //  c = testReg.test(''+m);
            if (!c){
                // debugger;
                e.preventDefault();
                e.returnValue = false;
                return false;
            } else {
                return true;
            }
        });

        // if (!(binding.value || {}).reg) {
            // ToDO 中文^  没有触发 onkeypress
        input.addEventListener('input', function (e){
            let _this = this;
            if ((binding.value || {}).reg) {
                setTimeout(()=>{
                    let val = input.value;
                    if (oldValue == val) {
                        return;
                    }
                    oldValue = val;
                    _this.value = val.replace(new RegExp(`[^\\${reg}]`, 'g'), '');
                    _this.dispatchEvent(new Event('input')); // 触发input通知v-model更新
                });
            }
        });
        input.addEventListener('paste', function (e){
            let _this = this;
            // 立即更新会没有效果，通过setTimeout()加入任务队列末尾，做一个延迟
            let tid = window.setTimeout(function() {
                let val = input.value;
                _this.value = val.replace(new RegExp(`[^\\${reg}]`, 'g'), '');
                _this.dispatchEvent(new Event('input')); // 触发input通知v-model更新
                window.clearTimeout(tid);
            }, 0);
        });
        
        // input.onkeyup = function(e){
        //     let _this = this;
        //     let key = e.key || String.fromCharCode(e.keyCode);
        //     _this.dispatchEvent(new Event('input'));
        //     return testReg.test(key);
        // };
        // 监听input，主要实现对粘贴到输入框的数据做过滤
        // input.oninput = function(e){
        //     let _this = this;
        //     let val = this.value;
        //     if (replaceReg.test(val)) {
        //         val = val.replace(replaceReg, '');
        //     }

        //     // 如果格式化后的数字不等于当前输入框的值，替换输入框的值
        //     if (this.value.toString() !== val.toString()) {
        //         // 立即更新会没有效果，通过setTimeout()加入任务队列末尾，做一个延迟
        //         let tid = window.setTimeout(function() {
        //             _this.value = val;
        //             _this.dispatchEvent(new Event('input')); // 触发input通知v-model更新
        //             window.clearTimeout(tid);
        //         }, 0);
        //     }

        // };
    },
    unbind: function(el) {
        let input = el.querySelector('input') || el.querySelector('textarea');
        input.onpaste = null;
        input.onkeyup = null;
    }
};