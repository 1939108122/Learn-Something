<template>
    <div v-if="loading || noData || hasError" class="data-tips">
        <div class="spinner" v-if="loading">
            <slot name="loading">
                <span><i class="ui-icon-loading"></i>{{ loadingTxt || '正在加载中' }}</span>
            </slot>
        </div>
        <div class="data-blank" v-else-if="hasError">
            <slot name="error">
                <i class="tip-errordata"></i><b>{{ errorTxt || '数据加载出错' }}</b>
            </slot>
        </div>
        <div class="data-blank" v-else-if="noData">
            <slot name="no-data">
                <i class="tip-nodata"></i><b v-html="blankTxt || '暂无数据'" class="blank-txt"></b>
            </slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'data-blank',
    props: {
        loading: {
            type: Boolean,
            default: false,
        },
        noData: {
            type: Boolean,
            default: false,
        },
        hasError: {
            type: Boolean,
            default: false,
        },
        blankTxt: {
            type: String,
            default: '',
        },
        loadingTxt: {
            type: String,
            default: '',
        },
        errorTxt: {
            type: String,
            default: '',
        },
    },
};
</script>
<style lang="less" scoped>
.data-tips {
    .spinner {
        width: unset;
        line-height: 17px;
    }
    .blank-txt {
        display: block;
        line-height: 20px;
    }
}
</style>
