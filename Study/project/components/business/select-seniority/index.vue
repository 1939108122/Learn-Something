<template>
    <ui-popover
        v-model="dropdownVisible"
        trigger="click"
        appendToBody
        :disabled="disabled"
        :visible-arrow="false"
        :offset="0"
        :popper-class="`${popperClass} ui-select-seniority`"
        :width="dropdownWidth"
    >
        <ui-similar-input ref="similarInputRef" :class-name="similarInputClasses" slot="reference" no-scroll>
            <template v-if="$slots.labelPrefix" #labelPrefix>
                <slot name="labelPrefix"></slot>
            </template>

            <template v-if="displayText">
                <span class="text-content">{{ displayText }}</span>
                <i class="ui-icon-circle-close icon" @click.stop="onClear"></i>
            </template>

            <template v-else>
                <span class="placeholder">{{ placeholder }}</span>
                <i class="ui-icon-arrow-down icon"></i>
            </template>
        </ui-similar-input>

        <div class="seniority-range-wrapper">
            <div class="choose-range">
                <ui-input-number v-model="min" :min="1" :max="999" placeholder="请输入" @on-blur="onLeftBlur">
                    <template #suffix>月</template>
                </ui-input-number>
                <i class="separator" />
                <ui-input-number v-model="max" :min="1" :max="999" placeholder="请输入" @on-blur="onRightBlur">
                    <template #suffix>月</template>
                </ui-input-number>
            </div>
            <!-- <div class="btn-wrapper">
                <button class="btn btn-primary btn-small" @click="onConfirm">确定</button>
            </div> -->
        </div>
    </ui-popover>
</template>

<script>
import UiSimilarInput from '@/components/feature/similar-input';

export default {
    name: 'UiSelectSeniority',
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
            type: Array,
            default: () => []
        },
        placeholder: {
            type: String,
            default: '请输入'
        }
    },
    data() {
        return {
            dropdownVisible: false,
            dropdownWidth: 272,
            min: null,
            max: null,
            displayText: '',
        };
    },
    watch: {
        dropdownVisible: {
            handler(val) {
                if(val==false){
                    this.onConfirm();
                    if(this.min && this.max && this.min>this.max) { //处理左右边框大小反转情况，恢复左边小于右边
                        [this.min, this.max] = [this.max, this.min];
                    }
                }
            }
        },
        min: {
            handler() {
                this.onConfirm();
            }
        },
        max: {
            handler() {
                this.onConfirm();
            }
        },
    },
    computed: {
        similarInputClasses() {
            return ['select-seniority-input', this.dropdownVisible && 'select-visible'].filter(Boolean).join(' ');
        },
        rangeList() {
            if (this.min === null && this.max === null) return [];
            if (this.min === null) {
                return [1, this.max];
            }
            if (this.max === null) {
                return [this.min, 999];
            }
            return this.min > this.max ? [this.max, this.min] : [this.min, this.max];
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
        /* dynamicCompare() {
            if (this.min === null && this.max === null) return;

            if (this.max !== null && (this.min === null || this.min > this.max)) {
                this.min = this.max;
                return;
            }

            if (this.min !== null && (this.max === null || this.max < this.min)) {
                this.max = this.min;
            }
        }, */
        /* calcDisplayText() {
            if (this.min === null && this.max === null) return '';

            if (this.min === this.max) return `${this.min}月`;

            return `${this.min}-${this.max}月`;
        }, */
        returnText() {
            if (this.min === null && this.max === null) return '';
            if (this.min === this.max) return `${this.min}月`;
            if (this.min > this.max && this.max != null) return `${this.max}-${this.min}月`;
            if (this.min && this.max === null) return `${this.min}月以上`;
            if (this.max && this.min === null) {
                if(this.max == 1) {
                    return `${this.max}月`;
                }
                return `${this.max}月以下`;
            }
            return `${this.min}-${this.max}月`;
        },
        onLeftBlur() {
            this.onConfirm();
        },
        onRightBlur() {
            this.onConfirm();
        },

        // 确定变更
        onConfirm() {
            //this.dynamicCompare();

            this.displayText = this.returnText();
            //this.dropdownVisible = false;

            this.$emit('input', this.rangeList);
            this.$emit('change', this.rangeList);
        },
        // 清空
        onClear() {
            this.min = null;
            this.max = null;
            this.onConfirm();
        }
    },
    mounted() {
        this.startObserver();
    }
};
</script>

<style lang="less" scoped>
.select-seniority-input {
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

    .placeholder {
        font-size: 14px;
        color: #9fa6b5;
        line-height: 20px;
    }

    .text-content {
        font-size: 14px;
        color: #363f55;
        line-height: 20px;
    }
}
</style>

<style lang="less">
.ui-select-seniority {
    padding: 0;
    &.ui-popper[x-placement^='bottom'] {
        margin-top: 1px;
    }

    .seniority-range-wrapper {
        padding: 16px;

        .choose-range {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;

            .input-wrap {
                flex-grow: 1;
            }

            .separator {
                position: relative;
                margin: 0 8px;
                width: 8px;
                flex-shrink: 0;
                &::after {
                    content: '';
                    display: block;
                    position: absolute;
                    top: 50%;
                    width: 8px;
                    height: 1px;
                    background-color: #cdd0d6;
                }
            }
        }

        .btn-wrapper {
            text-align: right;

            .btn-small {
                padding: 4px 12px;
            }
        }
    }
}
</style>
