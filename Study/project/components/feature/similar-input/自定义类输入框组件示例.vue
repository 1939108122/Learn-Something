<template>
    <ui-popover
        v-model="dropdownVisible"
        trigger="click"
        appendToBody
        :disabled="disabled"
        :visible-arrow="false"
        :offset="0"
        :popper-class="`${popperClass} ui-xxx`"
        :width="dropdownWidth"
    >
        <ui-similar-input ref="similarInputRef" :class-name="similarInputClasses" slot="reference" no-scroll>
            <template v-if="$slots.labelPrefix" #labelPrefix>
                <slot name="labelPrefix"></slot>
            </template>

            <!--TODO: 根据实际情况配置-->
            <template v-if="false">
                <span class="placeholder">{{ placeholder }}</span>
                <i class="ui-icon-arrow-down icon"></i>
            </template>

            <template v-else>
                <!--TODO: 内容-->

                <i class="ui-icon-circle-close icon" @click.stop="onClear"></i>
            </template>
        </ui-similar-input>

        <div>下拉框内容</div>
    </ui-popover>
</template>

<script>
import UiSimilarInput from '@/components/feature/similar-input';

export default {
    name: 'UiXxx',
    components: { UiSimilarInput },
    props: {
        popperClass: {
            type: String,
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        },
        value: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: '请输入'
        }
    },
    data() {
        return {
            dropdownVisible: false,
            dropdownWidth: 272
        };
    },
    computed: {
        similarInputClasses() {
            return ['xxx-input', this.dropdownVisible && 'select-visible'].filter(Boolean).join(' ');
        }
    },
    watch: {
        async dropdownVisible(newVal) {
            // TODO: do something
        }
    },
    methods: {
        startObserver() {
            // 🥱输入框容器
            const inputResizeObserver = new ResizeObserver(([inputContainer]) => {
                this.dropdownWidth = inputContainer.target.offsetWidth;
            });
            /* 监听 */
            inputResizeObserver.observe(this.$refs.similarInputRef.$el);

            /* 取消监听 */
            this.$on('hook:beforeDestroy', () => {
                inputResizeObserver.disconnect();
            });
        },
        // 清空
        onClear() {
            // TODO: 清空数据
        }
    },
    mounted() {
        this.startObserver();
    }
};
</script>

<style lang="less" scoped>
.xxx-input {
    position: relative;
    min-width: 272px;
    width: 100%;
    padding-right: 32px;

    &:hover {
        .ui-icon-circle-close {
            display: inline-block;
        }
    }

    .icon {
        position: absolute;
        right: 8px;
        top: 50%;
        transform: translateY(-50%) rotate(0deg);
        color: #8790a2;
        transition: all 0.2s ease-in-out;
    }

    .ui-icon-circle-close {
        display: none;
        transition: all 0.3s;

        &:hover {
            color: #8790a2;

            &::after {
                content: '';
                position: absolute;
                left: -1px;
                top: -1px;
                display: inline-block;
                width: 16px;
                height: 16px;
                background: #e4e8f0;
                z-index: -1;
                border-radius: 4px;
            }
        }
    }

    &.select-visible {
        .ui-icon-arrow-down {
            transform: translateY(-50%) rotate(180deg);
        }
    }
}
</style>

<style lang="less">
.ui-xxx {
    padding: 0;
    &.ui-popper[x-placement^='bottom'] {
        margin-top: 1px;
    }

    // TODO: 下拉框内容样式
}
</style>
