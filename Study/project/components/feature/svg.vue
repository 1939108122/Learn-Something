<!--svg图标-->
<template>
    <svg :class="['ui-svg-icon', { 'disabled': disabled }]" aria-hidden="true" :style="`width:${size}px;height:${size}px`">
        <use :xlink:href="`#${iconClass}`" />
    </svg>
</template>

<script lang="ts">
export default({
    name: 'SvgIcon',
    props: {
        iconClass: {
            type: String,
            required: true
        },
        size: {
            type: [Number, String],
            default: 14
        },
        disabled: {
            type: Boolean,
            default: false
        }
    }
});
</script>

<style lang="less">
.ui-svg-icon {
    vertical-align: middle;
    fill: currentColor;
    overflow: hidden;
    outline: none;

    &.disabled {
        color: #aaaeb9;
    }

    title {
        display: none;
    }
}
</style>
