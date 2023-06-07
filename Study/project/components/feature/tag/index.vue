<template>
    <span class="ui-tag2" :class="classes" @click="handleClick">
        <slot></slot>

        <span v-if="closable" @click="handleClose" class="icon-close">
            <i class="icrm-icon-close"></i>
        </span>
    </span>
</template>

<script>
export default {
    name: 'UiTag2',
    props: {
        closable: Boolean
    },
    computed: {
        classes() {
            return [this.closable ? 'has-close' : ''];
        }
    },
    methods: {
        handleClose(event) {
            event.stopPropagation();
            this.$emit('close', event);
        },

        handleClick(event) {
            this.$emit('click', event);
        }
    }
};
</script>

<style lang="less" scoped>
.ui-tag2 {
    position: relative;
    background: #f1f2f5;
    color: #425161;
    border-radius: 2px;
    font-size: 12px;
    display: inline-flex;
    align-items: center;
    max-width: 100%;
    //height: 20px;
    padding: 0 4px;
    line-height: 20px;

    &.has-close {
        padding-right: 18px;
    }

    .icon-close {
        position: absolute;
        top: 50%;
        right: 4px;
        color: #9FA6B5;
        transform: translateY(-50%);
        cursor: pointer;
        font-size: 12px;
        width: 12px;
        height: 12px;
        display: inline-flex;
        align-items: center;

        .icrm-icon-close {
            font-size: 12px;
            width: 100%;
            height: 100%;

            &::before {
                display: inline-block;
                height: 12px;
                position: relative;
                bottom: 3px;
                transform: scale(0.8);
            }
        }

        &:hover {
            color: #fff;
            background-color: #d3d8e6;
            border-radius: 50%;
        }
    }
    .icon-close::before, .icon-close::after {
        display: none;
    }
}

</style>
