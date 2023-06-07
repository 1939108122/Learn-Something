<template>
    <ui-popover
        placement="top"
        appendToBody
        trigger="hover"
        v-model="isShow"
        popperClass="asr-select-box">
        <span slot="reference" class="asr-select-input" :class="{open: isShow}">{{ speed }}</span>
        <ul class="asr-select-content">
            <li class="select-item" :class="{'select-active': value == item.value}"
                v-for="(item, index) in options"
                :key="index"
                v-logParams="{ wc_interface: '录音详情', ele_name: `audio-detail-speed-${item.label}`, ...setParams }"
                @click.stop="onSelect(item)">{{ item.label }}</li>
        </ul>
    </ui-popover>
</template>

<script>
export default {
    name: 'asr-select',
    props: {
        value: {
            type: [Number, String],
            default: 1
        },
        setParams: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            isShow: false,
            options: [
                {label: '2.0x', value: 2},
                {label: '1.5x', value: 1.5},
                {label: '1.0x', value: 1}
            ],
        };
    },
    methods: {
        onSelect(itm) {
            this.$emit('input', itm.value);
            this.$emit('on-change', itm.value);
            this.isShow = false;
        },
    },
    computed: {
        speed() {
            let str = '倍速';
            for(let itm of this.options) {
                if(itm.value == this.value) {
                    str = itm.value == 1 ? '倍速' : itm.label;
                    break;
                }
            }
            return str;
        }
    }
};
</script>

<style lang="less">
    .asr-select-input {
        display: inline-block;
        margin-right: 3px;
        padding: 0 12px;
        height: 28px;
        line-height: 28px;
        color: #363F55;
        text-align: center;
        // background: #F1F2F5;
        border-radius: 4px;
        cursor: pointer;
        &:hover, &.open {
            background: #F1F2F5;
        }
    }
    .ui-popper.asr-select-box {
        z-index: 9999 !important;
        min-width: 0;
        width: 60px;
        padding: 4px 0;
        box-sizing: border-box;
        line-height: 32px;
        text-align: center;
        background: #FFFFFF;
        box-shadow: 1px 2px 10px -4px rgba(54, 63, 85, 0.2);
        border: 1px solid #E7EAEC;

        &[x-placement^="top"] {
            margin-bottom: 4px;
        }
        .popper__arrow {
            display: none;
        }
        .asr-select-content {
            .select-item {
                cursor: pointer;

                &.select-active {
                    color: #4465EB;
                }
            }
        }
    }
</style>
