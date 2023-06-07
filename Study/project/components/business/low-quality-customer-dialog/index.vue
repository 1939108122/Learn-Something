<template>
    <div v-if="visible">
        <ui-dialog :value="true" width="420" wrapClass="low-quality-customer-dialog" prevent-hide :showFooter="false" @on-close="close">
            <template #title><i class="icrm-warn"></i><span class="span-title">确定添加商机库</span></template>
            <template #content>
                <template v-if="dialogInfo.recommendType !== 0">
                    <p class="p-text">{{ qualityRemindText }}，您还有以下<span v-if="qualityInfo" :style="{ color: qualityInfo.color }">{{ qualityInfo.text }}</span>客户未联系：</p>
                    <div class="customer-info" @click="openCustomerDialog">
                        <dots line="1" :txt="dialogInfo.customerName" class="name" />
                        <span class="contact-text">马上联系<i class="icrm-arrow-right"></i></span>
                    </div>
                </template>
                <div class="add-part">
                    <button type="button" class="btn" @click="onContinueAdd">继续添加</button>
                </div>
            </template>
        </ui-dialog>
    </div>
</template>

<script>
export default {
    name: 'low-quality-customer-dialog',
    data() {
        return {
            visible: false,
            onContinue: null, // 点击【继续添加】按钮时执行的回调
            onSeeCustomer: null, // 点击【客户名称交互热区】时执行的回调
            onOpen: null, // 弹窗打开时执行的回调
            onClose: null, // 点击叉号执行的回调
            // 主要用下面这些参数-数据来源[/customer/checkToBusi]
            dialogInfo: {
                // echoAllocateAllId: 0, //派单id（暂时用不到）
                // message: '该客户xxxxxxxx，确定要添加商机库吗？', // 前端代码中维护
                // customerId: 1103752, //客户id
                // customerEncryptId: 'bb56a4e105f72cb01nV62Nm_Fw~~', //客户加密id
                // customerName: '北京东方忞睿商贸有限公司', //客户名称
                // recommendType: 1, //0 不推荐 1 文案一 2 文案二
                // qualityType: 1, //1 高质 2 中质
            },
        };
    },
    computed: {
        // 质量信息
        qualityInfo() {
            const tempMap = {
                1: { text: '高质', color: '#CC1231' },
                2: { text: '中质', color: '#C24D00' },
                3: { text: '高质', color: '#CC1231' },
                4: { text: '高质', color: '#CC1231' },
                5: { text: '高质', color: '#CC1231' },
            };
            return tempMap[this.dialogInfo.qualityType];
        },
        // 规则文案-[https://wiki.kanzhun-inc.com/pages/viewpage.action?pageId=149048996]
        qualityRemindText() {
            const tempMap = {
                1: '通话中该客户表达的需求意向低且模型评估的客户质量分较低',
                2: '该客户通话时长短且模型评估的客户质量分较低',
            };
            return tempMap[this.dialogInfo.recommendType];
        },
    },
    methods: {
        // 继续添加
        onContinueAdd() {
            if (typeof this.onContinue === 'function') {
                this.onContinue(this.$el);
            }
            this.hide();
        },
        // 打开客户详情弹窗
        openCustomerDialog() {
            if (typeof this.onSeeCustomer === 'function') {
                this.onSeeCustomer(this.$el);
            }
            this.hide();
        },
        // 显示弹窗
        show() {
            this.visible = true;
            if (typeof this.onOpen == 'function') {
                this.onOpen(this.$el);
            }
        },
        hide() {
            this.visible = false;
            if (typeof this.onHide == 'function') {
                this.onHide(this.$el);
            }
        },
        // 点击叉号
        close() {
            this.visible = false;
            if (typeof this.onClose === 'function') {
                this.onClose(this.$el);
            }
        },
    },
    mounted() {
        this.show();
    },
};
</script>

<style lang="less">
.low-quality-customer-dialog {
    .dialog-container {
        padding: 24px;
        .dialog-header {
            display: flex;
            align-items: center;
            margin-bottom: 16px;
            .title {
                font-size: 16px;
                font-weight: 500;
                color: #1e2433;
                line-height: 20px;
                .span-title {
                    position: relative;
                    top: -1px;
                }

                .icrm-warn {
                    color: #f77233;
                    margin-right: 12px;
                    font-size: 20px;
                }
            }
        }
        .dialog-body {
            padding-left: 32px;
            .p-text {
                line-height: 22px;
            }
            .customer-info {
                margin-top: 12px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                height: 40px;
                padding: 10px 12px;
                background: #ffffff;
                border-radius: 4px;
                border: 1px solid #00bebd;
                font-size: 14px;
                font-weight: 400;
                line-height: 20px;
                cursor: pointer;
                transition: all 250ms;
                > .name {
                    width: 224px;
                    color: #29292d;
                }
                > .contact-text {
                    color: #01a09c;
                    > .icrm-arrow-right {
                        margin-left: 4px;
                    }
                }
                &:hover {
                    box-shadow: 0 0 0 2px rgba(0, 190, 189, 0.31);
                }
            }
            .add-part {
                margin-top: 24px;
                display: flex;
                flex-direction: row-reverse;
                .btn {
                    border-radius: 4px;
                    padding: 5px 16px;
                    border: 1px solid #dbdfe6;
                    font-size: 14px;
                    font-weight: 400;
                    color: #363f55;
                    line-height: 20px;
                }
            }
        }
        .close {
            right: 24px;
            top: 22px;
            .icon-close {
                transform: scale(1.1);
            }
        }
    }
}
</style>
