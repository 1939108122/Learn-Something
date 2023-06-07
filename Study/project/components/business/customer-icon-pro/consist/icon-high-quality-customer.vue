<template>
    <div class="customer-icon-item">
        <ui-tooltip2
            placement="top"
            appendToBody
            effect="light"
            popperClass="popper-customer-icon-simple"
            @on-show="onShow"
            @on-hide="onHide('icon-slip-excellent')">
            <span class="icon-slip-excellent icon-customer-high-quality icon-customer-trigger"></span>
            <template slot="content">
                <div class="customer-icon-content">
                    <p class="desc">优质客户成单率是其他客户的3倍</p>
                </div>
            </template>
        </ui-tooltip2>
    </div>
</template>
<script>
import trackEventMixins from './track-event-mixins';
export default {
    name: 'customer-icon-hign-quality-customer',
    mixins: [trackEventMixins],
    data () {
        return {};
    },
    props: {},
};
</script>