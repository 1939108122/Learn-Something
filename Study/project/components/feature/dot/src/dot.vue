<template>
    <div class="dot" ref="dot">
        <ui-tooltip
            v-if="showTip" 
            :wrapClass="'dot-popover-wrap ' + customWrapClass" 
            :placement="placement" 
            trigger="hover"
            :theme="theme" 
            :content="txt" 
            :width="width" 
            :appendToBody="appendToBody" 
            :class="{'hidden-tip': !showTip}">
            <div slot="reference" :class="['txt', {'show-tips': showTip}, customWrapClass]" :style="{'max-height': linHeight * line + 'px'}">
                <slot>{{txt}}</slot>
            </div>
            <div slot="content" v-if="userHtmlString" v-html="txt"></div>
        </ui-tooltip>
        <p v-else>
            <slot>{{txt}}</slot>
        </p>
    </div>
</template>

<script>
export default {
    name: 'dot',
    data () {
        return {
            showTip: false,
        };
    },
    props: {
        linHeight: {
            type: [String, Number],
            default: 20
        },
        line: {
            type: [String, Number],
            default: 2
        },
        txt: {
            type: [String, Number],
            default: ''
        },
        userHtmlString: {
            type: Boolean,
            default: false
        },
        placement: {
            type: String,
            default: 'top'//bottom
        },
        width: {
            type: [String, Number],
            default: '300'
        },
        theme: {
            type: String,
            default: 'light'
        },
        appendToBody: {
            type: Boolean,
            default: false
        },
        customWrapClass: {
            type: String,
            default: ''
        }
    },
    mounted () {
        this.updateView();
    },
    updated () {
        // 循环卡死（客户）
        // this.updateView();
    },

    methods: {
        updateView () {
            this.$nextTick(() => {
                let limitHeight = this.linHeight * this.line;
                let selfHeight = window.getComputedStyle(this.$refs.dot).height.replace('px', '');
                if(selfHeight > limitHeight) {
                    this.showTip = true;
                    this.wrapClass = '';
                }else {
                    this.showTip = false;
                    this.wrapClass = 'hide-tip';
                }
            });
        }
    }
};
</script>

<style lang="less">

    .dot {
        display: block;
        word-wrap: break-word;
        word-break: break-all;
        .txt {
            display: block;
            overflow-wrap: break-word;
            word-break: break-word;
            word-wrap: break-word;
            position: relative;
            &.show-tips {
                overflow: hidden;
                &:after {
                    content: "...";
                    display: block;
                    position: absolute;
                    padding-left: 5px;
                    right: 0;
                    bottom: 0;
                    height: 20px;
                    color: #414a60;
                    // background: -webkit-linear-gradient(left,hsla(0,0%,100%,.5),#fff,#fff);
                    background: #fff;
                }
            }
        }
        .popover-wrap {
            bottom: calc(~'100% + 5px');
            .popover-content {
                max-height: 200px;
                overflow: auto;
                word-break: break-all;
                word-wrap: break-word;
            }
        }
        .hidden-tip  {
            .popover-wrap {
                display: none;
            }
        }
    }
    .ui-table tr:hover td .show-tip:after {
        // background: -webkit-linear-gradient(left, hsla(0,0%,100%,.5), #f7fafc, #f7fafc);
        background:  #f7fafc;
    }
    .dot-popover-wrap {
        .popover-content {
            max-height: 200px;
            overflow: auto;
            word-break: break-all;
            word-wrap: break-word;
        }
    }
</style>
