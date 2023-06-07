<template>
    <li
        @click.stop="selectOptionClick"
        class="select-dropdown__item"
        :class="{
            'select-dropdown__item_selected': itemSelected,
            'is-disabled': option.disabled
        }"
        :style="{
            minHeight: '34px',
            transform: `translateY(${ translateY }px)`
        }"
    >
        <slot v-if="(($slots || {}).default || []).length"></slot>
        <span class="select-dropdown__item__span" v-else>{{ option[config.label] }}</span>
  </li>
</template>
<script>
export default {
    name: 'SelectOption',
    props: {
        option: {
            type: Object,
            default: () => ({})
        },
        itemHeight: {
            type: Number,
            default: 34
        },
        currentValue: {
            type: String | Number | Array,
            default: ''
        },
        value: {
            type: String | Number,
            default: ''
        },
        label: {
            type: String | Number,
            default: ''
        },
        list: {
            type: Array,
            default: () => ([])
        },
        config: {
            type: Object,
            default: () => ({})
        }
    },
    watch: {
        '$parent': {
            handler () {
                const parentObj = this?.$parent?.$parent?.$parent?.$parent || {};
                const { 
                    isSelectOption, 
                    $options = {}, 
                    selecedtList = [], 
                    multipleLimit = 0, 
                    handleSelectValue, 
                    updateVisible
                } =  parentObj;
                const selectValue = (parentObj?.$parent || {})['$options'];
                const groupValue = selectValue?.propsData?.value || '';
                let val = $options?.propsData?.value ||  '';
                let checkedValue = isSelectOption ? this.value : this.option[this.config.value];
                if (groupValue) {
                    val = groupValue;
                    checkedValue = this.value;
                }
                if (Array.isArray(val) && val ) {
                    this.itemSelected = val?.includes(checkedValue);
                }
                if ((val.constructor === String || val.constructor === Number) && val ) {
                    this.itemSelected = val?.split(',')?.includes(String(checkedValue));
                }
                this.isSelectOption = isSelectOption;
                this.selecedtList = selecedtList;
                this.multipleLimit = multipleLimit;
                this.updateValue = handleSelectValue;
                this.updateVisible = updateVisible;
            },
            immediate: true
        }
    },
    computed: {
        translateY () {
            const { positions = [], start = 0, isSelectOption } = this.$parent?.$parent || {};
            // 定高模式
            if (!this.$slots?.default?.length) {
                return  start * 34;
            }
            if (this.$slots?.default?.length && !isSelectOption) {
                // 自定义高度模式
                return positions[start - 1]?.top || 0;
            }
            return 0;
        }
    },
    data () {
        return {
            disabled: false,
            itemSelected: false,
            isSelectOption: false,
            selecedtList: [],
            multipleLimit: 0,
            updateValue: null,
            updateVisible: null
        };
    },
    mounted () {
        // 判断是否为自定义高度模式
        if (this.$slots?.default?.length) {
            const value = this.isSelectOption ? this.value : this.option[this.config.value];
            const setDynamicHeightFun = this.$parent?.$parent?.setDynamicHeight;
            typeof setDynamicHeightFun === 'function' 
                ? setDynamicHeightFun(this?.$el?.clientHeight, value) 
                : null;
        }
    },
    methods: {
        /**
         * 选中行时触发
         * isSelectOption: 是否使用select-option自定义模板
         * multipleLimit: 多选模式下，可被选择的最大数目
         * isSelectOptionGrounp: 是否使用select-option-group组
         */
        selectOptionClick () {
            const { selecedtList, multipleLimit, isSelectOption } = this;
            const isSelectOptionGrounp = (this.$parent?.$el || {})['_prevClass'] === 'select-option-group';
            let obj = { ...(this.option || {}), status: !this.itemSelected };

            // 多选模式下，可被选择的最大数目若与已选择数据长度相等不允许继续选择数据
            if (
                multipleLimit > 0 
                && multipleLimit === selecedtList.length
                && !this.itemSelected
            ) return;

            // 点击某个被禁用的option，数据不允许更新
            if(this.option.disabled) return;

            if (this.$slots?.default?.length) {
                const { text } = this.$slots?.default[0] || {};
                obj = {
                    value: isSelectOption? this.value : this.option[this.config.value],
                    label: isSelectOption ? this.label || text : this.option[this.config.label] || this.$el.innerText,
                    status: !this.itemSelected
                };
            }
            if (isSelectOptionGrounp) {
                obj = {
                    value: this.value,
                    label: this.label,
                    status: !this.itemSelected
                };
                const { handleSelectValue } = this?.$parent?.$parent?.$parent?.$parent?.$parent || {};
                this.updateValue = handleSelectValue;
            }
            typeof this.updateValue === 'function' ? this.updateValue(obj) : null;
            typeof this.updateVisible === 'function' ? this.updateVisible(0) : null;
            this.itemSelected = !this.itemSelected;
        }
    }
};
</script>
<style scoped lang="less">
.select-dropdown__item {
    width: 100%;
    margin: 0;
    padding: 8px;
    clear: both;
    list-style: none;
    cursor: pointer;
    transition: background 0.1s ease-in-out;
    display: flex;
    .select-dropdown__item__span {
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 18px;
      height: 18px;
    }
}
.select-dropdown__item_selected {
color: #0CC3BC;
}
.select-dropdown__item_selected:after {
    content: '';
    position: absolute;
    width: 10px;
    height: 6px;
    border: 1px solid;
    border-color: transparent transparent #0CC3BC #0CC3BC;
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg);
    right: 10px;
    top: 50%;
    margin-top: -5px;
}
.is-disabled {
    color: #bfc1c4;
    box-shadow: none;
    cursor: not-allowed;
}
.select-dropdown__item:hover {
    background: #F2F5FA;
}
</style>