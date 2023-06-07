<template>
    <div class="customer-icon-item">
        <ui-tooltip2
            placement="top"
            appendToBody
            effect="light"
            popperClass="popper-customer-icon-simple"
            @on-show="onShow"
            @on-hide="onHide('icon-customer-individual')">
            <span class="icon-customer-individual icon-customer-trigger"></span>
            <template slot="content">
                <div class="customer-icon-content">
                    <p class="desc">基于运营策略的调整，平台暂不支持个体工商户发布任何工作地点与其营业执照经营场所不在同一城市的职位</p>
                </div>
            </template>
        </ui-tooltip2>
    </div>
</template>

<script>
import trackEventMixins from './track-event-mixins';
export default {
    name: 'customer-icon-individual',
    mixins: [trackEventMixins],
    data () {
        return {};
    },
    props: {},
};
</script>