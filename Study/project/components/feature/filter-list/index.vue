<template>
    <div class="filter-content" ref="filter-content" v-clickoutside="handleClose">
        <div class="inner">
            <i :class="[iconName, { active: isShowOpen }]" @click.stop="openFilterContent"></i>
            <div class="list-filter-box" v-if="isOpen" :style="extraStyle">
                <ul class="list-filter" v-if="showAll">
                    <li @click.stop="checkAllItem()">
                        <label class="checkbox checkbox-checked">
                            <span class="checkbox-inner">
                                <i v-if="checkAll" class="checkbox-edging"></i>
                            </span>
                        </label>
                        全部
                    </li>
                </ul>
                <ul class="list-filter">
                    <li v-for="(item, index) in options" :key="item.value" @click.stop="selectFilter(item)">
                        <label class="checkbox checkbox-checked">
                            <span class="checkbox-inner">
                                <i v-if="item.showchecked" class="checkbox-edging"></i>
                            </span>
                        </label>
                        {{ item.label }}
                    </li>
                </ul>
                <div class="buttons">
                    <a href="javascript:void(0);" @click.prevent="confirmFilter">确定</a>
                    <a href="javascript:void(0);" @click.prevent="cancelFilter">取消</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'filterList',
    props: {
        options: {
            type: Array,
            default: () => [],
        },
        isOpen: {
            type: Boolean,
            default: false,
        },
        showAll: {
            type: Boolean,
            default: true,
        },
        iconName: {
            type: String,
            default: 'icrm-filter', // icrm-filter  icrm-filter-new
        },
        extraFn: {
            type: Function,
            required: false,
        },
    },
    data() {
        return {
            // open: false,
            isShowOpen: false,
            checkAll: true,
            mousePosition: {
                x: 0,
                y: 0,
            },
        };
    },
    computed: {
        extraStyle() {
            if (this.extraFn) {
                return {
                    position: 'fixed',
                    left: `${this.mousePosition.x - 40}px`,
                    top: `${this.mousePosition.y + 18}px`,
                };
            } else {
                return {};
            }
        },
    },
    created() {
        // this.open = this.isOpen;
    },
    methods: {
        initOptions() {
            let options = this.options.map((option) => {
                let checked = true,
                    showchecked = true;

                if (option.hasOwnProperty('checked')) {
                    checked = option.checked;
                    showchecked = option.checked;
                }
                return {
                    ...option,
                    checked,
                    showchecked,
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
        openFilterContent(event) {
            // this.open = !this.open;
            let open = !this.isOpen;
            this.$emit('update:isOpen', open);
            // 用 render 函数时 不会更新 update:isOpen
            this.$emit('changeOpen', open);
            this.options.forEach((ele) => {
                if (ele.checked) {
                    ele.showchecked = true;
                } else {
                    ele.showchecked = false;
                }
            });
            if (this.extraFn) {
                console.log(event.clientX, event.clientY, 'event');
                this.mousePosition.x = event.clientX;
                this.mousePosition.y = event.clientY;
            }
        },
        selectFilter(item) {
            this.options.forEach((ele) => {
                if (ele.value == item.value) {
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
                    return (this.isShowOpen = true);
                } else {
                    return (this.isShowOpen = false);
                }
            });

            // this.open = false;
            this.$emit('update:isOpen', false);
            // 用 render 函数时 不会更新 update:isOpen
            this.$emit('changeOpen', false);
            let statusArr = [];
            this.options.forEach((item, index, arr) => {
                if (item.checked) statusArr.push(item.value);
            });
            this.$emit('input', statusArr.join(','));
            this.$emit('on-change', statusArr.join(','));
        },
        cancelFilter() {
            this.options.map((ele) => {
                if (ele.checked) {
                    ele.showchecked = true;
                }
            });
            // this.open = false;
            this.$emit('update:isOpen', false);
            this.$emit('changeOpen', false);
        },
        handleClose() {
            // this.open = false;
            this.$emit('update:isOpen', false);
            this.$emit('changeOpen', false);
        },
        isAllChecked() {
            // 判断是否全选
            let hasNothowchecked = false;
            let hasChecked = false;
            for (let el of this.options) {
                if (!el.showchecked) {
                    hasNothowchecked = true;
                }
                if (el.checked) {
                    hasChecked = true;
                }
            }

            this.isShowOpen = hasChecked;
            if (hasNothowchecked) {
                this.checkAll = false;
                return;
            }

            this.checkAll = true;
        },
        hide() {
            console.log(this.isOpen, 'this.isOpen');
            if (this.isOpen) {
                this.$emit('update:isOpen', false);
            }
        },
    },
    watch: {
        options: {
            handler() {
                this.isAllChecked();
            },
            immediate: true,
            deep: true,
        },
        isOpen: {
            handler(bol) {
                if (bol) this.initOptions();
            },
            immediate: true,
        },
    },
    mounted() {
        if (this.extraFn) {
            this.extraFn(this.hide);
        }
    },
};
</script>

<style lang="less" scoped>
.filter-content,
.inner {
    display: inline-block;
    user-select: none;
}

.icrm-filter,
.icrm-filter-new {
    cursor: pointer;
    color: #858585;
    &.active {
        color: #54d8c9;
    }
}

.list-filter-box {
    position: absolute;
    min-width: 100px;
    padding-bottom: 40px;
    overflow: hidden;
    z-index: 10;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 0 10px #ccc;
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
