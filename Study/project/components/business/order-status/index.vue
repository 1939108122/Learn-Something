<template>
    <div class="order-status" v-if="matchedItem && matchedItem.length">
        <span :class="matchedItem[0].textClassName">
            <i :class="['icon-order', matchedItem[0].iconClassName]"></i>
            <i>
                <template>{{ matchedItem[0].label }}</template>
                <template v-if="type == 'payStatus' && (value == 1 || value == 2 || value == 4) && extraVal && extraVal > 0">-已申请退款</template>
            </i>
        </span>
    </div>
</template>
<script>
/**
 * 使用方法
 * 1.合同状态 <order-status type="contractState" value="4" extraVal="5"></order-status>  // @pamras {item.contractStatus}; @pamras {item.fileStatus};
 * 
 * 2.到款状态 <order-status type="payStatus" value="4" extraVal="5"></order-status> // @pamras {item.payStatus}; @pamras {item.refundApplyId};
 * 
 * 3.产品开通状态 <order-status type="productOpenedStatus" value="1"></order-status> // @pamras {item.productOpenedStatus};
 * 
 * 4.发票状态 <order-status type="invoiceStatus" value="1"></order-status> // @pamras {item.productOpenedStatus};
 */
import options from './src/status.js';
export default {
    data () {
        return {
            cache: options,
        };
    },
    props: {
        type: {
            type: String,
            default: '', //contractState 合同状态、payStatus 到款状态、productOpenedStatus 产品开通状态、invoiceStatus 发票状态
            required: true
        },
        value: {
            type: [String, Number],
            default: '',
        },
        // contractState => :fileStatus || payStatus => :refundApplyId
        extraVal: {
            type: [String, Number],
            default: '',
        },
    },
    computed: {
        matchedItem () {
            let opts = this.cache[this.type + 'Opts'];
            return opts.filter((item, index, arr) => {
                if(this.type == 'contractState') {
                    return item.value == this.value && item.fileStatus == this.extraVal;
                } else {
                    return item.value == this.value;
                };
            });
        },
    },
    created () {},
    methods: {},
};
</script>
<style lang="less" scoped>
    .order-status {
        display: inline-block;
        .icon-order {
            width: 10px;
            height: 10px;
            display: inline-block;
            margin-right: 4px;
            background: url("../../../assets/images/icons-grid.png") no-repeat;
        }
        .icon-purple {
            width: 11px;
            height: 11px;
            background-position: -4px -516px;
        }
        .icon-orange {
            background-position: -4px -483px;
        }
        .icon-green {
            background-position: -4px -451px;
        }
        .icon-red {
            background-position: -4px -552px;
        }
        .icon-gray {
            width: 11px;
            height: 11px;
            background-position: -4px -670px;
        }
        .text-purple {
            color: #707cd2;
        }
        .text-orange {
            color: #ffc36d;
        }
        .text-green {
            color: #49c3bb;
        }
        .text-red {
            color: #ff7576;
        }
        .text-gray {
            color: #9fa3b0;
        }
    }
</style>