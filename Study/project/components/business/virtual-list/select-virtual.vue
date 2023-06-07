<template>
    <div class="ui-select-virtual">
        <ui-popover
            trigger="click"
            v-model="dropdownVisible"
            :popper-class="`${popperClass} ui-select-virtual-popver`"
            :width="poperWidth"
            :disabled="disabled"
            :appendToBody="popperAppendToBody"
            ref="popover"
        >
            <div slot="reference" class="select-virtual">
                <div
                    v-if="multiple && selecedtList.length"
                    class="select-virtual__tags"
                    ref="tags"
                    :style="{'margin-left': `${labelPrefixWidth || 8}px`}"
                >
                    <span class="select-virtual-inner">
                        <span ref="collapseTags" v-if="!collapseTags">
                            <span
                                v-for="el in selecedtList"
                                class="ui-tag select-virtual-ui-tag"
                                :key="(el || {}).value"
                            >
                                {{ (el || {}).label }}
                                <i
                                    class="ui-icon-close select-virtual-icon-close"
                                    @click.prevent="clearItem(el)"
                                ></i>
                            </span>
                        </span>
                        <span ref="collapseTags" v-else>
                            <span
                                v-if="selecedtList[0]"
                                class="ui-tag"
                                :key="(selecedtList[0] || {}).value"
                            >
                                {{ (selecedtList[0] || {}).label }}
                                <i
                                    class="ui-icon-close select-virtual-icon-close"
                                    @click.prevent="clearItem(selecedtList[0])"
                                ></i>
                            </span>
                            <ui-tooltip2
                                v-if="collapseTagsTooltip && selecedtList.length >= 2"
                                placement="bottom"
                                :effect="effect"
                            >
                                <template>
                                    <div slot="content" class="ui-select-virtual-collapse-tags-tooltip__content">
                                        <span
                                            v-for="el in selecedtList"
                                            class="ui-tag select-virtual-ui-tag"
                                            :key="(el || {}).value"
                                        >
                                            {{ (el || {}).label }}
                                            <i
                                                class="ui-icon-close select-virtual-icon-close"
                                                @click.prevent="clearItem(el)"
                                            ></i>
                                        </span>
                                    </div>
                                    <span class="ui-tag">
                                        +{{ selecedtList.length - 1 }}
                                    </span>
                                </template>
                            </ui-tooltip2>
                            <span v-if="selecedtList.length >= 2 && !collapseTagsTooltip" class="ui-tag">
                                +{{ selecedtList.length - 1 }}
                            </span>
                        </span>
                    </span>
                </div>
                <span v-if="isLabelPrefix" ref="labelPrefix" class="labelPrefix">
                  <slot class="labelPrefix" name="labelPrefix"></slot>
                </span>
                <ui-input
                    class="select-virtual_input"
                    ref="input"
                    v-model="filterModel"
                    :disabled="disabled"
                    :clearable="clearable"
                    :placeholder="localPlaceholder"
                    :size="size"
                    :name="name"
                    :autocomplete="autocomplete"
                    :readonly="!filterable"
                    @on-change="changeInput"
                    @on-clear="clearInput"
                    @on-focus="onFocus($event)"
                    @on-blur="onBlur($event)"
                >
                    <template v-if="$slots.prefix" slot="prefix">
                        <slot name="prefix"></slot>
                    </template>
                    <template v-if="!clearable || (clearable && !filterModel)" slot="suffix" >
                        <i
                            :style="{transform: `rotate(${dropdownVisible ? '180deg' : '0'})`}"
                            class="ui-icon-arrow-down"
                            slot="suffix"
                        ></i>
                    </template>
                </ui-input>
            </div>
            <virtual-list
                ref="virtual"
                :list="list"
                :cacheScrollTop.sync="cacheScrollTop"
                :currentStart.sync="currentStart"
                :noDataText="noDataText"
                :class="popperClass"
                :height="height"
                :isSelectOption="isSelectOption"
                :isSelectOptionGrounp="isSelectOptionGrounp"
                :loading="loading"
                :positions="positions"
                :config="config"
                @updatePositios="updatePositios"
            >
                <template slot="empty" v-if="$slots.empty">
                    <slot name="empty"></slot>
                </template>
                <template slot-scope="props">
                    <slot :item="props.item"></slot>
                </template>
            </virtual-list>
        </ui-popover>
    </div>
