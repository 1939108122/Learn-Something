<template>
    <div class="opts-select" @mouseover="msover" @mouseout="msout">
        <a href="javascript:;" class="opts-select-trigger" ref="trigger">
            <i @click.prevent="toggle" v-clickoutside="close">...</i>
        </a>
        <template v-if="show">
            <div class="opts-select-lists" :style="{'left': pLeft + 'px', 'top': pTop + 'px'}" ref="list">
                <slot name="content"></slot>
            </div>
        </template>
    </div>
</template>
<script>
/** 使用指南
 *
 <ops-gather @on-select="opration" trigger="click">
     <ul slot="content">
         <li><i class="cc cc-op-edit"></i>编辑</li>
         <li><i class="cc cc-op-supplement"></i>禁用</li>
         <li><i class="cc cc-op-delete"></i>删除</li>
     </ul>
 </ops-gather>
 *
 */
export default {
    data() {
        return {
            show: false,
            pLeft: 0,
            pTop: 0,
            timer: null,
        };
    },
    props: {
        trigger: {
            type: String,
            default: 'hover', //hover
        },
    },
    mounted() {
    },
    watch: {
        'show'(flag) {
            if (flag) {
                this.$nextTick(() => {
                    this.setListPosition();
                });
            }
        }
    },
    methods: {
        toggle() {
            if (this.trigger !== 'click') return false;
            this.show = !this.show;
        },
        msover() {
            if (this.trigger == 'hover') {
                this.show = true;
                clearTimeout(this.timer);
            }
        },
        msout() {
            if (this.trigger == 'hover') {
                this.timer = setTimeout(() => {
                    this.show = false;
                }, 200);
            }
        },
        close() {
            this.show = false;
        },
        setListPosition() {
            let $op = this.$refs['trigger'];
            let $list = this.$refs['list'];
            let height = window.getComputedStyle($op).height;
            let clinetHeights = window.innerHeight;
            let rect = $op.getBoundingClientRect();
            this.pLeft = rect.right - parseInt(window.getComputedStyle($list).width);
            this.pTop = rect.bottom;
            if (this.pTop + parseInt(window.getComputedStyle($list).height) > clinetHeights) {
                this.pTop = rect.top - parseInt(window.getComputedStyle($list).height);
            }
        }
    }
};
</script>
<style scoped lang="less">
    @import "./index.less";
</style>
