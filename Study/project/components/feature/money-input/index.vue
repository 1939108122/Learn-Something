<template>
    <div class="money-format" :style="{'--padding': padding+'px'}">
       <ui-input v-model.trim="money" :placeholder="placeholder" :ref="ref" :maxlength="12" :disabled="disabled" @on-change="changeInput" @on-enter="onEnter" @on-focus="onFocus">
            <span v-if="$slots.labelPrefix" slot="labelPrefix">
                <slot name='labelPrefix'></slot>
            </span>
            <i v-if="showPrefix" slot="prefix">
                {{prefix}}
            </i>
            <i v-if="showSuffix" slot="suffix" @click.stop.prevent="inputDom.focus()">
                {{realSuffix}}
            </i>
            <span v-if="$slots.append" slot="append">
                <slot name='append'></slot>
            </span>
        </ui-input>
    </div>
</template>

<script>
export default {
    name: 'moneyInput',
    props: {
        value: {
            type: [String, Number],
            default: ''
        },
        placeholder: {
            type: [String, Number],
            default: '请输入'
        },
        disabled: {
            type: Boolean,
            default: false
        },
        showPrefix: {
            type: Boolean,
            default: true
        },
        prefix: {
            type: String,
            default: '￥'
        },
        suffix: {
            type: String,
            default: '元'
        },
        showSuffix: {
            type: Boolean,
            default: true
        },
        paddingRight: {
            type: Object,
            default: () => ({
                value: 20, // input默认padding-right
                disabled: false // disabled == true 阻止计算padding-right值
            })
        }
    },
    watch: {
        suffix: {
            handler (val) {
                if (val) {
                    this.realSuffix = val;
                }
            },
            immediate: true
        },
        value: {
            handler (value) {
                if (value || value === 0) {
                    if (this.money === value) {
                        return;
                    }
                    this.formatMoney();
                } else if (value === ''){
                    this.money = '';
                }

            },
            immediate: true
        },
        paddingRight: {
            handler(value) {
                this.padding = value.value || 20;
            },
            immediate: true
        }
    },
    data() {
        return {
            ref: (1000000 *  Math.random()) + Date.now(),
            money: '',
            realSuffix: '',
            inputDom: null,
            padding: 20,
            unit: {
                int: ['元', '万', '亿'],
                float: ['角', '分']
            }
        };
    },
    created() {
        this.$nextTick(()=>{
            if (this.$refs[this.ref]) {
                this.inputDom = this.$refs[this.ref].$el.querySelector('input');
                this.inputDom.addEventListener('keypress', this.keypress);
                this.inputDom.addEventListener('input', this.onInput);
                this.inputDom.addEventListener('blur', this.onblur);
            }
        });
    },
    beforeDestroy() {
        if (this.$refs[this.ref]) {
            this.inputDom = this.$refs[this.ref].$el.querySelector('input');
            this.inputDom.removeEventListener('keypress', this.keypress);
            this.inputDom.removeEventListener('input', this.onInput);
            this.inputDom.removeEventListener('blur', this.onblur);
        }
    },
    methods: {
        formatMoney () {
            // this.money == value
            let _valueList = ('' + this.value).replace(/[^0-9\.]/ig, '').split('.');

            let money = '';
            money = _valueList[0];
            if (!_valueList[0].length) {
                money = 0;
            }

            if ((_valueList[1] || '').length) {

                if (_valueList[1].length > 2) {
                    money = `${money}.${_valueList[1].substr(0, 2)}`;
                } else {
                    money = `${money}.${_valueList[1]}`;
                }
            }

            this.money = money;
            let t = null;

            t = setTimeout(()=>{
                if (this.inputDom) {
                    clearTimeout(t);
                    this.inputDom.value = money;
                    this.changeInput();
                }
            });
        },
        keypress (e) {
            if (!(/\.|\d/g.test(e.key))) {
                // 判断是否满足字符集
                e.preventDefault();
                e.returnValue = false;
                return false;
            }

            if (this.inputDom.value.indexOf('.') > -1 &&  /\./g.test(e.key)) {
                // 判断是否有小数点
                e.preventDefault();
                e.returnValue = false;
                return false;
            }
            if ('selectionStart' in this.inputDom) {
                // 判断小数点位置是否在倒数位置
                let len = (this.inputDom.value || '').length;
                let pos = this.inputDom.selectionStart;

                // if(!pos && /\./g.test(e.key)) {
                //     // 在第一位
                //     e.preventDefault();
                //     e.returnValue = false;
                //     return false;
                // }
                if (len - pos > 2 && /\./g.test(e.key)) {
                    // 再倒数两位处
                    e.preventDefault();
                    e.returnValue = false;
                    return false;
                }

                let pointIndex = (this.inputDom.value || '').indexOf('.');
                let afterPonitLen = ((this.inputDom.value || '').split('.')[1] || '').length;

                if (pointIndex < pos && afterPonitLen >= 2) {
                    // 如果光标在最后两位，且有小数点
                    e.preventDefault();
                    e.returnValue = false;
                    return false;
                }
            }
        },
        onInput (e) {
            this.inputDom.value = this.inputDom.value.replace(/[^\.|\d]/g, '');
        },
        onblur (e) {
            let List = this.inputDom.value.split('.');

            let value = '';
            if ((List[1] || '').length == 0) {
                if (String(List[0]).length != 1) {
                    value = List[0].replace(/^(0+)/, '');
                }
            }

            if (List[0] === '' && !List[1]) {
                value = '';
            } else if(List[1]) {
                value = `${List[0].replace(/^(0+)/, '')}.${List[1]}`;
            } else {
                value = this.inputDom.value;
            }

            this.inputDom.value = value;
            // 这里需要触发 emitModel
            this.emitModel();

            this.$emit('onBlur', value);
        },
        changeInput () {
            if (this.paddingRight.disabled) {
                // 这里需要触发 emitModel
                this.emitModel();
                return;
            }
            this.padding =  20 + 10 * this.inputDom.value.length;

            let list = this.inputDom.value.split('.');
            let afterPoint = '';
            if (list[1]) {
                list[1].split('').forEach((element, index) => {
                    if((element | 0) > 0) {
                        afterPoint += `${element}${this.unit.float[index]}`;
                    }
                });
            }

            let before = '';
            list[0].replace(/(?=(\d{4})+(?!\d))/g, ',').split(',').reverse().forEach((ele, index) => {
                if((ele | 0) > 0) {
                    before = `${ele}${this.unit.int[index]}` + before;
                }
            });

            let realSuffix = `${before}${afterPoint}`;

            this.realSuffix = realSuffix ? realSuffix : '元';

            // 这里需要触发 emitModel
            this.emitModel();
        },
        emitModel () {
            this.$emit('input', this.inputDom.value);
            this.$emit('on-change', this.money);
        },
        onEnter () {
            this.$emit('on-enter');
        },
        onFocus () {
            this.$emit('on-focus');
        }
    }
};
</script>

<style lang="less" scoped>
    .money-format{
        display: inline-block;
        vertical-align: middle;
        /deep/ input{
            padding-right: var(--padding);
        }
        /deep/ .suffix, /deep/ .prefix{
            font-size: 14px;
        }
        /deep/ .input-wrap{
            min-width: 0px;
            width: 275px;
        }
        /deep/ input::-webkit-input-placeholder{
            font-size: 14px;
        }
    }
</style>
