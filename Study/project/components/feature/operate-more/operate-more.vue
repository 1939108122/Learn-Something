<template>
    <div class="table-operate-more" :class="{'_operate-inline': inline}" :style="{'--color': color}">
        <RenderList
            v-if="(slotOptions || []).filter(item=>item.tag).length"
            :slotOption="(slotOptions || []).filter(item=>item.tag)"
            :count="count"
            :allowLastOutside="allowLastOutside"
            :color="color"
            :placement="placement"
            :popperClass="popperClass"
            :visibleArrow="visibleArrow"></RenderList>
    </div>
</template>
<script>
/**
 * @params operateList = []
 */
import RenderList from './renderlist.vue';
export default {
    name: 'table-operate-more',
    components: {
        RenderList
    },
    props: {
        count: { // 外露个数
            type: [String, Number],
            default: 1
        },
        allowLastOutside: { // 只比外露个数多一个时，是否外露
            type: Boolean,
            default: true
        },
        effect: {
            type: String,
            default: 'light'
        },
        inline: {
            type: Boolean, // 是否在一行
            default: false
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
            slotOptions: this.$slots.default
        };
    },
};
</script>

<style lang="less">
._operate-inline{
    ._operate-txt{
        display: inline-block;
        >* {
            display: inline-block;
            white-space: nowrap;
            margin-right: 10px;
        }
    }
}
</style>