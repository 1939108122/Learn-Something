<template>
    <div class="customer-icon-item">
        <ui-tooltip2
            placement="top"
            appendToBody
            effect="light"
            popperClass="popper-customer-icon-simple"
            @on-show="onShow"
            @on-hide="onHide('icon-slip-' + level.toLowerCase())">
            <span :class="'icon-slip-' + level.toLowerCase()" class="icon-customer-trigger"></span>
            <template slot="content">
                <div class="customer-icon-content">
                    <p class="desc">{{ '客户级别' + level }}</p>
                </div>
            </template>
        </ui-tooltip2>
    </div>
</template>
<script>
import trackEventMixins from './track-event-mixins';
export default {
    name: 'customer-icon-level',
    mixins: [trackEventMixins],
    data () {
        return {};
    },
    props: {
        level: {
            type: String,
            default: 'A',
        },
    },
};
</script>