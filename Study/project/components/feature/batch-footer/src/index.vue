<template>
        <!-- 组件 批量处理/退出批量处理 -->
        <div class="batch-footer-component" v-if="show">
            <span v-if="showSelectAll" class="select-all">
                <ui-checkbox @on-change="$emit('select-all', $event)">{{checkboxTxt}}</ui-checkbox>
            </span>
            <p>
                <!-- 可分配的条数 -->
                <span v-if="canCheckTxt">
                    {{canCheckTxt}}<i>{{canCheck}}</i>条，
                </span>
                <!-- 一共勾选的条数 -->
                <span v-if="dataCheckTxt">
                    {{dataCheckTxt}}<i>{{dataCheck}}</i>条
                </span>
            </p>
            <span  :class="['btn',{'btn-disabled':dataCheck == 0 || isLoading}]" :disabled="dataCheck == 0 || isLoading" @click="handleBatch()">{{batchTxt}}</span>
            <span class="btn btn-outline" @click="handleClear()">{{clearTxt}}</span>
        </div>
</template>
<script>
export default {
    data () {
        return {
        };
    },
    props: {
        // 组件 显示与否
        show: {
            type: Boolean,
            default: false
        },
        // 文案 已选中可分配为
        canCheckTxt: {
            type: String,
            default: '共'
        },
        // 文案 全部已选
        dataCheckTxt: {
            type: String,
            default: '当前已选'
        },
        // 条数 已选中可分配为
        canCheck: {
            type: Number,
            default: 0
        },
        // 条数 全部已选
        dataCheck: {
            type: Number,
            default: 0
        },
        isLoading: {
            type: Boolean,
            default: false
        },
        // 按钮 批量处理
        batchTxt:{
            type: String,
            default: '批量分配'
        },
        // 按钮 退出批量处理
        clearTxt:{
            type: String,
            default: '退出批量处理'
        },
        // 是否显示选择全部按钮
        showSelectAll: {
            type: Boolean,
            default: false
        },
        checkboxTxt: {
            type: String,
            default: '选择全部数据'
        }
    },
    created () {},
    methods: {
        // 退出批量处理
        handleClear () {
            this.$emit('clearSelection');
        },
        // 进行批量处理
        handleBatch () {
            this.$emit('batchSelection');
        }
    }
};
</script>
<style lang="less" scoped>
    @import "./index.less";
</style>
