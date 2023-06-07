<template>
    <div class="customer-icon-item">
        <ui-tooltip2
            placement="top"
            appendToBody
            effect="light"
            popperClass="popper-customer-icon-simple"
            @on-show="onShow"
            @on-hide="onHide('icon-customer-x')">
            <span class="icon-customer-x icon-customer-trigger"></span>
            <template slot="content">
                <div class="customer-icon-content">
                    <p class="desc">X客户</p>
                </div>
            </template>
        </ui-tooltip2>
    </div>
</template>

<script>
import trackEventMixins from './track-event-mixins';
export default {
    name: 'customer-icon-x',
    mixins: [trackEventMixins],
    data () {
        return {};
    },
    props: {},
};
</script>