</template>
<script>
import VirtualList from './virtual-list.vue';
export default {
    name: 'SelectVirtual',
    components: {
        VirtualList
    },
    props: {
        options: {
            type: Array,
            default: () => []
        },
        clearable: {
            type: Boolean,
            default: false
        },
        placeholder: {
            type: String,
            default: '请选择'
        },
        multiple: {
            type: Boolean,
            default: false
        },
        value: {
            type: String | Number | Boolean | Object,
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        },
        size: {
            type: String,
            default: 'default'
        },
        collapseTags: {
            type: Boolean,
            default: false
        },
        collapseTagsTooltip: {
            type: Boolean,
            default: false
        },
        multipleLimit: {
            type: Number,
            default: 0
        },
        name: {
            type: String,
            default: ''
        },
        autocomplete: {
            type: String,
            default: 'off'
        },
        filterable: {
            type: Boolean,
            default: false
        },
        noDataText: {
            type: String,
            default: '暂无数据'
        },
        popperAppendToBody: {
            type: Boolean,
            default: true
        },
        height: {
            type: Number | String,
            default: 182
        },
        remote: {
            type: Boolean,
            default: false
        },
        remoteMethod: {
            type: Function,
            default: () => {}
        },
        popperClass: {
            type: String,
            default: ''
        },
        loading: {
            type: Boolean,
            default: false
        },
        effect: {
            type: String,
            default: 'light'
        },
        config: {
            type: Object,
            default: () => ({ value: 'value', label: 'label' })
        }
    },
    data () {
        return {
            dropdownVisible: false,
            filterModel: '',
            cacheScrollTop: 0,
            currentStart: 0,
            selecedtList: [],
            list: [],
            isSelectOption: false,
            isSelectOptionGrounp: false,
            poperWidth: 300,
            localPlaceholder: '',
            positions: [],
            isLabelPrefix: false,
            labelPrefixWidth: 0
        };
    },
    watch: {
        value: {
            handler(val) {
                if (!val) {
                    this.cacheScrollTop = 0;
                    this.currentStart=0;
                    this.selecedtList = [];
                    this.list = this.options;
                    this.localPlaceholder = this.placeholder;
                    this.filterModel = '';
                    this.restCursor('reset', false);
                }
                if (!this.multiple && val) {
                    this.correctDynamicData(val);
                    // const item = this.options.find(item => String(item[this.config.value]) === String(val)) || {};
                    // this.selecedtList.push(item);
                    // this.filterModel = item[this.config.label];
                }
            },
            immediate: true
        },
        options: {
            handler (val = []) {
                this.list = val || [];

                if (!this.multiple && this.value && !this.filterModel && this.options.length !== 0) {
                    this.correctDynamicData(this.value);
                }
            },
            immediate: true,
            deep: true
        },
        dropdownVisible: {
            handler (val) {
                this.$emit('visible-change', val);
                if (this.filterable) {
                    if(!this.filterModel) this.list = this.options;
                }
                if (!this.multiple) {
                    this.localPlaceholder = val
                        ? this.filterModel
                        : this.placeholder;
                    this.filterModel = val
                        ? ''
                        : this.selecedtList.find(item => String(item?.value) === String(this.value))?.label;
                }
                if (val) this.$refs.input?.$el?.querySelector('input').focus();
            }
        },
        placeholder: {
            handler (val = '') {
                this.localPlaceholder = val;
            },
            immediate: true
        }
    },
    mounted () {
        const temp = this.$slots?.default || [];
        const input = this.$refs.input?.$el?.querySelector('input');
        this.isSelectOption = temp.some(item => item?.componentOptions?.tag === 'select-option');
        this.isSelectOptionGrounp = temp.some(item => item?.componentOptions?.tag === 'select-option-group');
        this.isLabelPrefix = this.$slots?.labelPrefix;
        this.$nextTick(() => {
            this.poperWidth = input.offsetWidth || 300;
            if (this.$slots?.labelPrefix) {
                this.labelPrefixWidth = this.$refs.labelPrefix?.clientWidth + 24;
                ((input || {}).style || {}).paddingLeft = `${this.labelPrefixWidth}px`;
            }
        });
    },
    methods: {
        correctDynamicData(targetValue) {
            const item = this.options.find(item => String(item[this.config.value]) === String(targetValue)) || {};
            this.selecedtList.push(item);
            this.filterModel = item[this.config.label];
        },
        /**
         * 获取焦点
         * e: (event: FocusEvent)
         */
        onFocus (e) {
            this.$emit('focus', e);
        },
        /**
         * 失去焦点
         * e: (event: FocusEvent)
         */
        onBlur (e) {
            this.$emit('blur', e);
        },
        /**
         * 下拉框选择数据处理逻辑
         * multiple: 是否多选
         * multipleLimit: 可被选择的最大数目
         */
        handleSelectValue (params = {}) {
            const args = {
                ...(params || {}),
                value: params[this.config.value] || params.value,
                label: params[this.config.label] || params.label
            };
            const argsValue = args?.value;
            // 数据去重
            const isExit = this.selecedtList.some(item => item?.value === argsValue);
            if(!this.multiple) {
                this.selecedtList = [args];
            } else {
                // 选中状态
                if (!isExit && args.status) {
                    this.selecedtList.push(args);
                }
                // 取消选中状态
                if(isExit && !args.status) {
                    this.selecedtList = this.selecedtList.filter(item => item.value !== argsValue);
                }
                // 多选模式下，可被选择的最大数目
                if (this.multipleLimit > 0) {
                    this.selecedtList = this.selecedtList.slice(0, this.multipleLimit);
                }

                this.selecedtList.length
                    ? this.localPlaceholder = ' '
                    : this.filterModel = '';

                if (!this.filterModel) this.filterModel = ' ';
                this.restCursor();
            }
            const selectedValue = this.selecedtList.map(item => item?.value);
            const value = this.multiple ? selectedValue : selectedValue?.join(',');
            this.$emit('input', value);
            this.$emit('change', value);
        },
        /**
         * 单选模式下，选择数据后关闭下拉框
         * dropdownVisible: 是否关闭下拉框
         * multiple: 是否多选模式
         */
        updateVisible () {
            if (!this.multiple) {
                this.dropdownVisible = false;
                this.list = this.options;
            }
        },
        /**
         * 过滤搜索
         * remote: 是否开启远程过滤
         */
        changeInput (e = {}) {
            const value = e?.target?.value?.trim();
            this.dropdownVisible = true;
            if (!this.remote) {
                this.list = this.options.filter(item => item[this.config?.label]?.includes(value));
            } else {
                this.remoteMethod(value);
            }
            if (!value) {
                this.list = this.options;
            }
        },
        /*
         *一键清空
         */
        clearInput () {
            const value = this.multiple ? [] : '';
            this.$emit('input', value);
            this.$emit('clear');
            this.cacheScrollTop = 0;
            this.currentStart=0;
            this.selecedtList = [];
            this.list = this.options;
            this.localPlaceholder = this.placeholder;
            this.restCursor('reset');
        },
        /**
         * 光标重置
         */
        restCursor (key, isFocus = true) {
            this.$nextTick(() => {
                const input = this.$refs.input?.$el?.querySelector('input');
                const lastElementChild = this.$refs?.collapseTags?.lastElementChild;
                const position = lastElementChild?.clientWidth || 8;
                const height = this.$refs?.tags?.clientHeight || 32;
                const offsetLeft = lastElementChild?.offsetLeft || 0;
                const offsetTop = lastElementChild?.offsetTop || 5;
                ((input || {}).style || {}).paddingLeft = `${ offsetLeft + position + 8}px`;
                ((input || {}).style || {}).paddingTop = `${ offsetTop }px`;
                if (this.isLabelPrefix) {
                    ((input || {}).style || {}).paddingLeft = `${
                        key === 'reset'
                            ? this.labelPrefixWidth
                            : offsetLeft + position + this.labelPrefixWidth
                    }px`;
                }
                if (isFocus) input.focus();
                if(!this.collapseTags) {
                    ((input || {}).style || {}).height = `${Math.ceil((height / 32)) * 32}px`;
                    this.$refs?.popover?.updatePopper();
                }
            });
        },
        /**
         * 多选模式下，单个删除选中项
         */
        clearItem (val = {}) {
            const data = this.selecedtList.filter(item => item?.value !== val?.value);
            const temp = data.map(item => item?.value);
            const value = this.multiple ? temp : temp?.join(',');
            this.selecedtList = data;
            this.$emit('input', value);
            this.$emit('remove-tag', val.value);
            this.dropdownVisible = false;
            if (!this.selecedtList.length) {
                this.cacheScrollTop = 0;
                this.currentStart = 0;
                this.filterModel = '';
                this.localPlaceholder = this.placeholder;
            }
            this.restCursor();
        },
        /**
         * 自定义高度模式下缓存位置信息
         */
        updatePositios (index, position = {}) {
            this.$set(this.positions, index, position);
        }
    }
};
</script>
<style scoped lang="less">
.ui-select-virtual {
    display: inline-block;
    position: relative;
    .labelPrefix {
      position: absolute;
      z-index: 1;
      top: 10%;
      left: 8px
    }
    .labelPrefix:after {
      margin-left: 8px;
      position: absolute;
      content: '';
      width: 1px;
      height: 60%;
      top: 20%;
      background-color: #ADB3BF;
      opacity: 0.5;
    }
    .select-virtual {
        position: relative;
        display: inline-block;
        max-width: 300px;
        vertical-align: middle;
        .select-virtual__tags {
            max-width: 270px;
            position: absolute;
            line-height: normal;
            white-space: normal;
            z-index: 1;
            top: 50%;
            transform: translateY(-43%);
            margin-left:8px;
            .select-virtual-icon-close {
                cursor: pointer;
            }
            .select-virtual-inner {
                display: inline-block;
            }
            .ui-tag {
                padding: 1px 4px;
                background: #f0f2f5;
                color: #425161;
                border-radius: 2px;
                max-width: 120px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }
}
</style>
<style lang="less">
 .select-virtual_input {
    position: relative;
    margin: 0 !important;
    .suffix-clear {
        z-index: 2;
    }
}
 .ui-select-virtual-collapse-tags-tooltip__content {
   max-width: 200px;
   max-height: 150px;
   overflow: auto;
 }
.ui-select-virtual-popver {
    padding: 5px 0 0;
    &.ui-popper[x-placement^="bottom"]{
        margin-top: 1px;
    }
    .popper__arrow{
        display: none;
    }
}
.select-virtual-ui-tag {
    padding: 1px 4px;
    background: #f0f2f5;
    color: #425161;
    border-radius: 2px;
    margin: 5px;
    .select-virtual-icon-close {
        cursor: pointer;
    }
}
</style>
