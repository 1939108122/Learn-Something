<template>
    <div class="customer-icon-item">
        <ui-tooltip2
            placement="top"
            appendToBody
            effect="light"
            popperClass="popper-customer-icon-simple"
            @on-show="onShow"
            @on-hide="onHide(iconClassName)">
            <span :class="iconClassName" class="icon-customer-trigger"></span>
            <template slot="content">
                <div class="customer-icon-content">
                    <p class="desc">{{ iconDescription }}</p>
                </div>
            </template>
        </ui-tooltip2>
    </div>
</template>
<script>
import trackEventMixins from './track-event-mixins';
export default {
    name: 'customer-icon-tiebi-customer',
    mixins: [trackEventMixins],
    data () {
        return {};
    },
    props: {
        addTimeStr: {
            type: [String, Number],
            default: '2021-08-21',
        },
        addV: {
            type: [String, Number, Boolean],
            default: 1,
        },
    },
    computed: {
        iconClassName () {
            let className = '';
            if(this.addV) {
                className = 'icon-customer-human-vip';
            } 
            else {
                className = 'icon-customer-human';
            };
            return className;
        },
        iconDescription () {
            let description = '';
            console.log(this.addTimeStr);
            if(this.addV) {
                description = `此客户于${this.addTimeStr}被判定为人资/派遣类客户，且已被铁壁拜访过。请按人资要求及指定阻断合作，业绩按人资/派遣类规则核算`;
            } 
            else {
                description = `此客户于${this.addTimeStr}被判定为人资/派遣类客户，请按人资要求及指定阻断合作，业绩按人资/派遣类规则核算。`;
            };
            return description;
        }
    }
};
</script>