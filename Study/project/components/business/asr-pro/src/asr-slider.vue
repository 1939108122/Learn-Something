<template>
    <div class="asr-slider-pos">
        <div class="slider-track-box" id="__slider-track">
            <div class="slider-track" id="__slider-piece" :style="{width: piecePercent + '%'}">
                <div class="slider-thumb"
                     :class="dynamicClassName"
                     id="__slider-thumb"
                     @mousedown.stop="onMousedown"
                     @mouseup.stop="onMouseup"
                     @mousemove.stop="onMousemove">
                    {{ msStr(value) }}
                </div>
            </div>
        </div>
        <i class="start">{{ msStr(start) }}</i>
        <i class="end">{{ msStr(end) }}</i>
    </div>
</template>

<script>
import { isNotEmpty } from '@/utils/tools/tools.js';
import { throttle } from '@/utils/tools/optimize.js';

const doSetX = throttle((ex, that) => {
    that.$nextTick(() => {
        // track = document.querySelector('#__slider-track'),
        // thumb = document.querySelector('#__slider-thumb'),
        let piece = document.querySelector('#__slider-piece');
        if(!piece) return;

        // trackRect = track.getBoundingClientRect(),
        let pieceRect = piece.getBoundingClientRect(),
            // thumbRect = thumb.getBoundingClientRect(),
            // trackWidth = trackRect.width,
            pieceWidth = pieceRect.width,
            // thumbWidth = thumbRect.width,
            // maxWidth = trackWidth - (thumbWidth / 2), // 滑动槽的最大长度
            mouseWidth = ex - that.startX, // 鼠标滑动距离
            v = pieceWidth + mouseWidth;

        // that.halfThumb = thumbWidth;

        if(v <= 0) {
            that.percent = 0;
        } else if(v >= that.totalWidth) {
            that.percent = 100;
        } else {
            that.percent = v * 100 / that.totalWidth;
        }
        // that.$emit('input', that.percent);
        that.$emit('on-change', that.percent);
        that.startX = ex;
    });
}, 100);

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
    },
    data() {
        return {
            dragging: false,
            startX: 0, // 滑动的那一刻，滑块的left
            totalWidth: 1, // 滑轨总长度
            dynamicClassName: '', // left-划块居左，right-滑块居右
            thumbWidth: 0, // 滑块的长度
            percent: 0,
        };
    },
    mounted() {
        this.doDragEvent();
        this.initSlider();
    },
    methods: {
        initSlider() {
            this.$nextTick(() => {
                let track = document.querySelector('#__slider-track'),
                    thumb = document.querySelector('#__slider-thumb');
                if(track) this.totalWidth = track.getBoundingClientRect().width;
                if(thumb) this.thumbWidth = thumb.getBoundingClientRect().width;
            });
        },
        onMousedown(e) {
            this.startX = e.x;
            this.dragging = true;
        },
        onMouseup() {
            this.dragging = false;
        },
        onMousemove(e) {
            // if (this.dragging) throttle(this.setX(e.x), 300);
            if (this.dragging) doSetX(e.x, this);
        },
        /*setX(ex) {
            this.$nextTick(() => {
                // track = document.querySelector('#__slider-track'),
                let piece = document.querySelector('#__slider-piece'),
                    thumb = document.querySelector('#__slider-thumb');
                if(!piece) return;

                // trackRect = track.getBoundingClientRect(),
                let pieceRect = piece.getBoundingClientRect(),
                    thumbRect = thumb.getBoundingClientRect(),
                    // trackWidth = trackRect.width,
                    pieceWidth = pieceRect.width,
                    // thumbWidth = thumbRect.width,
                    // maxWidth = trackWidth - (thumbWidth / 2), // 滑动槽的最大长度
                    mouseWidth = ex - this.startX, // 鼠标滑动距离
                    v = pieceWidth + mouseWidth;

                // this.halfThumb = thumbWidth;

                if(v <= 0) {
                    this.percent = 0;
                } else if(v >= this.totalWidth) {
                    this.percent = 100;
                } else {
                    this.percent = v * 100 / this.totalWidth;
                }
                // this.$emit('input', this.percent);
                this.$emit('on-change', this.percent);
                this.startX = ex;
            });
        },*/
        doDragEvent() {
            // 鼠标划出滑动条时
            document.body.addEventListener('mousemove', (e) => {
                this.onMousemove(e);
            });
            document.body.addEventListener('mouseup', () => {
                this.dragging = false;
            });
        },
    },
    computed: {
        piecePercent() {
            return this.dragging ? (this.percent || 0).toFixed(4) : (this.calcPercent || 0).toFixed(4);
        },
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
        calcPercent() {
            // 根据当前时间计算的进度
            return (this.value / this.duration) * 100;
        }
    },
};
</script>

<style lang="less" scoped>
    .asr-slider-pos {
        width: 100%;
        min-width: 300px;
        display: flex;
        justify-content: center;
        position: relative;
        border-radius: 2px;
        background-color: #DBDFE6;

        &:before {
            content: "";
            display: block;
            flex: 1;
            height: 4px;
            border-top-left-radius: 2px;
            border-bottom-left-radius: 2px;
            background-color: #00BEBD;
        }
        &:after {
            content: "";
            display: block;
            flex: 1;
            height: 4px;
            border-top-right-radius: 2px;
            border-bottom-right-radius: 2px;
            background-color: #DBDFE6;
        }
    }
    .slider-track-box {
        //width: calc(~"100% - var(--thumbWidth)");
        width: calc(~"100% - 50px");
        height: 4px;
        margin: 0 auto;
        position: relative;
        border-radius: 2px;

        .slider-track {
            // width: var(--piecePercent);
            height: 4px;
            min-width: 0 !important;
            max-width: 100% !important;
            //border-radius: 2px;
            background-color: #00BEBD;
            position: relative;

            .slider-thumb {
                min-width: 50px;
                height: 20px;
                line-height: 20px;
                padding: 0 10px;
                white-space: nowrap;
                border-radius: 10px;
                position: absolute;
                top: 0;
                right: 0;
                transform: translateX(50%) translateY(calc(~"-50% + 2px"));
                font-size: 12px;
                color: #fff;
                background-color: #00BEBD;
                cursor: pointer;

                /*&.left {
                    left: 0;
                    transform: translateY(calc(~"-50% + 2px"));
                }*/
                /*&.right {
                    right: 0;
                    transform: translateY(calc(~"-50% + 2px"));
                }*/
            }
        }
    }
    .start,
    .end {
        position: absolute;
        top: 15px;
        line-height: 1;
        font-size: 12px;
        color: #8790A2;
    }
    .start {
        left: 0;
    }
    .end {
        right: 0;
    }
</style>
