<template>
    <div class="slider-content">
        <div class="slider-title">通话时长: {{ timeList[`${value[0]}`].label }}-{{ timeList[`${value[1]}`].label }}</div>
        <ui-slider v-model="value" :max="maxLength" :step="1" range @on-change="timeChange" :tip-format="formatTip">
        </ui-slider>
        <div class="option-list">
            <div class="time-option" v-for="(item, index) in timeList" :key="index">{{ item.label }}</div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'DurationContent',
    data() {
        return {
            value: [0, 0],
            maxLength: 0,
            timeRange: {
                startBridgeDuration: '',
                endBridgeDuration: ''
            }
        };
    },
    props: {
        timeList: {
            type: Array,
            default: () => ([])
        }
    },
    watch: {
        value: {
            handler() {
                this.timeChange();
            }
        }
    },
    methods: {
        timeChange() {
            this.timeRange.startBridgeDuration = this.timeList[`${this.value[0]}`].value;
            this.timeRange.endBridgeDuration = this.timeList[`${this.value[1]}`].value;
            if (this.value[1] == this.maxLength) {
                this.timeRange.endBridgeDuration = '';
            };
            this.$emit('duration-change', this.timeRange);
            this.$emit('choose-time', this.timeList[`${this.value[0]}`].label + '-' + this.timeList[`${this.value[1]}`].label);
        },
        formatTip(val) {
            return this.timeList[val].label;
        }
    },
    created() {
        this.maxLength = this.timeList.length - 1;
        this.value = [0, this.maxLength]; //第一次打开选择全部范围即0到无限
    }
};
</script>
<style lang="less" scoped>
.slider-content {
    /* 
    display: flex;
    justify-content: center; */
    height: 118px;
    padding-bottom: 0px;

    .slider-title {
        padding: 7px 16px 5px 16px;

        font-size: 13px;
        font-weight: 400;
        color: #363F55;
        line-height: 18px;
    }

    .ui-slider {
        padding: 0 26px;

        /deep/ .popover-content {
            padding: 0;
            height: 20px;
            width: 40px;
            font-size: 13px;
        }
    }

    .option-list {
        padding: 0 16px;
        display: flex;
        justify-content: space-between;

        .time-option {
            display: inline-block;
            font-weight: 400;
            color: #757D8C;
            line-height: 17px;
            font-size: 12px;
        }

    }
}
</style>