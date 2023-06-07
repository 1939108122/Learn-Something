<template>
    <div class="customer-icon-item">
        <ui-tooltip2
            placement="top"
            appendToBody
            effect="light"
            popperClass="popper-customer-icon-simple"
            @on-show="onShow"
            @on-hide="onHide('icon-bell')">
            <span class="icon-bell icon-customer-trigger"></span>
            <template slot="content">
                <div class="customer-icon-content">
                    <p class="desc">此客户相关的询价保护客户或疑似关联客户已成单，了解签单情况，请联系{{ singleRemindDept }}{{ singleRemindUser }}</p>
                </div>
            </template>
        </ui-tooltip2>
    </div>
</template>
<script>
import trackEventMixins from './track-event-mixins';
export default {
    name: 'customer-icon-competition',
    mixins: [trackEventMixins],
    data () {
        return {};
    },
    props: {
        singleRemindDept: '',
        singleRemindUser: '',
    },
};
</script>