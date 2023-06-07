
<script>
const returnArrayFn = () => [];

export default {
    name: 'RenderList',
    props: {
        slotOption: {
            type: Array,
            default: returnArrayFn
        },
        count: { // 外漏几个
            type: [String, Number],
            default: 1
        },
        allowLastOutside: { // 只比外漏数多1 ，是否直接显示
            type: Boolean,
            default: true
        },
        effect: {
            type: String,
            default: 'light'
        },
        color: {
            type: String,
            default: '#01A09C'
        },
        placement: {
            type: String,
            default: 'bottom'
        },
        popperClass: {
            type: String,
            default: ''
        },
        visibleArrow: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            show: false
        };
    },
    // functional: true,
    render(h, context){
        let props = this;
        let outNode = [];
        let innerNode = [];
        if (props.slotOption) {
            if (props.slotOption.length <= props.count + 1 && props.allowLastOutside) {
                props.slotOption.forEach((item, index) => {
                    outNode.push(item);
                });
            } else {
                props.slotOption.forEach((item, index) => {
                    if (index < props.count) {
                        outNode.push(item);
                    } else {
                        if (item.data) {
                            item.data.staticClass = (item.data.staticClass || '') + ' _operate-tooltip-item';
                        } else {
                            item.data = {};
                            item.data.staticClass = '_operate-tooltip-item';
                        }
                        innerNode.push(item);
                    }
                });
            }
        }
        let arr = [h('p', {
            class: '_operate-txt',
        }, outNode)];

        if (innerNode.length) {
            arr.push(h('ui-tooltip2', {
                class: {
                    '_display-none': !innerNode.length
                },
                domProps: {
                    value: props.show,
                },
                on: {
                    input: function (event) {
                        props.show = event;
                    },
                },
                props: {
                    popperClass: '_operate-more-tooltip-box '+ props.popperClass,
                    effect: props.effect,
                    placement: props.placement,
                    visibleArrow: props.visibleArrow
                },
                ref: 'operateMore'
            }, [
                h('span', {
                    class: `${props.show ? 'selected ': ''}_oper_more-trigger-box`,
                    // slot: 'reference',
                    name: 1,
                }, [
                    h('i', {
                        class: 'icrm-more _icrm-more',
                    }),
                ]),
                h('div', {
                    slot: 'content',
                    style: {'font-size': '14px', '--color': props.color},
                    on: {
                        click: () => {
                            setTimeout(() => {
                                props.$refs.operateMore && props.$refs.operateMore.hide();
                            }, 50);
                        }
                    },
                }, innerNode),
            ]));
        }

        return h('div', {}, arr);
    },
    mounted () {
        this.$refs.operateMore?.$el.removeEventListener('blur', this.$refs.operateMore.handleBlur);
    }
};
</script>
<style lang="less">
._oper_more-trigger-box {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 24px;
    height: 24px;
    cursor: pointer;
    &:hover,
    &.selected {
        background: #E4E8F0;
        border-radius: 4px;
    }
    ._icrm-more {
        &::before {
            display: inline-block;
            transform: rotateZ(90deg);
            color: var(--color);
        }
    }
}
._operate-txt{
    color: var(--color);
    cursor: pointer;
    >*{
        &:hover{
            opacity: .6;
            font-weight: 500;
        }
    }
}
._operate-more-tooltip-box{
    min-width: 84px;
    background: #ffffff;
    box-shadow: 0px 9px 14px -4px rgba(0, 0, 0, 0.1);
    border: 1px solid #DBDFE6;
    padding: 4px 0;
    .popover-content{
        padding: 0;
    }
    ._operate-tooltip-item {
        // display: block;
        // color: var(--color);
        // padding: 10px 20px;
        // width: auto;
        // text-align: center;
        // white-space: nowrap;
        // cursor: pointer;
        // &:hover{
        //     background: rgba(239, 242, 248, 1);
        // }
        display: block;
        height: 32px;
        line-height: 32px;
        padding: 0 16px;
        font-size: 13px;
        color: var(--color);
        text-align: left;
        cursor: pointer;
        &:hover {
            background: #F7F8FB;
        }
    }
    &.ui-tooltip__popper[x-placement^=bottom] {
        margin-top: 0;
    }
    &.ui-tooltip__popper {
        margin-bottom: 0
    }
}
._operate-inline{
    >*{
        display: inline-flex;
        align-items: center;
        margin-right: 10px;
    }
}
</style>

