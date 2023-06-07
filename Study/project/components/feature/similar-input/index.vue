<template>
    <div :class="['similar-input', className, { disabled }]">
        <div v-if="$slots.labelPrefix" class="label-prefix">
            <slot name="labelPrefix"></slot>
        </div>
        <div class="label-content" :class="{ labelPrefix: $slots.labelPrefix, noScroll }">
            <slot></slot>
        </div>
    </div>
</template>

<script>
// 该组件提供类似input的css样式交互，可自定义其中的内容（简单来说：一个框）
export default {
    name: 'UiSimilarInput',
    props: {
        className: {
            type: String,
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        },
        noScroll: {
            type: Boolean,
            default: false
        }
    }
};
</script>

<style lang="less" scoped>
.similar-input {
    // 新增布局
    display: flex;
    align-items: center;

    width: 100%;
    height: 32px;
    position: relative;
    background: #ffffff;
    border-radius: 4px;
    border: 1px solid #dbdfe6;
    transition: border 0.2s ease-in-out, background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    white-space: nowrap;
    padding: 5px 12px;
    line-height: 20px;
    cursor: pointer;
    outline: none;

    .label-prefix {
        flex: 0;
        position: relative;
        &::after {
            position: absolute;
            content: '';
            width: 1px;
            right: -7px;
            height: 50%;
            top: 25%;
            background-color: #adb3bf;
            opacity: 0.5;
        }
    }
    .label-content {
        flex: 1;
        height: 20px;
        overflow: auto;

        &.noScroll {
            overflow: hidden;
        }

        &.labelPrefix {
            padding-left: 12px;
        }
    }

    &.disabled {
        background-color: #f7f7f7;
        border-color: #dbdfe6;
        box-shadow: none;
        cursor: default;
    }

    &:not(.disabled):hover {
        border-color: #54d8c9;
    }
}
</style>
