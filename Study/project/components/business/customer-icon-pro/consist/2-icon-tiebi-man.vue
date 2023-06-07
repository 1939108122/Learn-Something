<template>
    <div class="customer-icon-item">
        <ui-tooltip2
            placement="top"
            appendToBody
            effect="light"
            popperClass="popper-customer-icon-simple"
            @on-show="onShow"
            @on-hide="onHide('icon-customer-tie')">
            <span class="icon-customer-tie icon-customer-trigger"></span>
            <template slot="content">
                <div class="customer-icon-content">
                    <p class="desc">指被铁壁明访过，但不是人资、派遣类公司</p>
                </div>
            </template>
        </ui-tooltip2>
    </div>
</template>

<script>
import trackEventMixins from './track-event-mixins';
export default {
    name: 'customer-icon-tiebi-man',
    mixins: [trackEventMixins],
    data () {
        return {};
    },
    props: {},
};
</script>