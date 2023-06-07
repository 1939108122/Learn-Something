<template>
  <ul class="ui-select-pro-box" :class="{'box-with-label-prefix': $slots.labelPrefix}" :style="{'--dropdownWidth': dropdownWidth, '--labelWidth': labelWidth}" ref="__ui-select-pro-box">
      <li v-if="$slots.labelPrefix" class="label-prefix" ref="__label-prefix">
          <slot name="labelPrefix"></slot>
      </li>
      <li class="ui-select-pos">
          <ui-tooltip2 v-if="Array.isArray(model) && model.length && hasEffective" placement="top" effect="dark" trigger="hover" class="selected-item-popover" :popperClass="wrapClass" appendToBody>
              <i class="selected-item" @click.stop="handleClick">
                  {{model.length === optionList.length ? allText : '已选' + model.length + '项'}}
              </i>
              <div slot="content" class="ui-select-pro select-popover-content">{{selectedLabel}}</div>
          </ui-tooltip2>
          <ui-select ref="__ui-select-pro" v-model="model" :placeholder="placeholder" @on-change="changeSelect($event, model)" @on-open-change="openchangeSelect" multiple clearable>
              <ui-option v-for="item in optionList" :value="''+item[config.value]" :key="item[config.value]">
                  {{item[config.label]}}
              </ui-option>
          </ui-select>
      </li>
  </ul>
</template>
<script>
import { isNotEmpty } from '@/utils/tools/tools.js';
// 全选的默认value值
const ALL = '_ALL';

export default {
    name: 'index',
    props: {
        value: {
            type: String,
            default: '',
        },
        options: {
            type: Array,
            required: true,
            default: () => ([])
        },
        config: {
            type: Object,
            default: () => ({
                label: 'label',
                value: 'value'
            })
        },
        hasAll: {
            // 下拉选项是否显示全部
            type: Boolean,
            default: false
        },
        allText: { //有 ‘全部’时的文本
            type: String,
            default: '全部'
        },
        wrapClass: '',
        placeholder: {
            type: String,
            default: '请选择'
        }
    },
    data() {
        return {
            dropdownWidth: null,
            labelWidth: null,
        };
    },
    mounted() {
        this.setWidth();
    },
    methods: {
        changeSelect(nArr, oArr) {
            let nLen =  nArr.length,
                oLen = oArr.length;
            if (this.hasAll && nLen !== oLen) {
                // 全选或取消全选
                if (nArr.includes(ALL) && !oArr.includes(ALL)) {
                    // 全选
                    let vArr = [];
                    this.optionList.forEach(item => {
                        let val = item[this.config.value];
                        if(isNotEmpty(val)) vArr.push(val);
                    });
                    this.model = vArr;
                } else if (!nArr.includes(ALL) && oArr.includes(ALL)) {
                    // 取消全选
                    this.model = [];
                }
            }
        },
        openchangeSelect(val) {
            if(val) { // 展开时重新计算下拉框的宽度
                this.setWidth();
            }
            this.$emit('on-open-change', val);
        },
        handleClick() {
            this.$refs['__ui-select-pro'].handleClick();
        },
        setWidth() {
            this.$nextTick(() => {
                let labelDom = this.$refs['__label-prefix'];
                this.labelWidth = labelDom? labelDom.getBoundingClientRect().width * -1 + 'px' : null;
                this.dropdownWidth = this.$refs['__ui-select-pro-box'].getBoundingClientRect().width + 'px';
            });
        }
    },
    computed: {
        optionList() {
            let options = JSON.parse(JSON.stringify(this.options)),
                {label, value} = this.config;

            if (this.hasAll && Array.isArray(options) && options.length) options.unshift({[label]: this.allText, [value]: ALL});

            return options;
        },
        model: {
            get() {
                let valArr = isNotEmpty(this.value) ? this.value.split(',') : [],
                    len = valArr.length;

                if (this.hasAll && len && len === this.options.length) {
                    // 可全选，并且已全选
                    valArr.unshift(ALL);
                }

                // return valArr.filter(val => this.options.find(item => item.value == val)); // 值有效性
                return valArr;
            },
            set(arr) {
                let array = JSON.parse(JSON.stringify(arr)),
                    valStr = array.join(','),
                    idx = array.indexOf(ALL);
                if (this.hasAll && idx > -1) {
                    // 可全选，并且已全选
                    // 剔除
                    array.splice(idx, 1);
                    valStr = array.join(',');
                }
                this.$emit('input', valStr);
                this.$emit('on-change', valStr);
            }
        },
        hasEffective() {
            // model中存在有效值，也就是model中的值至少有一个是optionList中的值
            // 防止跳转带参时，所带的参数无效
            let list = this.optionList.map(itm => {
                return itm[this.config.value];
            }).filter(v => isNotEmpty(v));

            return this.model.some(v => list.includes(v) || list.includes(String(v)));
        },
        selectedLabel() {
            let labelArr =[];
            if (Array.isArray(this.model)) {
                this.options.forEach(item => {
                    if (this.model.includes(''+item[this.config.value])) {
                        labelArr.push(item[this.config.label]);
                    }
                });
            }
            return labelArr.join('、');
        }
    }
};
</script>
<style lang="less" scoped>
    .ui-select-pro-box {
        width: 258px;
        //margin: 5px 0;
        display: inline-block;
        position: relative;

        &:hover {
            /deep/ .ui-select-selection {
                border-color: #2CD7C8;
            }
        }

        .selected-item-popover {
            line-height: 20px;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            left: 12px;
            z-index: 1;
        }

        .selected-item {
            height: 20px;
            padding: 1px 5px;
            line-height: 18px;
            background: #F0F2F5;
            color: #425161;
            font-size: 13px;
            border-radius: 3px;
            cursor: pointer;
        }

        /deep/ .ui-select.ui-select-multiple {
            width: 100% !important;
            margin-top: 0;
            margin-bottom: 0;

            .ui-select-selection {
                height: 30px;
            }

            .ui-select-inner {
                & > .ui-tag {
                    display: none;
                }

                // .ui-select-placeholder {
                //     color: #d2d2d2;
                // }
            }
        }

        // slot=labelPrefix
        &.box-with-label-prefix {
            display: flex;
            border: 1px solid #DBDFE6;
            border-radius: 4px;

            &:hover {
                border-color: #2CD7C8;
            }
            .label-prefix {
                min-width: 30px;
                max-width: 120px;
                line-height: 30px;
                padding: 0 15px 0 8px;
                position: relative;

                &:after {
                    position: absolute;
                    content: "";
                    width: 1px;
                    height: 12px;
                    margin-top: -6px;
                    top: 50%;
                    right: 6px;
                    background-color: #ADB3BF;
                    opacity: .5;
                }
            }

            .ui-select-pos {
                flex: 1;
                position: relative;

                /deep/ .ui-select {
                    .ui-select-selection {
                        border: none;
                        box-shadow: none;
                        border-radius: 4px;
                        .ui-select-inner {
                            padding-left: 0;
                        }
                    }
                    .ui-select-dropdown.ui-select-multiple {
                        width: var(--dropdownWidth) !important;
                        transform: translateX(var(--labelWidth)) !important;
                    }
                }
                .selected-item-popover {
                    left: 2px;
                }
            }
        }
    }
</style>
<style lang="less">
  .ui-select-pro.select-popover-content {
      max-width: 200px;
  }
</style>
