<template>
    <div class="label-prefix-dropdown" ref="dropdownRef">
        <div class="label-prefix-dropdown-container" @click="toggleVisible">
            <span>{{ currentLabel }}</span>
            <i class="i-arrow" :class="{ 'icrm-bossui-icon-up': visible, 'icrm-bossui-icon-down': !visible }"></i>
        </div>
        <ul class="condition-list" v-show="visible">
            <li
                v-for="(item, index) in dataList"
                class="condition-list-item"
                :class="{ selected: value === item.value }"
                :style="{ width: `${width}px` }"
                :key="index"
                @click="changeChooseType(item.value)"
            >
                <span>{{ item.label }}</span>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'labelPrefixSelect',
    props: {
        dataList: {
            type: Array,
            default: () => [], // [{ label: xxx, value: xxx }]
        },
        // 当前选择的
        value: {
            type: [String, Number],
        },
        // 宽度
        width: {
            type: [String, Number],
            default: 100,
        },
    },
    data() {
        return {
            visible: false,
            isClickOutside: false,
        };
    },
    computed: {
        currentLabel() {
            return (this.dataList.find((item) => item.value === this.value) || {}).label;
        },
    },
    methods: {
        toggleVisible() {
            this.visible = !this.visible;
            this.$emit('click');
        },
        changeChooseType(type) {
            this.toggleVisible();
            this.$emit('input', type);
        },
        bindClickOutside() {
            const handler = (e) => {
                const targetRef = this.$refs['dropdownRef'];
                if (!targetRef) return;
                if (!targetRef.contains(e.target)) {
                    this.visible = false;
                }
            };
            document.addEventListener('click', handler);
            this.$on('hook:beforeDestroy', () => {
                document.removeEventListener('click', handler);
            });
        },
    },
    mounted() {
        this.bindClickOutside();
    },
};
</script>

<style lang="less">
.label-prefix-dropdown {
    position: relative;
    min-width: unset;
    border: none;
    padding: 4px 0;
    user-select: none;

    .label-prefix-dropdown-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;

        .i-arrow {
            margin-left: -1px;
            margin-right: -5px;
            color: #cdd0d6;
        }
    }

    .condition-list {
        position: absolute;
        z-index: 10;
        top: 28px;
        left: -8px;
        border-radius: 4px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        background: #fff;
        padding: 4px 0;

        &-item {
            padding: 5px 10px 5px 15px;
            color: #363f55;
            font-size: 14px;
            display: flex;
            align-items: center;
            cursor: pointer;
            line-height: 20px;

            &:hover {
                background-color: #f7f8fb;
            }

            &.selected {
                color: #01a09c;
            }
        }
    }
}
</style>
