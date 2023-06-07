<template>
    <ui-popover
        ref="filterList"
        placement="bottom"
        trigger="click"
        @show="show"
        @hide="hide"
        :popper-class="'_filter-list-popover '+ 'MutationObserver'+idkey">
        <i slot="reference" :id="'MutationObserver'+idkey" :class="['icrm-filter',{'active':isShowOpen}]"></i>
        <div class="list-filter-box">
            <ul class="list-filter">
                <li @click.stop="checkAllItem()">
                    <label class="checkbox checkbox-checked">
                        <span class="checkbox-inner">
                            <i v-if="checkAll" class="checkbox-edging"></i>
                        </span>
                    </label>
                    {{isAllText}}
                </li>
            </ul>
            <ul class="list-filter">
                <li v-for="(item, index) in options" :key="item[config.value]" @click.stop="selectFilter(item)">
                    <label class="checkbox checkbox-checked">
                        <span class="checkbox-inner">
                            <i v-if="item.showchecked" class="checkbox-edging"></i>
                        </span>
                    </label>
                    {{item[config.label]}}
                </li>
            </ul>
            <div class="buttons">
                <a href="javascript:void(0);" @click.prevent="confirmFilter">确定</a>
                <a href="javascript:void(0);" @click.prevent="cancelFilter">取消</a>
            </div>
        </div>
    </ui-popover>
</template>

<script>
import { debounce } from '@/utils/tools/optimize.js';
export default {
    name: 'filterList',
    props: {
        options: {
            type: Array,
            default: false
        },
        isAllText: {
            type: String,
            default: '全部'
        },
        config: {
            type: Object,
            default: () => ({
                value: 'value',
                label: 'label'
            })
        }
        /*isOpen: {
            type: Boolean,
            default: false
        }*/
    },
    data() {
        return {
            // open: false,
            isShowOpen: true,
            checkAll: true,
            idkey: Date.now(),
            isShow: false,
            observer: null
        };
    },
    watch: {
        options: {
            handler() {
                this.isAllChecked();
                this.options.some((item) => {
                    if (item.checked) {
                        return this.isShowOpen = true;
                    } else {
                        return this.isShowOpen = false;
                    }
                });
            },
            immediate: true,
            deep: true
        },
    },
    methods: {
        show () {
            this.isShow = true;
        },
        hide () {
            this.isShow = false;
        },
        scrollFunction () {
            if (this.isShow){
                this.$refs.filterList.createPopper();
            }
        },
        initOptions() {
            let options = this.options.map(option => {
                let checked = true,
                    showchecked = true;

                if (option.hasOwnProperty('checked')) {
                    checked = option.checked;
                    showchecked = option.checked;
                }
                return {
                    ...option,
                    checked,
                    showchecked
                };
            });
            this.$emit('update:options', options);
        },
        checkAllItem() {
            this.checkAll = !this.checkAll;
            this.options.forEach((ele) => {
                ele.showchecked = this.checkAll;
            });
        },
        selectFilter(item) {
            this.options.forEach((ele) => {
                if (ele[this.config.value] == item[this.config.value]) {
                    ele.showchecked = !ele.showchecked;
                }
            });
            this.isAllChecked();
            this.$forceUpdate();
        },
        confirmFilter() {
            this.options.forEach((ele) => {
                if (ele.showchecked) {
                    ele.checked = true;
                } else {
                    ele.checked = false;
                }
            });
            this.options.some((item) => {
                if (item.checked) {
                    return this.isShowOpen = true;
                } else {
                    return this.isShowOpen = false;
                }
            });
            let statusArr = [];
            let fullResult = [];
            this.options.forEach((item, index, arr) => {
                if (item.checked) {
                    statusArr.push(item[this.config.value]);
                    fullResult.push(JSON.parse(JSON.stringify(item)));
                } 
            });
            this.$emit('input', statusArr.join(','));
            this.$emit('on-change', statusArr.join(','));
            this.$emit('on-change-all-attribute', fullResult);
            this.handleClose();
        },
        cancelFilter() {
            this.options.map((ele) => {
                if (ele.checked) {
                    ele.showchecked = true;
                }
            });
            this.handleClose();
        },
        handleClose() {
            this.$refs.filterList.doClose();
        },
        isAllChecked() {
            // 判断是否全选
            for (let el of this.options) {
                if (!el.showchecked) {
                    this.checkAll = false;
                    return;
                }
            }
            this.checkAll = true;
        }
    },
    created() {
    },
    mounted () {
        let that = this;
        this.scrollFunction = debounce(this.scrollFunction, 16.7);
        // 区分 table-pro 和 table-pro2
        let dom = document.querySelector('.ui-tablepro-header') ? document.querySelector('.ui-tablepro-header') : document.querySelector('.ui-table-header-wrapper');
        if (dom) {
            dom.addEventListener('scroll', this.scrollFunction);

            function handleIntersect (entries) {
                if (entries[0].intersectionRatio <= 99 && that.isShow) {
                    that.handleClose();
                }
            }

            let boxElement = document.getElementById('MutationObserver'+this.idkey);

            let options = {
                rootMargin: '0px'
            };

            this.observer = new IntersectionObserver(handleIntersect, options);
            this.observer.observe(boxElement);
        }
    },
    beforeDestroy() {
        let dom = document.querySelector('.ui-tablepro-header') ? document.querySelector('.ui-tablepro-header') : document.querySelector('.ui-table-header-wrapper');
        if (dom) {
            dom.removeEventListener('scroll', this.scrollFunction);
            this.observer.disconnect();
            this.observer = null;
            this.scrollFunction = null;
        }
    },
};
</script>

<style lang="less" scoped>
    .inner {
        display: inline-block;
        user-select: none;
    }

    .icrm-filter {
        cursor: pointer;
    }

    .icrm-filter.active {
        color: #54d8c9;
    }

    .list-filter-box {
        // position: absolute;
        min-width: 100px;
        padding-bottom: 40px;
        overflow: hidden;
        background: #fff;
        border-radius: 4px;
        .list-filter {
            overflow-x: auto;
            max-height: 300px;
            li {
                padding: 5px 10px;
                cursor: pointer;
                &:hover {
                    background-color: #f2f5f9;
                }
            }
        }
        .buttons {
            position: absolute;
            left: 0;
            bottom: 10px;
            width: 100%;
            display: flex;
            text-align: center;
            a {
                flex: 1;
                font-size: 14px;
                color: #13d1be;
            }
        }
    }
</style>
<style lang="less">
._filter-list-popover{
    z-index: 20 !important;
}
</style>
