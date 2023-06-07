<template>
    <div :class="`icon-hover ${className}`" v-on="$listeners" :style="styles">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'IconHover',
    props: {
        hoverPadding: {
            type: [Number, String],
            default: 2
        },
        className: {
            type: String,
            default: ''
        }
    },
    computed: {
        styles() {
            return {
                padding: `${this.hoverPadding}px`
            };
        }
    }
};
</script>

<style lang="less" scoped>
.icon-hover {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    transition: all 0.25s;
    cursor: pointer;
    border-radius: 4px;
    overflow: hidden;
    line-height: 16px;

    &:hover {
        background: #e4e8f0;
    }

    [class^='icrm-'] {
        width: 1em !important;
        height: 1em !important;
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
