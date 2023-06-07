<template>
    <div class="asr-slider-pos">
        <i class="start text-left">{{ msStr(start) }}</i>
        <div class="slider-track-box" id="__slider-track" ref="sliderTrack">
            <div
                ref="sliderPiece"
                class="slider-track"
                id="__slider-piece"
                :style="{width: percent * 100 + '%'}">
                <div class="slider-thumb"
                    ref="sliderThumb"
                    :class="dynamicClassName"
                    id="__slider-thumb"
                    @mousedown.stop="onMousedown"
                    v-logParams="{ wc_interface: '录音详情', ele_name: 'audio-detail-slider-track', ...setParams}"></div>
            </div>
        </div>
        <i class="end text-right">{{ msStr(end) }}</i>
    </div>
</template>

<script>
import { isNotEmpty } from '@/utils/tools/tools.js';

export default {
    name: 'asr-slider',
    props: {
        value: {
            // 当前时间（毫秒）
            type: Number,
            default: 0
        },
        duration: {
            // 总时长（毫秒）
            type: Number,
            default: 1
        },
        start: {
            // 左下标开始时间（毫秒）
            type: Number,
            default: 0
        },
        end: {
            // 右下标结束时间（毫秒）
            type: Number,
            default: 0
        },
        setParams: {
            type: Object,
            default: () => ({})
        },
        isDragging: {
            type: Boolean,
            default: false
        },
        palyPercent: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            dynamicClassName: '',

            dragging: false,
            percent: 0, // 播放进度
        };
    },
    mounted() {
        this.doDragEvent();
    },
    watch: {
        palyPercent: {
            handler(val) {
                this.percent = val;
            },
            immediate: true
        },
        dragging: {
            handler(flag) {
                this.$emit('update:isDragging', flag);
            },
            immediate: true
        },
    },
    methods: {
        onMousedown() {
            this.dragging = true;
        },
        doDragEvent() {
            const sliderPiece = this.$refs.sliderPiece;
            const sliderTrack = this.$refs.sliderTrack;

            const onMousemove = (e) => {
                if (this.dragging) {
                    let distance = 0;
                    const react = sliderPiece.getBoundingClientRect();
                    const reactLeft = react.left;
                    const offsetWidth = sliderTrack.offsetWidth;
                    const mouseX = e.x;

                    distance = mouseX - reactLeft;

                    this.percent = distance <= 0 ? 0 : distance > offsetWidth ? 1 : distance / offsetWidth;
                }
            };
            const onMouseup = () => {
                if (this.dragging) {
                    this.$emit('on-change', this.percent);
                    this.dragging = false;
                }
            };

            document.body.addEventListener('mousemove', onMousemove);
            document.body.addEventListener('mouseup', onMouseup);

            this.$on('hook:beforeDestroy', () => {
                document.body.removeEventListener('mousemove', onMousemove);
                document.body.removeEventListener('mouseup', onMouseup);
            });
        },
    },
    computed: {
        msStr() {
            return (sec) => {
                // 把毫秒转化为：mm:ss
                let second = parseInt(sec),
                    timeStr = '00:00';

                if (isNotEmpty(second)) {
                    let s = parseInt(second / 1000);
                    let ss = s % 60,
                        MM = parseInt(s / 60);

                    timeStr = (MM > 9 ? MM : '0' + MM) + ':' + (ss > 9 ? ss : '0' + ss);
                }
                return timeStr;
            };
        },
    },
};
</script>

<style lang="less" scoped>
@main-asr-color: #4465EB;
@main-asr-hover-color: #1C40D2;
@slider-bar-height: 4px;
    .asr-slider-pos {
        position: relative;
        width: 100%;
        min-width: 300px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .slider-track-box {
        position: relative;
        flex: 1;
        height: @slider-bar-height;
        border-radius: 2px;
        background: #DBDFE6;

        .slider-track {
            position: relative;
            height: @slider-bar-height;
            min-width: 0 !important;
            max-width: 100% !important;
            background-color: @main-asr-color;
            border-radius: 2px;

            .slider-thumb {
                width: 8px;
                height: 16px;
                // min-width: 50px;
                // height: 20px;
                // line-height: 20px;
                // padding: 0 10px;
                // white-space: nowrap;
                border-radius: 3px;
                position: absolute;
                top: 0;
                right: 0;
                transform: translateX(50%) translateY(calc(~"-50% + 2px"));
                // font-size: 12px;
                // color: #fff;
                background-color: @main-asr-color;
                cursor: pointer;
            }
        }
    }
    .start,
    .end {
        width: 42px;
        flex-shrink: 0;
        white-space: nowrap;
        font-family: kanzhun;
        line-height: 20px;
        font-size: 13px;
        color: #363F55;
        overflow: hidden;
    }
</style>
