<template>
    <div class="scroll-view">
        <slot name="fixed" class="fixed"></slot>
        <ul ref="scrollBox" class="scroll-item-list"><slot name="content"></slot></ul>
    </div>
</template>
<script>
export default {
    name: 'scroll-view',
    provide () {
        return {
            scroll: this
        };
    },
    data () {
        return {
            scrollY: 0,
            $scroll: null,
        };
    },
    mounted () {
        this.$scroll = this.$refs['scrollBox'];
        this.$scroll.addEventListener('scroll', this.handleScroll, false);
        this.$on('move', (top, sort) => {
            this.$emit('on-move', top, sort);
        });
        this.$on('update', (sort) => {
            this.$emit('on-update', sort);
        });
    },
    beforeDestroy () {
        this.$scroll.removeEventListener('scroll', this.handleScroll, false);
    },
    methods: {
        handleScroll () {
            this.scrollY = this.$scroll.scrollTop;
        }
    }
};
</script>

<style lang="less">
.scroll-view {
    position: relative;
    max-height: inherit;
    overflow: hidden;
    .scroll-item-list {
        position: relative;
        max-height: inherit;
        overflow: auto;
        background-color: #fff;
    }
    .fixed {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 100;
        width: 100%;
        background-color:  #fff;
    }
}
</style>

