<!--订单字段对应的样式-->
<template>
    <div class="order-icon-status">
        <!--合同状态-->
        <template v-if="type == 'orderContractStatus'">
            <!-- <span v-if="code === 0" class="c-orange"><i class="icon-status icon-orange"></i>{{ name }}</span>
            <span v-else-if="code == 1" class="c-green"><i class="icon-status icon-green"></i>{{ name }}</span>
            <span v-else-if="code == 2" class="c-red"><i class="icon-status icon-red"></i>{{ name }}</span>
            <span v-else class="c-green"><i class="icon-status icon-green"></i>{{ name }}</span> -->

            <template v-if="code == 0 || code == 3 || code == 4">
                <i class="icrm-pending-approval-new"></i>
                <div v-if="splitNameArr.length" class="status-txt">
                    <span>{{ splitNameArr[0] }}</span>
                    <span v-if="splitNameArr[1]" class="grey">{{ splitNameArr[1] }}</span>
                </div>
            </template>

            <template v-else-if="code == 1 || code == 5">
                <i class="icrm-success-new"></i>
                <div v-if="splitNameArr.length" class="status-txt">
                    <span>{{ splitNameArr[0] }}</span>
                    <span v-if="splitNameArr[1]" class="grey">{{ splitNameArr[1] }}</span>
                </div>
            </template>

            <template v-else-if="code == 2 || code == 6">
                <i class="icrm-validate-error-new"></i>
                <div v-if="splitNameArr.length" class="status-txt">
                    <span>{{ splitNameArr[0] }}</span>
                    <span v-if="splitNameArr[1]" class="grey">{{ splitNameArr[1] }}</span>
                </div>
            </template>

            <template v-else-if="[7, 8, 9, 10, 11, 12, 13].includes(code)">
                <i class="icrm-to-be-submitted-new"></i>
                <div v-if="splitNameArr.length" class="status-txt">
                    <span>{{ splitNameArr[0] }}</span>
                    <span v-if="splitNameArr[1]" class="grey">{{ splitNameArr[1] }}</span>
                </div>
            </template>

            <template v-else>
                <i class="icrm-success-new"></i>
                <div v-if="splitNameArr.length" class="status-txt">
                    <span>{{ splitNameArr[0] }}</span>
                    <span v-if="splitNameArr[1]" class="grey">{{ splitNameArr[1] }}</span>
                </div>
            </template>
        </template>


        <!--订单状态-->
        <template v-if="type == 'contractStatus'">
            <!-- <span v-if="[99, 20, 27, 22, 0, 4].includes(code)" class="c-orange"><i class="icon-status icon-orange"></i>{{ name }}</span>
            <span v-else-if="code == 3" class="c-purple"><i class="icon-status icon-purple"></i>{{ name }}</span>
            <span v-else-if="code == 1 && [-1, 0, 1, 2, 3].includes(fileStatus)" class="c-green"><i class="icon-status icon-green"></i>{{ name }}</span>
            <span v-else-if="[2, 21].includes(code)" class="c-red"><i class="icon-status icon-red"></i>{{ name }}</span>
            <span v-else class="c-gray"><i class="icon-status icon-gray"></i>{{ name }}</span> -->

            <template v-if="[99, 20, 27, 22, 0, 4].includes(code) || code == 3">
                <i class="icrm-pending-approval-new"></i>
                <div v-if="splitNameArr.length" class="status-txt">
                    <span>{{ splitNameArr[0] }}</span>
                    <span v-if="splitNameArr[1]" class="grey">{{ splitNameArr[1] }}</span>
                </div>
            </template>

            <template v-else-if="code == 1 && [-1, 0, 1, 2, 3].includes(fileStatus)">
                <i class="icrm-success-new"></i>
                <div v-if="splitNameArr.length" class="status-txt">
                    <span>{{ splitNameArr[0] }}</span>
                    <span v-if="splitNameArr[1]" class="grey">{{ splitNameArr[1] }}</span>
                </div>
            </template>

            <template v-else-if="[2, 21].includes(code)">
                <i class="icrm-validate-error-new"></i>
                <div v-if="splitNameArr.length" class="status-txt">
                    <span>{{ splitNameArr[0] }}</span>
                    <span v-if="splitNameArr[1]" class="grey">{{ splitNameArr[1] }}</span>
                </div>
            </template>

            <template v-else>
                <i class="icrm-to-be-submitted-new"></i>
                <div v-if="splitNameArr.length" class="status-txt">
                    <span>{{ splitNameArr[0] }}</span>
                    <span v-if="splitNameArr[1]" class="grey">{{ splitNameArr[1] }}</span>
                </div>
            </template>
        </template>


        <!--到款状态-->
        <template v-else-if="type == 'payStatus'">
            <!-- <span v-if="code === 0" class="c-orange"><i class="icon-status icon-orange"></i>{{ name }}</span>
            <span v-else-if="code == 1" class="c-purple"><i class="icon-status icon-purple"></i>{{ name }}</span>
            <span v-else-if="code == 2" class="c-green"><i class="icon-status icon-green"></i>{{ name }}</span>
            <span v-else class="c-gray"><i class="icon-status icon-gray"></i>{{ name }}</span> -->

            <template v-if="code == 0 || code == 1">
                <i class="icrm-pending-approval-new"></i>
                <div v-if="splitNameArr.length" class="status-txt">
                    <span>{{ splitNameArr[0] }}</span>
                    <span v-if="splitNameArr[1]" class="grey">{{ splitNameArr[1] }}</span>
                </div>
            </template>

            <template v-else-if="code == 2">
                <i class="icrm-success-new"></i>
                <div v-if="splitNameArr.length" class="status-txt">
                    <span>{{ splitNameArr[0] }}</span>
                    <span v-if="splitNameArr[1]" class="grey">{{ splitNameArr[1] }}</span>
                </div>
            </template>

            <template v-else>
                <i class="icrm-to-be-submitted-new"></i>
                <div v-if="splitNameArr.length" class="status-txt">
                    <span>{{ splitNameArr[0] }}</span>
                    <span v-if="splitNameArr[1]" class="grey">{{ splitNameArr[1] }}</span>
                </div>
            </template>
        </template>


        <!--产品状态-->
        <template v-else-if="type == 'productOpenedStatus'">
            <!-- <span v-if="code === 0" class="c-orange"><i class="icon-status icon-orange"></i>{{ name }}</span>
            <span v-else-if="code == 1" class="c-purple"><i class="icon-status icon-purple"></i>{{ name }}</span>
            <span v-else-if="code == 2" class="c-green"><i class="icon-status icon-green"></i>{{ name }}</span>
            <span v-else class="c-gray"><i class="icon-status icon-gray"></i>{{ name }}</span> -->

            <template v-if="code == 0 || code == 1">
                <i class="icrm-pending-approval-new"></i>
                <div v-if="splitNameArr.length" class="status-txt">
                    <span>{{ splitNameArr[0] }}</span>
                    <span v-if="splitNameArr[1]" class="grey">{{ splitNameArr[1] }}</span>
                </div>
            </template>

            <template v-else-if="code == 2">
                <i class="icrm-success-new"></i>
                <div v-if="splitNameArr.length" class="status-txt">
                    <span>{{ splitNameArr[0] }}</span>
                    <span v-if="splitNameArr[1]" class="grey">{{ splitNameArr[1] }}</span>
                </div>
            </template>

            <template v-else>
                <i class="icrm-to-be-submitted-new"></i>
                <div v-if="splitNameArr.length" class="status-txt">
                    <span>{{ splitNameArr[0] }}</span>
                    <span v-if="splitNameArr[1]" class="grey">{{ splitNameArr[1] }}</span>
                </div>
            </template>
        </template>


        <!--发票状态-->
        <template v-else-if="type == 'invoiceStatus'">
            <!-- <span v-if="code == 1" class="c-orange"><i class="icon-status icon-orange"></i>{{ name }}</span>
            <span v-else-if="[0, 2].includes(code)" class="c-purple"><i class="icon-status icon-purple"></i>{{ name }}</span>
            <span v-else-if="code == 3" class="c-green"><i class="icon-status icon-green"></i>{{ name }}</span>
            <span v-else-if="code == 4" class="c-red"><i class="icon-status icon-red"></i>{{ name }}</span>
            <span v-else class="c-gray"><i class="icon-status icon-gray"></i>{{ name }}</span> -->

            <template v-if="[0, 1, 2].includes(code)">
                <i class="icrm-pending-approval-new"></i>
                <div v-if="splitNameArr.length" class="status-txt">
                    <span>{{ splitNameArr[0] }}</span>
                    <span v-if="splitNameArr[1]" class="grey">{{ splitNameArr[1] }}</span>
                </div>
            </template>

            <template v-else-if="code == 3">
                <i class="icrm-success-new"></i>
                <div v-if="splitNameArr.length" class="status-txt">
                    <span>{{ splitNameArr[0] }}</span>
                    <span v-if="splitNameArr[1]" class="grey">{{ splitNameArr[1] }}</span>
                </div>
            </template>

            <template v-else-if="code == 4">
                <i class="icrm-validate-error-new"></i>
                <div v-if="splitNameArr.length" class="status-txt">
                    <span>{{ splitNameArr[0] }}</span>
                    <span v-if="splitNameArr[1]" class="grey">{{ splitNameArr[1] }}</span>
                </div>
            </template>

            <template v-else>
                <i class="icrm-to-be-submitted-new"></i>
                <div v-if="splitNameArr.length" class="status-txt">
                    <span>{{ splitNameArr[0] }}</span>
                    <span v-if="splitNameArr[1]" class="grey">{{ splitNameArr[1] }}</span>
                </div>
            </template>
        </template>
    </div>
</template>

<script>

export default {
    props: {
        // 状态类型
        type: {
            type: String,
            validator: (value) => {
                return ['orderContractStatus', 'contractStatus', 'payStatus', 'productOpenedStatus', 'invoiceStatus'].includes(value);
            }
        },

        name: String, // 别名
        code: [String, Number],

        // 额外字段
        fileStatus: [String, Number]
    },
    computed: {
        // 有“-”的拆分出来
        splitNameArr() {
            return (this.name || '').split('-'); 
        }
    }
};
</script>
