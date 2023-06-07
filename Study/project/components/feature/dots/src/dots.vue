<template>
    <div class="_tooltip-box" :style="{ '--color': hoverColor }">
        <ui-tooltip2 v-if="canshow" :open-delay="300" :placement="placement" :arrowOffset="arrowOffset" :popperClass="'_dot-popover-wrap ' + customWrapClass" :effect="theme" :transition="' '">
            <p v-if="referenceHtml" v-html="txt" class="multy-line _hover-txt" :style="{ '-webkit-line-clamp': line }" @mouseenter.stop.prevent @mousemove.stop.prevent @mouseover.stop.prevent></p>
            <p v-else class="multy-line _hover-txt" :style="{ '-webkit-line-clamp': line }" @mouseenter.stop.prevent @mousemove.stop.prevent @mouseover.stop.prevent>
                <slot></slot>{{ txt }}
            </p>
            <div slot="content" class="popover-wrap-content" v-html="txt"></div>
        </ui-tooltip2>
        <template v-else>
            <p v-if="referenceHtml" v-html="txt" ref="tootipLine" class="multy-line _hover-txt" :class="{ hover }" :style="{ '-webkit-line-clamp': line }"></p>
            <p v-else ref="tootipLine" class="multy-line _hover-txt" :class="{ hover }" :style="{ '-webkit-line-clamp': line }"><slot></slot>{{ txt }}</p>
        </template>
    </div>
</template>

<script>
export default {
    data() {
        return {
            canshow: false,
        };
    },
    components: {},
    props: {
        line: {
            type: [String, Number],
            default: 1,
        },
        txt: {
            type: String,
            default: '',
        },
        customWrapClass: {
            type: String,
            default: '',
        },
        hoverColor: {
            type: String,
            default: '#414a60',
        },
        placement: {
            type: String,
            default: 'top-start',
        },
        // appendToBody: { // false 会不显示层级太低
        //     type: Boolean,
        //     default: false
        // },
        theme: {
            type: String,
            default: 'dark',
        },
        hover: {
            type: Boolean,
            default: true,
        },
        referenceHtml: { //展示内容是否允许v-html
            type: Boolean,
            default: false
        },
        arrowOffset: { //箭头偏移
            type: Number,
            default: 0
        },
    },

    computed: {},
    watch: {
        txt: {
            handler(val) {
                if (val) {
                    this.$nextTick(() => {
                        this.setDom();
                    });
                }
            },
            immediate: true,
        },
    },
    beforeDestroy() {},
    methods: {
        setDom() {
            let dom = this.$refs.tootipLine;
            if (dom) {
                this.canshow = dom.scrollHeight > dom.offsetHeight;
            }
        },
    },
    mounted() {
        // 解决团队客户v-show dots失效问题
        setTimeout(() => {
            this.setDom();
        }, 1);
    },
};
</script>

<style lang="less">
._tooltip-box {
    .multy-line {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        outline: none; // Safari浏览器，文案超长时，点击文案，左右出现外边框
    }
    .popover {
        width: 100%;
    }
}
._dot-popover-wrap {
    max-width: 280px;
    line-height: 1.7em;
    z-index: 10000 !important;
    font-size: 12px;
    padding-right: 0px;

    // &.is-dark {
    //     background: rgba(0, 0, 0, 0.65);
    //     border-color: transparent; // rgba(0, 0, 0, 0.76);
    //     box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.3);
    // }
    // &.is-dark[x-placement^='top'] .popper__arrow {
    //     border-top-color: rgba(0, 0, 0, 0.35) !important;
    // }
    // &.is-dark[x-placement^='top'] .popper__arrow:after {
    //     border-top-color: rgba(0, 0, 0, 0.35);
    // }
    // &.is-dark[x-placement^='bottom'] .popper__arrow {
    //     border-bottom-color: rgba(0, 0, 0, 0.35);
    // }
    // &.is-dark[x-placement^='bottom'] .popper__arrow:after {
    //     border-bottom-color: rgba(0, 0, 0, 0.35);
    // }
    // &.is-dark[x-placement^='left'] .popper__arrow {
    //     border-left-color: rgba(0, 0, 0, 0.35);
    // }
    // &.is-dark[x-placement^='left'] .popper__arrow:after {
    //     border-left-color: rgba(0, 0, 0, 0.35);
    // }
    // &.is-dark[x-placement^='right'] .popper__arrow {
    //     border-right-color: rgba(0, 0, 0, 0.5);
    // }
    // &.is-dark[x-placement^='right'] .popper__arrow:after {
    //     border-right-color: rgba(0, 0, 0, 0.5);
    // }
    > div:not(.popper__arrow) {
        max-height: 200px;
        overflow: auto;
    }
    .popover-wrap-content {
        padding-right: 10px;
    }
}
._hover-txt {
    &.hover {
        &:hover {
            color: var(--color);
        }
    }
    &:hover {
        color: var(--color);
    }
}
</style>
