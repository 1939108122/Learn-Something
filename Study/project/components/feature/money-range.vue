<!--金额范围选择-->
<template>
    <ui-popover
        ref="popover"
        placement="bottom"
        transition=""
        trigger="click"
        :visible-arrow="false"
        :close-delay="0"
        popper-class="popover-money-range"
    >
        <ui-input slot="reference" :value="inputText" :placeholder="placeHolder" readonly>
            <span slot="labelPrefix">{{ label }}</span>
            <template slot="suffix">
                <i
                    v-show="inputText"
                    class="suffix-icon ui-icon-circle-close"
                    style="cursor: pointer"
                    @click.stop="onClear"
                ></i>
            </template>
        </ui-input>

        <ul class="option-list">
            <li v-for="(i, n) in optionList" :key="n" :class="{ active: isEqual(i.value) }" @click="onOptionClick(i)">
                {{ i.label }}
            </li>
        </ul>

        <div class="content-footer">
            <template v-if="inputShow">
                <ui-input-number
                    v-model="range[0]"
                    class="no-arrow"
                    placeholder="请输入"
                    :min="0"
                    :precision="1"
                    @on-blur="onInputBlur"
                >
                    <template slot="suffix">万</template>
                </ui-input-number>
                <span>-</span>
                <ui-input-number
                    v-model="range[1]"
                    class="no-arrow"
                    placeholder="请输入"
                    :min="0"
                    :precision="1"
                    @on-blur="onInputBlur"
                >
                    <template slot="suffix">万</template>
                </ui-input-number>
            </template>
            <div v-else class="trigger-btn" @click="inputShow = true">
                <i class="icrm-edit icon"></i>
                <span>自定义区间</span>
            </div>
        </div>
    </ui-popover>
</template>

<script>
export default {
    props: {
        label: String,
        value: {
            type: Array,
            default: () => []
        },
        placeHolder: {
            type: String,
            default: '请选择'
        },
    },
    data() {
        return {
            inputShow: false,
            range: [null, null],
            optionList: [
                { label: '50万及以上', value: [50, null] },
                { label: '10万-50万', value: [10, 50] },
                { label: '5万-10万', value: [5, 10] },
                { label: '3万-5万', value: [3, 5] },
                { label: '2万-3万', value: [2, 3] },
                { label: '1.5万-2万', value: [1.5, 2] },
                { label: '1万-1.5万', value: [1, 1.5] },
                { label: '1万以下', value: [null, 1] }
            ]
        };
    },
    computed: {
        inputText() {
            if (typeof this.value[0] === 'number' && typeof this.value[1] === 'number') {
                return `${Math.min(...this.value)}万-${Math.max(...this.value)}万`; // 纠正范围
            }
            if (typeof this.value[0] === 'number') {
                return `${this.value[0]}万及以上`;
            }
            if (typeof this.value[1] === 'number') {
                return `${this.value[1]}万以下`;
            }
            return '';
        }
    },
    watch: {
        range: {
            handler(val) {
                this.$emit('input', val);
            },
            deep: true
        }
    },
    methods: {
        onClear() {
            this.range = [null, null];
            this.$refs.popover.showPopper = false;
        },
        onOptionClick(item) {
            this.range = item.value.concat(); // concat：新生成一个
            this.$refs.popover.showPopper = false;
            this.inputShow = false;
        },

        onInputBlur() {
            // 上年回款金额范围失焦时（纠正最大值、最小值）
            if (
                typeof this.range[0] === 'number' &&
                typeof this.range[1] === 'number' &&
                this.range[0] > this.range[1]
            ) {
                const temp = this.range[0];
                this.range[0] = this.range[1];
                this.range[1] = temp;
            }
        },

        isEqual(value) {
            // 是否选中
            return value.join() === this.range.join();
        }
    }
};
</script>

<style lang="less">
@import '~@/styles/variable';
.popover-money-range {
    width: 258px;
    padding: 0;
    margin: 0 !important;
    .option-list {
        padding: 5px 0;
        li {
            line-height: 36px;
            padding: 0 15px;
            cursor: pointer;
            &.active {
                color: @primary-color;
            }
            &:hover {
                background-color: #f7f8fb;
            }
        }
    }
    .content-footer {
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-top: 1px solid #dbdfe6;
        .inputnumber-wrap {
            width: 42%;
            margin: 0 12px;
        }
        .trigger-btn {
            display: flex;
            align-items: center;
            width: 100%;
            height: 100%;
            padding: 0 12px;
            cursor: pointer;
            &:hover {
                background-color: #f7f8fb;
            }
            .icon {
                font-size: 18px;
                margin-right: 3px;
            }
        }
    }
}
</style>
