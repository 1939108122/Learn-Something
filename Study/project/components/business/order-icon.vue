<!--订单的标签图标-->
<template>
    <ui-tooltip2 placement="top-start" effect="dark">
        <template v-if="renewFlag == 1">
            <p slot="content">新雇首单：首次合作客户的第一笔到款订单</p>
            <!-- <i class="icrm-order-new c-green"></i> -->
            <div class="order-icon i-green">新</div>
        </template>

        <template v-else-if="renewFlag == 2">
            <p slot="content">新雇复购：客户首次合作年份的非第一笔到款订单</p>
            <!-- <i class="icrm-order-fu c-green"></i> -->
            <div class="order-icon i-green">复</div>
        </template>

        <template v-else-if="renewFlag == 3">
            <p slot="content">老雇复购：客户首次合作年份后的复购订单</p>
            <!-- <i class="icrm-order-fu c-orange"></i> -->
            <div class="order-icon i-orange">复</div>
        </template>

        <template v-else-if="renewFlag == 4">
            <p slot="content">老雇续约：客户首次合作年份后的续约订单</p>
            <!-- <i class="icrm-order-xu c-orange"></i> -->
            <div class="order-icon i-orange">续</div>
        </template>

        <template v-else-if="renewFlag == 5">
            <p slot="content">断约拉回：客户首次合作年份后的拉回订单</p>
            <!-- <i class="icrm-order-la c-orange"></i> -->
            <div class="order-icon i-blue">拉</div>
        </template>

        <template v-else-if="renewFlag == 6">
            <p slot="content">人资业绩：订单签约的主体为人资客户</p>
            <!-- <i class="icrm-order-ren c-red"></i> -->
            <div class="order-icon i-pink">人</div>
        </template>
    </ui-tooltip2>
</template>

<script>
export default {
    props: {
        renewFlag: [Number, String]
    }
};
</script>

<style lang="less" scoped>
.order-icon {
    display: inline-block;
    height: 18px;
    line-height: 18px;
    padding: 0 7px;
    font-size: 12px;
    border-radius: 8px 8px 8px 2px;
    &.i-green {
        background-color: #E1F5ED;
        color: #1B8454;
    }
    &.i-orange {
        background-color: #FAEEE1;
        color: #E65815;
    }
    &.i-blue {
        background-color: #E6F2FF;
        color: #1679DB;
    }
    &.i-pink {
        background-color: #FDECEE;
        color: #E6405C;
    }
}
</style>
