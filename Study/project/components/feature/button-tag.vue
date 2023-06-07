<template>
    <ul class="button-tag">
        <li
            class="button-tag-item"
            v-for="(item, index) in tagList"
            :key="index"
            :class="{ active: item.value === activeValue }"
            @click="toggleTag(item)">
            <span
                v-logParams="{
                    wc_interface: `${logParams.wc_interface}-${item.label}` || '',
                    ele_name: `${logParams.ele_name}-${item.label}`,
                    ele_value: item.value
                }"
            >{{ item.label }}</span>
        </li>
    </ul>
</template>

<script>
export default {
    name: 'button-tag',
    model: {
        prop: 'activeValue',
        event: 'update'
    },
    props: {
        activeValue: {
            type: [String, Number],
            required: true
        },
        tagList: {
            type: Array,
            default: [],
        },
        loading: {
            type: Boolean,
            default: false,
        },
        logParams: {
            type: Object,
            default: () => {
                return {
                    wc_interface: '',
                    ele_name: ''
                };
            }
        }
    },
    methods: {
        toggleTag(item) {
            if (this.loading || this.activeValue === item.value) return;
            this.$emit('update', item.value);
            this.$emit('change', item);
        },
    },
};
</script>

<style lang="less" scoped>
.button-tag {
    display: flex;
    border-radius: 4px;
    font-weight: normal;

    &-item {
        position: relative;
        display: flex;
        padding: 3px 0;
        line-height: 26px;
        background: #F1F2F5;
        font-size: 14px;
        cursor: pointer;
        white-space: normal;
        border-right: none;
        user-select: none;
        color: #757D8C;

        &:first-child {
            padding-left: 3px;
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
        }
        &:last-child {
            padding-right: 3px;
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
        }
        &.active {
            color: #00a6a7;
            font-weight: bold;
            span {
                background-color: #fff;
            }
        }
        >span {
            padding: 0 16px;
            border-radius: 2px;
        }
        &:not(.active):hover {
            span {
                background-color: #fff;
            }
        }
        &+.button-tag-item {
            span {
                margin-left: 2px;
            }
        }
    }
    .button-tag-item:not(.active)+.button-tag-item:not(.active) {
        &::before {
            position: absolute;
            content: '';
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 1px;
            height: 12px;
            background: #CDD0D6;
        }
    }
}
</style>
