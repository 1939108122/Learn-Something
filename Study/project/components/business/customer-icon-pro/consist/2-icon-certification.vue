<template>
    <div class="customer-icon-item">
        <ui-tooltip2
            placement="top"
            appendToBody
            effect="light"
            popperClass="popper-customer-icon-simple"
            @on-show="onShow"
            @on-hide="onHide('icrm-aaum')">
            <span class="icrm-aaum icon-customer-certification icon-customer-trigger"></span>
            <template slot="content">
                <div class="customer-icon-content">
                    <p class="desc">通过工商认证</p>
                </div>
            </template>
        </ui-tooltip2>
    </div>
</template>

<script>
import trackEventMixins from './track-event-mixins';
export default {
    name: 'customer-icon-ceritification',
    mixins: [trackEventMixins],
    data () {
        return {};
    },
    props: {},
};
</script>