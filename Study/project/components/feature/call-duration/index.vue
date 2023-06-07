<template>
    <div class="call-duration">
        <div class="data-place" :style="{ 'padding-left': paddingLeftStr }" @click.self.stop="toggleTree" :class="{'has-select-data': selectRange!='请选择'}">{{selectRange}}</div>
        <ui-select2 class="call-duration-new" ref="selectRef">
            <span slot="labelPrefix">
                <slot name="labelPrefix">通话时长</slot>
            </span>
            <DurationContent :timeList="bridgeDurationOpts" @duration-change="timeChange" @choose-time="timeChoose"></DurationContent>
        </ui-select2>
    </div>
</template>
<script>
import DurationContent from './duration-content.vue';
export default {
    name: 'CallDuration',
    components: { DurationContent },
    data() {
        return {
            paddingLeftStr: '83px',
            bridgeDurationOpts: [
                { label: '0秒', value: '00:00:00' },
                { label: '1秒', value: '00:00:01' },
                { label: '45秒', value: '00:00:45' },
                { label: '3分', value: '00:03:00' },
                { label: '5分', value: '00:05:00' },
                { label: '8分', value: '00:08:00' },
                { label: '15分', value: '00:15:00' },
                { label: '不限', value: ''}
            ],
            selectRange: '请选择'
        };
    },
    methods: {
        toggleTree() {
            this.$refs?.selectRef?.$el.querySelector('input')?.click();
        },
        timeChange(timeRange){
            this.$emit('duration-change', timeRange);
        },
        timeChoose(item) { //用于展示选择的时间数据到筛选区域
            this.selectRange = item;
        },
        clearSelect() {
            this.selectRange = '请选择';
        }

    }
};
</script>
<style lang="less" scoped>
.call-duration {
    position: relative;

    .data-place {
        position: absolute;
        height: 20px;
        left: 1px;
        right: 30px;
        top: 50%;
        color: #C1C5CD;
        transform: translate3d(0, -50%, 0);
        z-index: 1;
        background-color: #FFF;
        line-height: 20px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .has-select-data {
        color: #414a60;
    }

    .ui-select-inner {
        padding-left: 79px;
    }
}
</style>