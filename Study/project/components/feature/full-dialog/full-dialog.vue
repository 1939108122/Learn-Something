<template>
    <!-- <div class="dialog-wrap"> -->
    <div class="dialog-custom-wrap" :class="wrapClass">
        <div class="dialog-custom-layer" v-if="!second"></div>
        <div :class="{'full-dialog-body':true, 'open':openStatus }" :style="'width:100%'">
            <div :class="{'icon-layer-close': true, 'icon-layer-action': true, 'ti-close':!second, 'ti-angle-right': second } " :style="'right:' + contentWidth + 'px'" @click="closeDialog"></div>
            <div class="full-dialog-content" :style="'width:'+ contentWidth +'px'">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
import emitter from '@/mixins/emitter.js';

export default {
    name: 'uiFullDialog',
    mixins: [emitter],
    inject: {
        uiForm: {
            default: ''
        }
    },
    data () {
        return {
            openStatus: false,
            contentWidth: 1190
        };
    },
    model: {
        prop: 'value',
        event: 'change'
    },
    destroyed() {
        this.unlock();
    },
    props: {
        value: {
            type: [Boolean, String],
            default: false
        },
        second: {
            type: Boolean,
            default: false
        },
        customClose: {
            type: Boolean,
            default: false
        },
        lock: {
            type: Boolean,
            default: false
        },
        // customCloseStatus: {
        //     type: Boolean,
        //     default: false
        // },
        wrapClass: {
            type: String,
            default: ''
        },
        width: {
            type: [String, Number],
            default: ''
        }
    },
    methods: {
        unlock () {
            if(!this.second || this.lock) {
                document.body.style.overflow = 'visible';
            };
        },
        closeDialog(){
            this.$emit('update:close');
            if (this.customClose) return false;
            this.openStatus = false;
            this.unlock();
        }
    },
    watch: {
        // customCloseStatus: {
        //     handler(val) {
        //         if(!val) {
        //             this.openStatus = false;
        //             if(!this.second) {
        //                 document.body.style.overflow = 'visible';
        //             }
        //         }
        //     },
        //     immediate: false
        // }
    },
    created(){
        if (this.width) {
            // 自定义宽度不需要计算
            this.contentWidth = this.width;
            return;
        }
        let bodywidth = document.body.scrollWidth;
        if(bodywidth < 1220){
            this.contentWidth = bodywidth - 30;
        }else{
            this.contentWidth = 1190;
        }
    },
    mounted() {
        setTimeout( ()=> {
            this.openStatus = true;
            // 兼容下载客户详情 tab内直接调用second(关闭页面被锁定)
            if(!this.second || this.lock) {
                document.body.style.overflow = 'hidden';
            }
        }, 100);
    },

};
</script>
<style>
    .dialog-custom-layer {
        position: fixed;
        /* width: 100%;
        height: 100%; */
        top: 48px;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(37, 40, 48, 0.7);
        /* z-index: 1002; */
        z-index: 997;
    }
    .dialog-custom-layer+.full-dialog-body {
        top: 48px;
    }
    /* 兼容订单详情-发票详情2级 */
    .dialog-flyin-large .full-dialog-body {
        top: 48px;
    }

    .full-dialog-body {
        position: fixed;
        width: 1190px;
        /* height: 100vh; */
        top: 0;
        right: 0;
        bottom: 0;
        padding-left: 0;
        /* z-index: 1003; */
        z-index: 998;
        transform: translateX(100%);
        transition: all  500ms ease 0s;
    }
    .full-dialog-body .full-dialog-body {
            top: 0;
    }
    .full-dialog-body.open{
        transform: translateX(0);
        transition: all  500ms ease 0s;
    }
    .full-dialog-body .icon-layer-action {
        position: absolute;
        width: 30px;
        height: 30px;
        line-height: 30px;
        cursor: pointer;
        /*left: -30px;*/
        top: 0;
        background-color: #54d8c9;
        color: #fff;
        font-family: themify!important;
        font-size: 12px;
        font-style: normal;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
    }
    .full-dialog-content{
        position: fixed;
        width: 1190px;
        /* height: 100vh; */
        top: 0;
        bottom: 0;
        right: 0;
        padding-left: 0;
        background: #fff;
        z-index: 1003;
        overflow: auto;
    }
</style>
