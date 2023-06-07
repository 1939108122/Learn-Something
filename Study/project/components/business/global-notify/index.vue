<template>
    <div :class="`${wrapCssClass()} speed-in`" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
        <div class="close-icon-wrapper">
            <IconHover @click="onClose" class-name="icon-hover-diy">
                <i class="icrm-icon-close"></i>
            </IconHover>
        </div>

        <div :class="`${wrapCssClass('header')}`">
            <div class="icon-type">
                <img :src="iconConfig.url" :style="{ backgroundColor: iconConfig.backgroundColor }" alt="" />
            </div>
            <span class="title-text">{{ title }}</span>
        </div>

        <div class="content-footer-wrap">
            <template v-if="dangerouslyUseHTMLString">
                <div :class="`${wrapCssClass('content')}`" v-html="content"></div>
            </template>
            <template v-else>
                <div :class="`${wrapCssClass('content')} normal`">{{ content }}</div>
            </template>

            <div :class="`${wrapCssClass('footer')}`">
                <div v-if="time" class="time">{{ time }}</div>
                <div v-if="showView" class="view-link" @click="onView">
                    <span>查看详情</span>
                    <span class="icon-arrow icrm-arrow-right"></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { commonProps } from './common-props.js';
import IconHover from '@/components/feature/icon-hover/index.vue';

const WRAPPER_CLASS = 'global-notify';

export default {
    name: 'GlobalNotify',
    components: {
        IconHover
    },
    props: {
        ...commonProps,
        duration: {
            type: Number,
            default: 5000
        }
    },
    data() {
        return {
            iconMap: {
                knowledge: {
                    url: require('@/assets/images/icon-knowledge-normal.png'),
                    backgroundColor: '#E4F7F7'
                },
                message: {
                    url: require('@/assets/images/icon-message.png'),
                    backgroundColor: '#E3EBFF'
                }
            },
            // 【关闭提醒】
            close: () => {},
            // 计时器实例
            timer: null,
            // 剩余倒计时
            restTime: 0
        };
    },
    computed: {
        iconConfig() {
            return this.type === 'knowledge' ? this.iconMap.knowledge : this.iconMap.message;
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        wrapCssClass(cssName) {
            return [WRAPPER_CLASS, cssName].filter(Boolean).join('-');
        },
        init() {
            this.startTimer();
            // 组件初始化时执行的函数
            if (this.externalShow && typeof this.externalShow === 'function') {
                this.externalShow();
            }
        },
        onClose() {
            // 关闭组件前执行的函数
            if (this.externalClose && typeof this.externalClose === 'function') {
                this.externalClose();
            }
            // 销毁组件
            this.close();
        },
        // 点击了查看
        onView() {
            if (this.externalView && typeof this.externalView === 'function') {
                this.externalView();
            }
            // 销毁组件
            this.close();
        },
        runTime() {
            if (this.restTime > 0) {
                this.timer = setTimeout(() => {
                    this.restTime -= 1000;
                    this.runTime();
                }, 1000);
            } else {
                if (this.timer) {
                    clearTimeout(this.timer);
                    this.timer = null;
                    this.close();
                }
            }
        },
        // 开启计时器
        startTimer() {
            // 同步时间
            this.restTime = this.duration;
            // 开始计时
            this.runTime();

            // 如果组件销毁前，倒计时未结束，手动结束倒计时
            this.$on('hook:beforeDestroy', () => {
                if (this.timer) {
                    clearTimeout(this.timer);
                    this.timer = null;
                }
            });
        },
        // 鼠标移入
        onMouseEnter() {
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }
        },
        // 鼠标移出
        onMouseLeave() {
            this.runTime();
        }
    }
};
</script>

<style lang="less" scoped>
@padding: 16px;

.global-notify {
    padding: @padding;
    position: fixed;
    right: 13px;
    bottom: 50px;
    z-index: 2000;

    width: 320px;
    min-height: 118px;
    background: #ffffff;
    box-shadow: 0 6px 13px -2px rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    border: 1px solid #eceef2;

    .close-icon-wrapper {
        position: absolute;
        right: @padding;
        top: @padding;

        .icon-hover-diy {
            color: #9fa6b5;
            &:hover {
                color: #363f55;
            }
        }
    }

    &-header {
        display: flex;
        align-items: center;
        font-size: 13px;
        font-weight: 500;
        color: #757d8c;
        line-height: 20px;

        .icon-type {
            display: flex;
            align-items: center;
            margin-right: 9px;

            img {
                width: 20px;
                height: 20px;
                padding: 2px;
                border-radius: 50%;
            }
        }

        .title-text {
            display: inline-block;
            max-width: 200px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }

    .content-footer-wrap {
        cursor: pointer;
    }

    &-content {
        margin-top: 12px;
        margin-bottom: 12px;
        font-size: 14px;
        color: #1e2433;
        line-height: 22px;
        min-height: 22px;

        &.normal {
            display: -webkit-box;
            overflow: hidden;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            text-overflow: ellipsis;
        }
    }

    &-footer {
        position: relative;
        line-height: 20px;
        min-height: 20px;

        .time {
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            font-size: 12px;
            color: #757d8c;
        }

        .view-link {
            position: absolute;
            right: 0;
            display: flex;
            align-items: center;
            font-size: 14px;
            color: #4465eb;
            cursor: pointer;

            .icon-arrow {
                margin-left: 2px;
            }
        }
    }
}

@-webkit-keyframes lightSpeedIn {
    from {
        -webkit-transform: translate3d(100%, 0, 0);
        transform: translate3d(100%, 0, 0);
    }

    to {
        -webkit-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
    }
}

@keyframes lightSpeedIn {
    from {
        -webkit-transform: translate3d(100%, 0, 0);
        transform: translate3d(100%, 0, 0);
    }

    to {
        -webkit-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
    }
}

.speed-in {
    -webkit-animation-name: lightSpeedIn;
    animation-name: lightSpeedIn;
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
    -webkit-animation-duration: 0.4s;
    animation-duration: 0.4s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
}
</style>
