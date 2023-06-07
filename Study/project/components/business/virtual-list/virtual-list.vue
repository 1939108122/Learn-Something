<template>
    <div 
        class="virtual-list-wrap" 
        ref="virtualList" 
        :placement="placeholder"
        :style="{maxHeight: `${height}px`}"
    >
        <select-dropdown>
            <div v-if="loading" class="data-loading">
                <i class="ui-icon-loading"></i>加载中...
            </div>
            <div v-else>
                <div v-if="!isSelectOption && !isSelectOptionGrounp">
                    <select-option
                        v-for="item in dataSource"
                        :key="item[config.value]"
                        :option="item"
                        :itemHeight="itemHeight"
                        :list="list"
                        :config="config"
                    >
                        <slot :item="item"></slot>
                    </select-option>
                </div>
                <slot v-else></slot>
                <div v-if="!dataSource.length && $slots.empty && !isSelectOption" class="empty" slot="empty">
                    <slot name="empty"></slot>
                </div>
                <div v-if="!dataSource.length && !$slots.empty && !isSelectOption" class="empty">
                    {{ noDataText }}
                </div>
            </div>
        </select-dropdown>
    </div>
</template>
<script>
import SelectDropdown from './select-dropdown.vue';
import SelectOption from './option.vue';
import { throttle } from '@/utils/tools/optimize.js';
let timer = null;
export default {
    name: 'VirtualList',
    components: {
        SelectDropdown,
        SelectOption
    },
    props: {
        placeholder: {
            type: String,
            default: '请选择'
        },
        list: {
            type: Array,
            default: () => []
        },
        cacheScrollTop: {
            type: Number,
            default: 0
        },
        currentStart: {
            type: Number,
            default: 0
        },
        noDataText: {
            type: String,
            default: '暂无数据'
        },
        height: {
            type: Number | String,
            default: 182
        },
        isSelectOption: {
            type: Boolean,
            default: false
        },
        isSelectOptionGrounp: {
            type: Boolean,
            default: false
        },
        loading: {
            type: Boolean,
            default: false
        },
        positions: {
            type: Array,
            default: () => []
        },
        config: {
            type: Object,
            default: () => ({})
        }
    },
    watch: {
        height (val) {
            this.count = Math.ceil(val / this.itemHeight) * 4;
        },
        list: {
            handler () {
                this.initScroll();
            },
            deep: true,
        },
        isDynamicSize (val) {
            if (val) {
                this.initPositions();
            }
        },
    },
    data () {
        return {
            dataSource: [],
            start: 0,
            count: 20, // 可展示数据条数
            itemHeight: 34, // 每个元素高度
            isScroll: false,
            isSlotOption: false,
            estimatedHeight: 34, // 动态列表预设高度
            isDynamicSize: false
        };
    },
    updated () { 
        this.$nextTick(() => {
            (this.$el || {}).scrollTop = this.cacheScrollTop;
        });
    },
    mounted () {
        this.initScroll();
    },
    beforeDestroy() {
        clearTimeout(timer);
    },
    methods: {
        /**
         * positions: 动态高度列表位置信息
         * 初始化监听滚动条
         */
        initScroll () {
            const data = this.list;
            this.start = this.currentStart;
            this.dataSource = data?.slice(this.start, this.start + this.count) || [];
            if (data.length <= this.count) return;
            this.$refs.virtualList.addEventListener('scroll', throttle((e) => {
                this.isScroll = true;
                // 固定高度列表滚动条计算
                let start = Math.floor(e?.target?.scrollTop / this.itemHeight);
                if (data.length > 20) {
                    // 动态高度列表滚动条计算
                    if (this.positions.length) {
                        start = this.getStartIndex(e?.target?.scrollTop);
                    };
                };
                clearTimeout(timer);
                this.$nextTick(() => {
                    if (data.length > 20) {
                        this.start = this.currentStart || start;
                        this.dataSource = data.slice(start, start + this.count);
                        this.$emit('update:currentStart', start);
                    }
                    this.$emit('update:cacheScrollTop', e?.target?.scrollTop);
                });
                // 解决滑动过快屏幕出现空白
                if ((this.start * this.itemHeight) !== e?.target?.scrollTop) {
                    setTimeout(() => {
                        this.start = this.currentStart || start;
                        this.$emit('update:cacheScrollTop', e?.target?.scrollTop);
                    }, 100);
                }
            }, 10));
        },
        /**
         * 初始化列表位置信息
         */
        initPositions(){
            this.list.forEach((item, index) => {
                this.$emit('updatePositios', index, {
                    value: item[this.config.value],
                    height: this.estimatedHeight,
                    top: index * this.estimatedHeight,
                    bottom:(index + 1) * this.estimatedHeight
                });
            });
        },
        /**
         * 获取列表起始索引
         */
        getStartIndex(scrollTop = 0){
            return this.binarySearch(this.positions, scrollTop);
        },
        /**
         * 二分法查找
         */
        binarySearch(list, value){
            let start = 0;
            let end = list.length - 1;
            let tempIndex = null;
            while(start <= end){
                let midIndex = Math.floor((start + end)/2);
                let midValue = list[midIndex]?.top;
                if(midValue === value) {
                    return midIndex;
                } else if(midValue < value) {
                    start = midIndex + 1;
                } else if(midValue > value) {
                    if(tempIndex === null || tempIndex > midIndex){
                        tempIndex = midIndex;
                    }
                }
                end = end - 1;
            };
            return tempIndex;
        },
        /**
         * 缓存动态列表位置信息
         */
        setDynamicHeight (height, value = '') {
            this.isDynamicSize = true;
            const index = this.list.findIndex(item => item[this.config.value] === value);
            const obj = this.list.find(item => item[this.config.value] === value) || {};
            let oldHeight = obj.height;
            let dValue = oldHeight - height;
            //存在差值
            if(dValue){
                this.$emit('updatePositios', index, {
                    ...obj, 
                    value,
                    height,
                    bottom: obj.bottom - dValue
                });
                for(let k = index + 1; k < this.positions.length; k++){
                    this.positions[k].top = this.positions[k-1].bottom;
                    this.positions[k].bottom = this.positions[k].bottom - dValue;
                }
            }
        }
    }
};
</script>
<style lang="less" scoped>
.virtual-list-wrap {
    overflow-y: auto;
    overflow-anchor: none;
    .empty {
        line-height: 170px;
        text-align: center;
    }
    .data-loading {
        text-align: center;
        line-height: 170px;
    }
}
</style>