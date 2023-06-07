<template>
    <ui-tooltip2 effect="dark" placement="right-start" popper-class="list-header-tooltip" :offset="-10">
        <IconHover class-name="list-header-tooltip-icon">
            <slot name="icon">
                <i class="icrm-info-tooltip"></i>
            </slot>
        </IconHover>
        <div slot="content">
            <div class="content-wrapper">
                <template v-for="(tipItem, tipIndex) in tipList">
                    <p :key="tipIndex">{{ `${tipItem.columnName}：${tipItem.tip}` }}</p>
                </template>
            </div>
        </div>
    </ui-tooltip2>
</template>

<script>
import IconHover from '@/components/feature/icon-hover';

export default {
    name: 'ListHeaderTips',
    components: {
        IconHover
    },
    props: {
        tipList: {
            type: Array, // [{ columnName: '', tip: '' }]
            required: true
        }
    }
};
</script>

<style lang="less">
.list-header-tooltip-icon {
    color: #9fa6b5;
    &:hover {
        color: #363f55;
    }
}

.list-header-tooltip {
    padding-left: 0;
    padding-right: 0;
    z-index: 999 !important;

    &.ui-tooltip__popper[x-placement^='right'] .popper__arrow {
        border-right-color: rgba(54, 63, 85, 0.85) !important;
    }
    &.ui-tooltip__popper[x-placement^='right'] .popper__arrow::after {
        border-right-color: transparent !important;
    }
    background-color: rgba(54, 63, 85, 0.85) !important;

    .content-wrapper {
        max-width: 440px;
        max-height: 310px;
        overflow-y: auto;
        padding: 0 10px;

        // 滚动条通用样式
        &::-webkit-scrollbar {
            &-track-piece {
                // 轨道变为透明色
                background-color: transparent !important;
            }
        }

        & > p {
            &:not(:last-child) {
                margin-bottom: 10px;
            }
            &:not(.common-tips) {
                position: relative;
                padding-left: 10px;
                &::before {
                    content: '';
                    position: absolute;
                    left: 0px;
                    top: 6px;
                    width: 4px;
                    height: 4px;
                    border-radius: 50%;
                    background-color: #fff;
                }
            }
        }
    }
}
</style>
