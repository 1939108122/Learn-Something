<template>
    <ui-popover v-model="panelShow" placement="bottom" transition="" :visible-arrow="false">

        <div v-if="panelShow" class="panel">
            <p class="panel-header">{{ title }}</p>
            <p class="panel-body">
                <ui-input v-model="numRange[0]" v-customTxt="{reg:'\d'}" :maxlength="10"></ui-input>
                <span>-</span>
                <ui-input v-model="numRange[1]" v-customTxt="{reg:'\d'}" :maxlength="10"></ui-input>
            </p>
            <div class="panel-footer">
                <span @click="onConfirm" class="link">确定</span>
                <span @click="panelShow = false" class="link">取消</span>
            </div>
        </div>

        <span slot="reference">
            <slot name="reference"></slot>
            <i :class="['icrm-filter trigger-btn', {'active': hasValue}]"></i>
        </span>
    </ui-popover>

</template>

<script>
export default {
    name: 'filterInput',
    props: {
        value: Array,
        title: {
            type: [Number, String],
            default: ''
        }
    },
    data() {
        return {
            panelShow: false,
            hasValue: false,
            numRange: []
        };
    },
    watch: {
        value: {
            handler (val) {
                if (!val || JSON.stringify(val) === JSON.stringify(this.numRange)) return;
                this.numRange = val.concat(); // 去除绑定
            },
            immediate: true
        }
    },
    methods: {
        onConfirm() {
            this.hasValue = !!(this.numRange[0] || this.numRange[1]);
            this.$emit('input', this.numRange);
            this.panelShow = false;
        }
    }
};
</script>

<style lang="less" scoped>
    .panel {
        text-align: center;
        &-header {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        &-body {
            padding: 10px 0;
        }
        &-footer {
            display: flex;
            text-align: center;
            .link {
                flex: 1;
                font-size: 14px;
            }
        }
    }
    .trigger-btn {
        font-weight: normal;
        color: #909399;
        outline: none;
        cursor: pointer;
        &.active {
            color: #54d8c9;
        }
    }
    .input-wrap {
        min-width: 0;
        width: 50px;
    }
</style>