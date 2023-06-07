<template>
    <div class="customer-icon-item" style="margin-right: 3px;">
        <ui-tooltip2
            placement="top"
            appendToBody
            effect="light"
            popperClass="popper-customer-icon-simple"
            @on-show="onShow"
            @on-hide="onHide(item.name)">
            <i class="icon-customer-custom icon-customer-trigger" :name="item.name" :style="{'background-image': 'url('+ item. iconUrl +')'} "></i>
            <template slot="content">
                <div class="customer-icon-content">
                    <p class="custom-name">{{ item.tagDesc || '客户标签' }}</p>
                    <div class="custom-text" v-if="item.showAddTime && item.addTime">添加时间：{{ item.addTime }}</div>
                    <div class="custom-text">{{ item.customerRemark }}</div>
                    <div class="custom-text">{{ item.customerRemarkTwo }}</div>
                </div>
            </template>
        </ui-tooltip2>
    </div>
</template>
<script>
import trackEventMixins from './track-event-mixins';
export default {
    name: 'customer-icon-custom',
    mixins: [trackEventMixins],
    data () {
        return {};
    },
    props: {
        item: {
            type: Object,
            default: () => ({}),
        },
    },
};
</script>