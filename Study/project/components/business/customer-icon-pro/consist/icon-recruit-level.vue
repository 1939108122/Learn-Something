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
    name: 'customer-icon-recruit-level',
    mixins: [trackEventMixins],
    data () {
        return {};
    },
    props: {
        recruitLevel: {
            type: [String, Number],
            default: 1,
        },
    },
    computed: {
        iconClassName () {
            let className = '';
            if(this.recruitLevel == 1) {
                className = 'icon-slip-middle';
            } 
            else if(this.recruitLevel == 2) {
                className = 'icon-slip-high';
            };
            return className;
        },
        iconDescription () {
            let description = '';
            if(this.recruitLevel == 1) {
                description = '成单概率中，成单率是其他客户的2倍';
            } 
            else if(this.recruitLevel == 2) {
                description = '成单概率高，成单率是其他客户的7倍';
            };
            return description;
        }
    }
};
</script>