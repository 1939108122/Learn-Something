<template>
    <div class="customer-icon-item">
        <ui-tooltip2
            placement="right"
            appendToBody
            effect="light"
            popperClass="popper-customer-icon-protection"
            @on-show="onShow"
            @on-hide="onHide(iconClassName)">
            <span :class="iconClassName" class="icon-customer-trigger"></span>
            <template slot="content">
                <div class="protection-details" :class="{'single': !origin.priceProtectionDO.remarks}"> 
                    <div class="title">
                        <p class="main">{{ origin.priceProtectionDO.protectType == 1 ? '集采' : '' }}询价保护客户</p>
                        <p class="sub">{{ origin.priceProtectionDO.customerName }}申请了询价保护<span v-if="origin.name != origin.priceProtectionDO.customerName">，当前客户与{{ origin.priceProtectionDO.customerName }}存在关联关系，请按以下价格方案统一报价！</span>保护期截止为:<i class="text-danger">{{ origin.priceProtectionDO.endTime }}</i>，还剩<i class="text-danger">{{ origin.protectionDays }}</i>天</p>
                        <p v-if="origin.priceProtectionDO.protectType == 1" class="sub c-green">集采续约周期：{{ getFormatCycleText(origin.priceProtectionDO.endTime) }}</p>
                    </div>
                    <div class="content">
                        <div class="protection-item">
                            <table>
                                <tr>
                                    <th width="140">产品名称</th>
                                    <th width="140">产品价格</th>
                                </tr>
                                <tr v-for="(item, index) in origin.priceProtectionDO.priceProtectionProductDOs" :key="index">
                                    <td>{{ item.productName }}</td>
                                    <td>{{ item.productDesc }}</td>
                                </tr>
                            </table>
                        </div>
                        <div class="protection-item" v-if="origin.priceProtectionDO.remarks">
                            <div class="text">
                                <div class="t">备注</div>
                                <p v-html="origin.priceProtectionDO.remarks"></p>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </ui-tooltip2>
    </div>
</template>
<script>
import { formatDate } from '@/utils/tools/utils.js';
import trackEventMixins from './track-event-mixins';
export default {
    name: 'customer-icon-protection',
    mixins: [trackEventMixins],
    data () {
        return {};
    },
    props: {
        origin: {
            type: Object,
            default: () => ({})
        },
    },
    computed: {
        iconClassName () {
            return this.origin.priceProtectionDO.protectType == 1 ? 'icon-collect' : 'icon-price-protect';
        },
    },
    methods: {
        getFormatCycleText (time) {
            let str = ''; //YYYY-MM-DD至YYYY-MM-DD
            if(time) {
                const endTime = new Date(time);
                const y = endTime.getFullYear();
                const m = endTime.getMonth();
                const d = endTime.getDate();

                const startDate = new Date(y, m - 3, d);
                
                // const nextMonthDates = new Date(y, m + 2, 0).getDate();
                // const endDate = new Date(y, m + 1, nextMonthDates);
                const endDate = new Date(y, m + 2, d);

                str = `${formatDate(startDate)} 至 ${formatDate(endDate)}`;
            };
            return str;
        },
    }
};
</script>